import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase,set,ref,child,get,push, onValue,onChildAdded } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
// import {getTestCode, testCodeFn} from "../app.js"



// // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5SzgIvNtiikFDII1BQUhENH251X774Qg",
  authDomain: "quiz-app-for-all.firebaseapp.com",
  projectId: "quiz-app-for-all",
  storageBucket: "quiz-app-for-all.appspot.com",
  messagingSenderId: "825880319861",
  appId: "1:825880319861:web:d0692adda48f00a7aba53c"
};










// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);


///////////////////getting the uid/////////////////

var uid,userCurrently;

 onAuthStateChanged(auth, (user) => {
  // console.log("hello");
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    uid = user.uid;
    userCurrently = user;
    // console.log(user);
    return;
    // ...
  } else {
    // User is signed out
    // ...
    window.location.replace("./login.html");
  }
});

// console.log(getTestCode());

var getTestDetails;
var testCode ;
var questionData=[] , getDuration;

window.getQuiz = (e) => {
    e.preventDefault();
    testCode = document.getElementById("testCode");
    onValue(ref(database,"tests/"+ testCode.value),function(snapshot) {
        if (snapshot.exists()) {
            // console.log(document.getElementById('result'));
            document.getElementById('result').remove();
        // console.log(snapshot.val());
        getTestDetails = snapshot.val();
        // questionData = getTestDetails.question;
        questionData = getTestDetails.questions;
        getDuration = getTestDetails.duration;
        // console.log(getDuration);
        render();

      } else {
        alert("No quiz available");
      }
    })
    
  }





  ////////////////////quiz starting /////////////////////////



//   var questionData = [
//     {
//       question: "What is the Full Form Of HTML?",
//       options: [
//         "HyperText Makeup Language",
//         "HyperText Markup Language",
//         "HyperText Markup Lame",
//         "HyperTate Markup Language",
//       ],
//       answer: "HyperText Markup Language",
//     },
//     {
//       question: "What does CSS stands for?",
//       answer: "Cascading Style Sheet",
//       options: [
//         "Common Style Sheet",
//         "Colorful Style Sheet",
//         "Computer Style Sheet",
//         "Cascading Style Sheet",
//       ],
//     },
//     {
//       question: "What does PHP stands for?",
//       answer: "Hypertext Preprocessor",
//       options: [
//         "Hypertext Preprocessor",
//         "Hypertext Programming",
//         "Hypertext Preprogramming",
//         "Hometext Preprocessor",
//       ],
//     },
//     {
//       question: "What does SQL stands for?",
//       answer: "Structured Query Language",
//       options: [
//         "Stylish Question Language",
//         "Stylesheet Query Language",
//         "Statement Question Language",
//         "Structured Query Language",
//       ],
//     },
//     {
//       question: "What year was JavaScript launched?",
//       answer: "1995",
//       options: ["1996", "1995", "1994", "None of the Above"],
//     },
//   ];
  
  var questionToRender = document.getElementById("questionToRender");
  var optionsToRender = document.getElementById("optionsToRender");
  var count = 0 , score = 0;
  var questionNumber = document.getElementById("questionNumber");
  var resultDisplay = document.getElementById("resultDisplay");
  var progressBar = document.getElementById("progressBar");
  var progressBarOptions;
  var startBtn = document.getElementById("startBtn");
  
  var timer = document.getElementById("timer");
  var sec = 0, isNotAlreadyRunning = true;
  
  var previousResult;
  
//   console.log(questionToRender.value);
// result.display = none;
  window.render = () => {

    // startBtn.remove();
    progressBarOptions = 100/questionData.length
    // console.log(questionData[count].question);
    window.timerStart(isNotAlreadyRunning,getDuration);
//   questionToRender.innerHTML = `Bye`

    progressBar.style.width =`${progressBarOptions*count}%`
    if(count < questionData.length){
      questionNumber.innerHTML = count+1;
      
      
      
  questionNumber.innerHTML = count+1;
  
  questionToRender.innerHTML = questionData[count].question;
  
  optionsToRender.innerHTML = ``
  for(var i = 0; i<questionData[count].options.length; i++){
    optionsToRender.innerHTML += `<div class="col-md-6 col-12 mt-3">
    <button class="btn btn-lg shadow-lg w-100 mt-3 text-primary fw-semibold" onclick="window.checkAnswer(${i})">${questionData[count].options[i]}</button>
    </div>`;
  }
  optionsToRender.innerHTML += `<div class="mt-5 text-end">
  <button class="btn btn-primary px-5" onclick="nextQuestion();">
    Next
  </button>
  </div>`
  
  }else{
    // resultDisplay.display = inlineBlock;

    // onValue(ref(database,"testResults/"+ testCode.value),function(snapshot) {
    //     if (snapshot.exists()) {
    //         previousResult = snapshot.val();
    //         // console.log(previousResult);
    //         previousResult.push({
    //             uid:uid,
    //             result:(score/questionData.length*100)
    //         })
    //     }
    // })
    
    /////////storing the result to the admin panel of test maker///////////

    clearInterval(interval);
  
  set(ref(database,`testResults/${testCode.value}/${uid}`),{
    result:  score/questionData.length*100,
    email: userCurrently.email
  })
        
        resultDisplay.innerHTML = 
        `
        <h1>Result : ${score}/${questionData.length}</h1>
        <h1>Percentage : ${(score/questionData.length*100)}</h1>
        `
    


    
    
  }
  
  
  
  }
  // render();
  
  window.nextQuestion = () =>{
      count++ ;
      render();
  }
  
  
window.checkAnswer = (i) => {
  if(questionData[count].answer === questionData[count].options[i] ){
      score ++;
  }
  window.nextQuestion();
  
  
  }
  
  var interval;
  
  
  
  window.timerStart = (isNotAlreadyRunning,durationData) => {

    if(isNotAlreadyRunning){

        return;
    }

    isNotAlreadyRunning = false;


  var min = +durationData;
   interval = setInterval(()=>{
    if(min === 0 && sec ===  0 || count === questionData.length) {
      // console.log("timeend")
    clearInterval(interval);
    
    timer.innerHTML = `0 : 00`;
    count = questionData.length  ;
    questionNumber.innerHTML = count;
    render();
    return
    }
  if (sec === 0){
    min--;
    sec = 60;
  
  }
  sec--;
  timer.innerHTML = `Duration : ${min} : ${sec}`;
  
  },1000);
  
  }
  
  // timerStart()
  
  
  
  