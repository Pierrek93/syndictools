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
          const {data, labels} = aggregateChartData(document.querySelectorAll('.financialTable')); 
          RefreshPieChart({data, labels}); 
      }
  });
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
      const inputValues = newRow.querySelectorAll('.input-values');
      const descriptionValue = newRow.querySelector('.description-input')

      inputValues.forEach(input => {
        input.value = ''; 
      });

      descriptionValue.value = '';

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
        calculateRecommendations();
        const {data, labels} = aggregateChartData(document.querySelectorAll('.financialTable'));
        RefreshPieChart({data, labels});
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
  const workingCapitalElement = recommendationSection.querySelector('#working-capital-minimum');
  const reserveFundsMinimumElement = recommendationSection.querySelector('#reserve-fund-minimum');
  const annualProvisionElement = recommendationSection.querySelector('#annual-provision');
  // const ExcepionalCallElement = recommendationSection.querySelector('#exceptionnal-call');
  const ReserveFundCallElement = recommendationSection.querySelector('#reserve-fund-call');
  
  //totalUpcomingBudget not being used to be deleted?;
  // let totalUpcomingBudget = 0;
  let totalUpcomingValues = [];

  financialTableSections.forEach(table => {
    const valueElements = table.querySelectorAll('.amount-values');

    // totalUpcomingBudget += parseFloat(valueElements[1].textContent) || 0;
    totalUpcomingValues.push(parseFloat(valueElements[1].textContent)) || 0;
  });

  console.log(totalUpcomingValues)

  let workingCapitalResult = (totalUpcomingValues[0] / 12) * 5;
  let reserveFundResult = (totalUpcomingValues[0]/100) * 5;
  let annualProvisionResult = totalUpcomingValues[0];
  let reserveFundCallResult = totalUpcomingValues[1];

  reserveFundsMinimumElement.textContent = reserveFundResult.toFixed(2);
  annualProvisionElement.textContent = annualProvisionResult;
  workingCapitalElement.textContent = workingCapitalResult.toFixed(2);
  // ExcepionalCallElement.textContent = #;
  ReserveFundCallElement.textContent = reserveFundCallResult;
}

// UPDATECHARTDATA FUNCTION
function aggregateChartData(tables) {
  let mergedArrayOfRealisedInputs = [];
  let mergedLabels = [];

  tables.forEach(table => {
      const amountEntryRows = table.querySelectorAll('.amount-entry-row');

      amountEntryRows.forEach(row => {
          const inputValues = row.querySelectorAll('.input-values');
          const realisedValue = parseFloat(inputValues[0].value) || 0;
          mergedArrayOfRealisedInputs.push(realisedValue);
          const label = row.querySelector('.description-input')?.value || `Item ${mergedLabels.length + 1}`;
          mergedLabels.push(label);
      });
  });

  return { data: mergedArrayOfRealisedInputs, labels: mergedLabels }; 
}

//BARGRAPH
// const barChart = document.getElementById('myBarChart');
// new Chart(barChart, {
//   type: 'bar',
//   data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [
//       {
//       label: '2021 sales',
//       data: [120, 180, 130, 260],
//       borderWidth: 1
//       },
//       {
//         label: '2022 Sales',
//         data: [120, 180, 130, 260],
//         borderWidth: 2
//     },
//   ]
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       }
//     }
//   }
// });

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
              label: '#',
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
}

//LOAD FUNCTIONS AFTER DOM LOADED
document.addEventListener('DOMContentLoaded', function(){
  manageTableRows();
});