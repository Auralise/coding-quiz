var reset = document.querySelector('#clear');

function init() {
    var scores = JSON.parse(localStorage.getItem('scores'))
    if (scores !== null)
    {
        let list = document.createElement('ul');
        //create 5 list items of the highest scores
    } else {
        let text = document.createElement('h3');
        text.textContent = "No Scores have been saved - Please return to the quiz to set a high score";
        document.querySelector('#score-table').appendChild(text);
    }
}

function clearScores() {
    if (localStorage.getItem('scores') !== null)
    {
        localStorage.removeItem('scores');
    }
    else {
        //Do something? 
    }
}


reset.addEventListener('click', clearScores);

init();