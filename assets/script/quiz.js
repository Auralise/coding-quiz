var timer

var startButton = document.querySelector('#start-button');

var results = {
    scores: []
}

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

function clearQuizBox() {
    document.querySelector('#quiz-card').innerHTML = '';
}

function selectQuestions(amount) {
    let questions = quiz.questions;
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

        if(!repeatsAllowed){
            questions.splice(questionIndex, 1)
        } 
        
    }

    return selectedQuestions;

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








startButton.addEventListener('click', startQuiz)