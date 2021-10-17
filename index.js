import { v4 as uuidv4 } from 'uuid';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set,onValue, child, get } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNg_rfCY7LQ8OCwEBVDShFvY-qKN0slI0",
  authDomain: "squid-game-bdf08.firebaseapp.com",
  projectId: "squid-game-bdf08",
  storageBucket: "squid-game-bdf08.appspot.com",
  messagingSenderId: "488714645016",
  appId: "1:488714645016:web:c9686063442155193a5d6d",
  measurementId: "G-YV7FSWWRKG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get a reference to the database service
const database = getDatabase(app);

console.log(database)

// writeUserData(
//     {
//         tableName : "usersPosition",
//         id : "user2",
//         key : "position",
//         value : {
//             userName:"user2",
//             x:0,
//             y:0,
//         },
//     }
// )
let userPosition = {
  x:0,
  y:0,
}

window.addEventListener("keydown",function(e){
  let x = userPosition.x;
  let y = userPosition.y;
  switch(e.key){
    case "ArrowRight":
      x +=1;
      break;
    case "ArrowDown":
      y +=1;
      break;
    case "ArrowLeft":
      x -=1;
      break;
    case "ArrowUp":
      y -=1;
      break;
  }
  console.log(x)
  console.log(y)
  
  writeUserData(
      {
          tableName : "usersPosition",
          id : "user1",
          key : "position",
          value : {
              userName:"user1",
              x,
              y,
          },
      }
  )
  userPosition.x = x;
  userPosition.y = y;
})

function writeUserData({tableName,id, key,value}) {
    const db = getDatabase();
    let object = {};
    object[key] = value;
    set(ref(db, `${tableName}/${id}` ), 
        object
    );
  }

const dbRef = ref(getDatabase());
get(child(dbRef, `gameUsers/`)).then((snapshot) => {
  if (snapshot.exists()) {
    let returnArr = Object.values(snapshot.val());
    updateUserList(returnArr);
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
get(child(dbRef, `usersPosition/`)).then((snapshot) => {
  if (snapshot.exists()) {
    let returnArr = Object.values(snapshot.val());
    console.log(userPosition)
    returnArr.map(i=>{
      if(i.position.userName =="user1"){
        userPosition.x = i.position.x;
        userPosition.y = i.position.y;
      }
    })
    
    drawUserPosition(returnArr);
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

const starCountRef = ref(getDatabase(), 'usersPosition/user1');
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data)
  drawUserPosition([{...data}]);
});
function updateUserList(userList){
    const userDOM = document.querySelector(".user-list")
    userDOM.innerHTML = "접속중인 유저 : "+userList.map(i=>i.userName);
}
function drawUserPosition(userPosition){
    userPosition.map(i=>{
      console.log(i.position.x)
      const activeDOM = document.querySelectorAll(".user1");
      if(activeDOM.length >0){
        for (let i = 0; i < activeDOM.length; i++) {
          const element = activeDOM[i];
          console.log(element)
          element.classList.remove("user1")
        }
      }
      const parentDOM = document.querySelectorAll(".map__row")[i.position.y];
      if(!parentDOM){
        console.log(i.position)
        return false;
      }
        const positionDOM =parentDOM.children[i.position.x];
        console.log(positionDOM)
        positionDOM.classList.add("active")
        positionDOM.classList.add(i.position.userName)
    })
    // const userDOM = document.querySelector(".user-list")
    // userDOM.innerHTML = "접속중인 유저 : "+userList.map(i=>i.userName);
}