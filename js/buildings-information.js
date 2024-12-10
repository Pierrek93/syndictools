console.log('Buildings-information.js succesfully loaded')

import { getBuildingInfo, dropDownDisplay } from "../js/modules/utilities.js";

const informationSectionEle = document.getElementById('information-section');

const displayBuildingInformationBtnEle = document.getElementById('display-information-btn');

// Function that is triggered when the button is clicked
async function displayBuildingInformation() {
  const buildingSelectEle = document.getElementById('information-building-dropdown');
  const selectedOption = buildingSelectEle.options[buildingSelectEle.selectedIndex];
  let buildingIdData, buildingNameData, buildingBceData, gasMeterData, electricityMeterData, buildingYearData

  if (selectedOption.value === "") {
    console.log("No building selected.");
  } else {
    console.log(`Selected Option Text: ${selectedOption.textContent}`);
  }

  try {
  const response = await fetch(`http://localhost:3000/buildings_info?building_name=${selectedOption.textContent}`);
  const result = await response.json();

  console.log(`result: `, result)

  buildingIdData = result[0].building_id;
  buildingNameData = result[0].building_name;
  buildingBceData = result[0].building_bce
  gasMeterData = result[0].gas_meter;
  buildingYearData = result[0].building_year;
  electricityMeterData = result[0].electricity_meter;

  } catch (error) {
    console.error('Fetch error:', error);
  }

  const buildingNameEle = informationSectionEle.querySelector('#building-name span')
  const buildingBceEle = informationSectionEle.querySelector('#building-bce span')
  const gasMeterEle = informationSectionEle.querySelector('#gas-meter span')
  const electricityMeterEle = informationSectionEle.querySelector('#electricity-meter span')
  const buildingYearEle = informationSectionEle.querySelector('#building-year span')
  const buildingIdEle = informationSectionEle.querySelector(`#building-id span`)

  buildingIdEle.textContent = buildingIdData;
  buildingNameEle.textContent = buildingNameData;
  buildingBceEle.textContent = buildingBceData;
  gasMeterEle.textContent = gasMeterData;
  electricityMeterEle.textContent = electricityMeterData;
  buildingYearEle.textContent = buildingYearData;
}

displayBuildingInformationBtnEle.addEventListener('click', displayBuildingInformation);

const modifyBuildingInfoBtnEle = informationSectionEle.querySelector(`#modify-building-information`)

function updateBuildingInformation() {
  console.log("Initiating update process");

  const buildingInfoFieldset = document.querySelector('#building-information-fieldset');

  const infoParagraphs = buildingInfoFieldset.querySelectorAll('p');

  infoParagraphs.forEach((paragraph) => {
    const infoSpan = paragraph.querySelector('span');

    if (infoSpan) {
      const inputField = document.createElement('input');
      inputField.value = infoSpan.textContent; 

      paragraph.replaceChild(inputField, infoSpan);
    }
  });
}

modifyBuildingInfoBtnEle.addEventListener('click', updateBuildingInformation);

const saveBuildingInfoBtnEle = document.querySelector('#save-building-information');

async function saveBuildingInformation() {
  const buildingInfoFieldset = document.querySelector('#building-information-fieldset');
  const infoParagraphs = buildingInfoFieldset.querySelectorAll('p');
  const buildingIdEle = buildingInfoFieldset.querySelector(`#building-id span`)
  const buildingNameEle = buildingInfoFieldset.querySelector(`#building-name span`)
  const buildingBceEle = buildingInfoFieldset.querySelector(`#building-bce span`)

  const updatedData = {building_id: buildingIdEle.textContent, building_name: buildingNameEle.textContent, building_bce: buildingBceEle.textContent};

  infoParagraphs.forEach((paragraph) => {
    const inputField = paragraph.querySelector('input');
    if (inputField) {
      const fieldId = paragraph.id;
      const updatedFieldId = fieldId.replace(/-/g, '_');
      updatedData[updatedFieldId] = inputField.value;
    }
  });

  console.log('Updated data:', updatedData);

  infoParagraphs.forEach((paragraph) => {
    const inputField = paragraph.querySelector('input');

    if (inputField) {
      const infoSpan = document.createElement('span');
      infoSpan.textContent = inputField.value; 

      paragraph.replaceChild(infoSpan, inputField);
    }
  });

  try {
    const response = await fetch('http://localhost:3000/buildings_info', {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Building information updated:', result);
    } else {
      console.log('Error updating building information');
    }
  } catch (error) {
    console.error('Error with the update request:', error);
  };

};

saveBuildingInfoBtnEle.addEventListener('click', saveBuildingInformation);
