/* eslint-disable no-unused-vars */

import {
  createSync,
  updateSync,
  filterSync,
  multiSync,
} from "../../axiosRequest";
import { activeTab, activeModel } from "../../core";

import delegate from "../../lib/delegate";

import itemsGird from "./itemsGird";

//////// ***** Main Component  : prescriptionComponent ***** //////////

const invoiceModule = {
  componentName: null,
  init: function (className = '.component[data-component="invoiceModule"]') {
    invoiceModule.componentName = className;
    let invoiceComponent = document.querySelector(invoiceModule.componentName);
    if (invoiceComponent) {
      itemsGird.init(invoiceComponent);
    }
  },
};
export default invoiceModule;
