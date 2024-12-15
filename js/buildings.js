console.log('Buildings.js succesfully loaded')


// LISTING BUILDINGS
const listBuildingsButtonElement = document.getElementById('list-buildings-btn');

async function listBuildings() {
  const tableBody = document.querySelector('#buildings-table tbody');
  tableBody.innerHTML = '';
  console.log('Fetching buildings...');

  try {
    const response = await fetch("http://localhost:3000/buildings_info?fields=building_id,building_name,building_bce,building_adress");
    const buildings = await response.json();

    console.log(`specific ${buildings}`)

    buildings.forEach(eachBuilding => {

      const row = document.createElement('tr');

      Object.values(eachBuilding).forEach((value, index) => {
        const cell = document.createElement('td');
        cell.textContent = value;
        
        if (index === 0) {
          cell.classList.add('building-id-details');
        } else if (index === 1) {
          cell.classList.add('building-name-details');
        } else if (index === 2) {
          cell.classList.add('building-bce-details');
        } else if (index === 3) {
          cell.classList.add('building-address-details');
        }

        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching buildings:", error);
  }
}

listBuildingsButtonElement.addEventListener('click', listBuildings)

//CREATE BUILDING FRONTEND
const createBuildingsButtonElement = document.getElementById('create-buildings-btn');

async function createBuilding() {
  const formElement = document.getElementById('add-building-form');
  const inputElements = formElement.querySelectorAll('input');
  const newCreatedBuilding = { name: '#', bce: '#', adress: '#' };

  const propertyMap = {
    'building-name-form': 'name',
    'building-bce-form': 'bce',
    'building-adress-form': 'adress'
  };

  inputElements.forEach(element => {
    const property = propertyMap[element.id];
    if (property) {
      newCreatedBuilding[property] = element.value;
    } else {
      console.log('Error: Unknown input element');
    }
  });

  console.log(newCreatedBuilding);

  try {
    const response = await fetch('http://localhost:3000/buildings_info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCreatedBuilding) 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Building added successfully:', data);

  } catch (error) {
    console.error('Error adding building:', error);
  }
listBuildings();
}

createBuildingsButtonElement.addEventListener('click', createBuilding)


const modifyBuildingsBtnEle = document.getElementById(`modify-buildings-btn`)

// MODIFY BUILDING FUNCTION
function modifyBuildingInfo() {
  const tableBodyEle = document.getElementById('building-table-body');

  const rowsEle = tableBodyEle.querySelectorAll('tr');

  if (rowsEle) {
    console.log(rowsEle);
  }

  Array.from(rowsEle).forEach(row => {
    const infoTableHeads = row.querySelectorAll('td');

    Array.from(infoTableHeads).forEach(th => {
      const infoTableInput = document.createElement('input');
      infoTableInput.type = 'text';
      infoTableInput.value = th.textContent.trim(); 

      th.textContent = ''; 
      th.appendChild(infoTableInput); 
    });
  });
}

modifyBuildingsBtnEle.addEventListener(`click`, modifyBuildingInfo)

const saveBuildingsBtnEle = document.getElementById(`save-buildings-btn`)

async function saveBuildingDetails() {
  const tableBodyEle = document.getElementById('building-table-body');
  const rowsEle = tableBodyEle.querySelectorAll('tr'); 

  const updatedBuildings = [];

  rowsEle.forEach(row => {
    const cells = row.querySelectorAll('td'); 
    const buildingData = {
      building_id: '',
      building_name: '',
      building_bce: '',
      building_address: ''
    };

    cells.forEach(cell => {
      const input = cell.querySelector('input');
      if (input) {
        if (cell.classList.contains('building-id-details')) {
          buildingData.building_id = input.value.trim();
        } else if (cell.classList.contains('building-name-details')) {
          buildingData.building_name = input.value.trim();
        } else if (cell.classList.contains('building-bce-details')) {
          buildingData.building_bce = input.value.trim();
        } else if (cell.classList.contains('building-address-details')) {
          buildingData.building_address = input.value.trim();
        }
        const span = document.createElement('span');
        span.textContent = input.value.trim();  
        cell.textContent = '';  
        cell.appendChild(span); 
      }
    });

    updatedBuildings.push(buildingData);
  });

  console.log("Updated Buildings:", updatedBuildings);

  try {
    const response = await fetch('http://localhost:3000/buildings_info', {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBuildings),
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

}

saveBuildingsBtnEle.addEventListener(`click`, saveBuildingDetails)

// DELETE BUILDING FUNCTION
const deleteBuildingButtonEle = document.getElementById('delete-building-btn');

async function deleteSelectedBuilding() {
const deleteFollowUpElement = document.getElementById('delete-follow-up')
const deleteBuildingNameEle = deleteFollowUpElement.querySelector('#delete-building-name')
const deleteBuildingBceEle = deleteFollowUpElement.querySelector('#delete-building-bce')

const deleteThisBuilding = { name: deleteBuildingNameEle.value, bce: deleteBuildingBceEle.value};

  try {
    const response = await fetch('http://localhost:3000/buildings_info', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deleteThisBuilding) 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Building deleted successfully:', data);

  } catch (error) {
    console.error('Error deleting building:', error);
  }
  listBuildings();
};

deleteBuildingButtonEle.addEventListener('click', deleteSelectedBuilding);