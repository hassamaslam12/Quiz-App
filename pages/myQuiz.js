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
var dbRef = ref(getDatabase())
var testNumber;

 onAuthStateChanged(auth, (user) => {
  // console.log("hello");
  if (user) {
    uid = user.uid;
    userCurrently = user;
    // console.log(user);

    // getting the data of user once authorization is checked////////////////////////////////
    get(child(dbRef,"users/"+ uid)).then(function(snapshot) {
        if (snapshot.exists()) {
        //  console.log(snapshot.val());
            testNumber = snapshot.val().myTest;
            // console.log(testNumber);
    

            
            ///////////getting the result////////////////////////////////
            onValue(ref(database,"testResults/"+ testNumber),function(snapshot) {
                if (snapshot.exists()) {
                    // console.log(snapshot.val());
                    var persons = snapshot.val();
                  
                  var display = document.getElementById("display");
                  display.innerHTML = `
                  <table class="table table-striped">
                  <thead>
                      <tr>
                  
                          <td colspan="3"> 
                              Test Code:
                              <strong>
                                  
                                  ${testNumber}
                              </strong>
                          </td>
                      </tr>
                  </thead>        
                  
                  <tbody id="tableBody">
                     

                      
                  
                  </tbody>
                        </table>
                  `

                    var count =1;
                    var tableBody = document.getElementById('tableBody');
                    tableBody.innerHTML =` <tr>
                    <td><h3>S.no</h3></td>
                    <td><h3>E-mail</h3></td>
                    <td><h3>Percentage</h3></td>
                </tr>`;
                // console.log(persons);
                for(let eachPerson in persons){
                        tableBody.innerHTML += `<tr>
                        <td>${count}</td>
                        <td>${persons[eachPerson].email}</td>
                        <td>${persons[eachPerson].result}%</td>
                    </tr>`;
                    // console.log(persons);
                    count++;
                }


                  // window.location.replace('./pages/quiz.html');
                } else {
                  console.log("No data available");
                  alert("No quiz found");
                }
              })







      } else {
        alert("No quiz available");
      }
    })
    return;
  } else {
    
    window.location.replace("./login.html");
  }
});

