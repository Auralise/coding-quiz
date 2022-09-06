
//clear element 
function clearElement(el) {
    el.innerHTML = '';
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

    updateTimerDisplay(gTimer);

    gSaved = false; //reset global saved state
}

//Update the value displayed in the timer
function updateTimerDisplay(timerValue){
    timerDisplay.textContent = `Time Remaining: ${timerValue}`;
}

//select a random set of questions from the available options
function selectQuestions(amount) {
    //create a deep copy of all possible questions
    let questions = JSON.parse(JSON.stringify(quiz.questions));

    //declare variables to be used in loop
    let questionIndex;
    let selectedQuestions = [];
    let repeatsAllowed = false;

    //if input question list is not long enough, repeat questions to provide the requested amount
    if (parseInt(amount) > parseInt(questions.length)) {
        repeatsAllowed = true;
        console.warn('Not enough questions. Allowing repeats');
        console.table(quiz.questions);
    }

    for (let i = 0; i < amount; i++) {
        //choose an index for the question 
        questionIndex = Math.floor(Math.random() * questions.length);

        selectedQuestions.push(questions[questionIndex])

        //if not repeats then remove question from array
        if (!repeatsAllowed) {
            questions.splice(questionIndex, 1)
        }

    }

    return selectedQuestions;

}

//Take in a question object and print the question based on constituent elements
function printQuestion(question) {

    clearElement(quizCard); // Clear the quiz display
    if (question.hasOwnProperty('text') && question.hasOwnProperty('answers')) {
        let questionWrapper = document.createElement('div');
        let questionText = document.createElement('h2');
        let answerList = document.createElement('ul');

        questionWrapper.setAttribute('id', 'question-wrapper');

        questionText.textContent = question.text;
        for (let i = 0; i < question.answers.length; i++) {
            let answer = document.createElement('li');
            answer.innerHTML = `<button class="standard-button answer" data-index='${i}'>${question.answers[i]}</button>`
            answerList.appendChild(answer);

        }

        questionWrapper.appendChild(questionText);
        questionWrapper.appendChild(answerList);
        quizCard.appendChild(questionWrapper);

    }
    else {
        let errorText = document.createElement('h2');
        errorText.textContent = "Failed to print question";
        quizCard.appendChild(errorText);
    }



}

function printSaveScreen(finalTimer) {

    clearElement(quizCard);
    quizCard.addEventListener('click', generalListener)    

    let titleContent = document.createElement('h2');
    let initialsInput = document.createElement('input');
    let inputLabel = document.createElement('label');
    let restartButton = document.createElement('button');
    let saveButton = document.createElement('button');

    initialsInput.setAttribute('id', 'initials-input');
    initialsInput.setAttribute('type', 'text');

    inputLabel.setAttribute('for', 'initials-input');
    saveButton.setAttribute('id', 'save-button');
    restartButton.setAttribute('id', 'restart-button');

    restartButton.classList.add('standard-button');
    saveButton.classList.add('standard-button');

    restartButton.textContent = 'Restart';
    saveButton.textContent = 'Save';
    inputLabel.textContent = 'Enter your initials here: ';

    if (finalTimer > 0) {
        titleContent.textContent = `Congratulations, you set a time of ${finalTimer} seconds! Save your score with your initials: `;
        quizCard.appendChild(titleContent);
        quizCard.appendChild(inputLabel);
        quizCard.appendChild(initialsInput);
        quizCard.appendChild(document.createElement('br'))
        quizCard.appendChild(saveButton);
    } else {
        titleContent.textContent = `You did not complete the quiz within the time allowed. Please try again!`
        quizCard.appendChild(titleContent);
    }
    quizCard.appendChild(restartButton);


}

function validateSave() {
    let initials = document.querySelector("#initials-input")

    if (!!document.querySelector('#save-notification')) { //If element exists
        var saveStatus = document.querySelector('#save-notification');
    }
    else { //if element does not exist, create it
        var saveStatus = document.createElement('h3');
        quizCard.appendChild(document.createElement('br'));
        saveStatus.setAttribute('id', 'save-notification')
        quizCard.appendChild(saveStatus);
    }

    if (initials.value === '') {
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
function saveScores(currentScore) {
    let existingScores = localStorage.getItem('scores');
    let scores = [];
    if (existingScores !== null) {
        scores = JSON.parse(existingScores);
        scores.push(currentScore);
    }
    else {
        scores.push(currentScore);
    }

    localStorage.setItem('scores', JSON.stringify(scores));
}


function startQuiz() {
    //clear existing content from display card
    clearElement(quizCard);
    //select questions from database/collection
    let questions = selectQuestions(5);
    let questionIndex = 0;
    let answerIndex = 0;

    // console.table(questions);

    quizCard.addEventListener('click', quizListener)

    //Quiz listener function definition - Nested to have access to variables required to perform quiz specific actions. 
    // This has been defined as a function specifically to allow for the removal of this listener once it is no longer required. 
    function quizListener(event) {
        if (event.target.matches('.answer') && !gAnswered) {
            gAnswered = true;
            answerIndex = event.target.getAttribute('data-index');
            let buttons = document.querySelectorAll('.answer');
    
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList.add('answered');
            }
    
            let output = document.createElement('div');
            outputDisplay.appendChild(output);
    
            if (parseInt(questions[questionIndex].correctIndex) === parseInt(answerIndex)) {
                output.innerHTML = `<br> <hr> <h3 class='successful'>Correct!</h3>`;
                setTimeout(()=> {clearElement(outputDisplay)}, 1000);
            } else {
                output.innerHTML = `<br> <hr> <h3 class='unsuccessful'>Wrong!</h3>`;
                gTimer -= 10;
                updateTimerDisplay(gTimer);
                setTimeout(()=> {clearElement(outputDisplay)}, 1000);
    
            }
        }
    
    
    }

    printQuestion(questions[questionIndex]);

    let gameLoop = setInterval(() => {



        if (gTimer < 10 && !timerDisplay.classList.contains('timer-low')) {
            timerDisplay.classList.add('timer-low');
        }

        if (gTimer === 0) {
            clearInterval(gameLoop);
            printSaveScreen(gTimer);
            quizCard.removeEventListener('click', quizListener)
            quizCard.addEventListener('click', generalListener)
        }
        else if (gAnswered) {

            gAnswered = false;
            questionIndex++;

            if (questionIndex > questions.length - 1) {
                clearInterval(gameLoop);
                quizCard.removeEventListener('click', quizListener)
                printSaveScreen(gTimer);
            } else {
                printQuestion(questions[questionIndex]);
            }

        }
        else {
            gTimer--;
            updateTimerDisplay(gTimer);
        }


    }, 1000)




}



//Function for general event listener - This is for meta functions such as starting the quiz and saving/restarting
function generalListener(event) {
        // console.log(event);
        if (event.target.matches('#start-button')) {
            startQuiz();
            quizCard.removeEventListener('click', generalListener)
        }

        if (event.target.matches('#restart-button')) {
            gTimer = 60;
            resetQuizScreen();
            init();
        }

        if (event.target.matches('#save-button')) {
            validateSave();
        }

}

function clearConditionalClasses() {
    if (timerDisplay.classList.contains('timer-low')) {
        timerDisplay.classList.remove('timer-low');
    }
}

// initialise the 
function init() {
    quizCard.addEventListener('click', generalListener);
    clearConditionalClasses();
    gTimer = 60;
}

// game states
var gAnswered = false; // question is answered
var gSaved = false; // score has been saved

//global timer
var gTimer = 60;

//element selectors
var quizCard = document.querySelector('#quiz-card');
var timerDisplay = document.querySelector('.timer-text');
var outputDisplay = document.querySelector('#output-section');


//Run init function
init();








// quiz questions - To be replaced by a data fetch or some equivalent once we learn this. 
var quiz = {
    questions:[
       {
          text:"In Javascript, which of these is not a primitive datatype?",
          correctIndex:2,
          answers:[
             "String",
             "Number",
             "Float",
             "Symbol"
          ]
       },
       {
          text:"In Javascript, what is a an instantiated collection of properties and methods called?",
          correctIndex:1,
          answers:[
             "Class",
             "Object",
             "Blob",
             "Array"
          ]
       },
       {
          text:"What is the purpose of a loop?",
          correctIndex:3,
          answers:[
             "To read data",
             "To make the computer sad",
             "Video games",
             "To perform repetative tasks"
          ]
       },
       {
          text:"When should you use a for loop?",
          correctIndex:0,
          answers:[
             "When you know the number of iterations required",
             "When you do not know the number of iterations required",
             "When the while loop gets too difficult",
             "None of the above"
          ]
       },
       {
          text:"What does the window component of the DOM do?",
          correctIndex:2,
          answers:[
             "Allows you to consider what it would be like outside for once",
             "Provides access to the browser",
             "Represents the current open page in the browser",
             "Gives access to local storage"
          ]
       },
       {
          text:"What is the purpose of the DOM?",
          correctIndex:1,
          answers:[
             "Allows you to use the browser",
             "Provides a tree-like structure of the elements of a webpage/site to access and modify",
             "Reads the contents of a webpage back to you",
             "Provides speedy access to Domino's Pizza"
          ]
       },
       {
           text:"What basic mathematical operations are available in Javascript?",
           correctIndex:3,
           answers:[
             "Modulo",
             "Exponentiation", 
             "Division",
             "All of the above"
         ]
       },
       {
           text:"What does the \"null\" value indicate",
           correctIndex:0,
           answers:[
             "The absense of data - in essence \"nothing\"",
             "An undefined variable",
             "An unintialised variable",
             "The void. i.e. null and void"
           ]
       }
    ]
 }