import ajaxGetData from "./ajaxGetData";
import viewItem from "./viewItem";
import editItem from "./editItem";
import removeItem from "./removeItem";
import delegate from "../lib/delegate";
import {
  createSync,
  readSync,
  updateSync,
  deleteSync,
  listSync,
  searchSync,
} from "../axiosRequest";
import { valueByString } from "../helper";

let render = {
  grid: function (res = {}, table, col) {
    console.log(res);
    const datas = res.result;
    const paginationData = res.pagination;

    table.querySelector("ul.tableBody").innerHTML = "";
    table.querySelector("#pagination .prev").dataset.action = "";
    table.querySelector("#pagination .next").dataset.action = "";

    for (const data of datas) {
      let listItem = document.createElement("li");
      listItem.dataset.id = data._id;
      const orgMoreOption = table.querySelector(".moreOption");
      let moreOption = orgMoreOption.cloneNode(true);
      moreOption.querySelector("li.remove").dataset.id = data._id;
      moreOption.querySelector(
        "li.remove"
      ).dataset.displayLabel = valueByString(
        data,
        moreOption.querySelector("li.remove").dataset.label || ""
      );
      moreOption.querySelector("li.edit").dataset.id = data._id;
      moreOption.querySelector("li.read").dataset.id = data._id;

      for (let i = 0; i < col.length; ++i) {
        const variable = valueByString(data, col[i]);

        listItem.appendChild(
          document.createElement("p")
        ).textContent = variable;
      }
      listItem.appendChild(moreOption).classList.remove("hidden");

      table.querySelector("ul.tableBody").appendChild(listItem);
    }
    let prev = "";
    if (paginationData.page > 1) {
      prev = parseInt(paginationData.page) - 1;
    } else prev = "";
    table.querySelector("#pagination .prev").dataset.action =
      table.dataset.action + prev;
    let next = "";
    if (paginationData.page < paginationData.pages) {
      next = parseInt(paginationData.page) + 1;
    } else next = "";
    table.querySelector("#pagination .next").dataset.action =
      table.dataset.action + next;
  },
  pagination: function (res, table) {
    const paginationData = res.pagination;

    table.querySelector("#pagination ul.pages").innerHTML = "";

    for (let i = 1; i <= paginationData.pages; ++i) {
      let listPag = document.createElement("li");
      listPag.innerHTML = i;
      listPag.dataset.action = table.dataset.action + i;

      if (i === paginationData.page) {
        listPag.classList.add("active");
      }
      table.querySelector("#pagination ul.pages").appendChild(listPag);
    }
  },
  activePagination: function (page) {
    const i = page;
    const pag = document.querySelectorAll("#pagination ul.pages li");
    for (let i = 0; i < pag.length; ++i) {
      pag[i].classList.remove("active");
    }
    pag[i - 1].classList.add("active");
  },
};

const dataGrid = {
  init: function (component, tableName, panelFormName) {
    const form = document.querySelector(panelFormName);
    const table = component.querySelector(tableName);
    const col = JSON.parse(table.dataset.col);
    const actionEdit = table.dataset.show;
    const actionRead = table.dataset.show;
    const removeUrl = table.dataset.remove;
    const viewType = table.dataset.viewtype;
    const searchInput = document.querySelector(
      '.component[data-component="search-input"]'
    );

    const target = table.dataset.target;
    console.log("target : " + target);
    const result = listSync(target);
    console.log(result);
    result.then(function (response) {
      render.grid(response, table, col);
      render.pagination(response, table);
    });

    delegate(
      document.body,
      ".tableBody li .moreOption .edit",
      "click",
      function (e) {
        console.log("delegate .edit");
        const actionClic = actionEdit + e.delegateTarget.dataset.id;
        editItem(actionClic, form, e.delegateTarget.dataset.id);
      },
      false
    );

    delegate(
      document.body,
      ".tableBody li .moreOption .read",
      "click",
      function (e) {
        console.log("delegate .read");
        viewItem(actionRead + e.delegateTarget.dataset.id, viewType);
      },
      false
    );

    delegate(
      document.body,
      ".tableBody li .moreOption .remove",
      "click",
      function (e) {
        console.log("delegate .remove");
        const removeAction = removeUrl + e.delegateTarget.dataset.id;
        const displayLabel = e.delegateTarget.dataset.displayLabel;
        removeItem(removeAction, displayLabel);
      },
      false
    );

    delegate(
      document.body,
      "#pagination ul.pages li",
      "click",
      function (e) {
        const actionClic = e.delegateTarget.dataset.action;
        const result = ajaxGetData(actionClic);
        result.then(function (res) {
          render.grid(res, table, col);
          render.activePagination(res.pagination.page);
        });
      },
      false
    );

    table.querySelector("#pagination .next").addEventListener(
      "click",
      function () {
        console.log("#pagination .next");
        const actionClic = this.dataset.action;
        const result = ajaxGetData(actionClic);
        result.then(function (res) {
          render.grid(res, table, col);
          render.activePagination(res.pagination.page);
        });
      },
      false
    );

    table.querySelector("#pagination .prev").addEventListener(
      "click",
      function () {
        console.log("#pagination .prev");
        const actionClic = this.dataset.action;
        const result = ajaxGetData(actionClic);
        result.then(function (res) {
          render.grid(res, table, col);
          render.activePagination(res.pagination.page);
        });
      },
      false
    );
    if (searchInput) {
      searchInput.addEventListener(
        "select",
        function (event) {
          const url = searchInput.dataset.read;
          const { detail } = event;
          viewItem(url + detail.id, viewType);
        },
        false
      );
    } else {
      console.error(`cant find .component[data-component="search-input"]`);
    }
  },

  refresh: function (component) {
    const table = component.querySelector(".table");
    const col = JSON.parse(table.dataset.col);
    const currentActivePage = document.querySelector(
      "#pagination ul.pages li.active"
    );
    if (currentActivePage) {
      const actionClic = currentActivePage.dataset.action;
      const result = ajaxGetData(actionClic);
      result.then(function (res) {
        render.grid(res, table, col);
        render.pagination(res, table);
        render.activePagination(res.pagination.page);
      });
    }
  },
};
export default dataGrid;
