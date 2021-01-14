import ajaxGetData from "./ajaxGetData";
import activeTab from "./activeTab";
import setCurrentRecord from "./setCurrentRecord";
import ajaxDataRead from "./ajaxDataRead";
import consultationComponent from "./consultationComponent";
// import { toForm } from './editItem';

function viewItem(url, viewType = ["standard"]) {
  console.log(viewType);
  const result = ajaxGetData(url);
  return result.then(function (res) {
    setCurrentRecord(res);
    activeTab(["read"]);
    // toForm(res);

    if (viewType.includes("consultation")) {
      const infoDivs = document.querySelectorAll(
        '.component[data-component="consultationInfo"]'
      );
      [].forEach.call(infoDivs, function (infoDiv) {
        console.log("viewType consultation");
        consultationComponent.info(infoDiv, res);
      });
    } else {
      const infoDivs = document.querySelectorAll(
        '.component[data-component="information"]'
      );
      [].forEach.call(infoDivs, function (infoDiv) {
        console.log("viewType standard");
        ajaxDataRead(infoDiv, "ul.info", res);
      });
    }
    return res;
  });
}
export default viewItem;
