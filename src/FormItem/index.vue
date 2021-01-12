<template>
  <el-form-item :label="x.name" :label-width="x.labelWidth" :rules="rules(x)" :class="x.itemClassName||{'inline-block':x.inline}">
    <template v-if="x.type==='view'">
      <el-tooltip effect="dark" :content="form[x.key]" placement="top" v-if="x.overflow">
        <div class="overtext">{{x.transform ? x.transform(form[x.key]) :form[x.key]}}</div>        
      </el-tooltip>
      <span v-else>{{x.transform ? x.transform(form[x.key]) :form[x.key] || locz('na')}}</span>
    </template>
    <template v-if="x.type==='input'">
      <el-input v-model="form[x.key]" v-bind="inputcfg(x)" @change="changeFn" @input="inputFn">
        <template slot="prepend" v-if="x.prependText">{{x.prependText}}</template>
        <template slot="append" v-if="x.appendText">{{x.appendText}}</template>
      </el-input>
    </template>
    <template v-else-if="x.type==='number'">
      <el-input-number v-model="form[x.key]" v-bind="inputcfg(x)"  @change="changeFn"/>
    </template>
    <template v-else-if="x.type==='textarea'">
      <el-input v-model="form[x.key]" type="textarea" v-bind="inputcfg(x)"  @change="changeFn"/>
    </template>
    <template v-else-if="x.type==='radio'">
      <el-radio-group v-model="form[x.key]" v-bind="inputcfg(x)" @change="changeFn">
        <el-radio v-for="y in dictList" :key="y.val" :label="y.val">{{y.name}}</el-radio>
      </el-radio-group>
    </template>
    <template v-else-if="x.type==='checkbox'">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="checkAll" v-if="x.checkAll">{{locz("checkAll")}}</el-checkbox>
      <el-checkbox-group v-model="form[x.key]" v-bind="inputcfg(x)" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="y in dictList" :key="y.val" :label="y.val">{{y.name}}</el-checkbox>
      </el-checkbox-group>
    </template>    
    <template v-else-if="x.type==='select'">
      <el-select v-model="form[x.key]" v-bind="inputcfg(x)" @change="changeFn">
        <el-option v-for="y in dictList" :key="y.val" :label="y.name" :value="x.useLabel ? y.name : y.val" />
      </el-select>
    </template>
    <template v-else-if="x.type==='date'">
      <el-date-picker v-model="form[x.key]" type="daterange" v-bind="inputcfg(x)" @change="changeFn">
      </el-date-picker>
    </template>
    <template v-else-if="x.type==='datetime'">
      <el-date-picker v-model="form[x.key]" type="datetimerange" v-bind="inputcfg(x)" @change="changeFn">
      </el-date-picker>
    </template>
    <template v-else-if="x.type==='date1'">
      <el-date-picker v-model="form[x.key]" type="date" v-bind="inputcfg(x)" @change="changeFn">
      </el-date-picker>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </el-form-item>
</template>
<script>
import { locz , inputcfg } from "../commonFn/commonFn.js";
const tipsFn = x => {
  if (x.type === "input") {
    return locz("pleaseInput") + x.name;
  } else if (x.type === "select") {
    return locz("pleaseSelect")  + x.name;
  }
};
export default {
  name: "rl-form-item",
  props: ["x", "form"],
  data() {
    const self = this;
    return {
      queryParams: {},
      dictList: [],
      checkAll:false,
      isIndeterminate:false,
    };
  },
  async mounted() {
    if (this.x.dict) {
      const list = await this.$dict(this.x.dict);
      if (this.x.pick) {
        this.dictList = list.filter(x => this.x.pick.includes(x.val));
      } else {
        this.dictList = list;
      }
    } else {
      this.dictList = this.x.list || []
    }
  },
  watch: {
    "x.list"(val) {
      if (val) {
        this.dictList = this.x.list || []
      }
    }
  },
  computed: {},
  methods: {
    locz,
    inputcfg,
    changeFn(val){
      if (this.x.changeFn) {
        this.x.changeFn(val)
      }
    },
    inputFn(val){
      if (this.x.changeFn) {
        this.x.inputFn(val)
      }
    },
    rules: x => [{
      required: !(x.norule || x.type === "view"),
      message: tipsFn(x),
      trigger: x.type === "select" ? "change " : "blur"
    }],
    handleCheckAllChange(val) {
      this.form[this.x.key] = val ? this.dictList.map(x => x.val) : []
      this.isIndeterminate = false;
      if (this.x.changeFn) {
        this.x.changeFn(this.form[this.x.key])
      }
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.dictList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.dictList.length;
      if (this.x.changeFn) {
        this.x.changeFn(value)
      }
    }
  }
};
</script>
<style scoped>
.el-form-item {
  vertical-align: top;
}
.overtext  {
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
}
.checkAll {
  display: block;
}
</style>
