const input = document.querySelector(".search");
const dropdown = document.querySelector(".dropdown");
const repositories = document.querySelector(".repositoryes");
let data;

const debounce = (fn, debounceTime) => {
  let id = null;
  return function (...arg) {
    clearTimeout(id);
    id = setTimeout(() => {
      fn.apply(this, arg);
    }, debounceTime);
  };
};

const getRepositories = async function () {
  if (input.value.trim().length !== 0) {
    try {
      const request = await fetch(
        `https://api.github.com/search/repositories?q=${input.value}&sort=stars&order=desc&per_page=5`
      );
      data = await request.json();
      let dropdownHtml = "";
      for (item of data.items) {
        dropdownHtml += `<li class="dropdown__item">${item.name}</li>`;
      }
      dropdown.innerHTML = dropdownHtml;
    } catch (error) {
      console.log(error);
    }
  } else dropdown.innerHTML = "";
};

const createRepository = function (event) {
  if (event.target.classList.contains("dropdown__item")) {
    const repos = data.items;
    const filteredRepositories = repos.filter(
      (rep) => rep.name === event.target.textContent
    );
    const repositoryItem = ` <li class="repositoryes__item">
        <div class="wrap">
        <p>Name: ${filteredRepositories[0].name}</p>
        <p>Owner: ${filteredRepositories[0].owner.login}</p>
        <p>Stars: ${filteredRepositories[0].stargazers_count}</p>
        </div>
        <button class="bts"></button>
        </li>`;

    repositories.insertAdjacentHTML("afterbegin", repositoryItem);
    input.value = "";
    dropdown.innerHTML = "";
  }
};
const deleteRepository = function (event) {
  if (event.target.classList.contains("bts")) {
    event.target.closest(".repositoryes__item").remove();
  }
};

input.addEventListener("input", debounce(getRepositories, 500));
dropdown.addEventListener("click", createRepository);
repositories.addEventListener("click", deleteRepository);
