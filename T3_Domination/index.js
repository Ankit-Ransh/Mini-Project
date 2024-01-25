let grids = document.querySelectorAll(".grid");
let reset = document.querySelector(".resetGame");
let player = document.querySelector(".winner");
let game = document.querySelector(".game");
let turns = true;
let winner = "";
let index = 0;

const winnerPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

reset.addEventListener("click", (e) => {
    grids.forEach((box) => {
        box.innerText = "";
        box.disabled = false;
    })
    index = 0;
    turns = 0;

    // Edit styles 
    player.style.display = "none";
    game.style.marginBottom = "2rem";
})

const disableButtons = () => {
    grids.forEach((box) => {
        box.disabled = true;
    })
}

const declareResult = () => {
    game.style.marginBottom = 0;
    player.style.display = "flex";
}

grids.forEach((box) => {
    box.addEventListener("click", (e) => {
        if(turns === true){
            box.innerText = "O";
            turns = false;
        }
        else{
            box.innerText = "X";
            turns = true;
        }

        index += 1;

        box.disabled = true;

        let isWinner = checkWinner();
        if(isWinner === true){
            declareResult();
            disableButtons();
            player.innerHTML = `<div> Winner: Player ${winner} </div>`;
        }
        else{
            if(index == 9){
                declareResult();
                player.innerHTML = `<div> Match: Draw </div>`;
            }
        }
    })
})

const checkWinner = () => {
    for(let patterns of winnerPatterns){

        let pos1 = grids[Number(patterns[0])];
        let pos2 = grids[Number(patterns[1])];
        let pos3 = grids[Number(patterns[2])];

        if(pos1.innerText != "" && pos2.innerText != "" && pos3.innerText != ""){
            if(pos1.innerText === pos2.innerText && pos2.innerText === pos3.innerText){
                winner = pos1.innerText;
                return true;
            }
        }

    }
    return false;
}



