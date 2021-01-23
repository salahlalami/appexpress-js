import activeTab from "./activeTab";
import { accordionBar } from "./accordionModel";
import { valueByString } from "../helper";
import delegate from "../lib/delegate";
import ajaxDataRead from "./ajaxDataRead";
import consultationComponent from "./consultationComponent";
import dataGrid from "./dataGrid";

import { createSync, readSync, updateSync, deleteSync } from "../axiosRequest";

export const initCrudPanel = (component) => {
  delegate(
    document.body,
    ".meta-actions .meta-remove",
    "click",
    function (e) {
      const target = component.dataset.target;
      const displayLabel = e.delegateTarget.dataset.displayLabel;
      removeItem(target, e.delegateTarget.dataset.id, displayLabel);
    },
    false
  );

  delegate(
    document.body,
    ".meta-actions .meta-edit",
    "click",
    function (e) {
      const form = document.querySelector('form.ajax[data-state="update"]');
      const target = component.dataset.target;
      editItem(form, target, e.delegateTarget.dataset.id);
    },
    false
  );
};
export const toForm = (response, form) => {
  if (!form) {
    form = document.querySelector("form.ajax");
  }
  if (!form) {
    return;
  }
  const elements = form.querySelectorAll("input, select, textarea");
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    if (element.classList.contains("ajaxResult")) {
      var value = response.result[element.name];
      element.dataset.value = value._id;
    } else {
      if (element.classList.contains("ajaxSelect")) {
        var variable = response.result[element.name];
        element.value = variable._id || variable;
        setTimeout(() => {
          const e = new Event("change");
          element.dispatchEvent(e);
        }, 100);
      } else if (element.classList.contains("searchAjax")) {
        var _id = response.result[element.name];
        // var variable = "";
        if (
          element.dataset.label &&
          typeof response.result[element.name] == "object"
        ) {
          variable = valueByString(
            response.result[element.name],
            element.dataset.label
          );

          _id = response.result[element.name]._id;
        }

        element.value = variable;
        element.dataset.value = _id;
        let inpSelect = document.createElement("SELECT");
        inpSelect.name = element.name;
        inpSelect.hidden = true;
        inpSelect.setAttribute("id", "hiddenSelect");
        inpSelect.options[0] = new Option(variable, _id);
        element.parentNode.appendChild(inpSelect);
      } else {
        const name = element.dataset.name || element.name;
        variable = valueByString(response.result, name);
        //const json =  JSON.stringify(variable);

        element.value = variable._id || variable;
      }
    }
  }
};

export const editItem = (form, target, id) => {
  if (!form) {
    form = document.querySelector('form.ajax[data-state="update"]');
  }

  const viewInfo = document.querySelector(
    '.component[data-component="view-details"]'
  );
  if (viewInfo) {
    viewInfo.querySelector(".panel-body").classList.remove("hidden");
  }

  form.dataset.id = id;
  form.dataset.target = target;
  form.dataset.state = "update";
  const result = readSync(target, id);
  result.then(function (response) {
    setCurrentRecord(target, response);
    activeTab(["edit"]);
    toForm(response, form);
  });
};

export const viewItem = (target, id, viewType = ["standard"]) => {
  console.log(viewType);
  const result = readSync(target, id);
  return result.then(function (response) {
    setCurrentRecord(target, response);
    activeTab(["read"]);
    // toForm(response);

    if (viewType.includes("consultation")) {
      const infoDivs = document.querySelectorAll(
        '.component[data-component="consultationInfo"]'
      );
      [].forEach.call(infoDivs, function (infoDiv) {
        console.log("viewType consultation");
        consultationComponent.info(infoDiv, response);
      });
    } else {
      const infoDivs = document.querySelectorAll(
        '.component[data-component="information"]'
      );
      [].forEach.call(infoDivs, function (infoDiv) {
        console.log("viewType standard");
        ajaxDataRead(infoDiv, "ul.info", response);
      });
    }
    return response;
  });
};

export const removeItem = (target, id, displaylabel) => {
  if (displaylabel != undefined) {
    document
      .getElementById("delete-record")
      .querySelector(".row-info").innerHTML = " : " + displaylabel;
  }

  window.modal.open("delete-record");

  const currentModal = document.querySelector(".current-modal");
  if (currentModal) {
    const confirmButton = currentModal.querySelector(".delete-confirm");

    if (confirmButton) {
      confirmButton.removeEventListener("click", handleDeleteConfirm, false);
      confirmButton.addEventListener("click", handleDeleteConfirm, false);
    }
  }

  function handleDeleteConfirm() {
    const result = deleteSync(target, id);
    result.then(function () {
      accordionBar();
      document
        .querySelector('[data-component="accordionForm"]')
        .querySelector(".accordionForm")
        .classList.remove("disabled");
      const dataTables = document.querySelectorAll(
        '.component[data-component="dataTable"]'
      );
      [].forEach.call(dataTables, function (component) {
        dataGrid.refresh(component);
      });
      window.modal.close();
    });
  }
};

export const setCurrentRecord = (target, res) => {
  const data = res.result;
  const viewInfo = document.querySelector(
    '.component[data-component="view-details"]'
  );
  viewInfo.dataset.target = target;
  const infoTitle = viewInfo.querySelector(".info-title");
  const metaActions = viewInfo.querySelector(".meta-actions");

  viewInfo.querySelector(".panel-body").classList.remove("hidden");

  if (viewInfo.dataset.page == "patient") {
    viewInfo.querySelectorAll(".tab-link").forEach(function (el, index) {
      // var name = el.textContent;
      const tabContent = viewInfo.querySelectorAll(".tab-content")[index];
      const itemList = tabContent.querySelector(".item-list");
      el.dataset.loaded = false;

      /////// >>>>>> remove event and make it without event
      if (itemList) {
        el.addEventListener("click", function () {
          console.log("event added to tabs");
          const url = itemList.dataset.get + "/" + data._id;
          itemList.dataset.getUrl = url;
        });
      }
    });
  }

  if (infoTitle) {
    if (infoTitle.dataset.key) {
      const title = valueByString(data, infoTitle.dataset.key);
      infoTitle.innerHTML = infoTitle.dataset.prefix + " " + title;
    }
  }

  if (metaActions.querySelector(".meta-edit")) {
    metaActions.querySelector(".meta-edit").dataset.id = data._id;
  }
  if (metaActions.querySelector(".meta-remove")) {
    metaActions.querySelector(".meta-remove").dataset.id = data._id;
    if (metaActions.querySelector(".meta-remove").dataset.label) {
      metaActions.querySelector(
        ".meta-remove"
      ).dataset.displayLabel = valueByString(
        data,
        metaActions.querySelector(".meta-remove").dataset.label
      );
    }
  }
  if (metaActions.querySelector(".meta-print")) {
    metaActions.querySelector(".meta-print").dataset.id = data._id;
  }

  //
};

// convert form data to json
export function toJson(form) {
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

export function ajaxForm(form, component) {
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
    console.log("createSync");
    ajaxCall = createSync(target, json);
  } else if (state === "update") {
    console.log("updateSync");
    const id = form.dataset.id;
    ajaxCall = updateSync(target, id, json);
  }
  if (ajaxCall != null) {
    ajaxCall.then(function (response) {
      console.log(" ----------- response : " + response);

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
      viewItem(target, response.result._id, formtype);
    });
  }
}

export function formSubmit(component, formName) {
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
  // const formState = form.dataset.state;
  // const target = form.dataset.target;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    ajaxForm(form, component);
  });
}
