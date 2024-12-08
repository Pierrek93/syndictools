console.log('Buildings-information.js succesfully loaded')


const informationSectionEle = document.getElementById('information-section');

async function getBuildingNames() {
  console.log('Fetching buildings names...');

    try{
        const response = await fetch(`http://localhost:3000/buildings_info?fields=building_name`)
        const result = await response.json();

        const buildingArray = []

        result.forEach(building => {
        buildingArray.push({name: building.building_name})
        })

        return buildingArray

    } catch (error) {
        console.error(`error fetching buildings in buildings-information: ${error}`)
    }
}

function dropDownDisplay(buildingArray){
  const buildingSelectEle = informationSectionEle.querySelector('#building-dropdown-select');
  buildingSelectEle.innerHTML = '';

  try {
    buildingArray.forEach((building, index) => {
      const option = document.createElement('option');
      option.value = index; 
      option.textContent = building.name; 
      buildingSelectEle.appendChild(option);
    });
  } catch (error) {
    const option = document.createElement('option');
    option.value = 1;  
    option.textContent = `Error Fetching`;   
    buildingSelectEle.appendChild(option);
  }

  return buildingSelectEle;
}

const displayBuildingInformationBtnEle = document.getElementById('display-information-btn');

// Function that is triggered when the button is clicked
async function displayBuildingInformation() {
  const buildingSelectEle = document.getElementById('building-dropdown-select');
  const selectedOption = buildingSelectEle.options[buildingSelectEle.selectedIndex];
  let gasMeterData, electricityMeterData, buildingYearData

  if (selectedOption.value === "") {
    console.log("No building selected.");
  } else {
    console.log(`Selected Option Text: ${selectedOption.textContent}`);
  }

  try {
  const response = await fetch(`http://localhost:3000/buildings_info?building_name=${selectedOption.textContent}`);
  const result = await response.json();

  console.log(`result: `, result)

  gasMeterData = result[0].gas_meter;
  buildingYearData = result[0].building_year;
  electricityMeterData = result[0].eletricity_meter;

  } catch (error) {
    console.error('Fetch error:', error);
  }

  const gasMeterEle = informationSectionEle.querySelector('#gas-meter span')
  const electricityMeterEle = informationSectionEle.querySelector('#electricity-meter span')
  const buildingYearEle = informationSectionEle.querySelector('#building-year span')

  gasMeterEle.textContent = gasMeterData;
  electricityMeterEle.textContent = electricityMeterData;
  buildingYearEle.textContent = buildingYearData;
  
}

displayBuildingInformationBtnEle.addEventListener('click', displayBuildingInformation);

document.addEventListener('DOMContentLoaded', async function () {
  const buildingArray = await getBuildingNames();
  const buildingSelectEle = dropDownDisplay(buildingArray);
});
