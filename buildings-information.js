console.log('Buildings-information.js succesfully loaded')

async function getBuildingNames() {

  console.log('Fetching buildings...');

    try{
        const response = await fetch(`http://localhost:3000/buildings_info`)
        const result = await response.json();

        const buildingArray = []

        result.forEach(building => {
        console.log(building.building_name)
        buildingArray.push(building.building_name)
        })

        return buildingArray

    } catch (error) {
        console.error(`error fetching buildings in buildings-information: ${error}`)
    }
}

function dropDownDisplay(buildingArray){
    const informationSectionEle = document.getElementById('information-section');
    const buildingSelectEle = informationSectionEle.querySelector('#building-select');
    buildingSelectEle.innerHTML = '';

    console.log(buildingArray)

    for (let i = 0; i < buildingArray.length; i++) {
        const option = document.createElement('option');
        option.value = buildingArray[i]; 
        option.textContent = buildingArray[i];  
        buildingSelectEle.appendChild(option);
    };
};

async function displayBuildingInformation() {
    buildingSelectEle.addEventListener('change', function() {
        return buildingSelectEle.value;
    });

    try {
        const buildingInfoResponse = await fetch(`http://localhost:3000/buildings_details`)
        const buildingInforesult = await buildingInfoResponse.json();

        console.log(buildingInforesult)
        
    } catch (error) {
        console.error(`couldn't fetch the building details ${error}`)
    }

}

document.addEventListener('DOMContentLoaded', async function() {
    const buildingArray = await getBuildingNames();  
    dropDownDisplay(buildingArray); 
})

