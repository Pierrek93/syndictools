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

async function fetchBuildings() {
  try {
    console.log("Fetching buildings...");
    const response = await fetch("http://localhost:3000/buildings");
    console.log("Response:", response);
    const buildings = await response.json();
    console.log("Buildings:", buildings);
    displayBuildings(buildings);
  } catch (error) {
    console.error("Error fetching buildings:", error);
  }
}


function displayBuildings(buildings) {
  console.log(`succesfully fetched`)
}

  // LOAD FUNCTIONS AFTER DOM LOADED
  document.addEventListener('DOMContentLoaded', function () {
    switchSection(); 
    fetchBuildings();
  });
  