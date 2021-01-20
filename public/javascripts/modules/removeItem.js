import ajaxGetData from "./ajaxGetData";
import dataGrid from "./dataGrid";
import { accordionBar } from "./accordionModel";
import {
  createSync,
  readSync,
  updateSync,
  deleteSync,
  listSync,
  searchSync,
} from "../axiosRequest";

function removeItem(target, id, displaylabel) {
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
}
export default removeItem;
