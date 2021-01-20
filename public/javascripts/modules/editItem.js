import activeTab from "./activeTab";
import { valueByString } from "../helper";
// import ajaxDataRead from './ajaxDataRead';
import setCurrentRecord from "./setCurrentRecord";
import {
  createSync,
  readSync,
  updateSync,
  deleteSync,
  listSync,
  searchSync,
} from "../axiosRequest";
export function toForm(response, form) {
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
}

function editItem(form, target, id) {
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
}
export default editItem;
