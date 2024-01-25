let btn = document.querySelector(".btn");
let result = document.querySelector(".result");
let copyurl = "";

// const BACKEND_URL = "http://127.0.0.1:8080";
const BACKEND_URL = "https://tinylinkr.onrender.com";

btn.addEventListener("click", async (e) => {
    e.preventDefault();

    let input = document.querySelector("#input");

    try{    
        // fetch short url
        const response = await fetch(`${BACKEND_URL}/user`, {
            method: "POST",
            body: JSON.stringify({ url: input.value }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if(response.ok){
            const data = await response.json();

            result.innerHTML = `
                    <p> ${data.shortUrl} </p>
                    <button class="clipBoard"> <i class="fa fa-clipboard" aria-hidden="true"></i> <button>`;
            copyurl = data.shortUrl;

            input.value = "";
        }
        else{
            copyurl = "";
            throw new Error("Invalid Input");
        }

        let clipBoard = document.querySelector(".clipBoard");

        if(copyurl && clipBoard){
            clipBoard.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(copyurl);
                    clipBoard.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
                }
                catch (err) {
                    console.error('Failed to copy: ', err);
                }
            })
        }
    }
    catch(err){
        input.value = "";
        console.log("Error", err);
    }
    

})

