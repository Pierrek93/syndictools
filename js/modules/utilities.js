console.log('utilities.js succesfully loaded')

const informationSectionEle = document.getElementById('information-section');

export async function getBuildingInfo() {
  console.log('Fetching buildings names...');

    try{
        const response = await fetch(`http://localhost:3000/buildings_info?fields=building_name,building_bce,building_address`)
        const result = await response.json();

        const buildingInfoArray = []

        result.forEach(building => {
        buildingInfoArray.push({
          name: building.building_name,
          bce: building.building_bce,
          address: building.building_address})
        })

        return buildingInfoArray;

    } catch (error) {
        console.error(`error fetching buildings in buildings-information: ${error}`)
    }
}

export function dropDownDisplay(buildingInfoArray) {
    const selectElementsEle = document.querySelectorAll('.building-dropdown-select');
    const selectedOption = []

    selectElementsEle.forEach((buildingSelectEle) => {
      buildingSelectEle.innerHTML = ''; 
      
  
      try {
        buildingInfoArray.forEach((building, index) => {
          const option = document.createElement('option');
          option.value = index;
          option.textContent = building.name;
          buildingSelectEle.appendChild(option);
        });

        buildingSelectEle.addEventListener('change', (event) => {
          const selectedIndex = event.target.value;
          selectedOption = buildingInfoArray[selectedIndex]?.name || null;
      });

      } catch (error) {
        const option = document.createElement('option');
        option.value = 1;  
        option.textContent = 'Error Fetching';   
        buildingSelectEle.appendChild(option);
      }

      
    });

    return () => selectedOption
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const buildingInfoArray = await getBuildingInfo();
    const selectedOption = dropDownDisplay(buildingInfoArray);
  });

