

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
                "correct",
                "existentialism",
            ],
        },
        {
            text: "2 - Gründerzeit expressionism pre-raphaelites abstract expressionism street art young british artists dadaism multiculturalism action painting, mail art russian symbolism",
            correctIndex: 1,
            answers: [
                "kinetic",
                "Correct",
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
                "correct",
            ],
        },
        {
            text: "4 - Fauvism deformalism postmodernism illusionism die brücke merovingian, historicism international",
            correctIndex: 0,
            answers: [
                "correct",
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

    if (parseInt(amount) > questions.length) {
        repeatsAllowed = true;
        console.warn('Not enough questions. Allowing repeats');
    }

    for (let i = 0; i < amount; i++) {
        questionIndex = Math.floor(Math.random() * quiz.questions.length);

        selectedQuestions.push(questions[questionIndex])

        //if not repeats then remove question from array
        if (!repeatsAllowed) {
            questions.splice(questionIndex, 1)
        }

    }

    return selectedQuestions;

}

function printQuestion(question) {

    clearQuizBox();
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

    clearQuizBox();

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


async function startQuiz() {
    //clear existing content from display card
    clearQuizBox();
    //select questions from database/collection
    let questions = selectQuestions(3);
    let questionIndex = 0;
    let answerIndex = -1;

    console.table(questions);

    if (!!quizCard.getAttribute('listener')) {
        quizCard.removeEventListener('click');
    }

    quizCard.addEventListener('click', (event) => {
        if (event.target.matches('.answer') && !gAnswered) {
            gAnswered = true;
            answerIndex = event.target.getAttribute('data-index');
            let buttons = document.querySelectorAll('.answer');
            
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList.add('answered');
            }

            let output = document.createElement('div');
            quizCard.appendChild(output);

            if (parseInt(questions[questionIndex].correctIndex) === parseInt(answerIndex)) {
                output.innerHTML = `<br> <hr> <h3 class='successful'>Correct!</h3>`;
            } else {
                output.innerHTML = `<br> <hr> <h3 class='unsuccessful'>Wrong!</h3>`;
                timer -= 10;
            }            


            
        }
        else {
            console.error('Something went wrong when choosing an answer');
        }
    })

    printQuestion(questions[questionIndex]);

    let timer = setInterval(() => {


        if (gTimer < 10 && !timerDisplay.classList.contains('timer-low')) {
            timerDisplay.classList.add('timer-low');
        }
        
        if (gAnswered) {




            gAnswered = false;
            questionIndex++;

            if(questionIndex > questions.length - 1){
                clearInterval(timer);
                addGeneralListener();
                printSaveScreen(gTimer);
            } else {
                setTimeout(()=> {
                    printQuestion(questions[questionIndex]);
                }, 1000)
            }

        }
        else {
            gTimer--;
            timerDisplay.textContent = `Time Remaining: ${gTimer}`;

        }


    }, 1000)



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

function addGeneralListener() {
    if (!!quizCard.getAttribute('timer')) {
        quizCard.removeEventListener('click');
    }

    quizCard.addEventListener('click', (event) => {

        console.log(event);
        if (event.target.matches('#start-button')) {
            console.log("start button pressed");
            startQuiz();
        }

        if (event.target.matches('#restart-button')) {
            resetQuizScreen();
            init();
        }

        if (event.target.matches('#save-button')) {
            validateSave();
        }

    });
}

function clearConditionalClasses() {
    if (timerDisplay.classList.contains('timer-low')) {
        timerDisplay.classList.remove('timer-low');
    }
}

function init() {
    addGeneralListener();
    clearConditionalClasses();
    gTimer = 60;
}

// game states
var gAnswered = false;
var gTimer = 60;
var gSaved = false;

var quizCard = document.querySelector('#quiz-card');
var timerDisplay = document.querySelector('.timer-text');

init();