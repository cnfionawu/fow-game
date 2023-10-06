// Define the jobs and data arrays
const job1 = document.querySelector(".first");
const job2 = document.querySelector(".second");
const job3 = document.querySelector(".third");
const job4 = document.querySelector(".fourth");

var jobs = [
    { body: job1, name: "Uber (Berkeley)", time: 0, gametime: 15, mistakes: 0, earning: 0, interval: null },
    { body: job2, name: "UberEats (Berkeley)", time: 0, gametime: 10, mistakes: 0, earning: 0, interval: null },
    { body: job3, name: "Uber (SF)", time: 0, gametime: 30, mistakes: 0, earning: 0, interval: null },
    { body: job4, name: "UberEats (SF)", time: 0, gametime: 15, mistakes: 0, earning: 0, interval: null }
];
// store data here
const data = [];
// console.log(jobs);

// countup timer
setInterval(countupTime, 1000);
var seconds = 0;
function countupTime() {
    seconds++;
    document.getElementById("timer").innerHTML= seconds;
}

if (seconds == 30) {
    const gameArrToSend = JSON.stringify(data); // 2. Convert string array into a single JSON string
    console.log("Sending experiment result:", gameArrToSend); // 3. Check data type is String or JSON String
    console.log("Type of experiment result:", typeof gameArrToSend);
    window.parent.postMessage({ type: 'gameArr', data: gameArrToSend }, '*');
}


function randomchoose(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// start the countdown timer
function startCountdown(elementId, initialTime, callback) {
    const timerElement = document.getElementById(elementId);
    let time = initialTime;

    function updateTimer() {
        timerElement.innerHTML = time;
        time--;

        if (time < 0) {
            clearInterval(interval);
            if (callback) {
                callback();
            }
        }
    }

    // Initially update the timer
    updateTimer();

    // interval update the timer every second
    const interval = setInterval(updateTimer, 1000);
}

// reset Page 1 countdown timers
function resetPage1Countdowns() {
    var job1time = randomchoose(10, 30);
    jobs[0].time = job1time;
    var job2time = randomchoose(5, 15);
    jobs[1].time = job2time;
    var job3time = randomchoose(20, 60);
    jobs[2].time = job3time;
    var job4time = randomchoose(10, 20);
    jobs[3].time = job4time;

    jobs.forEach((job, index) => {
        const timerId = `timer${index + 1}`;
        const timerElement = document.getElementById(timerId);
        let initialTime = job.time;
        
        clearInterval(job.interval); // Clear any existing intervals
        job.interval = setInterval(() => {
            timerElement.innerHTML = initialTime;
            initialTime--;

            if (initialTime < 0) {
                clearInterval(job.interval);
                timerElement.innerHTML = "Available!";
                job.body.classList.add("jobanimate", "hover");
            } else {
                // Remove animation classes when countdown is not zero
                job.body.classList.remove("jobanimate", "hover");
            }
        }, 1000);
        
        // if (initialTime > 0) {
        //     // Start the countdown and remove animation classes
        //     // console.log(job.body)
        //     job.body.classList.remove("jobanimate", "hover");
        
        //     startCountdown(timerId, initialTime, () => {
        //         timerElement.innerHTML = "Available!";
        //         job.body.classList.add("jobanimate");
        //         job.body.classList.add("hover");
        //     });
        // } 
        
    });
}

// Event listeners for job clicks
if (job1) {
    job1.addEventListener("click", keeptrack);
}
if (job2) {
    job2.addEventListener("click", keeptrack);
}
if (job3) {
    job3.addEventListener("click", keeptrack);
}
if (job4) {
    job4.addEventListener("click", keeptrack);
}

// clicking on a job -> store in data array
function keeptrack(event) {
    if (event.currentTarget.classList.contains('jobanimate')) {
        const clickedElement = event.currentTarget;
        const job = jobs.find(job => job.body === clickedElement);
        // store job data
        data.push(job);

        // check uber or ubereats
        if (job.name.includes("UberEats")) {
            wordList = ["apple", "coconut", "banana", "pineapple"];
        } else {
            wordList = ["red", "green", "yellow"];
        }

        // Hide Page 1 and show Page 2
        page1.style.display = "none";
        page2.style.display = "block";

        // Start the game countdown on Page 2
        startGameCountdown(job.gametime);

        // start game in Page 2
        startRound();
    }
}

// start a new game countdown on Page 2
function startGameCountdown(gametime) {
    const gametimerElement = document.getElementById("gametimer");

    startCountdown("gametimer", gametime, () => {
        gametimerElement.innerHTML = "Time's up!";
        
        // Hide Page 2 and show Page 1 after the game is over
        page2.style.display = "none";
        page1.style.display = "block";

        // Reset Page 1 countdowns when coming back to it
        resetPage1Countdowns();
    });
}

// Call countdown function for four different timers on Page 1
resetPage1Countdowns();


// Game Part
// Get references to HTML elements
const imageDisplay = document.getElementById("image-display");
const userInput = document.getElementById("user-input");
const feedback = document.getElementById("feedback");

let currentWord = "";
let mistake = 0;
let wordList;

// start a new round
function startRound() {
    console.log(wordList);

    // Randomly select a word from the list
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];

    // Display corresponding image
    imageDisplay.src = `images/${currentWord}.jpg`;

    // Clear user input and feedback
    userInput.value = "";
    feedback.textContent = "";
}

// check user input
function checkInput(event) {
    // Check if the Enter key (key code 13) was pressed
    if (event.keyCode === 13) {
        const userAnswer = userInput.value.toLowerCase();

        if (userAnswer === currentWord) {
            feedback.textContent = "Correct!";
            startRound();
        } else {
            feedback.textContent = "Incorrect. Try again.";
            data[data.length-1].mistakes ++;
            console.log(data);
        }
    }
}

// Event listener for the Enter key press in the input field
userInput.addEventListener("keydown", checkInput);
