## **Form Item** 表单项文档

### 1. 引入 
```javascript
import { FormItem } from "@repackel/repack";
```
```javascript
components: {
  FormItem,
},
```
```html
<form-item :form="form" :x="x" v-for="(x,i) in list" :key="i">
    <!-- <el-input v-if="x.name==='建筑面积'" v-model="form.acreage" placeholder="建筑面积" size="small">
        <template slot="append">m²</template>
    </el-input> -->
</form-item>
```

**默认插槽：将自定义内容放到 `<form-item></form-item>` 之间即可。可以通过列表项的 `name` 来做判断*

### 2. 列表字段

列表结构
```javascript
list:[
    {
        name: "房屋类型",
        type: "select",
        inline: true,
        key: "housingCategory",
        list: this.$dictLoc("房屋类型")
    }
]

```

| 键名 | 值 | 类型 | 默认值 | 示例 |
| --- | --- | --- |--- | --- |
| name | 中文名 | `String` | 必传 | `"房屋类型"` |
| type | 见下表 | `String`| 必传 | `"select"` |
| key | 表单的键 | `String` | 必传 | `"housingCategory"` |
| list | 下拉类型的列表 | `Array` | 必传 | `this.$dictLoc("房屋类型")` |
| pick | 过滤列表，仅保留 `val` 在数组内的项 | `Array` |   | `['1','2']` |
| inline | 行内 | `Boolean` | `false` | `true` |
| norule | 不校验 | `Boolean` | - | `true`  |
| class | content 类名 | `String` | - | `'w300'` |
| itemClassName | `<el-form-item>` 类名 | `String` | - | `'pct50'` |
| width | 宽度 | `String` | - | `'150px'` |
| labelWidth | 同 element-ui `label-width` | `String` | - | `'15em'` |
| range | 即 min 和 max | `Array` | - | `[1,20]` |
| overflow | 当 `type="view"` 时，显示溢出文本 | `Boolean` | - | `true` |
| transform | 当 `type="view"` 时，处理显示文本，传入`form[x.key]` | `Function` | - | `str => str.substr(0,4)` |
| inputFn | 当 `type="input"` 时，触发输入事件，同 `@input` | `Function` | - | ` val=>{console.log('input=>',val)}` |
| changeFn | `Change` 事件，同 `@change` | `Function` | - | ` val=>{console.log('change=>',val)}` |
| checkAll | 当 `type="checkbox"` 时，显示全选框 | `Boolean` | `false` | `true` |
| prependText | 当 `type="input"` 时，显示前置文本 | `String` | - | `"https://"` |
| appendText | 当 `type="input"` 时，显示后置文本 | `String` | - | `"元/人"` |
| - | 以下同 element-ui ||||
| size | - | `String` | `"small"` | `"small"` |
| filterable | - | `Boolean` | - | `true` |
| clearable | - | `Boolean` | `true` | `true` |
| multiple | - | `Boolean` | - | `true` |
| readonly | - | `Boolean` | - | `true` |
| disabled | - | `Boolean` | - | `true` |
| maxlength | - | `Number` | `25` | `20` |
| rows | - | `Boolean` | `"3"` | `"5"` |
| resize | - | `Boolean` | `"none"` | `"none"` |
| placeholder | - | `String` | - | `"请选择"` |
| startPlaceholder | start-placeholder | `String` | - | `"请选择开始时间"` |
| endPlaceholder | end-placeholder | `String` | - | `"请选择结束时间"` |
| valueFormat | value-format | `String` | - | `"yyyy-MM-dd HH:mm:ss"` |

**下拉框列表数据的必须设为以下格式，键名 `name`, 键值 `val`*

```javascript
list: [{
  val: "1",
  name: "住宅"
}, {
  val: "2",
  name: "公共设施用房"
}, {
  val: "3",
  name: "商业用房"
}]
```

### 3. 支持的 form item 类型

| 传值 | 含义 |
| -- | -- |
| `input` | 输入框 |
| `number` | 数字输入框 |
| `textarea` | 文本框 |
| `radio` | 单选框 |
| `checkbox` | 复选框 |
| `select`| 下拉框 | 
| `date`| 日期范围 |
| `datetime` | 日期时间范围 |
| `date1`| 单个日期 |
| `view` | 查看文本 |