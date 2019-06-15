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


  const createScoreList = function(scoreList){
    // ScoreList is an array of objects, where each object consists of name & score
    let tbody = qs('#highScoreListTable > tbody');

    // Clear existing list
    deleteChildren(tbody);

    for(let i = 0; i < scoreList.length; i++ ){
      let tr = document.createElement('TR');

      let rank = document.createElement('TD');
      let rankText = document.createTextNode(`${i + 1}`);
      rank.appendChild(rankText);
      tr.appendChild(rank);

      let name = document.createElement('TD');
      let nameText = document.createTextNode(scoreList[i].name);
      name.appendChild(nameText);
      tr.appendChild(name);

      let score = document.createElement('TD');
      let scoreText = document.createTextNode(scoreList[i].highScore);
      score.appendChild(scoreText);
      tr.appendChild(score);
     
      tbody.appendChild(tr);
    }
  }

  return {
    createScoreList
  }

})();