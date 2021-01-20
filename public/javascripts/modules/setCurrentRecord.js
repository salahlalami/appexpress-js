import editItem from "./editItem";
import removeItem from "./removeItem";
import { valueByString } from "../helper";
import delegate from "../lib/delegate";

function setCurrentRecord(target, res) {
  const data = res.result;
  const viewInfo = document.querySelector(
    '.component[data-component="view-details"]'
  );
  const infoTitle = viewInfo.querySelector(".info-title");
  const metaActions = viewInfo.querySelector(".meta-actions");
  const removeIcon = metaActions.querySelector(".meta-remove");
  removeIcon.removeEventListener("click", handleDelete, false);
  removeIcon.addEventListener("click", handleDelete, false);
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
    // delegate(document.body, ".meta-remove", "click", handleDelete, false);
  }
  if (metaActions.querySelector(".meta-print")) {
    metaActions.querySelector(".meta-print").dataset.id = data._id;
  }

  function handleEdit() {
    const viewInfo = document.querySelector(
      '.component[data-component="view-details"]'
    );
    const form = viewInfo.querySelector("form.ajax");
    // if (type != 'edit') {
    editItem(form, target, this.dataset.id);
    // }
  }

  function handleDelete() {
    console.log("handleDelete event");
    const displayLabel = this.dataset.displayLabel;
    removeItem(target, this.dataset.id, displayLabel);
  }
}

export default setCurrentRecord;
