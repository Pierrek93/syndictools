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
      if (event.target.matches('.input-values') || event.target.matches('.description-input')) {
          updateTotals(); 
          calculateRecommendations();
          updateTimeline();
          const {data, budget, labels} = aggregateChartData(document.querySelectorAll('.financialTable')); 
          RefreshPieChart({data, labels}); 
          RefreshBarChart({data, budget, labels});
      }
  });
}

//MANAGE TABLES ROWS FUNCTION
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
      const inputValues = newRow.querySelectorAll('.input-values');
      const descriptionValue = newRow.querySelector('.description-input')

      inputValues.forEach(input => {
        input.value = ''; 
      });

      descriptionValue.value = '';

      tbody.insertBefore(newRow, totalAmountRow);
      updateTotalsOnInput(financialTable);
    };

    // DELETE ROWS FUNCTION
    const deleteRow = () => {
      const allRows = section.querySelectorAll('.amount-entry-row');
      const lastRow = allRows[allRows.length - 1];

      if (allRows.length > 1) {
        lastRow.remove();
        updateTotalsOnInput(financialTable);
        calculateRecommendations();
        updateTimeline();
        const {data, labels} = aggregateChartData(document.querySelectorAll('.financialTable'));
        RefreshPieChart({data, labels});
        RefreshBarChart({data, budget, labels});
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

//CALCULATE RECOMMENDATIONS FUNCTION
function calculateRecommendations() {
  const financialTableSections = document.querySelectorAll('.section-top');
  const recommendationSection = document.querySelector('#recommendations-section');
  const workingCapitalElement = recommendationSection.querySelector('#working-capital-minimum');
  const reserveFundsMinimumElement = recommendationSection.querySelector('#reserve-fund-minimum');
  const annualProvisionElement = recommendationSection.querySelector('#annual-provision');
  const exceptionalCallElement = recommendationSection.querySelector('#dynamic-input');
  const reserveFundCallElement = recommendationSection.querySelector('#reserve-fund-call');
  
  let totalUpcomingValues = [];

  financialTableSections.forEach(table => {
    const valueElements = table.querySelectorAll('.amount-values');

    totalUpcomingValues.push(parseFloat(valueElements[1].textContent)) || 0.00;
  });

  let workingCapitalResult = (totalUpcomingValues[0] / 12) * 5;
  let reserveFundResult = (totalUpcomingValues[0]/100) * 5;
  let annualProvisionResult = totalUpcomingValues[0];
  let exceptionalCallResult = parseFloat(exceptionalCallElement.textContent) || 0.00;
  let reserveFundCallResult = totalUpcomingValues[1] - exceptionalCallResult || 0.00;
  console.log('Hello World', reserveFundCallResult, typeof(reserveFundCallResult), exceptionalCallResult, typeof(exceptionalCallResult));  

  reserveFundsMinimumElement.textContent = reserveFundResult.toFixed(2);
  annualProvisionElement.textContent = annualProvisionResult.toFixed(2);
  workingCapitalElement.textContent = workingCapitalResult.toFixed(2);
  reserveFundCallElement.textContent = reserveFundCallResult.toFixed(2);
  
  return [... totalUpcomingValues, exceptionalCallResult]
};

// EVENT LISTENER FOR EXCEPTIONAL CALL
const exceptionalCallElement = document.querySelector('#dynamic-input');
exceptionalCallElement.addEventListener('input', () => {
  calculateRecommendations();
  updateTimeline();
});

//UPDATE TIMELINE FUNCTION
function updateTimeline() {
  const totalUpcomingValues = calculateRecommendations();
  const timelineSection = document.querySelector('#timeline-section')
  const timelineItemsElements = timelineSection.querySelectorAll('.timeline-item')

  console.log('res=',totalUpcomingValues)

  let quarterlyProvisionCallResult = totalUpcomingValues[0] / 4;
  let quarterlyReserveCallResult = (totalUpcomingValues[1] - totalUpcomingValues[2]) / 4;

  timelineItemsElements.forEach(item => {
    const quarterlyProvisionCallElement = item.querySelector('.quarterly-provision-call')
    const quarterlyReserveCallElement = item.querySelector('.quarterly-reserve-call')

    quarterlyProvisionCallElement.textContent = quarterlyProvisionCallResult.toFixed(2);
    quarterlyReserveCallElement.textContent = quarterlyReserveCallResult.toFixed(2);
  });
};

//UPDATECHARTDATA FUNCTION
function aggregateChartData(tables) {
  let mergedArrayOfRealisedInputs = [];
  let mergedArrayOfBudgetInputs = [];
  let mergedLabels = [];

  tables.forEach(table => {
      const amountEntryRows = table.querySelectorAll('.amount-entry-row');

      amountEntryRows.forEach(row => {
          const inputValues = row.querySelectorAll('.input-values');
          const realisedValue = parseFloat(inputValues[0].value) || 0;
          const budgetValue = parseFloat(inputValues[1].value) || 0;
          const label = row.querySelector('.description-input')?.value || `Item ${mergedLabels.length + 1}`;

          mergedArrayOfRealisedInputs.push(realisedValue);
          mergedArrayOfBudgetInputs.push(budgetValue);
          mergedLabels.push(label);
      });
  });

  let data = mergedArrayOfRealisedInputs;
  let budget = mergedArrayOfBudgetInputs;
  let labels = mergedLabels;

  return {data, budget, labels}; 
}

//BARGRAPH
function RefreshBarChart({data, budget, labels}) {
  const barChart = document.getElementById('myBarChart');
  
  if (barChart.chartInstance) {
      barChart.chartInstance.destroy();
  }

  const chartInstance = new Chart(barChart, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: 'Exercice précédent',
              data: data,
              borderWidth: 1
          },
          {
            label: 'Exercice suivant',
            data: budget,
            borderWidth: 1
          }]
      },
      
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });

  barChart.chartInstance = chartInstance;
}

//CREATE AND REFRESH PIECHART FUNCTION
function RefreshPieChart({data, labels}) {
  const pieChart = document.getElementById('myPieChart');
  
  if (pieChart.chartInstance) {
      pieChart.chartInstance.destroy();
  }

  const chartInstance = new Chart(pieChart, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [{
              label: 'Exercice précédent',
              data: data,
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });

  pieChart.chartInstance = chartInstance;
};

// PRINT BUDGET FUNCTION
const printBudgetElement = document.querySelector('#printButton');
function printBudget() {
  window.print();
};
printBudgetElement.addEventListener('click', printBudget)

//LOAD FUNCTIONS AFTER DOM LOADED
document.addEventListener('DOMContentLoaded', function(){
  manageTableRows();
});