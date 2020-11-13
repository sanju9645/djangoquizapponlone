
const questionNumber=document.querySelector(".question-number")
const questionText=document.querySelector(".question-text")
const optionContainer=document.querySelector(".option-container")
const answersIndicatorContainer=document.querySelector(".answers-indicator")

const homeBox=document.querySelector(".home-box")
const quizBox=document.querySelector(".quiz-box")
const resultBox=document.querySelector(".result-box")

let questionCounter=0
let currentQuestion;
let availableQuestions=[]
let availableOptions=[]
let correctAnswers=0
let attempts=0
var attempt_logs = []


let start_hour=0
let start_minutes=0
let start_seconds=0

let end_hour=0
let end_minutes=0
let end_seconds=0

let time1=0
let time2=0
let t1=0
let t2=0


//pusing available questions into availableQuestions Array
function setAvailableQuestions(){
    const totalQuestion = quiz.length
    for(let i=0;i<totalQuestion;i++){
        availableQuestions.push(quiz[i])
    }
}


function getNewQuestion(){
    questionNumber.innerHTML="Question "+(questionCounter + 1)+ " of "+quiz.length

    //setting qustion in the question text field in random order
    const questionIndex = availableQuestions[Math.floor(Math.random()*availableQuestions.length)]

    currentQuestion=questionIndex
    questionText.innerHTML=currentQuestion.question

    //aviding question duplication

    //get the position of 'questionIndex' from the availableQuestion array
    const index1=availableQuestions.indexOf(questionIndex)

    //removing the 'questionIndex' from the availableQuestion array
    availableQuestions.splice(index1,1)


    //setup options
    const optionLength = currentQuestion.options.length
    //pushing options into availableOptions array
    for(let i=0;i<optionLength;i++){
        availableOptions.push(i)
    }

    optionContainer.innerHTML= '';

    let animationDelay = 0.15

    //displaying options in option section of html page
    for(let i=0;i<optionLength;i++){
        const optionIndex = availableOptions[Math.floor(Math.random()*availableOptions.length)]
        const index2=availableOptions.indexOf(optionIndex)
        availableOptions.splice(index2,1)

        const option=document.createElement("div")
        option.innerHTML=currentQuestion.options[optionIndex]
        option.id=optionIndex
        option.style.animationDelay=animationDelay='s';
        animationDelay=animationDelay+0.15
        option.className="option"
        optionContainer.appendChild(option)
        option.setAttribute("onClick","getResult(this)")
    }


    questionCounter++
}

//to get the result of current question
function getResult(element){
    const id=parseInt(element.id)
    let attempt = {'q_id': currentQuestion.q_id,'question':currentQuestion.question, 'attempt': currentQuestion.options[id],'answer':currentQuestion.options[currentQuestion.answer]}
    attempt_logs.push(attempt);

    //get the answer by comparing the id of clicked option with the saved answer
    if(id==currentQuestion.answer){
        
        element.classList.add("correct")

        //add the indicator to correct mark
        updateAnswerIndicator("correct")
        correctAnswers++
    }
    else{
        element.classList.add("wrong")

         //add the indicator to correct mark
        updateAnswerIndicator("wrong")

        //if the answer is incorrect we have to show the correct answer by changing the color
        const optionLen=optionContainer.children.length
        //console.log(currentQuestion.answer)
        for(let i=0;i<optionLen;i++){
            
            //console.log(optionContainer.children[i].id)
            if(parseInt(optionContainer.children[i].id)==currentQuestion.answer){
                optionContainer.children[i].classList.add("correct")
            }
        }
    }
    attempts++
    unclickableOptions()
}


//make all the options unclickable once the user select an option
function unclickableOptions(){
    const optionLen=optionContainer.children.length
    for(let i=0;i<optionLen;i++){
        optionContainer.children[i].classList.add("already-answered")
    }
}

function answerIndicator(){
    answersIndicatorContainer.innerHTML=''
    const totalQuestion = quiz.length
    for(let i=0;i<totalQuestion;i++){
        const indicator=document.createElement("div")
        answersIndicatorContainer.appendChild(indicator)
    }
}

function updateAnswerIndicator(markedType){
    answersIndicatorContainer.children[questionCounter-1].classList.add(markedType)

}


function next(){
    if(questionCounter===quiz.length){
        
        quizOver()
    }else{
        getNewQuestion()
    }
}

function quizOver(){

    time2=performance.now()
    
    //hide quiz box when quiz is complete
    
    quizBox.classList.add("hide")

    //then show result box
    resultBox.classList.remove("hide")
    quizResult()
}

function quizResult(){
    resultBox.querySelector(".total-question").innerHTML=quiz.length
    resultBox.querySelector(".total-attempt").innerHTML=attempts
    resultBox.querySelector(".total-correct").innerHTML=correctAnswers
    resultBox.querySelector(".total-wrong").innerHTML=attempts-correctAnswers

    let seconds=Math.floor((time2-time1)/1000)
    let minutes=Math.floor(seconds/60)
    let hour=Math.floor(minutes/60)
    resultBox.querySelector(".total-time").innerHTML=hour+"hr :  "+minutes+"min :  "+seconds+"sec "

    const percentage=(correctAnswers/quiz.length)*100
    resultBox.querySelector(".percentage").innerHTML=percentage.toFixed()+"%"
    resultBox.querySelector(".total-score").innerHTML=correctAnswers +" / "+quiz.length
    
    // send the attempt logs
    console.log(attempt_logs)
    fetch('/startQuiz/saveAttempts/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(attempt_logs)
    }).then(res=>{
        if (res.ok){
            return res.json()
        }else{
            throw Exception("Something went wrong")
        }
    }).then(res=>{
        console.log(res)
    }).catch(err=>{
        console.log(err);
    })
}


function resetQuiz(){
    questionCounter=0
    correctAnswers=0
    attempts=0
}


function startQuiz(){

    //hide home box
    homeBox.classList.add("hide")

    //show quiz box
    quizBox.classList.remove("hide")

    time1=performance.now()

    setAvailableQuestions()
    getNewQuestion()
    
    answerIndicator()
}

function tryAgainQuiz(){
    //hiding result box
    resultBox.classList.add("hide")

    //showing the quiz box
    quizBox.classList.remove("hide")
    resetQuiz()
    startQuiz()
}

function backToHome(){
    //hide result Box
    resultBox.classList.add("hide")

    quizBox.classList.add("hide")

    homeBox.classList.remove("hide")
    resetQuiz()
}

window.onload=function(){
    homeBox.querySelector(".total-questions").innerHTML=quiz.length
    quizBox.classList.add("hide")
    resultBox.classList.add("hide")
}

// window.onload =function(){
//     setAvailableQuestions()
//     getNewQuestion()

//     answerIndicator()
// }

