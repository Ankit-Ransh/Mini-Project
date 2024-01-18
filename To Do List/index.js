const addTodo = () => {
    console.log(document.querySelector(".todo"));
}

let input = document.querySelector(".todos");
input.addEventListener("submit", addTodo);
