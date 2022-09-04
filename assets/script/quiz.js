// game states
var answered = false;
var win = false;
var gTimer = 60;
var gSaved = false;

var quizCard = document.querySelector('#quiz-card');
//var startButton = document.querySelector('#start-button');

var results = {
    scores: []
}


// quiz questions - To be replaced by a fetch
var quiz = {
    questions: [
        {
            text: "Question 1 -Modernipsum dolor sit amet cloisonnism, stuckism international street art ego-futurism eclecticism , gründerzeit impressionism installation art.",
            correctIndex: 2, // Index 
            answers: [
                "suprematism",
                "Bauhaus",
                "metaphysical",
                "existentialism",
            ],
        },
        {
            text: "2 - Gründerzeit expressionism pre-raphaelites abstract expressionism street art young british artists dadaism multiculturalism action painting, mail art russian symbolism",
            correctIndex: 1,
            answers: [
                "kinetic",
                "Neo-impressionism",
                "blaue",
                "neo-dada",
            ],
        },
        {
            text: "3 - Fauvism deformalism postmodernism illusionism die brücke merovingian, historicism international",
            correctIndex: 3,
            answers: [
                "Gothic",
                "Reiter",
                "Video Game Art",
                "pre-raphelites",
            ],
        },
        {
            text: "4 - Fauvism deformalism postmodernism illusionism die brücke merovingian, historicism international",
            correctIndex: 0,
            answers: [
                "Gothic",
                "Reiter",
                "Video Game Art",
                "pre-raphelites",
            ],
        },
    ],

}



//clear quiz display
function clearQuizBox() {
    quizCard.innerHTML = '';
}

//reset quiz to the starting screen
function resetQuizScreen() {
    quizCard.innerHTML = `<h1 class="quiz-heading">Coding Quiz Challenge</h1>
    <p class="quiz-description">In this quiz, you will be asked 5 questions about Javascript fundamentals. If
        you answer the question correctly, you will be presented with the next question. If you answer the
        question incorrectly, you will be presented with the next question and some time will be deducted from
        the clock.<br>Your score is equal to the time left on the clock but beware, you will lose if the time
        runs out!<br>GOOD LUCK!!!</p>
    <button id="start-button" class="standard-button">Click to Begin!</button>`;

    gSaved = false; //reset global saved state
}

function selectQuestions(amount) {
    //Make an array of all possible questions
    let questions = quiz.questions;

    //declare variables to be used in loop
    let questionIndex;
    let selectedQuestions = [];
    let repeatsAllowed = false;

    if (parseInt(amount) > questions.length)
    {
        repeatsAllowed = true;
        console.warn('Not enough questions. Allowing repeats');
    }

    for (let i = 0; i < amount; i++)
    {
        questionIndex = Math.floor(Math.random() * quiz.questions.length);
        
        selectedQuestions.push(questions[questionIndex])

        //if not repeats then remove question from array
        if(!repeatsAllowed){
            questions.splice(questionIndex, 1)
        } 
        
    }

    return selectedQuestions;

}

function printQuestion (question) {

    clearQuizBox();
    if(question.hasOwnProperty('text') && question.hasOwnProperty('answers')) 
    {
        let questionText = document.createElement('h2');
        let answerList = document.createElement('ul');
        let answers = [];
        let tempLi;
        let tempButton;

        questionText.textContent = question.text;
        for (let i = 0; i < question.answers.length; i++) {
            answerList.appendChild(
                document.createElement('li').innerHTML(
                    `<button class="standard-button answer" data-index='${i}'>${question.answers[i]}</button>`
                    ))

        }

        quizCard.appendChild(questionText);
        quizCard.appendChild(answerList);

    }
    else {
        let errorText = document.createElement('h2');
        errorText.textContent = "Failed to print question";
        quizCard.appendChild(errorText);
    }

    

}

function printSaveScreen (finalTimer) {
    
    clearQuizBox();

    let titleContent = document.createElement('h2');
    let initialsInput = document.createElement('input'); 
    let inputLabel = document.createElement('label');
    let restartButton = document.createElement('button');
    let saveButton = document.createElement('button');

    initialsInput.setAttribute('id', 'initials-input');
    initialsInput.setAttribute('type', 'text');

    inputLabel.setAttribute('for','initials-input');
    saveButton.setAttribute('id', 'save-button');
    restartButton.setAttribute('id', 'restart-button');

    restartButton.classList.add ('standard-button');
    saveButton.classList.add ('standard-button');

    restartButton.textContent = 'Restart';
    saveButton.textContent = 'Save';
    inputLabel.textContent = 'Enter your initials here: ';

    if(finalTimer > 0){
        titleContent.textContent = `Congratulations, you set a time of ${finalTimer} seconds! Save your score with your initials: `;
        quizCard.appendChild(titleContent);
        quizCard.appendChild(inputLabel);
        quizCard.appendChild(initialsInput);
        quizCard.appendChild(document.createElement('br'))
        quizCard.appendChild(saveButton);
    } else
    {
        titleContent.textContent = `You did not complete the quiz within the time allowed. Please try again!`
        quizCard.appendChild(titleContent);
    }
    quizCard.appendChild(restartButton);

    
}

function validateSave () {
    let initials = document.querySelector("#initials-input")

    if (!!document.querySelector('#save-notification')){ //If element exists
        var saveStatus = document.querySelector('#save-notification');
    }
    else{ //if element does not exist, create it
        var saveStatus = document.createElement('h3');
        quizCard.appendChild(document.createElement('br'));
        saveStatus.setAttribute('id', 'save-notification')
        quizCard.appendChild(saveStatus);
    }  

    

    if(initials.value === '')
    {
        saveStatus.classList.remove('successful');
        saveStatus.classList.add('unsuccessful');
        saveStatus.textContent = "Please enter a valid name";

    } else if (gSaved) {
        saveStatus.classList.remove('successful');
        saveStatus.classList.add('unsuccessful');
        saveStatus.textContent = 'You have already saved your score!';
        
    } else { //If all correct, perform save
        let currentScore = {
            name: initials.value,
            score: gTimer,
        }
        saveStatus.classList.remove('unsuccessful');
        saveStatus.classList.add('successful');
        saveStatus.textContent = 'Data saved successfully';
        gSaved = true; // set global saved state to true
        saveScores(currentScore);
    }

}


//save scores to local storage
function saveScores (currentScore) {
    let existingScores = localStorage.getItem('scores');
    let scores = [];
    if (existingScores !== null){
        scores = JSON.parse(existingScores);
        scores.push(currentScore);
    }
    else 
    {
        scores.push(currentScore);
    }

    localStorage.setItem('scores', JSON.stringify(scores));
}


function startQuiz() {
    //clear existing content from display card
    clearQuizBox();
    //select questions from database/collection
    let questions = selectQuestions(3);
    
    console.table(questions);
    

    // let timer = setInterval(() => {

        
    // }, 1000)



    // start timer
    //for each question:
    //print question text
    //generate button list with data-value 1-4 
    //event listener on list listening for button presses
    //if button clicked, stop event listener and compare data-value to answer index

    //if correct, display correct and move to next question
    //if incorrect, deduct time and next question 

    //once 5 questions have been answered, give score and ask for name/initials

    //save initials and score in local storage

}








quizCard.addEventListener('click', (event)=> {
    
    console.log(event);
    if (event.target.matches('#start-button'))
    {
        console.log("start button pressed");
        printSaveScreen(gTimer);
    }
    
    if (event.target.matches('.answer') && !answered) {

    }
    
    if (event.target.matches('#restart-button')) {
        resetQuizScreen();
    }

    if (event.target.matches('#save-button')){
        validateSave();
    }
    
});