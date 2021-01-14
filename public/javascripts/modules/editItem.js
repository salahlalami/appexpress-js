import ajaxGetData from "./ajaxGetData";
import activeTab from "./activeTab";
import { valueByString } from "../helper";
// import ajaxDataRead from './ajaxDataRead';
import setCurrentRecord from "./setCurrentRecord";

export function toForm(result, form) {
  console.log(result.data);
  if (!form) {
    form = document.querySelector("form.ajax");
  }
  if (!form) {
    return;
  }
  const elements = form.querySelectorAll("input, select, textarea");
  for (let i = 0; i < elements.length; ++i) {
    console.log(elements[i]);
    const element = elements[i];
    if (element.classList.contains("ajaxResult")) {
      var value = result.data[element.name];
      element.dataset.value = value._id;
    } else {
      if (element.classList.contains("ajaxSelect")) {
        var variable = result.data[element.name];
        element.value = variable._id || variable;
        setTimeout(() => {
          const e = new Event("change");
          element.dispatchEvent(e);
        }, 100);
      } else if (element.classList.contains("searchAjax")) {
        var _id = result.data[element.name];
        // var variable = "";
        if (
          element.dataset.label &&
          typeof result.data[element.name] == "object"
        ) {
          variable = valueByString(
            result.data[element.name],
            element.dataset.label
          );
          console.log(variable);
          _id = result.data[element.name]._id;
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
        console.log(element.name);
        const name = element.dataset.name || element.name;
        variable = valueByString(result.data, name);
        //const json =  JSON.stringify(variable);
        console.log(variable);
        element.value = variable._id || variable;
      }
    }
  }
}

function editItem(action, form, id) {
  if (!form) {
    form = document.querySelector("form.ajax");
  }

  const viewInfo = document.querySelector(
    '.component[data-component="view-details"]'
  );
  if (viewInfo) {
    viewInfo.querySelector(".panel-body").classList.remove("hidden");
  }

  form.action = form.dataset.edit + id;
  form.dataset.id = id;
  const result = ajaxGetData(action);
  result.then(function (res) {
    setCurrentRecord(res);
    activeTab(["edit"]);
    toForm(res, form);
    // const infoDivs = document.querySelectorAll('.component[data-component="information"]');
    // [].forEach.call(infoDivs, function (infoDiv) {
    //     ajaxDataRead(infoDiv, 'ul.info', res);
    // });
  });
}
export default editItem;
