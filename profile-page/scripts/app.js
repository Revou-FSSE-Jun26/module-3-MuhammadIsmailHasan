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

const form = document.querySelector("#form");
const statusEl = document.querySelector("#form-status");
const messageInput = document.querySelector("#message");
const messageCount = document.querySelector("#message-count");
const sentBox = document.querySelector("#sent");
const sentList = document.querySelector("#sent-list");
const sentSummary = document.querySelector("#sent-summary");

const rules = {
	name: (v) => v.trim().length >= 2 || "Enter at least 2 characters.",
	email: (v) =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
		"Enter a valid email, e.g. you@mail.com.",
	phone: (v) =>
		/^\+?[0-9\s-]{8,16}$/.test(v.trim()) ||
		"Use 8–15 digits, e.g. +62 812 3456 7890.",
	source: (v) => v !== "" || "Choose where you found me.",
	address: (v) => v.trim().length >= 5 || "Enter your address.",
	message: (v) => v.trim().length >= 10 || "Write at least 10 characters.",
};

const fields = Object.keys(rules).map((name) => form.elements[name]);

function validateField(input) {
	const result = rules[input.name](input.value);
	const isValid = result === true;
	document.querySelector(`#${input.name}-error`).textContent = isValid
		? ""
		: result;
	input.classList.toggle("is-invalid", !isValid);
	input.setAttribute("aria-invalid", String(!isValid));
	return isValid;
}

fields.forEach((input) => {
	input.addEventListener("blur", () => validateField(input));
	input.addEventListener("input", () => {
		if (input.classList.contains("is-invalid")) validateField(input);
	});
});

messageInput.addEventListener("input", () => {
	messageCount.textContent = `${messageInput.value.length}/300 · at least 10 characters`;
});

const messages = [];

function renderSent() {
	sentBox.hidden = messages.length === 0;
	sentList.innerHTML = "";

	messages.forEach((m) => {
		const li = document.createElement("li");
		const title = document.createElement("strong");
		title.textContent = `${m.name} — ${m.reason}`;
		const meta = document.createElement("span");
		meta.className = "meta";
		meta.textContent = `${m.email} · ${m.phone} · ${m.source} · ${m.sentAt}`;
		const body = document.createElement("span");
		body.textContent = m.message;
		li.append(title, meta, body);
		sentList.append(li);
	});

	const jobOffers = messages.filter((m) => m.reason === "Job offer").length;
	const totalChars = messages.reduce((sum, m) => sum + m.message.length, 0);
	sentSummary.textContent = `${messages.length} sent · ${jobOffers} job offer(s) · ${totalChars} characters`;
}

form.addEventListener("submit", (event) => {
	event.preventDefault();

	const results = fields.map(validateField);
	if (!results.every(Boolean)) {
		statusEl.textContent = "Please fix the highlighted fields.";
		fields.find((f) => f.classList.contains("is-invalid")).focus();
		return;
	}

	const data = Object.fromEntries(new FormData(form));
	messages.unshift({
		...data,
		sendme: data.sendme === "on",
		sentAt: new Date().toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		}),
	});

	renderSent();
	form.reset();
	messageCount.textContent = "0/300 · at least 10 characters";
	statusEl.textContent = `Thanks, ${data.name.split(" ")[0]}! Your message was sent.`;
});
