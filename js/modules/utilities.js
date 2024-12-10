console.log('utilities.js succesfully loaded')

const informationSectionEle = document.getElementById('information-section');

export function testOne () {
    console.log(`UTILITIES LOAD GOOD `)
}

export async function getBuildingNames() {
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

export function dropDownDisplay(buildingArray) {
    const selectElementsEle = document.querySelectorAll('.building-dropdown-select');
  
    selectElementsEle.forEach((buildingSelectEle) => {
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
        option.textContent = 'Error Fetching';   
        buildingSelectEle.appendChild(option);
      }
    });
  
    return selectElementsEle;
  }
  