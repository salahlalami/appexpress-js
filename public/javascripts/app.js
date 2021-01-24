"use strict";
import "../sass/style.scss";

import docReady from "./lib/docReady";
// import { $$ } from './lib/bling';

import moreOption from "./modules/moreOption";
import modal from "./modules/modal";
import inputFunction from "./modules/inputFunction";
import dataGrid from "./modules/dataGrid";
import ajaxSelectInput from "./modules/ajaxSelectInput";
import searchList from "./modules/searchList";
import tabPanel from "./modules/tabPanel";
import navApp from "./modules/navApp";
import initSubMenuDrawer from "./modules/subMenuDrawer";
import panelModel from "./modules/panelModel";
import datepicker from "./lib/datepicker";
import accordionModel from "./modules/accordionModel";
import FileUpload from "./modules/fileUpload";
import consultationComponent from "./modules/consultationComponent";
// import consultationAudioRecorder from './modules/consultationAudioRecorder';
import patientFolder from "./modules/patientFolder";
import { initCrudPanel, formSubmit, searchItem } from "./modules/crudPanel";

docReady(function () {
  // const allPages = $('#pageId');
  const inputs = document.querySelectorAll("input");

  const dataTables = document.querySelectorAll(
    '.component[data-component="dataTable"]'
  );
  const viewdetails = document.querySelectorAll(
    '.component[data-component="view-details"]'
  );
  const ajaxForms = document.querySelectorAll(
    '.component[data-component="ajaxForm"]'
  );
  const ajaxSelects = document.querySelectorAll(
    '.component[data-component="ajaxSelect"]'
  );
  const ajaxSearchs = document.querySelectorAll(
    '.component[data-component="ajaxSearch"]'
  );
  const searchLists = document.querySelectorAll(
    '.component[data-component="searchList"]'
  );
  const tabContents = document.querySelectorAll(
    '.component[data-component="tabContent"]'
  );
  const navigations = document.querySelectorAll(
    '.component[data-component="navigation"]'
  );
  const panels = document.querySelectorAll(
    '.component[data-component="panel"]'
  );
  const accordions = document.querySelectorAll(
    '.component[data-component="accordionForm"]'
  );
  // const recorderToggle = document.querySelectorAll('.component[data-component="recorder-toggle"]');
  const fileUploadComponent = document.querySelectorAll(
    '.component[data-component="file-upload"]'
  );
  const prescriptions = document.querySelectorAll(
    '.component[data-component="prescriptionGrid"]'
  );
  const itemListComponent = document.querySelectorAll(
    '.component[data-component="item-list"]'
  );

  window.modal = modal;
  moreOption();
  initSubMenuDrawer();

  [].forEach.call(inputs, function (input) {
    inputFunction(input);
  });

  datepicker(".datepicker");

  [].forEach.call(dataTables, function (dataTable) {
    dataGrid.init(dataTable);
  });

  [].forEach.call(viewdetails, function (viewdetail) {
    initCrudPanel(viewdetail);
  });

  [].forEach.call(ajaxForms, function (ajaxForm) {
    formSubmit(ajaxForm, "form.ajax");
  });

  [].forEach.call(ajaxSelects, function (ajaxSelect) {
    ajaxSelectInput(ajaxSelect, ".ajaxSelect", ".ajaxResult");
  });

  [].forEach.call(ajaxSearchs, function (ajaxSearch) {
    searchItem(ajaxSearch, ".searchAjax");
  });

  [].forEach.call(searchLists, function (searchList) {
    searchList(searchList, ".searchAjax");
  });

  [].forEach.call(navigations, function (navigation) {
    navApp(navigation, ".toggle");
  });

  [].forEach.call(accordions, function (accordion) {
    accordionModel(accordion, ".accordionForm");
  });

  [].forEach.call(tabContents, function (tabContent) {
    tabPanel(tabContent, "#tabs1");
  });

  [].forEach.call(panels, function (panel) {
    panelModel(panel, ".panel", ".panelButton");
  });

  [].forEach.call(prescriptions, function (prescription) {
    consultationComponent.init(prescription);
  });

  // [].forEach.call(recorderToggle, function(el) {
  //     consultationAudioRecorder(el);
  // });

  [].forEach.call(fileUploadComponent, function (el) {
    FileUpload(el);
  });

  [].forEach.call(itemListComponent, function (el) {
    patientFolder(el);
  });
});
