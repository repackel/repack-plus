<template>
  <section class="full-page">
    <slot name="pageBegin"></slot>
    <div class="full-page-inner" :class="{hasLeft:cfg.hasLeft}">
      <div class="action-bar" :class="cfg.actionAlign" v-if="cfg.actionList && cfg.actionList.length">
        <div v-for="(x,i) in (cfg.actionAlign ==='between' ? cfg.actionList:[cfg.actionList]  )" :key="i">
          <el-button :type="y.type||'primary'" :plain="y.plain" :icon="y.icon" size="small" @click="y.fn ? y.fn() : $emit(y.e)" v-for="(y,j) in x" :key="j">{{y.name}}</el-button>
        </div>
      </div>
      <cpTitle v-if="cfg.rightName">{{cfg.rightName}}</cpTitle>
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
            <template slot-scope="scope">
              <template v-for="(y,j) in x.buttonList">
                <el-button :size="y.size" :type="y.type|| 'text'" :key="j" @click="y.fn ? y.fn(scope.row,scope.$index) : void 0" v-bind="genAttr(y,scope)" v-if="!y.hidden || !(y.hidden && y.hidden(scope.row) )">
                  {{ typeof y.text === 'function' ? y.text(scope.row,scope.$index) : y.text }}
                </el-button>
              </template>
            </template>
          </el-table-column>
          <el-table-column v-bind="colcfg(x,i)" :key="i" v-else-if="x.viewImg">
            <template slot-scope="scope">
              <el-image style="width: 60px; height: 60px" fit="contain" :src="scope.row[x.prop]" :preview-src-list="[scope.row[x.prop]]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column v-bind="colcfg(x,i)" :key="i" v-else-if="x.transform || x.class || x.style || cfg.tableCellFallbackText ">
            <template slot-scope="scope">
              <span v-bind="genAttr(x,scope)" @click="x.fn ? x.fn(scope.row,scope.$index) : void 0">{{ fallbackText(x.transform ? x.transform(scope.row) : scope.row[x.prop]) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-bind="colcfg(x,i)" :key="i" v-else />
        </template>
      </el-table>
      <div class="pager-container" v-if="!cfg.hidePagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryParams.pageNum" :page-sizes="pageList" :page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableTotal">
        </el-pagination>
      </div>
    </div>
  </section>
</template>

<script>
import { genAttr ,locz , inputcfg , _ } from "../commonFn/commonFn.js";
export default {
  name: "rl-table",
  props: ["cfg"],
  data() {
    return {
      _,
      loading: false,
      // hidden: false,
      searchDateArr: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ...this.cfg.queryParams
      },
      queryList: {},
      tableData: this.cfg.tableData || [],
      tableTotal: 0,
      dialogVisible: false,
      searchCfg: {
        queryBtn: 2
      },
      currentPage: 1,
      imageList: [],
      pageList: this.cfg.pageSizes || [10, 50, 100, 150]
    };
  },
  computed: {},
  mounted() {
    // Search Select List
    this.searchCfg = this.cfg.searchCfg || this.searchCfg;
    // dictList only available when $dictArr exit
    if (this.$dictArr && this.cfg.searchList) {
      const dictList = this.cfg.searchList
            .map((x) => !(x.list instanceof Array) && x.list)
            .filter((x) => x) ||
        [];
        
      if (dictList.length) {
        this.$dictArr(...dictList).then((res) => dictList.forEach((x, i) => this.$set(this.queryList, x, res[i])));
      }
    }
    this.$nextTick(_ => {
      const hasVal =
        this.cfg.searchList &&
        this.cfg.searchList.find(x => x && x.type === "input" && x.value);
      if (hasVal) {
        this.queryParams[hasVal.key] = hasVal.value;
        this.getList();
      } else {
        this.getList("reset");
      }
      // fetchConditionFn
      if ( this.cfg.fetchConditionFn ) {
        this.cfg.fetchConditionFn().then((res)=>{
          Object.entries(res).forEach(x=>this.$set(this.queryList, x[0], x[1]))          
        }).catch(err=>{
          console.log('err',err)
        })
      }
    });
  },
  methods: {
    genAttr,
    locz,
    inputcfg,
    fallbackText(val){
      if ( this.cfg.tableCellFallbackText && [null,undefined,''].includes( val)) {
         return this.cfg.tableCellFallbackText
      } else {
        return val
      }
    },
    getList(reset) {
      // Search FN
      if (this.cfg.searchFn) {
        this.loading = true;
        this.cfg
          .searchFn(this.queryParams, reset)
          .then(res => {
            if ( res ) {
              this.tableData = res.list;
              this.tableTotal = res.total;
            }
          })
          .catch(e => {
            console.error(e);
          })
          .finally(f => {
            this.loading = false;
          });
      }
    },
    colcfg: (x, i) => ({
      label: x.label,
      width: x.width,
      minWidth: x.minWidth,
      prop: x.prop,
      align: x.align,
      showOverflowTooltip: x.overflow,
      fixed: x.fixed
    }),
    dateChange(arr, x) {
      [this.queryParams[x.key1], this.queryParams[x.key2]] = arr || [];
      if (this.queryParams[x.key2]) {
        this.queryParams[x.key2] = this.queryParams[x.key2].replace(
          "00:00:00",
          "23:59:59"
        );
      }
    },
    handleSizeChange(size) {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = size;
      this.getList();
    },
    handleCurrentChange(page) {
      this.queryParams.pageNum = page;
      this.getList();
    },
    searchButton(){
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      if (this._pick) {
        this.queryParams = this._pick(this.queryParams, ["pageSize"]);
      } else {
        this.queryParams = { pageSize: this.queryParams.pageSize };
      }
      this.queryParams.pageNum = 1;
      this.searchDateArr = [];
      this.getList("reset");
    },
    handleSelectionChange(val) {
      this.$emit("getSelection", val);
    }
  }
};
</script>