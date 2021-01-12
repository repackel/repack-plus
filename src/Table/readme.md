## **Table** Document

### Import
```javascript
import { Table } from "@repackel/repack";
```
```javascript
components: {
  [Table.name]: Table,
},
```
```html
<rl-table :cfg="cfg" ref="staffTable" @getSelection="getSelection">
  <!-- <template slot="searchbox">slot</template> -->
</rl-table>
```

**Slot：*

| Name | Slot | Example |
| --- | --- | --- |
| pageBegin | at page beginning | `slot="pageBegin"` |
| beforeTable | before `Table` Tag | `slot="beforeTable"` |
| searchBegin | at searchList beginning | `slot="searchBegin"` |
| searchbox | between searchList, controlled by `type = 'slot'` | `slot="searchbox"` |
| customTable | custom Table, take effect when `cfg.customTable` is `true` | `slot="customTable"` |


### Configuration

- 1 `cfg` Configuration
```javascript
{
  actionList:[], // Action button list, Optional
  actionAlign: "right", // Action button alignment, default `"right"`
  searchList:[], // Search list
  searchFn: this.getList, // Search method `Function`
  fetchConditionFn: this.fetchConditionList, // Asynchronous method to get the list of search conditions `Function`
  tableSelection: true, // Multiple select Table, default `false`
  customTable: true, // custom Table, default `false`
  tableList:[], // Table header Props, Not necessary when customizing the table
  tableCellFallbackText: 'N/A', // Alternative text for table cells, optional. Displayed when the value of the table cell is empty, it is effective for the whole table. No default
  hideSearchForm: true, // Hide search items and search buttons, Display default
  hidePagination: true, // Hide the paging component, Display default
}
```

- 1-1 `searchFn` Configuration

The search interface is passed in through an asynchronous function, Eventually called internally by the component, Complete data assembly outside the component.
Search is called when `mounted()` inside the component, and there is no need to call it again outside the component.

Example:
```javascript
getList(p, reset) {
  // `p` is the search parameters passed in the component
  // `reset` is the reset search switch, when the external parameters are used, it should be cleared here
  // Finally, `resolve` contains `table` data and pagination
  let { ...pr } = p;
  if (!reset) {
    // For example: when searching, take the external province and city data
    const divList = this.divList;
    switch (divList.length) {
      case 1:
        pr.provinceCode = this._last(divList);
        break;
      case 2:
        pr.cityCode = this._last(divList);
        break;
      case 3:
        pr.areaCode = this._last(divList);
        break;
      default:
        break;
    }
  } else {
    // clear the external provinces and municipalities array when reset
    this.divList = [];
  }
  // At the same time, you can take other mandatory conditions
  pr.buildingType = 1;
  return new Promise((resolve, reject) => {
    this.$req("/community/building/list", {
      method: "GET",
      params: pr
    }).then(res => {
      resolve({
        list: res.rows,
        total: res.total
      });
    });
  });
},
```

- 1-2 `fetchConditionFn` Configuration

A method to get the list of search conditions asynchronously, `return` a `Promise`, and finally `resolve` an object.
Each object key is the `key` of an item in `searchList`, and the object value is the corresponding Select box option `list`.
Called when `mounted()`.

Example:
```javascript
fetchConditionList() {
  return new Promise(async (resolve, reject) => {
    const childType = await this.$req("/getList");
    // const subChildType = await this.$req("/getChildType");
    resolve({
      childType: childType,
      // subChildType: subChildType
    });
  });
},
```

- 1-3 `searchList` Configuration

> scheme:
```javascript
searchList: [
  {
    name: "Name",
    type: "input",
    key: "name"
  },
  {
    name: "Gender",
    type: "select",
    key: "sex",
    list: "XB"
  },
  {
    name: "Time Range",
    type: "date",
    key1: "beginDate",
    key2: "endDate"
  }
]
```
> Property description:

| Key | Value | Data Type | Default | Example |
| --- | --- | --- |--- | --- |
| name | Display name | `String` | Mandatory | `"Name"` |
| type | See table below | `String` | Mandatory | `"select"` |
| key | key of the search form | `String` | Mandatory | `"name"` |
| list | `Select` list | `Array` | Mandatory | `[{name:'Male',val:'1'}]` |
| useLabel | Use the `label` of Select to pass the value | `Boolean` |  | `true` |
| key1 | Begin date of `type="date"` | `String` |  | `"beginDate"` |
| key2 | End date of `type="date"` | `String` |  | `"endDate"` |
| hidden | Hide this search item | `Boolean` | - | `true` |
| width | item content width | `String` | - | `"220px"` |
| class | item content class name | `String` | - | `"w250"` |
| itemClassName | item class name | `String` | - | `"block"` |
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

> `type` Type

| Value | Description |
| -- | -- |
| `input` | Input box |
| `select`| Select box | 
| `date`| Date range |
| `datetime` | Date time range |
| `date1`| Single date |
| `slot` | Slot |

**Note: When `type="slot"`, you can use the named slot of `name="searchbox"` to configure more flexible content.*

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

- 1-4 `tableList` Configuration
> scheme:
```javascript
tableList: [
  {
    label: "Name",
    prop: "name",
    width: 80
  },
  {
    label: "Gender",
    transform: row => ["","Male", "Female"][row.sex],
    width: 120
  }
]
```
> Description:

| Key | Value | Data Type | Default | Example |
| --- | --- | --- |--- | --- |
| label | Header | `String` | Mandatory |`"Name"` |
| prop | Key of form loop | `String` | Mandatory |`"name"` |
| hidden | Hide the column | `Boolean` | `false` |`true` |
| viewImg | Take the prop field to display the picture | `Boolean` | | `true` |
| width | Width, same as element-ui | `Number` | | `80`  |
| minWidth | Minimum width, same as element-ui | `Number` | | `120`  |
| align | List alignment, same as element-ui | `String` |  | `'right'`  |
| overflow | showOverflowTooltip, same as element-ui | `Boolean` |  | `true` |
| fixed | Fixed list, same as element-ui | `Boolean` `String` | `false` | `'right'`  |
| transform | Functions for processing displayed text, pass in `row` return result | `Function` |  | `row => row.num + 'kg'` | 
| class | Class name | `String` `Function` | | `row => ["", "green", "red"][row.state]`  |
| style | Inline style | `String` `Function` | | `row => ({ color: ["", "green", "red"][row.state]})`  |
| fn | Click event, pass in `(row,index)` | `Function` | | `(row,index) => this.alert(row,index)`  |
| buttonList | List of table action buttons | `Array` | | See table below  |


- 1-5-1 `buttonList` Configuration
> scheme:
```javascript
buttonList:[
   {
     text: "Edit",
     fn: () => this.$info("Edit")
   }
 ]
```
> Property description:

| Key | Value | Data Type | Default | Example |
| --- | --- | --- |--- | --- |
| icon | Button icon | `String` | | `"el-icon-edit"`  |
| type | Button type, same as element-ui | `String` | `'text'` | `"primary"`  |
| size | Button size, same as element-ui | `String` | `'default'` | `"mini"`  |
| disabled | Disabled | `Boolean` `Function` | | `true`  |
| class | Class name | `String` `Function` | | `row => ["", "green", "red"][row.state]`  |
| style | Inline style | `String` `Function` | | `row => ({ color: ["", "green", "red"][row.state]})` |
| text | Button text | `String` `Function` | | `row => ["", "View", "Edit"][row.state]`  |
| fn | Click event, pass in `(row,index)` | `Function` | | `(row,index) => this.alert(row,index)`  |

### Method

usage:

```javascript
this.$refs[ ref name ].[ Method name ]
// this.$refs.staffTable.getList()
```
> Method list:

| Method name | Description | 
| --- | --- |
| `searchButton()` | Search button |
| `getList()` | Search function |
| `resetQuery()` | Reset function |
| `handleSizeChange()` | Page size change |
| `handleCurrentChange()` | Paging index change |

### Event

usage:

```javascript
@getSelection="myGetSelectionMethod"
// It is the `selection-change` method of element
```