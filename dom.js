//UPDATETOTALS FUNCTION
function updateTotalsOnInput(table) {
    const amountEntryRows = table.querySelectorAll('.amount-entry-row');
    const displayedTotals = table.querySelectorAll('.amount-values');

    const updateTotals = () => {
      let totalRealised = 0; 
      let totalBudget = 0;

      amountEntryRows.forEach(row => {
        const inputValues = row.querySelectorAll('.input-values');
        const realisedValue = parseFloat(inputValues[0].value) || 0;
        const budgetValue = parseFloat(inputValues[1].value) || 0;

        totalRealised += realisedValue;
        totalBudget += budgetValue;
      });

      displayedTotals[0].textContent = totalRealised.toFixed(2);
      displayedTotals[1].textContent = totalBudget.toFixed(2);
    };

    updateTotals();

    const tbody = table.querySelector('tbody')
    tbody.addEventListener('input', (event) => {
      if (event.target.matches('.input-values')) {
        updateTotals();
        calculateRecommendations()
      }
    })
}

// MANAGE TABLES ROWS FUNCTION
function manageTableRows() {
  const financialTableSections = document.querySelectorAll('.section-top');

  financialTableSections.forEach(section => {
    const addButton = section.querySelector('.addRow');
    const deleteButton = section.querySelector('.deleteRow');
    const tbody = section.querySelector('tbody');
    const financialTable = section.querySelector('.financialTable'); 

    // ADD ROWS FUNCTION
    const addRow = () => {
      const rowTemplate = section.querySelector('.amount-entry-row');
      const totalAmountRow = section.querySelector('.total-amount-row');
      const newRow = rowTemplate.cloneNode(true);

      tbody.insertBefore(newRow, totalAmountRow);
      updateTotalsOnInput(financialTable);
      calculateRecommendations()
    };

    // DELETE ROWS FUNCTION
    const deleteRow = () => {
      const allRows = section.querySelectorAll('.amount-entry-row');
      const lastRow = allRows[allRows.length - 1];

      if (allRows.length > 1) {
        lastRow.remove();
        updateTotalsOnInput(financialTable);
        calculateRecommendations()
      } else {
        alert('Cannot delete the last row.');
      }
    };

    // EVENT LISTENERS
    addButton.addEventListener('click', addRow);
    deleteButton.addEventListener('click', deleteRow);

    updateTotalsOnInput(financialTable);
  });
}

//CALCULATERECOMMENDATIONS FUNCTION
function calculateRecommendations() {
  const financialTableSections = document.querySelectorAll('.section-top');
  const recommendationSection = document.querySelector('#recommendations-section');
  const workingCapitalElement = recommendationSection.querySelector('#workingCapitalTotal');
  const reserveFundsElement = recommendationSection.querySelector('#reserveFundTotal');
  const quarterlyProvisionElement = recommendationSection.querySelector('#provisionTotal');
  
  let totalUpcomingBudget = 0;

  financialTableSections.forEach(table => {
    const valueElements = table.querySelectorAll('.amount-values');

    totalUpcomingBudget += parseFloat(valueElements[1].textContent) || 0;
  })

  let workingCapitalResult = (totalUpcomingBudget / 12) * 5;
  let reserveFundResult = (totalUpcomingBudget/100) * 5;
  let quarterlyProvisionResult = totalUpcomingBudget / 4;


  reserveFundsElement.textContent = reserveFundResult.toFixed(2);
  quarterlyProvisionElement.textContent = quarterlyProvisionResult.toFixed(2);
  workingCapitalElement.textContent = workingCapitalResult.toFixed(2);
}

//LOAD FUNCTIONS AFTER DOM LOADED
document.addEventListener('DOMContentLoaded', function(){
  manageTableRows();
});