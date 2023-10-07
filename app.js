import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase,set,ref,child,get,push, onValue,onChildAdded } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5SzgIvNtiikFDII1BQUhENH251X774Qg",
  authDomain: "quiz-app-for-all.firebaseapp.com",
  projectId: "quiz-app-for-all",
  storageBucket: "quiz-app-for-all.appspot.com",
  messagingSenderId: "825880319861",
  appId: "1:825880319861:web:d0692adda48f00a7aba53c"
};










// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);







/////////check if user is authenticated///////
// import { getAuth, onAuthStateChanged } from "firebase/auth";
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
    // console.log(window.location.pathname.endsWith('/signup.html'));

    if(window.location.pathname.endsWith('/')){

      window.location.replace("./pages/login.html");
    }else if(window.location.pathname.endsWith('/login.html') || window.location.pathname.endsWith('/signup.html')){
  
    }
    else{
      window.location.replace("./login.html");
    }
//     if(!window.location.pathname.endsWith('/login.html')) {
// if( !window.location.pathname.endsWith('/signup.html')){

// }
//     }
  }
});





///////////////signoutuser //////////////////////

window.signOutUser = function(){
  // console.log("runnning");
  signOut(auth).then(() => {
    // Sign-out successful.
    window.location.replace("./pages/login.html");
    console.log("success");
  }).catch((error) => {
    // An error happened.
    console.log(error);
  });
}






var newEmail;
var newPass ;
var newName ;

window.register = () => {
  
   newEmail = document.getElementById('newEmail').value;
   newPass = document.getElementById('newPass').value;
   newName = document.getElementById('newName').value;

if(!validateEmail(newEmail) || !validatePassword(newPass) || !validateName(newName)){
  alert('Please enter valid inputs');
  return;
}
var user

createUserWithEmailAndPassword( auth,newEmail, newPass)
.then((userCredential ) => {
  console.log('User Created');
   user = userCredential.user;
  // console.log(user);
  
  var databaseRef = ref(getDatabase());
  var userData = {
    email: newEmail,
    name: newName,
  };
  loginUser (newEmail,newPass)

set(ref(database,'users/' + user.uid),userData);

})
.catch(function(err) {
  alert(err);
})

}




window.loginUser = (email,password) => {
  if(!email || !password){

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
  }
  
  
  signInWithEmailAndPassword(auth,email,password)
  .then(function(response){
    // console.log(response);
    window.location.replace('../index.html');
  })
  .catch(function(err){
    console.log(err);
  });
}





function validateEmail(email) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/;

  if (newEmail){
    if (expression.test(email)) {
      return true;
    } else {
      return false;
    }
  }
}

function validatePassword(newPass) {
  if (newPass.length <6) { 
    return false;
  }else{
    return true;
  }
}

function validateName(newName) {
  if(!newName){
    return false;
  }else{
    return true;
  }
}





















////////////////////////////////////////////////////

/////////////////////////Database new quiz///////////////////

var question;
var answer;
var options;
var optionsArray = [];

// function NewQuestion (question, options, answer) {
//     this.question = question;
//     this.options = options;
//     this.answer = answer;
// } 



var questions = []
window.addNewQuestion = function(){

     question = document.getElementById('question').value;
     answer = document.getElementById('answer').value;
     options = document.getElementsByClassName('options');
    //  console.log(answer);
     for (var i = 0; i < options.length; i++) {
       optionsArray.push(options[i].value);
       options[i].value =``
      }
      
      
      if(!optionsArray || !answer || !question){
        alert('Please input valid details');
        return;
      }
      document.getElementById('question').value = ``
      document.getElementById('answer').value =``
    


     var n ={
        
      question: question,
      options: optionsArray,
      answer: answer,
     }

    //  var n = new NewQuestion(question, optionsArray, answer);
questions.push(n);
// console.log(questions);
   options =[]
     
}
var key,justAnEmptyArray = [];
var duration = document.getElementById('duration');
window.makeNewQuiz = function(){
  if(!duration){
    alert('Please input duration');
    return;
  }
  
  var keyRef = ref(database);
  key = push(keyRef).key;
  
  set(ref(database,`testResults/${key}`),{
    results: justAnEmptyArray
  })
  set(ref(database,`users/${uid}`),
    {
      email: userCurrently.email,
      myTest: key,
    }
  )




  set(ref(database,"tests/"+key),
  {questions:questions,
  duration: duration.value,
  owner: uid
  })
  .then(function(){
    
    questions = []
    
      var toBeReplaced = document.getElementById('toBeReplaced')
      toBeReplaced.innerHTML = `<div>
        <p>Your Quiz code is:</p>
        <p><strong onclick='copyToClipboard()' id='classKey'>${key}</strong></p>
      </div>`
      

    
   
    })
    .catch((err)=>{
      console.log(err);
    })

    
    // getQuizCodeFromDatabase()
    
    // console.log(key);
    
  }


  window.copyToClipboard = ()=> {
    // Get the text field
    var classKey = document.getElementById("classKey");
  
    // Select the text field
    classKey.select();
    classKey.setSelectionRange(0, 99999); // For mobile devices
  
    // Copy the text inside the text field
    navigator.clipboard.writeText(classKey.value);
    
    // Alert the copied text
    alert("Copied the text: " + classKey.value);
  }
  
  
  
  
  
  // window.getQuizCodeFromDatabase = ()=>{
    
    //   get(child(database,"tests/"+key).then(function(snapshot){
      //     if (snapshot.exists()) {
        //       console.log(snapshot.val());
        //     } else {
          //       console.log("No data available");
          //     }
          //   })
          //   )
          
          // }
          
          
          let testCode;
          // let checkTheTest= false;
          window.getQuiz = (e)=>{
            e.preventDefault();
            testCode = document.getElementById("testCode");
            // window.testCode = testCode.value
            onValue(ref(database,"tests/"+ testCode.value),function(snapshot) {
              if (snapshot.exists()) {
                // console.log(snapshot.val());
                testCode= testCode.value;
                justCalling();
                
                // window.location.replace('./pages/quiz.html');
              } else {
                console.log("No data available");
                alert("No quiz found");
              }
            })
          }
          


          function justCalling() {
            
  
          }







// console.log('kkk');






// function testCodeFn(){
// return testCode;
// }
// export {getTestCode}