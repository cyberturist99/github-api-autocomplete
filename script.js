const search = document.querySelector("#search");
const autocomplete = document.querySelector("#autocomplete");
const repositories = document.querySelector("#repositories");
const input = document.querySelector(".input");

async function fetchRepositories(query) {
	const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
	const data = await response.json();
	return data.items;
}

function debounce(func, delay) {
	let timeout;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function () {
			func.apply(context, args);
		}, delay);
	};
}

function updateAutocomplete(query) {
	autocomplete.classList.remove("hidden");
	if (query.length === 0) {
		autocomplete.classList.add("hidden");
		return;
	}
	fetchRepositories(query).then((repositories) => {
		autocomplete.textContent = "";
		repositories.slice(0, 5).forEach((repository) => {
			const li = document.createElement("li");
			li.textContent = repository.name;
			li.addEventListener("click", () => {
				addRepository(repository);
				search.value = "";
				autocomplete.classList.add("hidden");
			});
			autocomplete.append(li);
		});
	});
}

function addRepository(repository) {
	const li = document.createElement("li");
	li.style.backgroundColor = "rgba(226, 123, 235, 1)";
	li.insertAdjacentHTML(
		"beforeend",
		`
	  <span class="repoInfo">Name: ${repository.name}<br>
	  Owner: ${repository.owner.login}<br>
	  Stars: ${repository.stargazers_count}</span>
	  <button class="remove-btn"><img src="./src/second.svg" class='img' /><img src="./src/first.svg" />
	  </button>
	`
	);

	repositories.append(li);
}

repositories.addEventListener("click", function (event) {
	if (event.target.closest(".remove-btn")) {
		const li = event.target.closest("li");
		li.remove();
	}
});

search.addEventListener(
	"input",
	debounce(function () {
		updateAutocomplete(search.value);
	}, 500)
);
