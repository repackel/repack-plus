export const hello = 'hello world'



// export { default as FormItem } from './src/FormItem/index.vue'
export {
  default as Table
}
from './src/Table/index.vue'
export {
  default as Paginated
}
from './src/Paginated/index.vue'

const cfg = {}


import Table from './src/Table/index.vue'
const componentsList = [
  Table
]

const defaultInstallOpt = {
  pageAlias: {
    current: "current",
    size: "size"
  }
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