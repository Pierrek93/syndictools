console.log('Buildings.js succesfully loaded')


// LISTING BUILDINGS
const listBuildingsButtonElement = document.getElementById('list-buildings-btn');

async function listBuildings() {
  const tableBody = document.querySelector('#buildings-table tbody');
  tableBody.innerHTML = '';
  console.log('Fetching buildings...');

  try {
    const response = await fetch("http://localhost:3000/buildings_info?fields=building_id,building_name,building_bce,building_address");
    const buildings = await response.json();

    console.log(`specific ${buildings}`)

    buildings.forEach(eachBuilding => {

      const row = document.createElement('tr');

      Object.values(eachBuilding).forEach((value, index) => {
        const cell = document.createElement('td');
        cell.textContent = value;
        
        if (index === 0) {
          cell.classList.add('building-id-details');
          cell.style.display = 'none'
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

//DISPLAY POPUP FUNCTION

const allPopUpButtonEle = document.querySelectorAll(`.pop-up-btn`);
let formSelection = ``

function displayPopUp(event) {

  const allPopUpForms = document.querySelectorAll('.pop-up-form');
  allPopUpForms.forEach(form => {
    form.style.display = 'none';
  });

  if (event.target.id === `create-buildings-btn`) {
    const createBuildingPopUpEle = document.getElementById(`add-building-form`)
    createBuildingPopUpEle.style.display = `block`
    formSelection = `Building Creation`
  } 
  else if  (event.target.id === `delete-building-btn`) {
    const deleteBuildingPopUpEle = document.getElementById(`delete-building-form`)
    deleteBuildingPopUpEle.style.display = `block`
    formSelection = `Building Deletion`
  }
  else {
  console.error(`DisplayPopUp Error: Invalid button ID`)
  }

  return formSelection
};

  allPopUpButtonEle.forEach(button => {
  button.addEventListener('click', displayPopUp);
  });

//CONFIRMATION ACTION FUNCTION
function confirmAction (formSelection) {

  const confirmationPopUpEle = document.getElementById(`confirmation-pop-up`)
  const yesBtnEle = confirmationPopUpEle.querySelector(`#yes-btn`)
  const noBtnEle = confirmationPopUpEle.querySelector(`#no-btn`)

  console.log(formSelection)
  confirmationPopUpEle.style.display = `block`;

  yesBtnEle.addEventListener(`click`, () => {
    if (formSelection === `Building Creation`) {
      console.log(`CREATING BUILDING!`)
    }
    else if (formSelection === `Building Deletion`) {
      console.log(`DELETING BUILDING!`)
    }
    formSelection = ``
  })
};

//CREATE BUILDING FRONTEND
const saveCreatedBuildingEle = document.getElementById(`save-building`)

async function createBuilding() {
  const formElement = document.getElementById('add-building-form');
  const inputElements = formElement.querySelectorAll('input');
  const newCreatedBuilding = { name: '#', bce: '#', address: '#' };

  const propertyMap = {
    'building-name-form': 'name',
    'building-bce-form': 'bce',
    'building-address-form': 'address'
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

saveCreatedBuildingEle.addEventListener('click', () => {
  confirmAction(formSelection);
})

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
const deleteBuildingButtonEle = document.getElementById('delete-building');

async function deleteSelectedBuilding() {
const deleteFollowUpElement = document.getElementById('delete-building-form')
const deleteBuildingNameEle = deleteFollowUpElement.querySelector('#delete-form-name')
const deleteBuildingBceEle = deleteFollowUpElement.querySelector('#delete-form-bce')

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

deleteBuildingButtonEle.addEventListener('click', () => {
  confirmAction(formSelection);
})