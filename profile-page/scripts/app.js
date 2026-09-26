const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");

function renderToggle() {
	const dark = root.dataset.theme === "dark";
	toggle.textContent = dark ? "☀️" : "🌙";
	toggle.setAttribute("aria-pressed", String(dark));
}

toggle.addEventListener("click", () => {
	const next = root.dataset.theme === "dark" ? "light" : "dark";
	root.dataset.theme = next;
	try {
		localStorage.setItem("theme", next);
	} catch (e) {}
	renderToggle();
});

renderToggle();
