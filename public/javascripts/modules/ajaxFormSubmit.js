import axios from "axios";
import activeTab from "./activeTab";
import { viewItem } from "./crudPanel";
import dataGrid from "./dataGrid";
import { createSync, updateSync } from "../axiosRequest";
// convert form data to json
function toJson(form) {
  let obj = {};

  const elements = form.querySelectorAll("input, select, textarea");
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    const name = element.name;
    const value = element.value;

    if (name && element.dataset.disabled != "true") {
      obj[name] = value;
    }
  }
  return obj;
}

function ajaxForm(form, component) {
  //e.preventDefault();
  const dataTable = document.querySelector(
    '.component[data-component="dataTable"]'
  );
  var element = component.querySelector(".loaderWarpper");
  const alertSuccess = component.querySelector(".alert-success");
  const alertError = component.querySelector(".alert-error");
  element.classList.add("show");
  const target = form.dataset.target || dataTable.dataset.target;
  const state = form.dataset.state || "create";

  const json = toJson(form);

  //if element iput was empty convert his value to undefined
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const field = json[key];
      if (!field || !field.trim()) {
        json[key] = undefined;
        delete json[key];
      }
    }
  }
  let ajaxCall = null;
  if (state === "create") {
    ajaxCall = createSync(target, json);
  } else if (state === "update") {
    const id = form.dataset.id;
    ajaxCall = updateSync(target, id);
  }
  if (ajaxCall != null) {
    ajaxCall.then(function (response) {
      alertSuccess.innerHTML = response.result;
      element.classList.remove("show");
      // Refresh table when adding/updating an entry
      const activePaginationButton = document.querySelector(
        "#pagination > ul > li.active"
      );
      activePaginationButton
        ? dataGrid.refresh(dataTable)
        : dataGrid.init(dataTable, ".table", "form.ajax");
      const formtype = form.dataset.formtype || "standard";
      const target = form.dataset.target;
      viewItem(target, response.result._id, formtype);
    });
  }
}

function ajaxFormSubmit(component, formName) {
  component.querySelector("button.cancel").addEventListener(
    "click",
    function (e) {
      activeTab(["read"]);
    },
    false
  );

  component.querySelector(".alert").addEventListener(
    "click",
    function (e) {
      this.classList.remove("show");
    },
    false
  );
  component.querySelector(".loaderWarpper").addEventListener(
    "click",
    function (e) {
      this.classList.remove("show");
    },
    false
  );

  const form = component.querySelector(formName);
  //form.on('submit', ajaxForm)
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    ajaxForm(form, component);
  });
}

export default ajaxFormSubmit;
