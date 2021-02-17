/* eslint-disable no-unused-vars */

import {
  uploadSync,
  createSync,
  updateSync,
  readSync,
  filterSync,
  deleteSync,
  multiSync,
} from "../axiosRequest";
import { activeTab, activeModel } from "../core";
import { uniqueid, formatDate } from "../helper";

import delegate from "../lib/delegate";
import AudioRecorder from "../lib/audioRecorder";

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
    const value = element.value;
    const form = component.querySelector("form");
    const type = component.querySelector(`.${value}`);
    const prescriptionForms = component.querySelectorAll(".prescriptionForm");
    if (type) {
      [].forEach.call(prescriptionForms, function (prescriptionForm) {
        prescriptionForm.classList.add("hidden");

        form.dataset.status = "new";
        form.dataset.idPrescription = null;
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
    const form = component.querySelector("form");
    const prescriptionType = component.querySelector(".prescriptionType");
    const targetPrescription = component.dataset.targetPrescription;
    const loaderWarpper = '.model[data-model="prescription"]';
    activeModel("prescription");
    const ajaxCall = readSync(targetPrescription, id, { loaderWarpper });
    ajaxCall.then((response) => {
      if (response.success == true) {
        // form.dataset.consultationId = response.result.consultation._id;

        const consultation = component.querySelector(
          'input[name="consultation"]'
        );
        const patient = component.querySelector('input[name="patient"]');
        const doctor = component.querySelector('input[name="doctor"]');
        const prescriptionTitle = component.querySelector(".page-title");
        const letterFrom = component.querySelector(`.letter`);
        consultation.value = response.result.consultation._id;
        patient.value = response.result.patient._id;
        doctor.value = response.result.doctor._id;
        consultation.dataset.id = response.result.consultation._id;
        patient.dataset.id = response.result.patient._id;
        doctor.dataset.id = response.result.doctor._id;
        prescriptionTitle.innerHTML = `Ordonnance #1 ${
          response.result.patient.name + " " + response.result.patient.surname
        }`;

        const type = response.result.type;
        prescriptionType.value = type;
        prescriptionType.dispatchEvent(new Event("change"));
        form.dataset.idPrescription = id;
        form.dataset.status = "update";

        if (type == "letter") {
          letterFrom.querySelector("textarea").value = response.result.letter;
        } else {
          medicamentGrid.render(component, response.result);
        }
      }
    });
  },
  remove: function (component, element) {
    const prescriptionType = component.querySelector(".prescriptionType");
    const form = component.querySelector("form");
    const targetPrescription = component.dataset.targetPrescription;
    const id = element.dataset.id;
    const loaderWarpper = '.component[data-component="panel"] .panel';

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
      window.modal.close();
      const ajaxCall = deleteSync(targetPrescription, id, { loaderWarpper });

      ajaxCall.then((response) => {
        //Rest all prescriptionForm
        if (response === undefined || response.success === false) {
          return;
        }
        //Rest all prescriptionForm
        prescriptionType.dispatchEvent(new Event("change"));

        form.dataset.status = "new";
        form.dataset.idPrescription = null;
        if (response.success == true) {
          const className = `.prescriptionItem[data-id="${id}"]`;

          const selected = document.querySelector(className);

          if (selected) {
            selected.parentNode.removeChild(selected);
          }
        }
      });
    }
  },
  download: function (element) {
    const id = element.dataset.id;
    const link = element.dataset.path + "-" + id + ".pdf";

    window.open(link, "_blank");
    //prescriptionItem.setAttribute('href',`/api/prescription/pdf/${response.result._id}`)
  },
  renderPrescription: function (component, datas, multiple = true) {
    const orgprescriptionItem = component.querySelector(
      ".template .prescriptionItem"
    );
    const prescriptionItemList = component.querySelector(
      ".prescriptionItemList"
    );
    if (multiple) {
      prescriptionItemList.dataset.nbr = 0;
      prescriptionItemList.innerHTML = "";
    }
    for (const data of datas) {
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

      prescriptionItemList.appendChild(prescriptionItem);
    }
  },
};
//////// ***** report Module  : remove ***** //////////
const reportGrid = {
  recorder: function (recorderToggle) {
    var isRecording = false;
    var recordingIndex = 1;
    var recordButton = recorderToggle;
    var oldLabel = recordButton.innerHTML;
    const loaderWarpper = '.component[data-component="panel"] .panel';
    // var recordingsList = document.querySelector(recorderToggle.dataset.listSelector);
    // var template = recordingsList.querySelector('.single-item.template');
    var recordingsStatus = recorderToggle;
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
      const targetRecorder = recorderToggle.dataset.targetRecorder;
      var formData = new FormData();

      formData.append("name", `Recording ${recordingIndex}`);
      recordingIndex++;
      formData.append("audioFile", blob);
      formData.append("consultation", recorderToggle.dataset.id);
      const ajaxCall = uploadSync(targetRecorder, formData, { loaderWarpper });
      ajaxCall.then(function (response) {
        const datas = [];
        datas.push(response.result);
        const consultation = document.querySelector(
          '.component[data-component="consultationInfo"]'
        );
        if (consultation) {
          reportGrid.renderRecord(consultation, datas, false);
        }
      });
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
  remove: function (component, element) {
    const id = element.dataset.id;
    const targetRecorder = component.dataset.targetRecorder;
    const loaderWarpper = '.component[data-component="panel"] .panel';

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
      window.modal.close();
      const ajaxCall = deleteSync(targetRecorder, id, { loaderWarpper });

      ajaxCall.then((response) => {
        //Rest all prescriptionForm
        if (response === undefined || response.success === false) {
          return;
        }

        if (response.success == true) {
          const className = `.report[data-id="${response.result._id}"]`;

          const selected = document.querySelector(className);

          if (selected) {
            selected.parentNode.removeChild(selected);
          }
        }
      });
    }
  },
  renderRecord: function (component, datas, multiple = true) {
    const orgreport = component.querySelector(".template .report");
    const reportItemList = component.querySelector(".reportItemList");
    if (multiple) {
      reportItemList.innerHTML = "";
      reportItemList.dataset.nbr = 0;
    }
    for (const data of datas) {
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
      }

      reportItemList.appendChild(report);
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

const consultationModule = {
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

    const loaderWarpper = '.model[data-model="prescription"]';

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
        reportGrid.remove(component, e.delegateTarget);
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
        form.dataset.status = "new";
        form.dataset.idPrescription = null;
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

        const calculationRows = component.querySelectorAll(".calculation-row");
        const letterFrom = component.querySelector(`.letter`);

        const form = component.querySelector("form");
        let prescriptionData = prescriptionGrid.formToObject(form);
        const type = prescriptionType.value;
        const status = form.dataset.status;
        const targetPrescription = component.dataset.targetPrescription;
        prescriptionData.medicamentsList = [];
        prescriptionData.letter = "";
        if (type == "letter") {
          const letter = letterFrom.querySelector("textarea");
          prescriptionData.letter = letter.value;
        } else {
          let medicamentList = [];

          [].forEach.call(calculationRows, function (calculationRow) {
            const data = calculationRow.dataset.medicament;

            if (data != undefined) {
              const dataObj = JSON.parse(data);
              medicamentList.push(dataObj);
            }
          });

          prescriptionData.medicamentsList = medicamentList;
        }
        if (
          prescriptionData.medicamentsList.length > 0 ||
          prescriptionData.letter != ""
        ) {
          let ajaxCall = null;
          if (form.dataset.status === "new") {
            ajaxCall = createSync(targetPrescription, prescriptionData, {
              loaderWarpper,
            });
          } else {
            const idPrescription = form.dataset.idPrescription || "";
            ajaxCall = updateSync(
              targetPrescription,
              idPrescription,
              prescriptionData,
              {
                loaderWarpper,
              }
            );
          }

          ajaxCall.then((response) => {
            if (response != undefined && response.success == true) {
              form.dataset.status = "new";
              form.dataset.idPrescription = null;
              [].forEach.call(prescriptionForms, function (prescriptionForm) {
                medicamentGrid.reset(component);
                prescriptionGrid.resetForm(prescriptionForm);
              });
              activeModel("dataTable");
              activeTab(["read"]);
              if (status == "new") {
                const datas = [];
                datas.push(response.result);
                const consultation = document.querySelector(
                  '.component[data-component="consultationInfo"]'
                );
                if (consultation) {
                  prescriptionGrid.renderPrescription(
                    consultation,
                    datas,
                    false
                  );
                }
              }
            }
          });
        } else {
          console.log("fields empty");
        }
      },
      false
    );
  },
  info: function (component, response) {
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
    const loaderWarpper = '.component[data-component="panel"] .panel';

    activeModel("dataTable");

    document.querySelector('[data-component="recorder-toggle"]').dataset.id =
      response.result._id;

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
    const targetPrescription = prescriptionItemList.dataset.targetPrescription;
    const filter = "consultation";
    const equal = response.result._id;
    const ajaxCallPrescription = filterSync(targetPrescription, {
      filter,
      equal,
    });

    reportItemList.innerHTML = "";
    reportItemList.dataset.nbr = 0;
    const targetRecorder = reportItemList.dataset.targetRecorder;

    const ajaxCallRecorder = filterSync(targetRecorder, { filter, equal });

    const resultSync = multiSync([ajaxCallPrescription, ajaxCallRecorder], {
      loaderWarpper,
    });
    resultSync.then(function (responses) {
      const responsePrescription = responses[0];
      const responseRecorder = responses[1];
      if (
        responsePrescription != undefined &&
        responsePrescription.success === true
      ) {
        prescriptionGrid.renderPrescription(
          component,
          responsePrescription.result
        );
      }

      if (responseRecorder != undefined && responseRecorder.success === true) {
        reportGrid.renderRecord(component, responseRecorder.result);
      }
    });

    if (newPrescription) {
      newPrescription.addEventListener(
        "click",
        function () {
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
export default consultationModule;
