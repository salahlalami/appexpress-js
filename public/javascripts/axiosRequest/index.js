import axios from "axios";
import { baseUrl } from "./config";

exports.createSync = (target, jsonData) => {
  const result = axios
    .post(baseUrl + target + "/create", jsonData)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};
exports.readSync = (target, id) => {
  const result = axios
    .get(baseUrl + target + "/read/" + id)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};
exports.updateSync = (target, id, jsonData) => {
  const result = axios
    .patch(baseUrl + target + "/update/" + id, jsonData)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};

exports.deleteSync = (target, id) => {
  const result = axios
    .delete(baseUrl + target + "/delete/" + id)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};

exports.filterSync = (target, option = null) => {
  let query = "";
  if (option != null) {
    let filter = "";
    let equal = "";
    if (option.filter) {
      filter = "filter=" + option.filter;
    }
    if (option.equal) {
      equal = "&equal=" + option.equal;
    }
    query = `?${filter}${equal}`;
  }

  const result = axios
    .get(baseUrl + target + "/filter" + query)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};
exports.searchSync = (target, option = null) => {
  let query = "";
  if (option != null) {
    let fields = "";
    let question = "";
    if (option.fields) {
      fields = "fields=" + option.fields;
    }
    if (option.question) {
      question = "&q=" + option.question;
    }
    query = `?${fields}${question}`;
  }

  const result = axios
    .get(baseUrl + target + "/search" + query)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};
exports.listSync = (target, option = null) => {
  let query = "";
  if (option != null) {
    let page = "";
    let items = "";
    if (option.page) {
      page = "page=" + option.page;
    }
    if (option.items) {
      items = "&items=" + option.items;
    }
    query = `?${page}${items}`;
  }
  console.log("query : " + query);

  const result = axios
    .get(baseUrl + target + "/list" + query)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};

exports.postDataSync = (targetUrl, jsonData) => {
  const result = axios
    .post(baseUrl + targetUrl, jsonData)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};
exports.getDataSync = (targetUrl) => {
  const result = axios
    .get(baseUrl + targetUrl)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};
