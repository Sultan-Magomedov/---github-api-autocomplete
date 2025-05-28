const input = document.querySelector(".search");
const dropdown = document.querySelector(".dropdown");
const repositories = document.querySelector(".repositoryes");

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
  try {
    const request = await fetch(
      `https://api.github.com/search/repositories?q=${input.value}&sort=stars&order=desc&per_page=5`
    );
    const resolve = await request.json();
    let dropdownHtml = "";
    for (item of resolve.items) {
      dropdownHtml += `<li class="dropdown__item">${item.name}</li>`;
    }
    dropdown.innerHTML = dropdownHtml;
  } catch (error) {
    console.log(error);
  }
};

const createRepository = async function (event) {
  if (event.target.classList.contains("dropdown__item")) {
    try {
      const request = await fetch(
        `https://api.github.com/search/repositories?q=${input.value}&sort=stars&order=desc&per_page=5`
      );
      const resolve = await request.json();
      const repos = resolve.items;
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
    } catch (error) {
      console.log(error);
    }
  }
  if (event.target.classList.contains("bts")) {
    event.target.closest(".repositoryes__item").remove();
  }
};

input.addEventListener("input", debounce(getRepositories, 500));
document.addEventListener("click", createRepository);
