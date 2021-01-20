import activeTab from "./activeTab";
import setCurrentRecord from "./setCurrentRecord";
import ajaxDataRead from "./ajaxDataRead";
import consultationComponent from "./consultationComponent";
import {
  createSync,
  readSync,
  updateSync,
  deleteSync,
  listSync,
  searchSync,
} from "../axiosRequest";
// import { toForm } from './editItem';

function viewItem(target, id, viewType = ["standard"]) {
  console.log(viewType);
  const result = readSync(target, id);
  return result.then(function (response) {
    setCurrentRecord(target, response);
    activeTab(["read"]);
    // toForm(response);

    if (viewType.includes("consultation")) {
      const infoDivs = document.querySelectorAll(
        '.component[data-component="consultationInfo"]'
      );
      [].forEach.call(infoDivs, function (infoDiv) {
        console.log("viewType consultation");
        consultationComponent.info(infoDiv, response);
      });
    } else {
      const infoDivs = document.querySelectorAll(
        '.component[data-component="information"]'
      );
      [].forEach.call(infoDivs, function (infoDiv) {
        console.log("viewType standard");
        ajaxDataRead(infoDiv, "ul.info", response);
      });
    }
    return response;
  });
}
export default viewItem;
