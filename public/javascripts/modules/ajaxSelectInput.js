import ajaxGetData from "./ajaxGetData";

function ajaxSelectInput(component, ajaxSelectName, ajaxResultName) {
  const ajaxSelect = component.querySelector(ajaxSelectName);
  const resultId = ajaxSelect.dataset.id;
  const className = ajaxResultName + '[data-id="' + resultId + '"]';
  const ajaxResult = document.querySelector(className);

  ajaxSelect.addEventListener(
    "change",
    function () {
      console.log(`e.target.value = ${this.value}`);
      // const id =this.dataset.id;

      const actionClic = this.dataset.ajax + this.value;

      ajaxResult.disabled = true;
      ajaxResult.selectedIndex = 0;
      ajaxResult.options.length = 0;

      const result = ajaxGetData(actionClic);

      result.then(function (res) {
        if (res.success == 1) {
          const datas = res.data;
          for (const data of datas) {
            ajaxResult.options[ajaxResult.options.length] = new Option(
              data.name + " " + data.surname,
              data._id
            );
          }
          if (ajaxResult.options.length >= 1) {
            ajaxResult.disabled = false;
          }
          if (ajaxResult.dataset.value) {
            ajaxResult.value = ajaxResult.dataset.value;
            const e = new Event("change");
            ajaxResult.dispatchEvent(e);
          }
        } else {
          return;
        }
      });
    },
    false
  );
}

export default ajaxSelectInput;
