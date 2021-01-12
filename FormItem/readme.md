## **Form Item** Document

### 1. Import 
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
    <!-- <el-input v-if="x.name==='construction area'" v-model="form.acreage" placeholder="Construction Area" size="small">
        <template slot="append">m²</template>
    </el-input> -->
</form-item>
```

**Default slot: put the custom content between `<form-item></form-item>`. Can be judged by the `name` of the list item*

### 2. List field

List structure
```javascript
list:[
    {
        name: "House type",
        type: "select",
        inline: true,
        key: "housingCategory",
        list: this.$dictLoc("House type")
    }
]

```

| Key | Value | Data Type | Default | Example |
| --- | --- | --- |--- | --- |
| name | Display name | `String` | Mandatory |`"House type"` |
| type | See table below | `String`| Mandatory | `"select"` |
| key | Key of form item | `String` | Mandatory | `"housingCategory"` |
| list | `Select` list | `Array` | Mandatory | `this.$dictLoc("House type")` |
| pick | Filter the list, only keep `val` items in the array | `Array` |   | `['1','2']` |
| inline | Inline | `Boolean` | `false` | `true` |
| norule | No verification | `Boolean` | - | `true`  |
| class | content class Name | `String` | - | `'w300'` |
| itemClassName | `<el-form-item>` class Name | `String` | - | `'pct50'` |
| width | Width | `String` | - | `'150px'` |
| labelWidth | Same as element-ui `label-width` | `String` | - | `'15em'` |
| range | I.e., min and max | `Array` | - | `[1,20]` |
| overflow | When `type="view"` , show overflow text | `Boolean` | - | `true` |
| transform | When `type="view"` , processing displayed text, pass in `form[x.key]` | `Function` | - | `str => str.substr(0,4)` |
| inputFn | When `type="input"` , trigger input event, same as `@input` | `Function` | - | ` val=>{console.log('input=>',val)}` |
| changeFn | Change event, same as `@change` | `Function` | - | ` val=>{console.log('change=>',val)}` |
| checkAll | When `type="checkbox"` , show check all box | `Boolean` | `false` | `true` 
| prependText | When `type="input"` , show prepend text | `String` | - | `"https://"` |
| appendText | When `type="input"` , show append text | `String` | - | `"dollars per person"` |
| - | Same as element-ui below ||||
| size | - | `String` | `"small"` | `"small"` |
| filterable | - | `Boolean` | - | `true` |
| clearable | - | `Boolean` | `true` | `true` |
| multiple | - | `Boolean` | - | `true` |
| readonly | - | `Boolean` | - | `true` |
| disabled | - | `Boolean` | - | `true` |
| maxlength | - | `Number` | `25` | `20` |
| rows | - | `Boolean` | `"3"` | `"5"` |
| resize | - | `Boolean` | `"none"` | `"none"` |
| placeholder | - | `String` | - | `"Please Select"` |
| startPlaceholder | start-placeholder | `String` | - | `"Please Select Start Time"` |
| endPlaceholder | end-placeholder | `String` | - | `"Please Select End Time"` |
| valueFormat | value-format | `String` | - | `"yyyy-MM-dd HH:mm:ss"` |

**The data of the select list must be set to the following format, key `name`, value `val`*

```javascript
list: [{
  val: "1",
  name: "Residential"
}, {
  val: "2",
  name: "Public facilities"
}, {
  val: "3",
  name: "Commercial premises"
}]
```

### 3. Supported form item types

| Value | Description |
| -- | -- |
| `input` | Input box |
| `number` | Number input box |
| `textarea` | Textarea box |
| `radio` | Radio |
| `checkbox` | Checkbox |
| `select`| Select | 
| `date`| Date range |
| `datetime` | Date time range |
| `date1`| Single date |
| `view` | View text |