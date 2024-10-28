//ADD ROW
function addRow(){
  //grab elements
  const topDivs = document.querySelectorAll('.section-top')

  topDivs.forEach(section => {
    section.addEventListener('click', function(){
      console.log('clicked')
    })
  })
}

//LOAD FUNCTIONS AFTER DOM LOADED
document.addEventListener('DOMContentLoaded', function(){
  addRow();
});