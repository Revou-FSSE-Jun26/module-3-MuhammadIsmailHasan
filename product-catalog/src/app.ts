type Product = {
	id: number;
	name: string;
	category: string;
	description: string;
	price: number;
	stock: number;
	createdAt: string;
};

const products: Product[] = [
	{ id: 1, name: "Batik Tulis Pekalongan", category: "Fashion", description: "Kemeja batik tulis motif parang, adem dipakai.", price: 285000, stock: 12, createdAt: "2026-09-10" },
	{ id: 2, name: "Kopi Gayo Arabika 250g", category: "Minuman", description: "Biji kopi sangrai medium dari Aceh Tengah.", price: 89000, stock: 40, createdAt: "2026-09-15" },
	{ id: 3, name: "Keripik Tempe Sagu", category: "Makanan", description: "Renyah, gurih, cocok buat teman ngopi.", price: 22000, stock: 65, createdAt: "2026-08-21" },
	{ id: 4, name: "Tas Anyaman Pandan", category: "Kerajinan", description: "Tas anyaman tangan dari Tasikmalaya.", price: 135000, stock: 4, createdAt: "2026-08-05" },
	{ id: 5, name: "Sambal Roa Manado", category: "Makanan", description: "Pedas dan harum, tahan disimpan sebulan.", price: 45000, stock: 0, createdAt: "2026-07-30" },
	{ id: 6, name: "Sarung Tenun Samarinda", category: "Fashion", description: "Sarung tenun halus, warna tidak mudah luntur.", price: 320000, stock: 6, createdAt: "2026-09-18" },
	{ id: 7, name: "Teh Poci Melati", category: "Minuman", description: "Teh tubruk wangi melati, isi 100g.", price: 28000, stock: 30, createdAt: "2026-06-18" },
	{ id: 8, name: "Gerabah Kasongan", category: "Kerajinan", description: "Vas tanah liat buatan pengrajin Bantul.", price: 95000, stock: 2, createdAt: "2026-07-12" },
	{ id: 9, name: "Dodol Garut Rasa Durian", category: "Makanan", description: "Manis legit, dibungkus daun jagung.", price: 35000, stock: 18, createdAt: "2026-09-02" },
];

type CartItem = {
	product: Product;
	quantity: number;
};

type Cart = CartItem[];

let keyword = "";
let selectedCategory = "Semua";
let sortBy = "newest";
let onlyInStock = false;
const cart: Cart = [];

const searchInput = document.getElementById("search") as HTMLInputElement;
const sortSelect = document.getElementById("sort") as HTMLSelectElement;
const stockCheckbox = document.getElementById("in-stock") as HTMLInputElement;
const categoriesBox = document.getElementById("categories") as HTMLDivElement;
const productGrid = document.getElementById("grid") as HTMLDivElement;
const countText = document.getElementById("count") as HTMLParagraphElement;
const emptyBox = document.getElementById("empty") as HTMLDivElement;
const clearButton = document.getElementById("clear") as HTMLButtonElement;
const cartBadge = document.getElementById("cart-count") as HTMLSpanElement;

function formatRupiah(price: number): string {
	return "Rp" + price.toLocaleString("id-ID");
}

function stockLabel(stock: number): string {
	const style = "text-xs font-semibold px-2.5 py-1 rounded-full ";
	if (stock === 0) {
		return `<span class="${style} bg-slate-100 text-slate-500">Stok habis</span>`;
	}
	if (stock <= 5) {
		return `<span class="${style} bg-amber-100 text-amber-800">Sisa ${stock}</span>`;
	}
	return `<span class="${style} bg-emerald-100 text-emerald-800">Stok ${stock}</span>`;
}

function addToCart(productId: number) {
	const product = products.find((p) => p.id === productId);
	if (product === undefined) return;

	const item = cart.find((c) => c.product.id === productId);
	if (item === undefined) {
		cart.push({ product: product, quantity: 1 });
	} else if (item.quantity < product.stock) {
		item.quantity = item.quantity + 1;
	}
	showCartCount();
}

function getCartTotalItems(): number {
	let total = 0;
	for (const item of cart) {
		total = total + item.quantity;
	}
	return total;
}

function showCartCount() {
	cartBadge.textContent = String(getCartTotalItems());
}

function getVisibleProducts(): Product[] {
	const result: Product[] = [];
	for (const product of products) {
		const text = (product.name + " " + product.description).toLowerCase();

		const matchKeyword = text.includes(keyword.toLowerCase());
		const matchCategory =
			selectedCategory === "Semua" || product.category === selectedCategory;
		const matchStock = !onlyInStock || product.stock > 0;

		if (matchKeyword && matchCategory && matchStock) {
			result.push(product);
		}
	}

	if (sortBy === "price-asc") {
		result.sort((a, b) => a.price - b.price);
	} else if (sortBy === "price-desc") {
		result.sort((a, b) => b.price - a.price);
	} else if (sortBy === "name") {
		result.sort((a, b) => a.name.localeCompare(b.name));
	} else {
		result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	}

	return result;
}

function showCategories() {
	const names = ["Semua", "Fashion", "Makanan", "Minuman", "Kerajinan"];
	let html = "";
	for (const name of names) {
		const active = name === selectedCategory;
		const style = active
			? "bg-brand-600 text-white shadow"
			: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-brand-50";
		html += `<button type="button" data-category="${name}"
			class="shrink-0 min-h-11 px-5 rounded-full text-sm font-semibold transition ${style}">${name}</button>`;
	}
	categoriesBox.innerHTML = html;
}

function showProducts() {
	const list = getVisibleProducts();

	let html = "";
	for (const p of list) {
		const soldOut = p.stock === 0;
		html += `
		<article class="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 ${soldOut ? "opacity-60" : ""}">
			<div class="aspect-[4/3] grid place-items-center bg-gradient-to-br from-brand-50 to-brand-100">
				<span class="text-4xl font-extrabold text-brand-500/40">${p.name.charAt(0)}</span>
			</div>
			<div class="flex flex-col gap-2 p-5 flex-1">
				<p class="text-xs font-semibold uppercase tracking-widest text-brand-600">${p.category}</p>
				<h3 class="text-lg font-extrabold leading-tight">${p.name}</h3>
				<p class="text-sm text-slate-500">${p.description}</p>
				<div class="mt-auto pt-3 flex flex-wrap items-center justify-between gap-2">
					<span class="text-lg font-extrabold">${formatRupiah(p.price)}</span>
					${stockLabel(p.stock)}
				</div>
				<button type="button" data-add="${p.id}" ${soldOut ? "disabled" : ""}
					class="mt-3 min-h-11 rounded-full bg-brand-600 text-white font-semibold hover:bg-brand-700 transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed">
					${soldOut ? "Tidak tersedia" : "Tambah ke keranjang"}
				</button>
			</div>
		</article>`;
	}
	productGrid.innerHTML = html;

	productGrid.hidden = list.length === 0;
	emptyBox.hidden = list.length > 0;
	countText.textContent = `Menampilkan ${list.length} dari ${products.length} produk`;
}

function refresh() {
	showCategories();
	showProducts();
}

searchInput.addEventListener("input", () => {
	keyword = searchInput.value;
	refresh();
});

sortSelect.addEventListener("change", () => {
	sortBy = sortSelect.value;
	refresh();
});

stockCheckbox.addEventListener("change", () => {
	onlyInStock = stockCheckbox.checked;
	refresh();
});

categoriesBox.addEventListener("click", (event) => {
	const button = (event.target as HTMLElement).closest("button");
	if (button === null) return;
	selectedCategory = button.dataset["category"] ?? "Semua";
	refresh();
});

productGrid.addEventListener("click", (event) => {
	const button = (event.target as HTMLElement).closest("button");
	if (button === null || button.disabled) return;
	addToCart(Number(button.dataset["add"]));
});

clearButton.addEventListener("click", () => {
	keyword = "";
	selectedCategory = "Semua";
	onlyInStock = false;
	searchInput.value = "";
	stockCheckbox.checked = false;
	refresh();
});

refresh();
