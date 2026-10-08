const projects = [
	{ title: "Profile page", tags: ["HTML", "CSS"], hours: 14, done: true },
	{ title: "Product catalog", tags: ["TypeScript", "DOM"], hours: 20, done: true },
	{ title: "To-do list", tags: ["JS", "DOM"], hours: 8, done: true },
	{ title: "Landing page", tags: ["HTML", "CSS"], hours: 10, done: true },
	{ title: "Weather widget", tags: ["JS", "Fetch"], hours: 6, done: false },
	{ title: "Quiz app", tags: ["JS", "DOM"], hours: 12, done: false },
];

const tagCounts = projects.reduce((counts, p) => {
	p.tags.forEach((tag) => {
		counts[tag] = (counts[tag] || 0) + 1;
	});
	return counts;
}, {});

const listEl = document.querySelector("#projects");
const filtersEl = document.querySelector("#filters");
let activeTag = "All";

function render() {
	const visible =
		activeTag === "All"
			? projects
			: projects.filter((p) => p.tags.includes(activeTag));

	listEl.innerHTML = visible
		.map(
			(p) => `
		<article class="card">
			<h3>${p.title}</h3>
			<p>${p.hours} h · ${p.done ? "Finished" : "In progress"}</p>
			<div class="badges">${p.tags.map((t) => `<span class="badge badge-blue">${t}</span>`).join("")}</div>
		</article>`,
		)
		.join("");

	const hours = visible.reduce((sum, p) => sum + p.hours, 0);
	document.querySelector("#stat-count").textContent = visible.length;
	document.querySelector("#stat-hours").textContent = hours;
	document.querySelector("#stat-avg").textContent = visible.length
		? (hours / visible.length).toFixed(1)
		: 0;

	filtersEl.querySelectorAll("button").forEach((b) => {
		b.setAttribute("aria-pressed", b.dataset.tag === activeTag);
	});
}

["All", ...Object.keys(tagCounts)].forEach((tag) => {
	const btn = document.createElement("button");
	btn.className = "btn";
	btn.type = "button";
	btn.dataset.tag = tag;
	btn.textContent =
		tag === "All" ? `All (${projects.length})` : `${tag} (${tagCounts[tag]})`;
	btn.addEventListener("click", () => {
		activeTag = tag;
		render();
	});
	filtersEl.append(btn);
});

render();
