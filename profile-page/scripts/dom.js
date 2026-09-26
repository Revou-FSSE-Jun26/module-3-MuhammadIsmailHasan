const nameInput = document.querySelector("#name");
const bioInput = document.querySelector("#bio");
const bioCount = document.querySelector("#bio-count");
const skillInput = document.querySelector("#skill");
const openBox = document.querySelector("#open");
const editor = document.querySelector("#editor");

const cardName = document.querySelector("#card-name");
const cardBio = document.querySelector("#card-bio");
const status = document.querySelector("#status");
const tagList = document.querySelector("#tags");
const likeBtn = document.querySelector("#like");
const likesEl = document.querySelector("#likes");
const resetBtn = document.querySelector("#reset");

const defaultSkills = ["HTML", "CSS", "JavaScript"];
let skills = [...defaultSkills];
let likes = 0;

function renderText() {
	cardName.textContent = nameInput.value.trim() || "Your name";
	cardBio.textContent = bioInput.value;
	bioCount.textContent = bioInput.value.length;
}

function renderStatus() {
	const isOpen = openBox.checked;
	status.textContent = isOpen ? "Open to work" : "Not available";
	status.classList.toggle("is-open", isOpen);
}

function renderTags() {
	tagList.innerHTML = "";
	skills.forEach((skill, index) => {
		const tag = document.createElement("span");
		tag.className = "tag";
		tag.textContent = skill;

		const remove = document.createElement("button");
		remove.type = "button";
		remove.textContent = "×";
		remove.dataset.index = index;
		remove.setAttribute("aria-label", `Remove ${skill}`);

		tag.append(remove);
		tagList.append(tag);
	});
}

nameInput.addEventListener("input", renderText);
bioInput.addEventListener("input", renderText);
openBox.addEventListener("change", renderStatus);

editor.addEventListener("submit", (event) => {
	event.preventDefault();
	const value = skillInput.value.trim();
	if (!value || skills.includes(value)) return;
	skills.push(value);
	skillInput.value = "";
	renderTags();
});

tagList.addEventListener("click", (event) => {
	const button = event.target.closest("button");
	if (!button) return;
	skills.splice(Number(button.dataset.index), 1);
	renderTags();
});

likeBtn.addEventListener("click", () => {
	likes += 1;
	likesEl.textContent = likes;
});

resetBtn.addEventListener("click", () => {
	likes = 0;
	skills = [...defaultSkills];
	likesEl.textContent = likes;
	renderTags();
});

renderText();
renderStatus();
renderTags();
