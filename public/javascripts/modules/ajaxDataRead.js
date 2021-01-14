import { valueByString } from "../helper";

function ajaxDataRead(component, divResultName, res) {
  const divResult = component.querySelector(divResultName);
  const list = divResult.dataset.listinfos;
  divResult.innerHTML = "";
  console.log(res);
  const data = res.data;
  const obj = JSON.parse(list);
  console.log(res);

  for (let i = 0; i < obj.length; ++i) {
    let listItem = document.createElement("li");
    const propKey = obj[i].key;
    const propText = obj[i].text;
    let textItem = document.createElement("p");
    let point = document.createElement("p");
    let valueItem = document.createElement("p");
    textItem.textContent = propText;
    point.textContent = ":";
    listItem.appendChild(textItem);
    listItem.appendChild(point);
    valueItem.textContent = valueByString(data, propKey);
    listItem.appendChild(valueItem);
    divResult.appendChild(listItem);
  }
}

export default ajaxDataRead;
