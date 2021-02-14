/* eslint-disable no-unused-vars */

import axios from "axios";
import activeTab from "./activeTab";
import { uniqueid } from "../helper";
import { formatDate } from "../helper";
import { activeModel } from "../helper";
import delegate from "../lib/delegate";
import AudioRecorder from "../lib/audioRecorder";

// import prescriptionList from './prescriptionList';

//////// ***** medicament Module  : add , edit , remove , render ***** //////////

const medicamentGrid = {
  toObject: function (row) {
    let obj = {};

    const elements = row.querySelectorAll("input, select, textarea");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      const name = element.name;
      const value = element.value;

      if (name) {
        obj[name] = value;
      }
    }

    return obj;
  },

  rowToForm: function (jsonTxt, row, idRow) {
    console.log(idRow);
    let obj = JSON.parse(jsonTxt);
    row.dataset.action = "edit";
    row.dataset.id = idRow;
    const elements = row.querySelectorAll("input, select, textarea");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      element.value = obj[element.name];
    }

    return obj;
  },

  reset: function (component) {
    const currentRow = component.querySelector(".currentRow");
    currentRow.dataset.action = "new";
    currentRow.dataset.id = null;
    const elements = currentRow.querySelectorAll("input, select,textarea");
    const autocompletes = currentRow.querySelectorAll(".autocomplete");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      element.value = "";
      element.dataset.value = "";
    }
    [].forEach.call(autocompletes, function (autocomplete) {
      const select = autocomplete.querySelector("select");
      if (select != null) {
        if (select.parentNode) {
          select.parentNode.removeChild(select);
        }
      }
    });
  },
  validate: function (row) {
    const elements = row.querySelectorAll("input, select, textarea");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      if (element.hasAttribute("required")) {
        if (element.value.length == 0) {
          return false;
        }
      }
    }

    return true;
  },
  add: function (component) {
    const currentRow = component.querySelector(".currentRow");
    const medicamentRow = component.querySelector(".medicament-row");
    const form = component.querySelector("form");
    const orgMoreOption = form.querySelector(".orgMoreOption");
    const newObj = medicamentGrid.toObject(currentRow);
    const newID = uniqueid();
    const action = currentRow.dataset.action;
    console.log(newObj);
    if (medicamentGrid.validate(currentRow)) {
      const editedID = currentRow.dataset.id || null;
      const editClassName = `.calculation-row[data-row="${editedID}"]`;
      const editedRow = medicamentRow.querySelector(editClassName);

      if (action == "edit" && editedRow != null) {
        editedRow.dataset.medicament = JSON.stringify(newObj);
        editedRow.innerHTML = `
        <div class="col-5"><span>${newObj.medicamentName}</span></div>
        <div class="col-3"><span>${newObj.boxesNumber} Boite</span></div>
        <div class="col-3"><span>${newObj.daysNumber} Jours</span></div>
        <div class="col-3"><span>${newObj.drugsNumber} cp</span></div>
        <div class="col-3"><span>${newObj.times} fois</span></div>
        <div class="col-5"><span>${newObj.note}</span></div>
        `;

        let moreOption = orgMoreOption.cloneNode(true);
        moreOption.className = "moreOption";
        moreOption.querySelector("li.remove").dataset.id = editedID;
        moreOption.querySelector("li.edit").dataset.id = editedID;
        editedRow.appendChild(moreOption);
      }
      if (action == "new") {
        const newRow = `<div class="content-row calculation-row" data-medicament='${JSON.stringify(
          newObj
        )}' data-row='${newID}'>
        <div class="col-5"><span>${newObj.medicamentName}</span></div>
        <div class="col-3"><span>${newObj.boxesNumber} Boite</span></div>
        <div class="col-3"><span>${newObj.daysNumber} Jours</span></div>
        <div class="col-3"><span>${newObj.drugsNumber} cp</span></div>
        <div class="col-3"><span>${newObj.times} fois</span></div>
        <div class="col-5"><span>${newObj.note}</span></div>
        </div>
        `;

        medicamentRow.innerHTML += newRow;
        const className = `.calculation-row[data-row="${newID}"]`;
        const lastRow = medicamentRow.querySelector(className);
        let moreOption = orgMoreOption.cloneNode(true);
        moreOption.className = "moreOption";
        moreOption.querySelector("li.remove").dataset.id = newID;
        moreOption.querySelector("li.edit").dataset.id = newID;
        lastRow.appendChild(moreOption);
      }

      medicamentGrid.reset(component);
    }
  },
  edit: function (component, element) {
    const id = element.dataset.id;
    const currentRow = component.querySelector(".currentRow");
    const className = `.calculation-row[data-row="${id}"]`;
    const selected = component.querySelector(className);
    const jsonTxt = selected.dataset.medicament;
    medicamentGrid.rowToForm(jsonTxt, currentRow, id);
  },
  remove: function (component, element) {
    const id = element.dataset.id;

    const className = `.calculation-row[data-row="${id}"]`;
    const selected = component.querySelector(className);

    if (selected.parentNode) {
      selected.parentNode.removeChild(selected);
    }
  },
  record: (component, medicament) => {
    const form = component.querySelector("form");
    const orgMoreOption = form.querySelector(".orgMoreOption");
    const newID = uniqueid();
    const result = `<div class="content-row calculation-row" data-medicament='${JSON.stringify(
      medicament
    )}' data-row='${newID}'>
    <div class="col-5"><span>${medicament.medicamentName}</span></div>
    <div class="col-3"><span>${medicament.boxesNumber} Boite</span></div>
    <div class="col-3"><span>${medicament.daysNumber} Jours</span></div>
    <div class="col-3"><span>${medicament.drugsNumber} cp</span></div>
    <div class="col-3"><span>${medicament.times} fois</span></div>
    <div class="col-5"><span>${medicament.note}</span></div>
    </div>
    `;
    const dom = document.createElement("div");
    dom.innerHTML = result;
    const row = dom.querySelector(".calculation-row");
    let moreOption = orgMoreOption.cloneNode(true);
    moreOption.className = "moreOption";
    moreOption.querySelector("li.remove").dataset.id = newID;
    moreOption.querySelector("li.edit").dataset.id = newID;
    row.appendChild(moreOption);
    return dom.innerHTML;
  },
  render: (component, data) => {
    const medicamentRow = component.querySelector(".medicament-row");
    const { medicamentsList } = data;
    const content = medicamentsList.map((item) =>
      medicamentGrid.record(component, item)
    );
    // inner data to #dataCont
    medicamentRow.innerHTML = content.join("");
  },
};

//////// ***** prescription Module  : type , edit , remove , download ***** //////////
const prescriptionGrid = {
  type: function (component, element) {
    console.log("prescriptionType event dispatched");
    const value = element.value;
    const form = component.querySelector("form");
    const type = component.querySelector(`.${value}`);
    const prescriptionForms = component.querySelectorAll(".prescriptionForm");
    if (type) {
      [].forEach.call(prescriptionForms, function (prescriptionForm) {
        prescriptionForm.classList.add("hidden");
        form.action = form.dataset.add;
        form.dataset.status = "new";
        medicamentGrid.reset(component);
        prescriptionGrid.resetForm(prescriptionForm);
      });
      type.classList.remove("hidden");
    }
  },
  resetForm: function (prescriptionForm) {
    const elements = prescriptionForm.querySelectorAll(
      "input, select,textarea"
    );
    const medicamentRow = prescriptionForm.querySelector(".medicament-row");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      element.value = "";
      element.dataset.value = "";
    }
    if (medicamentRow) {
      medicamentRow.innerHTML = "";
    }
  },
  formToObject: function (form) {
    let obj = {};
    const elements = form.querySelectorAll("input, select, textarea");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      const name = element.name;
      const value = element.value;

      if (name && element.dataset.disabled != "true") {
        obj[name] = value;
      }
    }
    return obj;
  },

  edit: function (component, element) {
    const id = element.dataset.id;
    console.log(`editPrescription : ${id}`);
    const form = component.querySelector("form");
    const prescriptionType = component.querySelector(".prescriptionType");
    const action = form.dataset.read + id;
    axios.get(action).then((response) => {
      // Rest all prescriptionForm
      // [].forEach.call(prescriptionForms, function(prescriptionForm) {
      //   reset(currentRow);
      //   resetForm(prescriptionForm);
      // });
      console.log(response.data);
      if (response.data.success == 1) {
        console.log(response.data);
        activeModel("prescription");

        // form.dataset.consultationId = response.data.result.consultation._id;

        const consultation = component.querySelector(
          'input[name="consultation"]'
        );
        const patient = component.querySelector('input[name="patient"]');
        const doctor = component.querySelector('input[name="doctor"]');
        const prescriptionTitle = component.querySelector(".page-title");
        const letterFrom = component.querySelector(`.letter`);
        consultation.value = response.data.result.consultation._id;
        patient.value = response.data.result.patient._id;
        doctor.value = response.data.result.doctor._id;
        consultation.dataset.id = response.data.result.consultation._id;
        patient.dataset.id = response.data.result.patient._id;
        doctor.dataset.id = response.data.result.doctor._id;
        prescriptionTitle.innerHTML = `Ordonnance #1 ${
          response.data.result.patient.name +
          " " +
          response.data.result.patient.surname
        }`;

        const type = response.data.result.type;

        if (type == "letter") {
          prescriptionType.value = type;
          prescriptionType.dispatchEvent(new Event("change"));
          form.action = form.dataset.edit + id;
          form.dataset.status = "update";
          letterFrom.querySelector("textarea").value =
            response.data.result.letter;
        } else {
          prescriptionType.value = type;
          console.log(prescriptionType.value);
          prescriptionType.dispatchEvent(new Event("change"));
          form.action = form.dataset.edit + id;
          form.dataset.status = "update";
          medicamentGrid.render(component, response.data.result);
        }
      }
    });
  },
  remove: function (component, element) {
    const prescriptionType = component.querySelector(".prescriptionType");
    const form = component.querySelector("form");
    const id = element.dataset.id;
    const action = form.dataset.delete + id;

    document
      .getElementById("delete-record")
      .querySelector(".row-info").innerHTML = " : " + id;

    window.modal.open("delete-record");
    const currentModal = document.querySelector(".current-modal");
    if (currentModal) {
      const confirmButton = currentModal.querySelector(".delete-confirm");

      if (confirmButton) {
        confirmButton.removeEventListener(
          "click",
          prescriptionDeleteConfirm,
          false
        );
        confirmButton.addEventListener(
          "click",
          prescriptionDeleteConfirm,
          false
        );
      }
    }
    function prescriptionDeleteConfirm() {
      axios.delete(action).then((response) => {
        //Rest all prescriptionForm
        prescriptionType.dispatchEvent(new Event("change"));
        form.action = form.dataset.add;
        form.dataset.status = "new";
        if (response.data.success == 1) {
          const className = `.prescriptionItem[data-id="${id}"]`;
          console.log(className);
          const selected = document.querySelector(className);
          console.log(selected);
          if (selected) {
            selected.parentNode.removeChild(selected);
          }
          window.modal.close();
        }
      });
    }
  },
  download: function (element) {
    const id = element.dataset.id;
    const link = element.dataset.path + "-" + id + ".pdf";
    console.log(link);
    window.open(link, "_blank");
    //prescriptionItem.setAttribute('href',`/api/prescription/pdf/${response.data.result._id}`)
  },
  renderList: function (component, datas) {
    console.log(datas);

    const orgprescriptionItem = component.querySelector(
      ".template .prescriptionItem"
    );
    const prescriptionItemList = component.querySelector(
      ".prescriptionItemList"
    );
    prescriptionItemList.dataset.nbr = 0;
    prescriptionItemList.innerHTML = "";
    for (const data of datas) {
      console.log(data);
      let prescriptionItem = orgprescriptionItem.cloneNode(true);

      //const reportList = component.querySelector('.reportList');
      const date = data.created;

      const nbr = parseInt(prescriptionItemList.dataset.nbr, 10) + 1 || 1;
      prescriptionItemList.dataset.nbr = nbr;
      prescriptionItem.querySelector(
        "span[data-prescriptionNbr]"
      ).innerHTML = `Ordonnance #${nbr}`;
      prescriptionItem.querySelector(
        "span[data-prescriptionDate]"
      ).innerHTML = formatDate(date);
      prescriptionItem.dataset.id = data._id;
      prescriptionItem.querySelector(".edit").dataset.id = data._id;
      prescriptionItem.querySelector(".download").dataset.id = data._id;
      prescriptionItem.querySelector(".remove").dataset.id = data._id;

      console.log(prescriptionItem);

      prescriptionItemList.appendChild(prescriptionItem);
    }
  },
};
//////// ***** report Module  : remove ***** //////////
const reportGrid = {
  recorder: function (component) {
    console.log("consultationAudioRecorder");
    console.log(component);
    var isRecording = false;
    var recordingIndex = 1;
    var recordButton = component;
    var oldLabel = recordButton.innerHTML;
    // var recordingsList = document.querySelector(component.dataset.listSelector);
    // var template = recordingsList.querySelector('.single-item.template');
    var recordingsStatus = component;
    recordButton.addEventListener("click", function () {
      if (!isRecording) {
        isRecording = true;
        recordButton.disabled = true;
        startRecording();
      } else {
        isRecording = false;
        stopRecording();
      }
    });

    const audioRecorder = AudioRecorder({
      onStop: function ({ blob }) {
        createDownloadLink(blob, "mp3");
        recordButton.innerHTML = oldLabel;
      },
      onReady: function () {
        this.isReady = true;
        recordButton.disabled = false;
      },
      onStatus: function (string, type) {
        if (type != "init") {
          recordingsStatus.innerHTML = string;
        }
      },
    });

    function startRecording() {
      audioRecorder.startRecording();
    }

    function stopRecording() {
      audioRecorder.stopRecording();
    }

    function createDownloadLink(blob, encoding) {
      // const name = new Date().toISOString() + '.' + encoding;
      if (component.dataset.saveAction) {
        var formData = new FormData();

        formData.append("name", `Recording ${recordingIndex}`);
        recordingIndex++;
        formData.append("audioFile", blob);
        formData.append("consultation", component.dataset.id);

        axios
          .post(component.dataset.saveAction, formData, {
            // onUploadProgress: function (progressEvent) {
            //     var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            //     recordingsList.querySelector('.upload-progress').innerHTML = "Uploading " + percentCompleted + "%";
            // },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(function (response) {
            // recordingsList.querySelector('.upload-progress').innerHTML = "";
            // console.log(response)
            const datas = [];
            datas.push(response.data.result);
            const consultation = document.querySelector(
              '.component[data-component="consultationInfo"]'
            );
            if (consultation) {
              reportGrid.renderList(consultation, datas);
            }
          });
      }
    }
  },

  play: function (el) {
    var isPlaying = false;
    var audioEl = document.createElement("audio");
    audioEl.src = el.dataset.src;
    audioEl.classList.add("hidden");
    el.append(audioEl);
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    });

    audioEl.addEventListener("play", function () {
      isPlaying = true;
      el.querySelector(".play").classList.add("hidden");
      el.querySelector(".pause").classList.remove("hidden");
    });
    audioEl.addEventListener("pause", function () {
      isPlaying = false;
      el.querySelector(".play").classList.remove("hidden");
      el.querySelector(".pause").classList.add("hidden");
    });
    function pause() {
      audioEl.pause();
    }
    function play() {
      document.querySelectorAll("audio").forEach(function (audio) {
        audio.pause();
      });
      audioEl.play();
    }
  },
  remove: function (element) {
    const id = element.dataset.id;
    const action = element.dataset.removeAction;

    document
      .getElementById("delete-record")
      .querySelector(".row-info").innerHTML = " : " + id;

    window.modal.open("delete-record");
    const currentModal = document.querySelector(".current-modal");
    if (currentModal) {
      const confirmButton = currentModal.querySelector(".delete-confirm");

      if (confirmButton) {
        confirmButton.removeEventListener("click", reportDeleteConfirm, false);
        confirmButton.addEventListener("click", reportDeleteConfirm, false);
      }
    }
    function reportDeleteConfirm() {
      axios.delete(action).then((response) => {
        console.log(response);
        if (response.data.success == 1) {
          const className = `.report[data-id="${response.data.result._id}"]`;
          console.log(className);
          const selected = document.querySelector(className);
          console.log(selected);
          if (selected) {
            selected.parentNode.removeChild(selected);
          }
          window.modal.close();
        }
      });
    }
  },
  renderList: function (component, datas) {
    const orgreport = component.querySelector(".template .report");
    const reportItemList = component.querySelector(".reportItemList");
    reportItemList.innerHTML = "";
    reportItemList.dataset.nbr = 0;
    for (const data of datas) {
      // console.log(data)
      const report = orgreport.cloneNode(true);
      const nbr = parseInt(reportItemList.dataset.nbr, 10) + 1 || 1;
      reportItemList.dataset.nbr = nbr;
      report.dataset.id = data._id;
      report.querySelector(
        "span[data-reportnbr]"
      ).innerHTML = `Rapport #${nbr}`;
      report.querySelector("span[data-reportdate]").innerHTML = formatDate(
        data.created
      );
      const playComponent = report.querySelector(".playPushButton");
      const removeRecord = report.querySelector(".remove");

      if (playComponent) {
        playComponent.dataset.src = "/" + data.audioFile;
        reportGrid.play(playComponent);
      }

      if (removeRecord) {
        removeRecord.dataset.id = data._id;
        removeRecord.dataset.displaylabel = data.audioFile;
        removeRecord.dataset.removeAction =
          reportItemList.dataset.removeAction + data._id;
      }

      reportItemList.appendChild(report);
      // console.log(reportItemList);
    }
  },
};

function resetPrescriptionGrid(prescriptionGrid) {
  const currentRow = prescriptionGrid.querySelector(".currentRow");
  const medicamentRow = prescriptionGrid.querySelector(".medicament-row");
  if (medicamentRow) {
    medicamentRow.innerHTML = "";
  } else {
    return;
  }
  if (currentRow) {
    currentRow.dataset.action = "new";
    currentRow.dataset.id = null;
  } else {
    return;
  }
  const elements = currentRow.querySelectorAll("input, select, textarea");
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    element.value = "";
    element.dataset.value = "";
  }

  const autocompletes = currentRow.querySelectorAll(".autocomplete");

  [].forEach.call(autocompletes, function (autocomplete) {
    const select = autocomplete.querySelector("select");
    if (select != null) {
      if (select.parentNode) {
        select.parentNode.removeChild(select);
      }
    }
  });
}

//////// ***** Main Component  : prescriptionComponent ***** //////////

const consultationComponent = {
  init: function (component) {
    const addNewRow = component.querySelector("button.newMedicament");
    const savePrescription = component.querySelector(".savePrescription");
    const prescriptionType = component.querySelector(".prescriptionType");
    const back = component.querySelector(".back");
    const prescriptionForms = component.querySelectorAll(".prescriptionForm");
    const recorderToggle = document.querySelector(
      '.component[data-component="recorder-toggle"]'
    );
    const form = component.querySelector("form");

    delegate(
      document.body,
      ".prescriptionItem .remove",
      "click",
      function (e) {
        prescriptionGrid.remove(component, e.delegateTarget);
      },
      false
    );
    delegate(
      document.body,
      ".prescriptionItem .edit",
      "click",
      function (e) {
        prescriptionGrid.edit(component, e.delegateTarget);
      },
      false
    );
    delegate(
      document.body,
      ".prescriptionItem .download",
      "click",
      function (e) {
        prescriptionGrid.download(e.delegateTarget);
      },
      false
    );

    delegate(
      document.body,
      ".report .remove",
      "click",
      function (e) {
        reportGrid.remove(e.delegateTarget);
      },
      false
    );

    delegate(
      document.body,
      ".medicament-row .edit",
      "click",
      function (e) {
        medicamentGrid.edit(component, e.delegateTarget);
      },
      false
    );
    delegate(
      document.body,
      ".medicament-row .remove",
      "click",
      function (e) {
        medicamentGrid.remove(component, e.delegateTarget);
      },
      false
    );

    if (prescriptionType) {
      prescriptionType.addEventListener("change", function () {
        prescriptionGrid.type(component, this);
      });
    }

    if (back) {
      back.addEventListener("click", function () {
        form.action = form.dataset.add;
        form.dataset.status = "new";
        medicamentGrid.reset(component);
        [].forEach.call(prescriptionForms, function (prescriptionForm) {
          prescriptionGrid.resetForm(prescriptionForm);
        });
        activeModel("dataTable");
      });
    }
    if (recorderToggle) {
      reportGrid.recorder(recorderToggle);
    }

    addNewRow.addEventListener("click", function () {
      medicamentGrid.add(component);
    });

    form.addEventListener("keydown", function (event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });

    savePrescription.addEventListener(
      "click",
      function (event) {
        event.preventDefault();
        medicamentGrid.reset(component); // make new medicament row empty
        const calculationRows = component.querySelectorAll(".calculation-row");
        const letterFrom = component.querySelector(`.letter`);
        // const infoDivs = document.querySelectorAll('.component[data-component="consultationInfo"]');
        const form = component.querySelector("form");
        let prescriptionData = prescriptionGrid.formToObject(form);
        const type = prescriptionType.value;
        const status = form.dataset.status;

        if (type == "letter") {
          const letter = letterFrom.querySelector("textarea");
          prescriptionData.letter = letter.value;
        } else {
          // type PrescriptionForm
          let medicamentList = [];

          [].forEach.call(calculationRows, function (calculationRow) {
            const data = calculationRow.dataset.medicament;
            console.log(data);
            if (data != undefined) {
              const dataObj = JSON.parse(data);
              medicamentList.push(dataObj);
            }
          });

          prescriptionData.medicamentsList = medicamentList;
        }
        let ajaxCall = null;
        if (form.dataset.status === "new") {
          ajaxCall = axios.post(form.action, prescriptionData);
        } else {
          ajaxCall = axios.patch(form.action, prescriptionData);
        }

        ajaxCall.then((response) => {
          // Rest all prescriptionForm
          form.action = form.dataset.add;
          form.dataset.status = "new";
          [].forEach.call(prescriptionForms, function (prescriptionForm) {
            medicamentGrid.reset(component);
            prescriptionGrid.resetForm(prescriptionForm);
          });
          if (response.data.success == 1) {
            activeModel("dataTable");
            activeTab(["read"]);
            if (status == "new") {
              const datas = [];
              datas.push(response.data.result);
              const consultation = document.querySelector(
                '.component[data-component="consultationInfo"]'
              );
              if (consultation) {
                // console.log(consultation);
                prescriptionGrid.renderList(consultation, datas);
              }
            }
          }
        });
      },
      false
    );
  },
  info: function (component, response, filter = ["new"]) {
    console.log(response);
    const patientIds = component.querySelectorAll(".item-data[data-patientId]");
    const patientNames = component.querySelectorAll(
      ".item-data[data-patientName]"
    );
    const newPrescription = component.querySelector("#newPrescription");
    const prescriptionGridComponent = document.querySelector(
      '.component[data-component="prescriptionGrid"]'
    );
    const prescriptionItemList = component.querySelector(
      ".prescriptionItemList"
    );
    const reportItemList = component.querySelector(".reportItemList");

    const prescriptionApi =
      "/api/prescription/filter/?filter=consultation&equal=" +
      response.result._id;
    const reportApi =
      "/api/audiorecording/filter/?filter=consultation&equal=" +
      response.result._id;

    console.log(prescriptionApi);
    activeModel("dataTable");

    document.querySelector('[data-component="recorder-toggle"]').dataset.id =
      response.result._id;

    if (filter.includes("new")) {
      [].forEach.call(patientIds, function (patientId) {
        patientId.innerHTML =
          response.result.patient.patientId || response.result.patient._id;
      });

      [].forEach.call(patientNames, function (patientName) {
        patientName.innerHTML =
          response.result.patient.name + " " + response.result.patient.surname;
      });
      prescriptionItemList.innerHTML = "";
      prescriptionItemList.dataset.nbr = 0;
      axios
        .get(prescriptionApi)
        .then((response) => {
          console.log(response);
          const datas = response.data.result;
          prescriptionGrid.renderList(component, datas);
          // prescriptionGrid.renderList(component,datas);
        })
        .catch(function (error) {
          // handle error
          return error.response;
        });

      reportItemList.innerHTML = "";
      reportItemList.dataset.nbr = 0;
      axios
        .get(reportApi)
        .then((response) => {
          console.log(response);
          const datas = response.data.result;
          reportGrid.renderList(component, datas);
        })
        .catch(function (error) {
          // handle error
          return error.response;
        });
    }

    // if (filter.includes('saved')) {
    //   /////
    // }

    if (newPrescription) {
      newPrescription.addEventListener(
        "click",
        function () {
          console.log(response);

          if (prescriptionGridComponent) {
            const form = prescriptionGridComponent.querySelector("form");
            form.dataset.consultationId = response.result._id;
            const consultation = prescriptionGridComponent.querySelector(
              'input[name="consultation"]'
            );
            const patient = prescriptionGridComponent.querySelector(
              'input[name="patient"]'
            );
            const doctor = prescriptionGridComponent.querySelector(
              'input[name="doctor"]'
            );
            const prescriptionTitle = prescriptionGridComponent.querySelector(
              ".page-title"
            );
            consultation.value = response.result._id;
            patient.value = response.result.patient._id;
            doctor.value = response.result.doctor._id;
            consultation.dataset.id = response.result._id;
            patient.dataset.id = response.result.patient._id;
            doctor.dataset.id = response.result.doctor._id;
            prescriptionTitle.innerHTML = `Ordonnance #1 ${
              response.result.patient.name +
              " " +
              response.result.patient.surname
            }`;
            resetPrescriptionGrid(prescriptionGridComponent);
          }

          activeModel("prescription");
        },
        false
      );
    }
  },
};
export default consultationComponent;
