// Default Page
let username = "Ankit-Ransh";

const form = document.querySelector("form");
const input = document.querySelector("input");
const reposContainer = document.querySelector(".repo");
const pagination = document.querySelector(".pagination");

const reposPerPageDisplay = document.querySelector("#format");

const API_URL = "http://127.0.0.1:3000/";
const BASE_REPO_URL = "https://github.com/";

let repositoriesDetails = [];

let totalRepo = 0;
let numberOfPages = 0;
let reposPerPage = 10;
let pageNumber = 1;
let isDataRetrieved = false;

const enableLoader = () => {
    document.querySelector(".load").style.display = "flex";
    document.getElementById("stylesheet").href = "waiting.css";
    document.querySelector(".container").style.display = "none";
}

const disableLoader = () => {
    document.querySelector(".container").style.display = "block";
    document.getElementById("stylesheet").href = "style.css";
    document.querySelector(".load").style.display = "none";
}

const createPagination = () => {
    numberOfPages = Math.ceil(totalRepo / reposPerPage);

    const prevButton = document.createElement("button");
    prevButton.innerHTML = `<button type="submit" id="startPage"> « </button>`;
    pagination.appendChild(prevButton);

    // Loop to create page number buttons
    for (let page = 1; page <= numberOfPages; page++) {
        const pageButton = document.createElement("button");
        let pageName = `page${page}`;

        pageButton.innerHTML = `<button type="submit" id="${pageName}"> ${page} </button>`;
        pagination.appendChild(pageButton);
    }

    // Create the "»" (next) button
    const nextButton = document.createElement("button");
    nextButton.innerHTML = `<button type="submit" id="endPage"> » </button>`;
    pagination.appendChild(nextButton);
}

const fetchData = async (username) => {
    const response = await fetch(`${API_URL}api/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username })
    });

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();
    // console.log(data);

    // Total repos of the user
    totalRepo = data.public_repos;
    createPagination();

    document.getElementById("repositories").href = BASE_REPO_URL + `${username}?tab=repositories`;
    document.getElementById("stars").href = BASE_REPO_URL + `${username}?tab=stars`;
    document.getElementById("projects").href = BASE_REPO_URL + `${username}?tab=projects`;
    document.getElementById("packages").href = BASE_REPO_URL + `${username}?tab=packages`;

    document.getElementById("profile-img").src = data.avatar_url;
    document.querySelector(".name").innerText = data.name;
    document.querySelector(".username").innerText = data.login;
    document.querySelector(".bio").innerText = data.bio;
    document.getElementById("githubUrl").href = data.html_url;
}

// Function to fetch languages data and create cards asynchronously
const createCard = async ({ name, description, languages_url, git_url }) => {
    const modifiedUrl = git_url
        .replace(/^git:/, "http:")
        .replace(/\.git$/, "");

    try {
        // Fetch languages data from the backend API
        const response = await fetch(`${API_URL}api/languages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ languagesUrl: languages_url }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching languages: ${response.statusText}`);
        }

        const languagesData = await response.json();
        const languages = Object.keys(languagesData);

        const card = document.createElement("div");
        card.classList.add("card");

        const html = `
            <a href=${modifiedUrl} class="repoHeading" target="_blank"> ${name} </a>
            <p class="repoDescription"> ${description !== null ? description : ""} </p>
            <div class="languages">
                ${languages.filter(lang => lang !== null && lang !== undefined)
                    .map(lang => `<p class="language">${lang}</p>`).join('')}
            </div>`;

        card.innerHTML = html;
        repositoriesDetails.push(card);

        // Return the created card
        return card;
    } 
    catch (error) {
        // console.error('Error fetching languages:', error);
        throw error; // Propagate the error to the caller
    }
};

const displayPage = () => {
    reposContainer.innerHTML = '';
    pagination.innerHTML = '';
    
    createPagination();

    // Log or display the repositories for the specified page
    repositoriesDetails.forEach(repo => {
        reposContainer.append(repo);
    });
}

const fetchRepos = async (username) => {
    repositoriesDetails = [];

    try{
        const response = await fetch(`${API_URL}api/repos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, pageNumber, reposPerPage })
        });

        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        // console.log(data);

        for (const repo of data) {
            await createCard(repo);
        }

        displayPage();
        
    } catch (err) {
        throw new Error(err);
    }
}

const gitData = async (e) => {
    e.preventDefault();
    if(input.value !== "") {
        username = input.value;
    }

    if(username !== ""){
        try{
            enableLoader();
            const data = await fetchData(username);
            const repos = await fetchRepos(username);

            isDataRetrieved = true;
            enableRepoPerPageDisplay();
        }
        catch(err){
            throw new Error(err);
            // console.log(err);
        }
        finally{
            disableLoader();
            input.value = "";
        }
    }
}

form.addEventListener("submit", (e) => {
    gitData(e);
});

// Handle on click event of repo perpage and pages
const enableRepoPerPageDisplay = () => {
    reposPerPageDisplay.innerHTML = `
        <option selected value="10" id="tenPages"> 10 </option>
        <option value="50" id="fiftyPages"> 50 </option>
        <option value="100" id="hundredPages"> 100 </option>
    `;
}

const disableRepoPerPageDisplay = () => {
    reposPerPageDisplay.innerHTML = `
        <option selected value="10" id="tenPages"> 10 </option>
        <option disabled value="50" id="fiftyPages"> 50 </option>
        <option disabled value="100" id="hundredPages"> 100 </option>
    `;
}

reposPerPageDisplay.addEventListener("change", async() => {
    const selectedValue = reposPerPageDisplay.value;

    if(isDataRetrieved === true){
        reposPerPage = parseInt(selectedValue);
        pageNumber = 1;

        enableLoader();
        await fetchRepos(username);
        disableLoader();
    }
    else{
        disableRepoPerPageDisplay();
    }

})

pagination.addEventListener("click", async (e) => {
    const selectedValue = e.target.innerText;

    if(selectedValue === "«") pageNumber = 1;
    else if(selectedValue === "»") pageNumber = parseInt(numberOfPages);
    else pageNumber = parseInt(selectedValue);

    enableLoader();
    await fetchRepos(username);
    disableLoader();
})

window.addEventListener('load', (e) => {
    disableLoader();
    gitData(e);
});

// const resetData = () => {
//     reposContainer.innerHTML = '';
//     pagination.innerHTML = '';
//     totalRepo = 0;
//     totalRepo = 0;
//     reposPerPage = 10;
//     pageNumber = 1;
//     repositoriesDetails = [];
//     isDataRetrieved = false;
// }