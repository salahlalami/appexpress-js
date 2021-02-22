import {
  uniqueid,
  RowToObject,
  jsonToRow,
  validateRow,
  resetRow,
} from "../../helper";
import delegate from "../../lib/delegate";
//////// ***** items Module  : add , edit , remove , render ***** //////////

const itemsGrid = {
  currentRow: null,
  invoiceComponent: null,
  init: (invoiceComponent) => {
    itemsGrid.invoiceComponent = invoiceComponent;
    itemsGrid.currentRow = invoiceComponent.querySelector(".currentRow");
    const currentRow = itemsGrid.currentRow;
    const newItem = invoiceComponent.querySelector(".newItem");
    const price = currentRow.querySelector('input[name ="price"]');
    const quantity = currentRow.querySelector('input[name ="quantity"]');
    const total = currentRow.querySelector('input[name ="total"]');
    const taxRate = invoiceComponent.querySelector("select.taxRate");

    newItem.addEventListener("click", function () {
      itemsGrid.add();
    });

    taxRate.addEventListener("change", function () {
      itemsGrid.sum();
    });

    delegate(
      document.body,
      ".itemsRow .edit",
      "click",
      function (e) {
        itemsGrid.edit(e.delegateTarget);
      },
      false
    );
    delegate(
      document.body,
      ".itemsRow .remove",
      "click",
      function (e) {
        itemsGrid.remove(e.delegateTarget);
      },
      false
    );
    // Total calculation on input real time change
    price.addEventListener("input", function () {
      price.value = price.value < 0 ? -price.value : price.value;
      const totalValue = Math.abs(price.value) * Math.abs(quantity.value);
      total.value = parseFloat(totalValue).toFixed(2);
    });
    quantity.addEventListener("input", function () {
      quantity.value = quantity.value < 0 ? -quantity.value : quantity.value;
      const totalValue = Math.abs(price.value) * Math.abs(quantity.value);
      total.value = parseFloat(totalValue).toFixed(2);
    });
  },
  singleItem: (obj) => {
    return `<div class="col-5"><span>${obj.itemName}</span></div>
    <div class="col-7"><span>${obj.description}</span></div>
    <div class="col-3"><span>${obj.quantity} </span></div>
    <div class="col-3"><span>${obj.price} DA</span></div>
    <div class="col-4"><span>${obj.total} DA</span></div>
    `;
  },
  add: () => {
    const currentRow = itemsGrid.currentRow;
    const invoiceComponent = itemsGrid.invoiceComponent;
    const itemsRow = invoiceComponent.querySelector(".itemsRow");
    const orgdropdown = invoiceComponent.querySelector(".orgdropdown");
    const newObj = RowToObject(currentRow);
    const newID = uniqueid();
    const action = currentRow.dataset.action;
    let dropdown = orgdropdown.cloneNode(true);
    dropdown.className = "dropdown";
    if (validateRow(currentRow)) {
      const editedID = currentRow.dataset.id || null;
      const editClassName = `.calculation-row[data-row="${editedID}"]`;
      const editedRow = itemsRow.querySelector(editClassName);

      if (action == "edit" && editedRow != null) {
        editedRow.dataset.item = JSON.stringify(newObj);
        editedRow.dataset.total = newObj.total;
        editedRow.innerHTML = `
        ${itemsGrid.singleItem(newObj)}
        `;

        dropdown.querySelector("li.remove").dataset.id = editedID;
        dropdown.querySelector("li.edit").dataset.id = editedID;
        editedRow.appendChild(dropdown);
      }
      if (action == "new") {
        const newRow = `<div class="content-row calculation-row" data-total=${
          newObj.total
        } data-item=${JSON.stringify(newObj)} data-row='${newID}'>
        ${itemsGrid.singleItem(newObj)}
        </div>
        `;

        itemsRow.innerHTML += newRow;
        const className = `.calculation-row[data-row="${newID}"]`;
        const lastRow = itemsRow.querySelector(className);

        dropdown.querySelector("li.remove").dataset.id = newID;
        dropdown.querySelector("li.edit").dataset.id = newID;
        lastRow.appendChild(dropdown);
      }

      resetRow(currentRow);
    }
    itemsGrid.sum();
  },
  edit: (element) => {
    const invoiceComponent = itemsGrid.invoiceComponent;
    const id = element.dataset.id;
    const currentRow = invoiceComponent.querySelector(".currentRow");
    const className = `.calculation-row[data-row="${id}"]`;
    const selected = invoiceComponent.querySelector(className);
    const jsonTxt = selected.dataset.item;
    jsonToRow(jsonTxt, currentRow, id);
  },
  remove: (element) => {
    const invoiceComponent = itemsGrid.invoiceComponent;
    const id = element.dataset.id;
    const className = `.calculation-row[data-row="${id}"]`;
    const selected = invoiceComponent.querySelector(className);
    if (selected.parentNode) {
      selected.parentNode.removeChild(selected);
      itemsGrid.sum();
    }
  },

  render: (data) => {
    const invoiceComponent = itemsGrid.invoiceComponent;
    const itemsRow = invoiceComponent.querySelector(".itemsRow");
    const { items } = data;
    const content = items.map((item) => {
      const orgdropdown = invoiceComponent.querySelector(".orgdropdown");
      let dropdown = orgdropdown.cloneNode(true);
      const newID = uniqueid();
      const result = `<div class="content-row calculation-row"
                          data-total=${item.total}
                          data-item='${JSON.stringify(
                            item
                          )}' data-row='${newID}'>
                          ${itemsGrid.singleItem(item)}
                      </div>`;
      const dom = document.createElement("div");
      dom.innerHTML = result;
      const row = dom.querySelector(".calculation-row");
      dropdown.className = "dropdown";
      dropdown.querySelector("li.remove").dataset.id = newID;
      dropdown.querySelector("li.edit").dataset.id = newID;
      row.appendChild(dropdown);
      return dom.innerHTML;
    });
    // inner data to #dataCont
    itemsRow.innerHTML = content.join("");
    itemsGrid.sum();
  },
  sum: () => {
    const invoiceComponent = itemsGrid.invoiceComponent;
    const itemsRow = invoiceComponent.querySelector(".itemsRow");
    const items = itemsRow.querySelectorAll(".calculation-row");
    const calcTotal = invoiceComponent.querySelector(".calcTotal");
    const subTotal = calcTotal.querySelector(".subTotal");
    const taxRate = calcTotal.querySelector("select.taxRate").value;
    const taxTotal = calcTotal.querySelector(".taxTotal");
    const total = calcTotal.querySelector(".total");

    let subTotalValue = 0;
    items.forEach((item) => {
      const curruntAmount = parseFloat(item.dataset.total);
      subTotalValue += curruntAmount;
    });
    const taxTotalValue = subTotalValue * parseFloat(taxRate);
    const totalValue = subTotalValue + taxTotalValue;
    subTotal.innerHTML = subTotalValue.toFixed(2);
    taxTotal.innerHTML = taxTotalValue.toFixed(2);
    total.innerHTML = totalValue.toFixed(2);
  },
};

export default itemsGrid;
