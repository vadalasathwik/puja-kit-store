export interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  image: string;
  description: string;
  items: string[];
  category: string;
  badge?: string | null;
}

export const products: Product[] = [
  {
    id: "ganesh-puja-kit",
    name: "Ganesh Puja Kit",
    price: 499,
    image: "/images/ganesh-puja-kit.jpg",
    description:
      "A complete and sacred Ganesh Puja Kit thoughtfully assembled for Vinayaka Chaturthi, Sankashti Chaturthi, or any auspicious occasion where you seek the blessings of Lord Ganesha. Everything is sourced with purity and devotion.",
    items: [
      "Ganesh Idol (Clay / Eco-friendly)",
      "Modak (Prasad)",
      "Durva Grass",
      "Red Flowers & Garland",
      "Roli, Kumkum & Haldi",
      "Incense Sticks (Agarbatti)",
      "Camphor (Kapoor)",
      "Coconut",
      "Betel Leaves & Nuts",
      "Puja Thali",
      "Deepak (Oil Lamp)",
      "Cotton Wicks",
    ],
    category: "Festival",
    badge: "Bestseller",
  },
  {
    id: "satyanarayana-puja-kit",
    name: "Satyanarayana Puja Kit",
    price: 799,
    image: "/images/satyanarayana-puja-kit.jpg",
    description:
      "Perform the sacred Satyanarayana Vrat Puja with ease using our all-inclusive kit. Ideal for birthdays, housewarmings, anniversaries, or fulfilling a vow. Prepared according to traditional Vedic specifications.",
    items: [
      "Satyanarayana Idol / Photo",
      "Panchamrit Ingredients (Milk, Curd, Honey, Ghee, Sugar)",
      "Banana Leaves",
      "Sheera Prasad Mix",
      "Tulsi Leaves",
      "Yellow Flowers & Garland",
      "Roli, Kumkum & Chandan",
      "Incense Sticks & Dhoop",
      "Camphor",
      "Coconut & Fruits",
      "Betel Leaves, Nuts & Coins",
      "Sacred Thread (Kalava)",
      "Puja Thali with Deepak",
      "Cotton Wicks & Oil",
    ],
    category: "Vrat Puja",
    badge: "Popular",
  },
  {
    id: "gruhapravesam-puja-kit",
    name: "Gruhapravesam Puja Kit",
    price: 1299,
    image: "/images/gruhapravesam-puja-kit.jpg",
    description:
      "Bless your new home with positivity, prosperity, and divine protection. Our Gruhapravesam Puja Kit covers every ritual needed for a traditional housewarming ceremony as per Hindu customs, making the occasion more auspicious.",
    items: [
      "Kalash (Copper Pot) with Coconut",
      "Mango Leaves for Toran",
      "Turmeric Paste & Kumkum",
      "Navadhanyas (Nine Sacred Grains)",
      "Sacred Thread & Coins",
      "Incense Sticks, Camphor & Dhoop",
      "Pancha Diya (5 Deepaks)",
      "Cotton Wicks & Pure Ghee",
      "Betel Leaves, Areca Nuts",
      "Flowers, Garland & Petals",
      "Puja Thali with all accessories",
      "Hawan Samagri",
      "Coconut & Fruits",
      "Red & Yellow Cloth",
    ],
    category: "Ceremony",
    badge: "Premium",
  },
  {
    id: "daily-puja-kit",
    name: "Daily Puja Kit",
    price: 299,
    image: "/images/daily-puja-kit.jpg",
    description:
      "Maintain your daily spiritual practice with our compact and convenient Daily Puja Kit. Designed for everyday worship at your home temple (pooja ghar), it includes everything you need to offer prayers morning and evening.",
    items: [
      "Incense Sticks (30 sticks / 3 varieties)",
      "Camphor Tablets",
      "Sandalwood Paste (Chandan)",
      "Kumkum & Haldi Powder",
      "Cotton Wicks (100 pieces)",
      "Pure Coconut Oil (small bottle)",
      "Tulsi & Flower Petals (dried)",
      "Puja Bell",
      "Small Deepak",
      "Sacred Ash (Vibhuti)",
    ],
    category: "Daily",
    badge: "Value Pack",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
