import editItem from "./editItem";
import removeItem from "./removeItem";
import { valueByString } from "../helper";

function setCurrentRecord(res) {
  const { data } = res;
  const viewInfo = document.querySelector(
    '.component[data-component="view-details"]'
  );
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
    metaActions
      .querySelector(".meta-edit")
      .removeEventListener("click", handleEdit, false);
    metaActions
      .querySelector(".meta-edit")
      .addEventListener("click", handleEdit, false);
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
    metaActions
      .querySelector(".meta-remove")
      .removeEventListener("click", handleDelete, false);
    metaActions
      .querySelector(".meta-remove")
      .addEventListener("click", handleDelete, false);
  }
  if (metaActions.querySelector(".meta-print")) {
    metaActions.querySelector(".meta-print").dataset.id = data._id;
  }
}

function handleEdit() {
  const viewInfo = document.querySelector(
    '.component[data-component="view-details"]'
  );
  const actionClic = this.dataset.actionUrl + this.dataset.id;
  const form = viewInfo.querySelector("form.ajax");
  // if (type != 'edit') {
  editItem(actionClic, form, this.dataset.id);
  // }
}

function handleDelete() {
  const actionClic = this.dataset.actionUrl + this.dataset.id;
  const displayLabel = this.dataset.displayLabel;
  removeItem(actionClic, displayLabel);
}
export default setCurrentRecord;
