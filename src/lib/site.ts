export type ScenePalette = "peach" | "sunset" | "mint" | "dusk";
export type SceneVariant = "hills" | "lake" | "dunes";

export const siteConfig = {
  name: "RevoShop",
  locale: "id-ID",
  currency: "IDR",
  freeShippingThreshold: 1000000,
  phone: "+62 895 2843 8676",
  email: "hello@ismailhasan.my.id",
  address: "Jl. Ir. Soekarno, Ngawi, Jawa Timur",

  announcements: [
    "Free shipping on orders over Rp 1.000.000",
    "New products added every week",
    "A learning project — all data is for demo purposes",
  ],

  mainNav: [
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/collections/all" },
    { label: "Contact", href: "/#contact" },
  ],

  secondaryNav: [
    { label: "Track order", href: "/dashboard/buyer/orders" },
    { label: "Shipping & Delivery", href: "/#faq" },
  ],

  heroSlides: [
    {
      eyebrow: "Welcome to RevoShop",
      title: "Everything You Need, One Cart",
      subtitle:
        "Fashion, gadgets and everyday essentials from sellers you can browse in one place.",
      cta: { label: "Start shopping", href: "/collections/all" },
      image: "/images/hero-1.png",
      layout: "split" as "split" | "full",
      bg: "linear-gradient(to bottom, #aad4e4, #abd5e5 50%, #8dc2d4)",
      align: "left" as "left" | "right",
      tone: "dark" as "light" | "dark",
      position: "60% center",
    },
    {
      eyebrow: "Just landed",
      title: "Fresh Finds Every Week",
      subtitle: "Discover the newest products added by our sellers.",
      cta: { label: "See what's new", href: "/collections/all?sort=newest" },
      image: "/images/hero-3.png",
      layout: "split" as "split" | "full",
      bg: "#f3df62",
      align: "left" as "left" | "right",
      tone: "dark" as "light" | "dark",
      position: "50% center",
    },
    {
      eyebrow: "Sell with us",
      title: "Open Your Own Shop",
      subtitle:
        "Create a seller account, list your products and manage orders from your dashboard.",
      cta: { label: "Become a seller", href: "/register" },
      image: "/images/hero-2.png",
      layout: "full" as "split" | "full",
      bg: undefined as string | undefined,
      align: "right" as "left" | "right",
      tone: "light" as "light" | "dark",
      position: "40% center",
    },
  ],

  lookbook: {
    eyebrow: "Shop the look",
    title: "The everyday edit",
    image: "/images/lookbook.png",
  },

  promoMarquee: [
    "Free shipping over Rp 1.000.000",
    "New arrivals weekly",
    "Secure checkout",
    "Made for learning",
  ],

  features: [
    {
      icon: "truck",
      title: "Free shipping",
      text: "Orders over Rp 1.000.000 ship free. Smaller orders show their cost at checkout.",
    },
    {
      icon: "shield",
      title: "Secure accounts",
      text: "Sign in with protected sessions. Buyers, sellers and admins each see only their own tools.",
    },
    {
      icon: "support",
      title: "Track every order",
      text: "Follow your order from payment to delivery right from your dashboard.",
    },
  ] as const,

  roles: [
    {
      title: "Buyer",
      text: "Browse the catalogue, check out with a saved address and follow every order.",
      cta: { label: "Create a buyer account", href: "/register" },
    },
    {
      title: "Seller",
      text: "List products with multiple images, manage stock and move orders through shipping.",
      cta: { label: "Start selling", href: "/register" },
    },
    {
      title: "Admin",
      text: "Oversee every product and order, and organise categories and sub-categories.",
      cta: { label: "Sign in", href: "/login" },
    },
  ],

  faqs: [
    {
      q: "Is RevoShop a real store?",
      a: "No. RevoShop is a learning project built for a full-stack bootcamp. You can browse, register and place orders, but nothing is actually sold or shipped.",
    },
    {
      q: "Is the product data real?",
      a: "All products, prices, images and stock are sample data used for learning and demonstration only.",
    },
    {
      q: "Will I be charged when I place an order?",
      a: "No. There is no payment gateway. Checkout creates an order record so you can try the full order flow.",
    },
    {
      q: "What can I do on the site?",
      a: "Buyers browse and check out, sellers manage their own products and orders, and admins manage the whole catalogue.",
    },
    {
      q: "Can I create an account to try it?",
      a: "Yes. Register as a buyer or seller. Please do not use a password you use anywhere else.",
    },
    {
      q: "What is it built with?",
      a: "Next.js, React, TypeScript, Tailwind CSS and Motion on the front end, talking to a Flask REST API with JWT authentication.",
    },
    {
      q: "Why is the first load slow?",
      a: "The API runs on a free hosting tier that sleeps when idle. The first request can take up to a minute to wake it up.",
    },
    {
      q: "Where can I see the code?",
      a: "The source is on GitHub, linked in the footer.",
    },
  ],

  github: "https://github.com/MuhammadIsmailHasan",

  footer: [
    {
      title: "Shop",
      links: [
        { label: "All products", href: "/collections/all" },
        { label: "My orders", href: "/dashboard/buyer/orders" },
        { label: "Sell on RevoShop", href: "/register" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "FAQ", href: "/#faq" },
        { label: "Sign in", href: "/login" },
      ],
    },
  ],
};
