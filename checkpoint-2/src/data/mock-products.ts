import type { Product } from "@/types/product";

/**
 * Captured verbatim from GET /products/ so the UI is built against the real
 * payload — including the image URLs, which point at a host that does not
 * resolve. Replaced by a live fetch once the API layer is wired up.
 */
export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Laptop ASUS Vivobook 14",
    slug: "laptop-asus-vivobook-14",
    price: 8499000,
    stock: 15,
    image: "https://cdn.example.com/products/laptop-asus-vivobook-14-1.jpg",
  },
  {
    id: 2,
    name: "Mouse Wireless Logitech",
    slug: "mouse-wireless-logitech",
    price: 185000,
    stock: 50,
    image: "https://cdn.example.com/products/mouse-wireless-logitech-1.jpg",
  },
  {
    id: 3,
    name: "Kabel USB-C 2 Meter",
    slug: "kabel-usb-c-2-meter",
    price: 45000,
    stock: 100,
    image: "https://cdn.example.com/products/kabel-usb-c-2-meter-1.jpg",
  },
  {
    id: 4,
    name: "Monitor LG 27 Inch 4K",
    slug: "monitor-lg-27-inch-4k",
    price: 3750000,
    stock: 10,
    image: "https://cdn.example.com/products/monitor-lg-27-inch-4k-1.jpg",
  },
  {
    id: 5,
    name: "Keyboard Mekanik RGB",
    slug: "keyboard-mekanik-rgb",
    price: 649000,
    stock: 25,
    image: "https://cdn.example.com/products/keyboard-mekanik-rgb-1.jpg",
  },
  {
    id: 6,
    name: "Kaos Katun Combed 30s",
    slug: "kaos-katun-combed-30s",
    price: 75000,
    stock: 75,
    image: "https://cdn.example.com/products/kaos-katun-combed-30s-1.jpg",
  },
  {
    id: 7,
    name: "Celana Jeans Denim",
    slug: "celana-jeans-denim",
    price: 249000,
    stock: 40,
    image: "https://cdn.example.com/products/celana-jeans-denim-1.jpg",
  },
  {
    id: 8,
    name: "Jaket Hoodie Fleece",
    slug: "jaket-hoodie-fleece",
    price: 189000,
    stock: 30,
    image: "https://cdn.example.com/products/jaket-hoodie-fleece-1.jpg",
  },
  {
    id: 9,
    name: "Kopi Arabika Gayo 1kg",
    slug: "kopi-arabika-gayo-1kg",
    price: 135000,
    stock: 60,
    image: "https://cdn.example.com/products/kopi-arabika-gayo-1kg-1.jpg",
  },
  {
    id: 10,
    name: "Teh Hijau Celup 50 Kantong",
    slug: "teh-hijau-celup-50-kantong",
    price: 28000,
    stock: 80,
    image: "https://cdn.example.com/products/teh-hijau-celup-50-kantong-1.jpg",
  },
];

/**
 * Cases the live dataset happens not to contain. A card that survives these
 * survives production.
 *
 *   91  out of stock              → disabled button, getButtonClasses(false)
 *   92  very long name            → must clamp, must not change card height
 *   93  null image                → placeholder, no broken-image icon
 *   94  free item, single unit    → "Rp0" must render; quantity cannot exceed 1
 *   95  eight-digit price         → must not wrap or overflow the card
 */
export const edgeCaseProducts: Product[] = [
  {
    id: 91,
    name: "Powerbank 20000mAh",
    slug: "powerbank-20000mah",
    price: 299000,
    stock: 0,
    image: "https://cdn.example.com/products/powerbank-20000mah-1.jpg",
  },
  {
    id: 92,
    name: "Headset Gaming Wireless Noise Cancelling dengan Mikrofon Lepas Pasang dan Baterai 40 Jam",
    slug: "headset-gaming-wireless-noise-cancelling",
    price: 1250000,
    stock: 8,
    image: null,
  },
  {
    id: 93,
    name: "Tas Ransel Laptop",
    slug: "tas-ransel-laptop",
    price: 320000,
    stock: 12,
    image: null,
  },
  {
    id: 94,
    name: "Stiker Promo RevoShop",
    slug: "stiker-promo-revoshop",
    price: 0,
    stock: 1,
    image: null,
  },
  {
    id: 95,
    name: "Smart TV 65 Inch OLED",
    slug: "smart-tv-65-inch-oled",
    price: 24999000,
    stock: 3,
    image: "https://cdn.example.com/products/smart-tv-65-inch-oled-1.jpg",
  },
];
