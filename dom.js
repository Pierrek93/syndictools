//ADD ROW
function addRow() {
  const financialTables = document.querySelectorAll('.financialTable');
  const firstTable = financialTables[0];

  const amountEntryRows = firstTable.querySelectorAll('.amount-entry-row');
  const displayedTotals = firstTable.querySelectorAll('.amount-values');

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

  amountEntryRows.forEach(row => {
    const inputValues = row.querySelectorAll('.input-values');
    inputValues.forEach(input => {
      input.addEventListener('input', updateTotals);
    });
  });
}


//LOAD FUNCTIONS AFTER DOM LOADED
document.addEventListener('DOMContentLoaded', function(){
  addRow();
});