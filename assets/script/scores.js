var reset = document.querySelector('#clear');

function init() {
    var scores = JSON.parse(localStorage.getItem('scores'))
    if (scores !== null) {
        let list = document.createElement('ul');
        //create 5 list items of the highest scores
        var topScores = (scores.sort(compareScores)).splice(0,5)
        
        for (let i = 0; i < topScores.length; i++) {
            let scoreEntry = document.createElement('li');
            scoreEntry.innerHTML = `<strong>${topScores[i].name}</strong> completed the quiz with <strong>${topScores[i].score} seconds remaining</strong>`;
            document.querySelector('#score-table').appendChild(scoreEntry)
        }


    } else {
        let text = document.createElement('h3');
        text.textContent = "No Scores have been saved - Please return to the quiz to set a high score";
        document.querySelector('#score-container').appendChild(text);
    }
}

function compareScores(a, b) {
    if (a.score > b.score) {
        return -1;
    }

    if (b.score > a.score) {
        return 1;
    }

    return 0;
}

function clearScores() {
    if (localStorage.getItem('scores') !== null) {
        localStorage.removeItem('scores');
        document.location.reload();
    }

}


reset.addEventListener('click', clearScores);

init();