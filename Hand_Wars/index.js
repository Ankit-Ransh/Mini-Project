let choices = document.querySelector(".container");

// user score and computer score
let user = 0;
let computer = 0;

// map choice to index 
const options = {
    "rock": 0,
    "paper": 1,
    "scissors": 2,
}

// map index to choices
const indexToOptions = ["Rock","Paper","Scissors"];

// winning states
const winnerStates = [
    [0,2],
    [1,0],
    [2,1]
];

// change button css
const changeResultStyle = (res,color,size,width) => {
    res.style.backgroundColor = `${color}`;
    res.style.fontSize = `${size}rem`;
    res.style.width =  `${width}%`;
}

// find the winner
const declareResult = (userChoice,computerChoice) => {
    for(let state of winnerStates){

        const availScreenWidth  = window.screen.availWidth;

        let size = 0,width = 0;
        if(availScreenWidth < 320){
            size = 1;
            width = 80;
        }
        else if(availScreenWidth >= 320 && availScreenWidth < 480){
            size = 1.2;
            width = 80;
        }
        else if(availScreenWidth >= 480 && availScreenWidth < 600){
            size = 1.2;
            width = 70;
        }
        else if(availScreenWidth >= 600 && availScreenWidth < 768){
            size = 1.2;
            width = 50;
        }
        else if(availScreenWidth >= 768 && availScreenWidth < 992){
            size = 1.2;
            width = 45;
        }
        else{
            size = 1.2;
            width = 30;
        }

        // result button
        let res = document.querySelector(".result");

        // user is the winner
        if(state[0] === options[userChoice] && state[1] === computerChoice) {
            user += 1;
            document.querySelector(".user").innerText = `${user}`;

            res.innerText = `You won! ${indexToOptions[state[0]]} beats ${indexToOptions[state[1]]}`;

            changeResultStyle(res,"green",size,width);
            return;
        }

        // computer is the winner
        if(state[0] === computerChoice && state[1] === options[userChoice]) {
            computer += 1;
            document.querySelector(".computer").innerText = `${computer}`;

            res.innerText = `You lost. ${indexToOptions[state[0]]} beats ${indexToOptions[state[1]]}`;

            changeResultStyle(res,"red",size,width);
            return;
        }

        // draw 
        res.innerText = "It was a Draw";

        changeResultStyle(res,"#081b31",size,width);
    }
}

choices.addEventListener("click", (e) => {
    let choice = e.target.closest("[data-choice]");

    if(choice){
        let userChoice = choice.dataset.choice;
        let computerChoice = Math.floor(Math.random() * 3); // Math.random >= 0 && < 1

        declareResult(userChoice,computerChoice);
    }

})