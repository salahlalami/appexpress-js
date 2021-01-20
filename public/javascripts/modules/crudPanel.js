import activeTab from "./activeTab";
import { accordionBar } from "./accordionModel";
import { valueByString } from "../helper";
import delegate from "../lib/delegate";
import ajaxDataRead from "./ajaxDataRead";
import consultationComponent from "./consultationComponent";
import dataGrid from "./dataGrid";

import { readSync, deleteSync } from "../axiosRequest";

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
      const form = component.querySelector("form.ajax");
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
        // var event = new CustomEvent("setValue", {
        //     detail: {
        //         display: variable,
        //         id: _id,
        //     }
        // });
        // element.dispatchEvent(event);

        // element.addEventListener("setValue", function(event) {
        //     const { detail } = event;
        //     element.value= detail.display;
        // }, false);
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
    form = document.querySelector("form.ajax");
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
    // const infoDivs = document.querySelectorAll('.component[data-component="information"]');
    // [].forEach.call(infoDivs, function (infoDiv) {
    //     ajaxDataRead(infoDiv, 'ul.info', response);
    // });
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
  //   const removeIcon = metaActions.querySelector(".meta-remove");
  //   removeIcon.removeEventListener("click", handleDelete, false);
  //   removeIcon.addEventListener("click", handleDelete, false);
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
    // delegate(document.body, ".meta-remove", "click", handleDelete, false);
  }
  if (metaActions.querySelector(".meta-print")) {
    metaActions.querySelector(".meta-print").dataset.id = data._id;
  }

  //
};
