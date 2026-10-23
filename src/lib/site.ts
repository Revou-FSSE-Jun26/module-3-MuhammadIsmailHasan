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
    "Free shipping on orders over $100",
    "30-day hassle-free returns",
    "New arrivals every week — shop the latest drops",
  ],

  mainNav: [
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/collections/all" },
    { label: "Contact", href: "/#newsletter" },
  ],

  secondaryNav: [
    { label: "Track order", href: "#" },
    { label: "Shipping & Delivery", href: "/#faq" },
  ],

  heroSlides: [
    {
      eyebrow: "New season",
      title: "Time Meets Technology",
      subtitle: "Navigate your day seamlessly with our innovative electronics.",
      cta: {
        label: "Shop electronics",
        href: "/collections/all",
      },
      scene: "hills" as SceneVariant,
      palette: "peach" as ScenePalette,
    },
    {
      eyebrow: "Fresh drop",
      title: "Style That Speaks",
      subtitle: "Everyday clothing made for comfort, built to last.",
      cta: {
        label: "Shop clothing",
        href: "/collections/all",
      },
      scene: "lake" as SceneVariant,
      palette: "sunset" as ScenePalette,
    },
    {
      eyebrow: "Limited edition",
      title: "Shine Every Moment",
      subtitle: "Jewelry pieces picked for the little celebrations.",
      cta: { label: "Shop jewelry", href: "/collections/all" },
      scene: "dunes" as SceneVariant,
      palette: "dusk" as ScenePalette,
    },
  ],

  promoMarquee: ["Summer Sale", "Get 30% Off", "Free Returns", "New Arrivals"],

  features: [
    {
      icon: "truck",
      title: "Free Shipping & Returns",
      text: "Free shipping on orders over $100 and easy 30-day returns.",
    },
    {
      icon: "shield",
      title: "Money Back Guarantee",
      text: "Not happy with your order? Get a full refund, no questions asked.",
    },
    {
      icon: "support",
      title: "Online Support 24/7",
      text: "Our team is ready to help any time, any day of the week.",
    },
  ] as const,

  testimonials: [
    {
      name: "[Customer name]",
      role: "Verified buyer",
      title: "A shop you can trust",
      quote:
        "[Replace with a real customer review. Keep it to two or three sentences so it reads well in the slider.]",
      rating: 5,
    },
    {
      name: "[Customer name]",
      role: "Verified buyer",
      title: "Fast delivery",
      quote: "[Replace with a real customer review about delivery, packaging or support.]",
      rating: 5,
    },
    {
      name: "[Customer name]",
      role: "Verified buyer",
      title: "Great quality",
      quote: "[Replace with a real customer review about product quality.]",
      rating: 4,
    },
  ],

  news: [
    {
      title: "[Your blog post title]",
      date: "2026-10-01",
      tag: "Guides",
      scene: "hills" as SceneVariant,
      palette: "mint" as ScenePalette,
    },
    {
      title: "[Your blog post title]",
      date: "2026-09-20",
      tag: "News",
      scene: "lake" as SceneVariant,
      palette: "peach" as ScenePalette,
    },
    {
      title: "[Your blog post title]",
      date: "2026-09-05",
      tag: "Tips",
      scene: "dunes" as SceneVariant,
      palette: "sunset" as ScenePalette,
    },
  ],

  faqs: [
    {
      q: "Is free shipping available?",
      a: "Yes. Orders over $100 ship for free. Smaller orders use a flat shipping rate shown at checkout.",
    },
    {
      q: "Is the product I'm looking for in stock?",
      a: "Stock levels are shown on every product page. Out-of-stock items can be added to your wishlist.",
    },
    {
      q: "What are your return policies?",
      a: "You can return any unused item within 30 days of delivery for a full refund.",
    },
    {
      q: "Where will my order be sent by default?",
      a: "Orders ship to the default address saved in your account. You can change it during checkout.",
    },
    {
      q: "Are you an authorized retailer?",
      a: "Yes, we only sell genuine products sourced directly from brands or their official distributors.",
    },
    {
      q: "What is covered by the 1-year warranty?",
      a: "Manufacturing defects are covered for 12 months. Accidental damage is not included.",
    },
    {
      q: "Is express shipping available?",
      a: "Express shipping is available for most addresses and can be chosen at checkout.",
    },
    {
      q: "Can I redeem a coupon online?",
      a: "Yes — enter your code in the cart before checkout and the discount is applied instantly.",
    },
  ],

  footer: [
    {
      title: "Company",
      links: ["About us", "Careers", "Press", "Contact"],
    },
    {
      title: "Shop",
      links: ["All products", "New arrivals", "Best sellers", "Gift cards"],
    },
    { title: "Help", links: ["Shipping", "Returns", "Warranty", "FAQ"] },
  ],
};
