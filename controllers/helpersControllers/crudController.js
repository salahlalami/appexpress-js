const apiRest = require("./apiRest");
const mongoose = require("mongoose");

exports.createCRUDController = (modelName, filter = []) => {
  const Model = mongoose.model(modelName);
  let crudMethods = {};

  if (!filter.includes("create")) {
    crudMethods.create = async (req, res) => {
      apiRest.create(Model, req, res);
    };
  }
  if (!filter.includes("read")) {
    crudMethods.read = async (req, res) => {
      apiRest.read(Model, req, res);
    };
  }
  if (!filter.includes("update")) {
    crudMethods.update = async (req, res) => {
      apiRest.update(Model, req, res);
    };
  }
  if (!filter.includes("delete")) {
    crudMethods.delete = async (req, res) => {
      apiRest.delete(Model, req, res);
    };
  }
  if (!filter.includes("getAll")) {
    crudMethods.getAll = async (req, res) => {
      apiRest.getAll(Model, req, res);
    };
  }
  if (!filter.includes("search")) {
    crudMethods.search = async (req, res) => {
      apiRest.search(Model, req, res);
    };
  }
  if (!filter.includes("getByFilter")) {
    crudMethods.getByFilter = async (req, res) => {
      apiRest.getByFilter(Model, req, res);
    };
  }
  if (!filter.includes("getFilterbyDate")) {
    crudMethods.getFilterbyDate = async (req, res) => {
      apiRest.getFilterbyDate(Model, req, res);
    };
  }
  return crudMethods;
};
