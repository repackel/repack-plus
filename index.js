export const hello = 'hello repackel'



// export { default as FormItem } from './src/FormItem/index.vue'
export {
  default as Table
}
from './src/Table/index.vue'
export {
  default as Paginated
}
from './src/Paginated/index.vue'


import Table from './src/Table/index.vue'
const componentsList = [
  Table
]




const defaultInstallOpt = {
  pageAlias: {
    current: "current",
    size: "size"
  },
  hello
}



export default {
  install: (app, opt = {}) => {
    const option = Object.assign(defaultInstallOpt, opt)
    componentsList.forEach(component => {
      app.component(component.name, component)
    })
    Object.defineProperties(app.config.globalProperties, {
      $RP_CFG: {
        get() {
          return option;
        }
      }
    });
  }
}