/* eslint-disable */

const DM = (function(){

  //Source: https://www.geeksforgeeks.org/remove-all-the-child-elements-of-a-dom-node-in-javascript/
  const deleteChildren = function(element) { 
      //e.firstElementChild can be used. 
      var child = element.lastElementChild;  
      while (child) { 
          element.removeChild(child); 
          child = element.lastElementChild; 
      } 
  }

  const createElementWithTextNode = function(type, text){
    let element = document.createElement(type);
    let textNode = document.createTextNode(text);
    element.appendChild(textNode);
    
    return element;
  }

  const showElement = function(elem, displayStyle = 'block') {
    elem.style.display = displayStyle;
  };

  const hideElement = function (elem) {
    elem.style.display = 'none';
  };

  // Toggle element visibility
  const toggleElement = function(elem, displayStyle = 'block') {
    if (window.getComputedStyle(elem).display === displayStyle) {
      hideElement(elem);
      return;
    }
    showElement(elem);
  };


  const createScoreList = function(scoreList){
    // ScoreList is an array of objects, where each object consists of name & score
    let tbody = qs('#highScoreListTable > tbody');

    // Clear existing list
    deleteChildren(tbody);

    for(let i = 0; i < scoreList.length; i++ ){
      let tr = document.createElement('TR');

      tr.appendChild(createElementWithTextNode('TD', `${i + 1}`));
      tr.appendChild(createElementWithTextNode('TD', scoreList[i].name));
      tr.appendChild(createElementWithTextNode('TD', scoreList[i].highScore));
      tbody.appendChild(tr);
    }
  }

  return {
    createScoreList,
    showElement,
    hideElement,
    toggleElement
  }

})();