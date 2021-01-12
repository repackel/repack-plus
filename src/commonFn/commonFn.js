import i18n from "./i18n.json";
const genText = (fnText, arg) => {
  if (!fnText) {
    return "";
  } else if (typeof fnText === "function") {
    return fnText(arg);
  } else {
    return fnText;
  }
};

export const locz = (key) => {
  const lang = window.navigator.language;
  let locList = {};
  if (/zh/gi.test(lang)) {
    locList = i18n["zh"];
  } else if (/en/gi.test(lang)) {
    // add your language
    locList = i18n["en"];
  } else {
    locList = i18n["en"];
  }
  return locList[key];
};

export const genAttr = (x, scope) => {
  const genList = ["class", "style", "disabled"];
  const attrs = {};
  genList.forEach((y) => {
    x[y] && (attrs[y] = genText(x[y], scope.row));
  });
  if (x.icon) {
    attrs[icon] = x.icon;
  }
  return attrs;
};

export const inputcfg = (x, i) => {
  const { multiple, readonly, disabled } = x;
  let cfg = {
    size: x.size || "small",
    filterable: x.filterable || Boolean(x.dict) || true,
    clearable: x.clearable || true,
    class: x.class,
    style: x.width ? "width:" + x.width : "",
    multiple,
    readonly,
    disabled,
  };
  switch (x.type) {
    case "input":
      cfg.placeholder = x.placeholder || locz("pleaseInput") + x.name;
      cfg.maxlength = x.maxlength || (x.key === "mobile" ? 11 : 25);

      break;
    case "number":
      cfg.min = (x.range&&x.range[0])||1
      cfg.max = (x.range&&x.range[1])||20
      
      break;
    case "textarea":
      cfg.placeholder = x.placeholder || locz("pleaseFillin") + x.name;
      cfg.maxlength = x.maxlength || 200;
      cfg.resize = x.resize || "none";
      cfg.rows = x.rows || "3";

      break;
    case "select":
      cfg.placeholder = x.placeholder || locz("pleaseSelect") + x.name;

      break;
    case "date":
      cfg["start-placeholder"] = x.startPlaceholder || locz("startDate");
      cfg["end-placeholder"] = x.endPlaceholder || locz("endDate");
      cfg["value-format"] = x.valueFormat || "yyyy-MM-dd HH:mm:ss";

      break;
    case "datetime":
      cfg["start-placeholder"] = x.startPlaceholder || locz("startTime");
      cfg["end-placeholder"] = x.endPlaceholder || locz("endTime");
      cfg["value-format"] = x.valueFormat || "yyyy-MM-dd HH:mm:ss";

      break;
    case "date1":
      cfg.placeholder = x.placeholder || locz("pleaseSelect") + x.name;
      cfg["value-format"] = x.valueFormat || "yyyy-MM-dd";

      break;

    default:
      break;
  }

  return cfg;
};

// Lodash
const Lodash = {};
const LodashList = ["get", "has", "last", "pick", "omit", "omitBy", "padStart"];
LodashList.forEach((x) => (Lodash[x] = require("lodash/" + x + ".js")));
export const _ = Lodash;
