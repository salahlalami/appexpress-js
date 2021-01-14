import axios from "axios";

function ajaxGetData(url) {
  // e.preventDefault();

  const result = axios
    .get(url)
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
}

export default ajaxGetData;
