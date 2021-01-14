<template>
  <section class="full-page">
    <slot name="pageBegin"></slot>
    <div class="full-page-inner" :class="{hasLeft:cfg.hasLeft}">
      <div class="action-bar" :class="cfg.actionAlign" v-if="cfg.actionList && cfg.actionList.length">
        <div v-for="(x,i) in (cfg.actionAlign ==='between' ? cfg.actionList:[cfg.actionList]  )" :key="i">
          <el-button :type="y.type||'primary'" :plain="y.plain" :icon="y.icon" size="small" @click="y.fn ? y.fn() : $emit(y.e)" v-for="(y,j) in x" :key="j">{{y.name}}</el-button>
        </div>
      </div>
      <slot name="beforeTable"></slot>
      <el-form :inline="true" class="cp-form" label-width="6em" v-if="!cfg.hideSearchForm">
        <slot name="searchBegin"></slot>
        <template v-for="(x,i) in (cfg.searchList && cfg.searchList.filter(x=>x))">
          <el-form-item :label="x.name" :key="i" v-if="!x.hidden" :class="x.itemClassName">
            <template v-if="x.type==='input'">
              <el-input v-model="queryParams[x.key]" v-bind="inputcfg(x, i)" @keyup.enter.native="getList()" :value="x.value" />
            </template>
            <template v-else-if="x.type==='select'">
              <el-select v-model="queryParams[x.key]" v-bind="inputcfg(x, i)">
                <el-option v-for="dict in ( x.list instanceof Array ? x.list : queryList[x.list||x.key] || [] )" :key="dict.val" :label="dict.name" :value="x.useLabel ? dict.name : dict.val" />
              </el-select>
            </template>
            <template v-else-if="x.type==='date'">
              <el-date-picker type="daterange" v-model="searchDateArr" v-bind="inputcfg(x, i)" @change="arr=>dateChange(arr,x)">
              </el-date-picker>
            </template>
            <template v-else-if="x.type==='datetime'">
              <el-date-picker type="datetimerange" v-model="searchDateArr" v-bind="inputcfg(x, i)" @change="arr=>dateChange(arr,x)">
              </el-date-picker>
            </template>
            <template v-else-if="x.type==='date1'">
              <el-date-picker type="date" v-model="queryParams[x.key]" v-bind="inputcfg(x, i)">
              </el-date-picker>
            </template>
            <template v-else-if="x.type==='slot'">
              <slot name="searchbox" v-bind="inputcfg(x, i)"></slot>
            </template>
          </el-form-item>
          <br class="break" :key="i" v-if="x.br" />
        </template>
        <el-form-item class="btns">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="searchButton" v-if="searchCfg.queryText || searchCfg.queryBtn + '' === '2' ">{{searchCfg.queryText || locz('search') }}</el-button>
          <el-button type="plain" icon="el-icon-refresh-right" size="mini" @click="resetQuery" v-if="searchCfg.resetText || searchCfg.queryBtn + '' === '2'">{{searchCfg.resetText || locz('reset') }}</el-button>
        </el-form-item>
      </el-form>
      <div class="customTable" v-if="cfg.customTable" v-loading="loading">
        <slot name="customTable"></slot>
      </div>
      <el-table :data="tableData" style="width: 100%" stripe v-loading="loading" @selection-change="handleSelectionChange" v-else>
        <el-table-column type="selection" width="55" v-if="cfg.tableSelection" fixed="left" />
        <el-table-column type="index" width="80" :label="locz('index')" />
        <template v-for="(x,i) in (cfg.tableList && cfg.tableList.filter(x=>x && !x.hidden) || [])">
          <el-table-column v-bind="colcfg(x,i)" :key="i" v-if="x.buttonList" :fixed="x.fixed==='false'? false : x.fixed || 'right'">
            <template #default="scope">
              <template v-for="(y,j) in x.buttonList">
                <el-button :size="y.size" :type="y.type|| 'text'" :key="j" @click="y.fn ? y.fn(scope.row,scope.$index) : void 0" v-bind="genAttr(y,scope)" v-if="!y.hidden || !(y.hidden && y.hidden(scope.row) )">
                  {{ typeof y.text === 'function' ? y.text(scope.row,scope.$index) : y.text }}
                </el-button>
              </template>
            </template>
          </el-table-column>
          <el-table-column v-bind="colcfg(x,i)" :key="i + '-elseif'" v-else-if="x.viewImg">
            <template #default="scope">
              <el-image style="width: 60px; height: 60px" fit="contain" :src="scope.row[x.prop]" :preview-src-list="[scope.row[x.prop]]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column v-bind="colcfg(x,i)" :key="i + '-elseif2'" v-else-if="x.transform || x.class || x.style || cfg.tableCellFallbackText ">
            <template #default="scope">
              <span v-bind="genAttr(x,scope)" :key="i" @click="x.fn ? x.fn(scope.row,scope.$index) : void 0">{{ fallbackText(x.transform ? x.transform(scope.row) : scope.row[x.prop]) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-bind="colcfg(x,i)" :key="i + '-else'" v-else />
        </template>
      </el-table>
      <div class="pager-container" v-if="!cfg.hidePagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryParams[pageKey.current]" :page-sizes="pageList" :page-size="queryParams[pageKey.size]" layout="total, sizes, prev, pager, next, jumper" :total="tableTotal">
        </el-pagination>
      </div>
    </div>
  </section>
</template>

<script>
import { getCurrentInstance, ref, toRefs, onMounted, nextTick } from "vue";
import { genAttr, locz, inputcfg, _ } from "../commonFn/commonFn.js";
export default {
  name: "rp-table",
  props: ["cfg"],
  emits: ["getSelection"],
  setup(props, ctx) {
    const { cfg } = toRefs(props);
    const globalProperties = getCurrentInstance().appContext.config
      .globalProperties;
    const { $RP_CFG = {} } = globalProperties;

    const pageKey = ref(
      Object.assign({}, $RP_CFG.pageAlias, cfg.value.pageAlias)
    );

    let loading = ref(false);
    let dialogVisible = ref(false);
    const searchDateArr = ref([]);
    const queryList = ref({});
    let tableTotal = ref(0);

    const queryParams = ref(
      Object.assign(
        {
          [pageKey.value.current]: 1,
          [pageKey.value.size]: 10
        },
        cfg.value.queryParams
      )
    );

    const searchCfg = ref(
      Object.assign(
        {
          queryBtn: 2
        },
        cfg.value.searchCfg
      )
    );
    const tableData = ref(cfg.value.tableData || []);
    const pageList = ref(cfg.value.pageSizes || [10, 50, 100, 150]);
    const imageList = ref([]);

    onMounted(() => {
      // dictList only available when $dictArr exit
      // if (this.$dictArr && cfg.value.searchList) {
      //   const dictList =
      //     cfg.value.searchList
      //       .map(x => !(x.list instanceof Array) && x.list)
      //       .filter(x => x) || [];

      //   if (dictList.length) {
      //     this.$dictArr(...dictList).then(res =>
      //       dictList.forEach((x, i) => this.$set(this.queryList, x, res[i]))
      //     );
      //   }
      // }
      nextTick(_ => {
        const searchList = cfg.value.searchList || [];
        const hasVal = searchList.find(x => x && x.type === "input" && x.value);
        if (hasVal) {
          queryParams.value[hasVal.key] = hasVal.value;
          getList();
        } else {
          getList("reset");
        }
        // fetchConditionFn
        if (cfg.value.fetchConditionFn) {
          cfg.value
            .fetchConditionFn()
            .then(res => {
              Object.entries(res).forEach(
                x =>
                  // this.$set(this.queryList, x[0], x[1])
                  (queryList.value[x[0]] = x[1])
              );
            })
            .catch(err => {
              console.log("err", err);
            });
        }
      });
    });

    const getList = reset => {
      // Search FN
      if (cfg.value.searchFn) {
        loading.value = true;
        cfg.value
          .searchFn(queryParams.value, reset)
          .then(res => {
            if (res) {
              tableData.value = res.list;
              tableTotal.value = res.total * 1;
            }
          })
          .catch(e => {
            console.error(e);
          })
          .finally(f => {
            loading.value = false;
          });
      }
    };

    const fallbackText = val => {
      if (
        cfg.value.tableCellFallbackText &&
        [null, undefined, ""].includes(val)
      ) {
        return cfg.value.tableCellFallbackText;
      } else {
        return val;
      }
    };
    const colcfg = (x, i) => {
      const obj = {
        label: x.label,
        width: x.width,
        minWidth: x.minWidth,
        prop: x.prop,
        align: x.align,
        showOverflowTooltip: x.overflow,
        fixed: x.fixed
      };
      return _.pickBy(obj, x => x);
    };
    const dateChange = (arr, x) => {
      [queryParams.value[x.key1], queryParams.value[x.key2]] = arr || [];
      if (queryParams.value[x.key2]) {
        queryParams.value[x.key2] = queryParams.value[x.key2].replace(
          "00:00:00",
          "23:59:59"
        );
      }
    };

    // 分页函数
    const handleSizeChange = size => {
      queryParams.value[pageKey.value.current] = 1;
      queryParams.value[pageKey.value.size] = size;
      getList();
    };
    const handleCurrentChange = page => {
      queryParams.value[pageKey.value.current] = page;
      getList();
    };

    const searchButton = () => {
      queryParams.value[pageKey.value.current] = 1;
      getList();
    };
    const resetQuery = () => {
      if (_.pick) {
        queryParams.value = _.pick(queryParams.value, [pageKey.value.size]);
      } else {
        queryParams.value = {
          [pageKey.value.size]: queryParams.value[pageKey.value.size]
        };
      }
      queryParams.value[pageKey.value.current] = 1;
      searchDateArr.value = [];
      getList("reset");
    };

    const handleSelectionChange = val => {
      $emit("getSelection", val);
    };
    return {
      pageKey,
      loading,
      dialogVisible,
      searchDateArr,
      queryList,
      tableData,
      queryParams,
      pageList,
      tableTotal,
      searchCfg,
      colcfg,
      fallbackText,

      genAttr,
      locz,
      inputcfg,
      getList,
      dateChange,
      handleSizeChange,
      handleCurrentChange,
      searchButton,
      resetQuery,
      handleSelectionChange
    };
  }
};
</script>