console.log('Dashboard.js succesfully loaded')

// SWITCH SECTION NAV FUNCTION
function switchSection() {
    const navigationElementList = document.querySelector('.navigation-list');
    const displayElementList = document.querySelector('.display-section');
    
    if (!navigationElementList) return;
    
    navigationElementList.addEventListener('click', function(event) {
      const clickedNavItem = event.target;
      
      if (clickedNavItem.tagName.toLowerCase() === 'li') {
        const clickedId = clickedNavItem.id;
  
        const allSections = displayElementList.querySelectorAll('div[id$="-section"]');
        allSections.forEach(function(section) {
          section.style.display = 'none';
        });
  
        const sectionToShow = displayElementList.querySelector(`#${clickedId.replace('-nav', '-section')}`);
        
        if (sectionToShow) {
          sectionToShow.style.display = 'block';
        }
  
        console.log(`${clickedNavItem.textContent} Navigation clicked!`);
      }
    });
  }


// LISTING BUILDINGS
const listBuildingsButtonElement = document.getElementById('list-buildings-btn');

async function listBuildings() {
  const tableBody = document.querySelector('#buildings-table tbody');
  tableBody.innerHTML = ''; // Clear any existing rows in the table body
  console.log('Fetching buildings...');

  try {
    const response = await fetch("http://localhost:3000/buildings");
    const buildings = await response.json();

    buildings.forEach(eachBuilding => {
      console.log(`Each building:`, eachBuilding);

      // Create a new table row
      const row = document.createElement('tr');

      // Populate the row with data
      Object.values(eachBuilding).forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
      });

      // Append the row to the table body
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching buildings:", error);
  }
}

listBuildingsButtonElement.addEventListener('click', listBuildings)

  // LOAD FUNCTIONS AFTER DOM LOADED
  document.addEventListener('DOMContentLoaded', function () {
    switchSection(); 
  });
  