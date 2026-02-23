import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const products = [
  {
    name: "Classic Oversized Hoodie",
    description:
      "Premium cotton blend hoodie with a relaxed, oversized fit. Features a kangaroo pocket and adjustable drawstring hood.",
    category: "hoodies",
    brand: "UrbanThread",
    tags: ["oversized", "casual", "unisex", "streetwear"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_001",
        color: { name: "Midnight Black", hex: "#1a1a1a" },
        images: [
          {
            url: "https://cdn.example.com/hoodie-classic-black-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/hoodie-classic-black-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "HOD-CLB-S", stock: 30, price: 59.99 },
          { size: "M", sku: "HOD-CLB-M", stock: 45, price: 59.99 },
          { size: "L", sku: "HOD-CLB-L", stock: 25, price: 59.99 },
          { size: "XL", sku: "HOD-CLB-XL", stock: 15, price: 59.99 },
        ],
      },
      {
        variantId: "var_002",
        color: { name: "Ash Grey", hex: "#b0b0b0" },
        images: [
          {
            url: "https://cdn.example.com/hoodie-classic-grey-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/hoodie-classic-grey-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "HOD-CLG-S", stock: 20, price: 59.99 },
          { size: "M", sku: "HOD-CLG-M", stock: 35, price: 59.99 },
          { size: "L", sku: "HOD-CLG-L", stock: 18, price: 59.99 },
          { size: "XL", sku: "HOD-CLG-XL", stock: 10, price: 59.99 },
        ],
      },
    ],
    basePrice: 59.99,
    currency: "USD",
    discountPercent: 0,
    sizeGuide: {
      unit: "cm",
      chart: [
        { size: "S", chest: 91, length: 68 },
        { size: "M", chest: 96, length: 71 },
        { size: "L", chest: 101, length: 74 },
        { size: "XL", chest: 106, length: 77 },
      ],
    },
    material: "80% Cotton, 20% Polyester",
    careInstructions: ["Machine wash cold", "Do not bleach", "Tumble dry low"],
    ratings: { average: 4.6, count: 238 },
    status: "active",
  },
  {
    name: "Essential Crew Neck T-Shirt",
    description:
      "A wardrobe staple. Soft-touch jersey tee with a classic crew-neck cut.",
    category: "t-shirts",
    brand: "UrbanThread",
    tags: ["basics", "everyday", "unisex"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_003",
        color: { name: "White", hex: "#ffffff" },
        images: [
          {
            url: "https://cdn.example.com/tshirt-crew-white-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/tshirt-crew-white-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "XS", sku: "TSH-CRW-XS", stock: 50, price: 24.99 },
          { size: "S", sku: "TSH-CRW-S", stock: 60, price: 24.99 },
          { size: "M", sku: "TSH-CRW-M", stock: 80, price: 24.99 },
          { size: "L", sku: "TSH-CRW-L", stock: 40, price: 24.99 },
          { size: "XL", sku: "TSH-CRW-XL", stock: 20, price: 24.99 },
        ],
      },
      {
        variantId: "var_004",
        color: { name: "Charcoal", hex: "#333333" },
        images: [
          {
            url: "https://cdn.example.com/tshirt-crew-charcoal-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "S", sku: "TSH-CRC-S", stock: 45, price: 24.99 },
          { size: "M", sku: "TSH-CRC-M", stock: 55, price: 24.99 },
          { size: "L", sku: "TSH-CRC-L", stock: 30, price: 24.99 },
        ],
      },
    ],
    basePrice: 24.99,
    currency: "USD",
    discountPercent: 0,
    material: "100% Organic Cotton",
    careInstructions: ["Machine wash cold", "Hang dry"],
    ratings: { average: 4.3, count: 512 },
    status: "active",
  },
  {
    name: "Zip-Up Windbreaker Jacket",
    description:
      "Lightweight water-resistant windbreaker with a half-zip front and elastic cuffs.",
    category: "jackets",
    brand: "UrbanThread",
    tags: ["windbreaker", "lightweight", "outdoor"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_005",
        color: { name: "Navy Blue", hex: "#1b2a4a" },
        images: [
          {
            url: "https://cdn.example.com/windbreaker-navy-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/windbreaker-navy-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "JKT-WBN-S", stock: 15, price: 79.99 },
          { size: "M", sku: "JKT-WBN-M", stock: 22, price: 79.99 },
          { size: "L", sku: "JKT-WBN-L", stock: 18, price: 79.99 },
          { size: "XL", sku: "JKT-WBN-XL", stock: 10, price: 79.99 },
        ],
      },
      {
        variantId: "var_006",
        color: { name: "Forest Green", hex: "#2d5a27" },
        images: [
          {
            url: "https://cdn.example.com/windbreaker-green-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "M", sku: "JKT-WBG-M", stock: 12, price: 79.99 },
          { size: "L", sku: "JKT-WBG-L", stock: 8, price: 79.99 },
        ],
      },
    ],
    basePrice: 79.99,
    currency: "USD",
    discountPercent: 10,
    material: "100% Nylon",
    careInstructions: ["Machine wash cold", "Do not iron", "Hang dry"],
    ratings: { average: 4.4, count: 89 },
    status: "active",
  },
  {
    name: "Slim Fit Jogger Pants",
    description:
      "Tapered joggers with a soft fleece lining and ribbed ankle cuffs.",
    category: "pants",
    brand: "UrbanThread",
    tags: ["joggers", "slim-fit", "athleisure"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_007",
        color: { name: "Black", hex: "#000000" },
        images: [
          {
            url: "https://cdn.example.com/jogger-black-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/jogger-black-side.jpg",
            view: "side",
          },
        ],
        sizes: [
          { size: "S", sku: "PNT-JGB-S", stock: 28, price: 44.99 },
          { size: "M", sku: "PNT-JGB-M", stock: 40, price: 44.99 },
          { size: "L", sku: "PNT-JGB-L", stock: 20, price: 44.99 },
          { size: "XL", sku: "PNT-JGB-XL", stock: 12, price: 44.99 },
        ],
      },
      {
        variantId: "var_008",
        color: { name: "Heather Grey", hex: "#9e9e9e" },
        images: [
          {
            url: "https://cdn.example.com/jogger-grey-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "S", sku: "PNT-JGG-S", stock: 22, price: 44.99 },
          { size: "M", sku: "PNT-JGG-M", stock: 35, price: 44.99 },
          { size: "L", sku: "PNT-JGG-L", stock: 15, price: 44.99 },
        ],
      },
    ],
    basePrice: 44.99,
    currency: "USD",
    discountPercent: 0,
    sizeGuide: {
      unit: "cm",
      chart: [
        { size: "S", chest: 70, length: 98 },
        { size: "M", chest: 76, length: 100 },
        { size: "L", chest: 82, length: 102 },
        { size: "XL", chest: 88, length: 104 },
      ],
    },
    material: "70% Cotton, 30% Polyester",
    careInstructions: ["Machine wash cold", "Tumble dry low"],
    ratings: { average: 4.5, count: 176 },
    status: "active",
  },
  {
    name: "Graphic Print Hoodie",
    description:
      "Statement hoodie with a bold back graphic print. Brushed fleece interior for comfort.",
    category: "hoodies",
    brand: "StreetVibe",
    tags: ["graphic", "streetwear", "bold"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_009",
        color: { name: "Washed Black", hex: "#2a2a2a" },
        images: [
          {
            url: "https://cdn.example.com/hoodie-graphic-black-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/hoodie-graphic-black-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "M", sku: "HOD-GPB-M", stock: 20, price: 69.99 },
          { size: "L", sku: "HOD-GPB-L", stock: 18, price: 69.99 },
          { size: "XL", sku: "HOD-GPB-XL", stock: 10, price: 69.99 },
        ],
      },
      {
        variantId: "var_010",
        color: { name: "Off White", hex: "#f5f5dc" },
        images: [
          {
            url: "https://cdn.example.com/hoodie-graphic-white-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/hoodie-graphic-white-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "HOD-GPW-S", stock: 15, price: 69.99 },
          { size: "M", sku: "HOD-GPW-M", stock: 25, price: 69.99 },
          { size: "L", sku: "HOD-GPW-L", stock: 12, price: 69.99 },
        ],
      },
    ],
    basePrice: 69.99,
    currency: "USD",
    discountPercent: 15,
    material: "80% Cotton, 20% Polyester",
    careInstructions: [
      "Machine wash cold inside out",
      "Do not bleach",
      "Hang dry",
    ],
    ratings: { average: 4.7, count: 142 },
    status: "active",
  },
  {
    name: "Relaxed Fit Cargo Pants",
    description:
      "Utility-inspired cargo pants with multiple pockets and a relaxed straight-leg silhouette.",
    category: "pants",
    brand: "StreetVibe",
    tags: ["cargo", "utility", "relaxed-fit"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_011",
        color: { name: "Olive Drab", hex: "#6b8e23" },
        images: [
          {
            url: "https://cdn.example.com/cargo-olive-front.jpg",
            view: "front",
          },
          { url: "https://cdn.example.com/cargo-olive-side.jpg", view: "side" },
        ],
        sizes: [
          { size: "S", sku: "PNT-CGO-S", stock: 16, price: 64.99 },
          { size: "M", sku: "PNT-CGO-M", stock: 24, price: 64.99 },
          { size: "L", sku: "PNT-CGO-L", stock: 20, price: 64.99 },
          { size: "XL", sku: "PNT-CGO-XL", stock: 8, price: 64.99 },
        ],
      },
      {
        variantId: "var_012",
        color: { name: "Khaki", hex: "#c3b091" },
        images: [
          {
            url: "https://cdn.example.com/cargo-khaki-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "M", sku: "PNT-CGK-M", stock: 18, price: 64.99 },
          { size: "L", sku: "PNT-CGK-L", stock: 14, price: 64.99 },
          { size: "XL", sku: "PNT-CGK-XL", stock: 6, price: 64.99 },
        ],
      },
    ],
    basePrice: 64.99,
    currency: "USD",
    discountPercent: 0,
    material: "100% Cotton Twill",
    careInstructions: ["Machine wash warm", "Tumble dry medium"],
    ratings: { average: 4.2, count: 97 },
    status: "active",
  },
  {
    name: "Cropped Baby Tee",
    description:
      "Fitted cropped t-shirt with a flattering cut. Ribbed neckline for a retro look.",
    category: "t-shirts",
    brand: "NovaWear",
    tags: ["cropped", "fitted", "retro"],
    gender: "female",
    variants: [
      {
        variantId: "var_013",
        color: { name: "Baby Pink", hex: "#f4c2c2" },
        images: [
          {
            url: "https://cdn.example.com/tee-cropped-pink-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/tee-cropped-pink-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "XS", sku: "TSH-CBP-XS", stock: 30, price: 29.99 },
          { size: "S", sku: "TSH-CBP-S", stock: 40, price: 29.99 },
          { size: "M", sku: "TSH-CBP-M", stock: 35, price: 29.99 },
          { size: "L", sku: "TSH-CBP-L", stock: 20, price: 29.99 },
        ],
      },
      {
        variantId: "var_014",
        color: { name: "Lavender", hex: "#b57edc" },
        images: [
          {
            url: "https://cdn.example.com/tee-cropped-lavender-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "XS", sku: "TSH-CBL-XS", stock: 25, price: 29.99 },
          { size: "S", sku: "TSH-CBL-S", stock: 30, price: 29.99 },
          { size: "M", sku: "TSH-CBL-M", stock: 28, price: 29.99 },
        ],
      },
      {
        variantId: "var_015",
        color: { name: "White", hex: "#ffffff" },
        images: [
          {
            url: "https://cdn.example.com/tee-cropped-white-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "XS", sku: "TSH-CBW-XS", stock: 35, price: 29.99 },
          { size: "S", sku: "TSH-CBW-S", stock: 50, price: 29.99 },
          { size: "M", sku: "TSH-CBW-M", stock: 40, price: 29.99 },
          { size: "L", sku: "TSH-CBW-L", stock: 22, price: 29.99 },
        ],
      },
    ],
    basePrice: 29.99,
    currency: "USD",
    discountPercent: 0,
    material: "95% Cotton, 5% Elastane",
    careInstructions: ["Machine wash cold", "Do not bleach", "Lay flat to dry"],
    ratings: { average: 4.8, count: 321 },
    status: "active",
  },
  {
    name: "Heavyweight Boxy Tee",
    description:
      "Thick 280gsm cotton tee with a boxy dropped-shoulder cut. Premium blank for layering.",
    category: "t-shirts",
    brand: "UrbanThread",
    tags: ["heavyweight", "boxy", "premium"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_016",
        color: { name: "Bone", hex: "#e3dac9" },
        images: [
          {
            url: "https://cdn.example.com/tee-boxy-bone-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/tee-boxy-bone-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "TSH-BXB-S", stock: 18, price: 39.99 },
          { size: "M", sku: "TSH-BXB-M", stock: 30, price: 39.99 },
          { size: "L", sku: "TSH-BXB-L", stock: 22, price: 39.99 },
          { size: "XL", sku: "TSH-BXB-XL", stock: 14, price: 39.99 },
        ],
      },
      {
        variantId: "var_017",
        color: { name: "Washed Black", hex: "#2a2a2a" },
        images: [
          {
            url: "https://cdn.example.com/tee-boxy-black-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "S", sku: "TSH-BXK-S", stock: 15, price: 39.99 },
          { size: "M", sku: "TSH-BXK-M", stock: 25, price: 39.99 },
          { size: "L", sku: "TSH-BXK-L", stock: 20, price: 39.99 },
        ],
      },
    ],
    basePrice: 39.99,
    currency: "USD",
    discountPercent: 0,
    material: "100% Cotton (280gsm)",
    careInstructions: ["Machine wash cold", "Tumble dry low", "Iron low heat"],
    ratings: { average: 4.5, count: 198 },
    status: "active",
  },
  {
    name: "Fleece Quarter-Zip Pullover",
    description:
      "Cozy fleece pullover with a quarter-zip front and stand-up collar.",
    category: "hoodies",
    brand: "NovaWear",
    tags: ["fleece", "pullover", "quarter-zip", "cozy"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_018",
        color: { name: "Cream", hex: "#fffdd0" },
        images: [
          {
            url: "https://cdn.example.com/fleece-qz-cream-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/fleece-qz-cream-detail.jpg",
            view: "detail",
          },
        ],
        sizes: [
          { size: "S", sku: "HOD-QZC-S", stock: 14, price: 74.99 },
          { size: "M", sku: "HOD-QZC-M", stock: 22, price: 74.99 },
          { size: "L", sku: "HOD-QZC-L", stock: 16, price: 74.99 },
          { size: "XL", sku: "HOD-QZC-XL", stock: 8, price: 74.99 },
        ],
      },
      {
        variantId: "var_019",
        color: { name: "Slate Blue", hex: "#6a7b8b" },
        images: [
          {
            url: "https://cdn.example.com/fleece-qz-blue-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "M", sku: "HOD-QZB-M", stock: 18, price: 74.99 },
          { size: "L", sku: "HOD-QZB-L", stock: 12, price: 74.99 },
          { size: "XL", sku: "HOD-QZB-XL", stock: 6, price: 74.99 },
        ],
      },
    ],
    basePrice: 74.99,
    currency: "USD",
    discountPercent: 5,
    material: "100% Recycled Polyester Fleece",
    careInstructions: ["Machine wash cold", "Do not iron", "Tumble dry low"],
    ratings: { average: 4.6, count: 104 },
    status: "active",
  },
  {
    name: "Denim Trucker Jacket",
    description:
      "Classic denim trucker jacket with a slightly cropped fit and brass button closure.",
    category: "jackets",
    brand: "StreetVibe",
    tags: ["denim", "classic", "layering"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_020",
        color: { name: "Medium Wash", hex: "#5b8fbe" },
        images: [
          {
            url: "https://cdn.example.com/denim-jacket-med-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/denim-jacket-med-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "JKT-DTM-S", stock: 10, price: 89.99 },
          { size: "M", sku: "JKT-DTM-M", stock: 16, price: 89.99 },
          { size: "L", sku: "JKT-DTM-L", stock: 12, price: 89.99 },
          { size: "XL", sku: "JKT-DTM-XL", stock: 6, price: 89.99 },
        ],
      },
      {
        variantId: "var_021",
        color: { name: "Dark Indigo", hex: "#1a1a50" },
        images: [
          {
            url: "https://cdn.example.com/denim-jacket-dark-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "M", sku: "JKT-DTD-M", stock: 14, price: 89.99 },
          { size: "L", sku: "JKT-DTD-L", stock: 10, price: 89.99 },
        ],
      },
    ],
    basePrice: 89.99,
    currency: "USD",
    discountPercent: 0,
    material: "100% Cotton Denim",
    careInstructions: [
      "Machine wash cold inside out",
      "Hang dry",
      "Do not bleach",
    ],
    ratings: { average: 4.3, count: 67 },
    status: "active",
  },
  {
    name: "Ribbed Knit Beanie",
    description:
      "Soft acrylic ribbed beanie with a fold-over cuff. One size fits most.",
    category: "accessories",
    brand: "UrbanThread",
    tags: ["beanie", "winter", "accessories"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_022",
        color: { name: "Black", hex: "#000000" },
        images: [
          {
            url: "https://cdn.example.com/beanie-black-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "One Size", sku: "ACC-BNB-OS", stock: 80, price: 19.99 },
        ],
      },
      {
        variantId: "var_023",
        color: { name: "Burgundy", hex: "#800020" },
        images: [
          {
            url: "https://cdn.example.com/beanie-burgundy-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "One Size", sku: "ACC-BNR-OS", stock: 50, price: 19.99 },
        ],
      },
      {
        variantId: "var_024",
        color: { name: "Oatmeal", hex: "#d2c6a5" },
        images: [
          {
            url: "https://cdn.example.com/beanie-oatmeal-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "One Size", sku: "ACC-BNO-OS", stock: 45, price: 19.99 },
        ],
      },
    ],
    basePrice: 19.99,
    currency: "USD",
    discountPercent: 0,
    material: "100% Acrylic",
    careInstructions: ["Hand wash cold", "Lay flat to dry"],
    ratings: { average: 4.4, count: 289 },
    status: "active",
  },
  {
    name: "Puffer Vest",
    description:
      "Insulated puffer vest with a water-repellent shell. Ideal for layering in transitional weather.",
    category: "jackets",
    brand: "NovaWear",
    tags: ["puffer", "vest", "insulated", "layering"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_025",
        color: { name: "Matte Black", hex: "#1c1c1c" },
        images: [
          {
            url: "https://cdn.example.com/puffer-vest-black-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/puffer-vest-black-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "JKT-PVB-S", stock: 12, price: 84.99 },
          { size: "M", sku: "JKT-PVB-M", stock: 18, price: 84.99 },
          { size: "L", sku: "JKT-PVB-L", stock: 14, price: 84.99 },
          { size: "XL", sku: "JKT-PVB-XL", stock: 7, price: 84.99 },
        ],
      },
      {
        variantId: "var_026",
        color: { name: "Sage", hex: "#9caf88" },
        images: [
          {
            url: "https://cdn.example.com/puffer-vest-sage-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "M", sku: "JKT-PVS-M", stock: 10, price: 84.99 },
          { size: "L", sku: "JKT-PVS-L", stock: 8, price: 84.99 },
        ],
      },
    ],
    basePrice: 84.99,
    currency: "USD",
    discountPercent: 20,
    material: "Shell: 100% Nylon, Fill: Recycled Polyester",
    careInstructions: [
      "Machine wash cold gentle cycle",
      "Tumble dry low with tennis balls",
    ],
    ratings: { average: 4.1, count: 53 },
    status: "active",
  },
  {
    name: "Acid Wash Vintage Tee",
    description:
      "Vintage-inspired acid wash tee with a distressed finish and relaxed fit.",
    category: "t-shirts",
    brand: "StreetVibe",
    tags: ["vintage", "acid-wash", "distressed"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_027",
        color: { name: "Faded Black", hex: "#3b3b3b" },
        images: [
          {
            url: "https://cdn.example.com/tee-acid-black-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/tee-acid-black-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "TSH-ACB-S", stock: 20, price: 34.99 },
          { size: "M", sku: "TSH-ACB-M", stock: 30, price: 34.99 },
          { size: "L", sku: "TSH-ACB-L", stock: 22, price: 34.99 },
          { size: "XL", sku: "TSH-ACB-XL", stock: 12, price: 34.99 },
        ],
      },
      {
        variantId: "var_028",
        color: { name: "Faded Blue", hex: "#6e8ca0" },
        images: [
          {
            url: "https://cdn.example.com/tee-acid-blue-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "M", sku: "TSH-ACL-M", stock: 18, price: 34.99 },
          { size: "L", sku: "TSH-ACL-L", stock: 15, price: 34.99 },
        ],
      },
    ],
    basePrice: 34.99,
    currency: "USD",
    discountPercent: 0,
    material: "100% Cotton",
    careInstructions: [
      "Machine wash cold inside out",
      "Do not bleach",
      "Hang dry",
    ],
    ratings: { average: 4.4, count: 115 },
    status: "active",
  },
  {
    name: "Wide Leg Linen Trousers",
    description:
      "Breathable linen trousers with an elastic waistband and flowing wide-leg cut.",
    category: "pants",
    brand: "NovaWear",
    tags: ["linen", "wide-leg", "summer", "breathable"],
    gender: "female",
    variants: [
      {
        variantId: "var_029",
        color: { name: "Natural", hex: "#e8dcc8" },
        images: [
          {
            url: "https://cdn.example.com/linen-trouser-natural-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/linen-trouser-natural-side.jpg",
            view: "side",
          },
        ],
        sizes: [
          { size: "XS", sku: "PNT-LWN-XS", stock: 14, price: 54.99 },
          { size: "S", sku: "PNT-LWN-S", stock: 22, price: 54.99 },
          { size: "M", sku: "PNT-LWN-M", stock: 28, price: 54.99 },
          { size: "L", sku: "PNT-LWN-L", stock: 16, price: 54.99 },
        ],
      },
      {
        variantId: "var_030",
        color: { name: "Terracotta", hex: "#c66b3d" },
        images: [
          {
            url: "https://cdn.example.com/linen-trouser-terra-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "S", sku: "PNT-LWT-S", stock: 18, price: 54.99 },
          { size: "M", sku: "PNT-LWT-M", stock: 20, price: 54.99 },
          { size: "L", sku: "PNT-LWT-L", stock: 10, price: 54.99 },
        ],
      },
    ],
    basePrice: 54.99,
    currency: "USD",
    discountPercent: 0,
    material: "100% Linen",
    careInstructions: [
      "Hand wash cold",
      "Iron on medium heat",
      "Do not tumble dry",
    ],
    ratings: { average: 4.6, count: 78 },
    status: "active",
  },
  {
    name: "Oversized Striped Rugby Shirt",
    description:
      "Retro-inspired rugby shirt with contrast collar and bold horizontal stripes.",
    category: "t-shirts",
    brand: "StreetVibe",
    tags: ["rugby", "striped", "retro", "oversized"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_031",
        color: { name: "Navy/White", hex: "#1b2a4a" },
        images: [
          {
            url: "https://cdn.example.com/rugby-navywhite-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/rugby-navywhite-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "TSH-RGN-S", stock: 12, price: 54.99 },
          { size: "M", sku: "TSH-RGN-M", stock: 20, price: 54.99 },
          { size: "L", sku: "TSH-RGN-L", stock: 16, price: 54.99 },
          { size: "XL", sku: "TSH-RGN-XL", stock: 8, price: 54.99 },
        ],
      },
      {
        variantId: "var_032",
        color: { name: "Green/Cream", hex: "#355e3b" },
        images: [
          {
            url: "https://cdn.example.com/rugby-greencream-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "M", sku: "TSH-RGG-M", stock: 14, price: 54.99 },
          { size: "L", sku: "TSH-RGG-L", stock: 10, price: 54.99 },
        ],
      },
    ],
    basePrice: 54.99,
    currency: "USD",
    discountPercent: 0,
    material: "100% Heavy Cotton Jersey",
    careInstructions: ["Machine wash cold", "Tumble dry low"],
    ratings: { average: 4.3, count: 62 },
    status: "active",
  },
  {
    name: "Tech Fleece Zip Hoodie",
    description:
      "Modern tech fleece hoodie with full zip, bonded seams, and zippered side pockets.",
    category: "hoodies",
    brand: "UrbanThread",
    tags: ["tech-fleece", "zip-up", "modern", "performance"],
    gender: "male",
    variants: [
      {
        variantId: "var_033",
        color: { name: "Dark Grey", hex: "#404040" },
        images: [
          {
            url: "https://cdn.example.com/techfleece-grey-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/techfleece-grey-back.jpg",
            view: "back",
          },
          {
            url: "https://cdn.example.com/techfleece-grey-detail.jpg",
            view: "detail",
          },
        ],
        sizes: [
          { size: "S", sku: "HOD-TFG-S", stock: 10, price: 94.99 },
          { size: "M", sku: "HOD-TFG-M", stock: 18, price: 94.99 },
          { size: "L", sku: "HOD-TFG-L", stock: 14, price: 94.99 },
          { size: "XL", sku: "HOD-TFG-XL", stock: 8, price: 94.99 },
          { size: "XXL", sku: "HOD-TFG-XXL", stock: 4, price: 99.99 },
        ],
      },
      {
        variantId: "var_034",
        color: { name: "Black", hex: "#000000" },
        images: [
          {
            url: "https://cdn.example.com/techfleece-black-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "M", sku: "HOD-TFB-M", stock: 20, price: 94.99 },
          { size: "L", sku: "HOD-TFB-L", stock: 16, price: 94.99 },
          { size: "XL", sku: "HOD-TFB-XL", stock: 10, price: 94.99 },
        ],
      },
    ],
    basePrice: 94.99,
    currency: "USD",
    discountPercent: 0,
    sizeGuide: {
      unit: "cm",
      chart: [
        { size: "S", chest: 94, length: 66 },
        { size: "M", chest: 100, length: 69 },
        { size: "L", chest: 106, length: 72 },
        { size: "XL", chest: 112, length: 75 },
        { size: "XXL", chest: 118, length: 78 },
      ],
    },
    material: "66% Cotton, 34% Polyester (Tech Fleece)",
    careInstructions: ["Machine wash cold", "Do not bleach", "Tumble dry low"],
    ratings: { average: 4.8, count: 156 },
    status: "active",
  },
  {
    name: "Corduroy Overshirt",
    description:
      "Textured corduroy overshirt that works as a light jacket or heavy shirt layer.",
    category: "jackets",
    brand: "NovaWear",
    tags: ["corduroy", "overshirt", "layering", "textured"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_035",
        color: { name: "Tan", hex: "#d2b48c" },
        images: [
          {
            url: "https://cdn.example.com/corduroy-tan-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/corduroy-tan-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "JKT-CRT-S", stock: 10, price: 69.99 },
          { size: "M", sku: "JKT-CRT-M", stock: 16, price: 69.99 },
          { size: "L", sku: "JKT-CRT-L", stock: 12, price: 69.99 },
          { size: "XL", sku: "JKT-CRT-XL", stock: 6, price: 69.99 },
        ],
      },
      {
        variantId: "var_036",
        color: { name: "Rust", hex: "#b7410e" },
        images: [
          {
            url: "https://cdn.example.com/corduroy-rust-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "S", sku: "JKT-CRR-S", stock: 8, price: 69.99 },
          { size: "M", sku: "JKT-CRR-M", stock: 14, price: 69.99 },
          { size: "L", sku: "JKT-CRR-L", stock: 10, price: 69.99 },
        ],
      },
    ],
    basePrice: 69.99,
    currency: "USD",
    discountPercent: 10,
    material: "100% Cotton Corduroy",
    careInstructions: ["Machine wash cold", "Hang dry", "Iron on low heat"],
    ratings: { average: 4.5, count: 88 },
    status: "active",
  },
  {
    name: "Athletic Shorts",
    description:
      "Quick-dry athletic shorts with built-in mesh liner and side zip pockets.",
    category: "shorts",
    brand: "UrbanThread",
    tags: ["athletic", "quick-dry", "sport", "training"],
    gender: "male",
    variants: [
      {
        variantId: "var_037",
        color: { name: "Black", hex: "#000000" },
        images: [
          {
            url: "https://cdn.example.com/shorts-athletic-black-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/shorts-athletic-black-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "SHR-ATB-S", stock: 25, price: 34.99 },
          { size: "M", sku: "SHR-ATB-M", stock: 35, price: 34.99 },
          { size: "L", sku: "SHR-ATB-L", stock: 28, price: 34.99 },
          { size: "XL", sku: "SHR-ATB-XL", stock: 15, price: 34.99 },
        ],
      },
      {
        variantId: "var_038",
        color: { name: "Navy", hex: "#1b2a4a" },
        images: [
          {
            url: "https://cdn.example.com/shorts-athletic-navy-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "S", sku: "SHR-ATN-S", stock: 20, price: 34.99 },
          { size: "M", sku: "SHR-ATN-M", stock: 30, price: 34.99 },
          { size: "L", sku: "SHR-ATN-L", stock: 22, price: 34.99 },
        ],
      },
    ],
    basePrice: 34.99,
    currency: "USD",
    discountPercent: 0,
    material: "92% Polyester, 8% Spandex",
    careInstructions: [
      "Machine wash cold",
      "Do not use fabric softener",
      "Hang dry",
    ],
    ratings: { average: 4.2, count: 203 },
    status: "active",
  },
  {
    name: "Mock Neck Long Sleeve Top",
    description:
      "Sleek mock neck top in a stretchy ribbed knit. Perfect for layering or wearing solo.",
    category: "t-shirts",
    brand: "NovaWear",
    tags: ["mock-neck", "long-sleeve", "ribbed", "minimal"],
    gender: "female",
    variants: [
      {
        variantId: "var_039",
        color: { name: "Espresso", hex: "#3c2415" },
        images: [
          {
            url: "https://cdn.example.com/mockneck-espresso-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/mockneck-espresso-side.jpg",
            view: "side",
          },
        ],
        sizes: [
          { size: "XS", sku: "TSH-MNE-XS", stock: 16, price: 36.99 },
          { size: "S", sku: "TSH-MNE-S", stock: 24, price: 36.99 },
          { size: "M", sku: "TSH-MNE-M", stock: 30, price: 36.99 },
          { size: "L", sku: "TSH-MNE-L", stock: 18, price: 36.99 },
        ],
      },
      {
        variantId: "var_040",
        color: { name: "Ivory", hex: "#fffff0" },
        images: [
          {
            url: "https://cdn.example.com/mockneck-ivory-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "XS", sku: "TSH-MNI-XS", stock: 20, price: 36.99 },
          { size: "S", sku: "TSH-MNI-S", stock: 28, price: 36.99 },
          { size: "M", sku: "TSH-MNI-M", stock: 25, price: 36.99 },
        ],
      },
      {
        variantId: "var_041",
        color: { name: "Black", hex: "#000000" },
        images: [
          {
            url: "https://cdn.example.com/mockneck-black-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "XS", sku: "TSH-MNK-XS", stock: 22, price: 36.99 },
          { size: "S", sku: "TSH-MNK-S", stock: 30, price: 36.99 },
          { size: "M", sku: "TSH-MNK-M", stock: 28, price: 36.99 },
          { size: "L", sku: "TSH-MNK-L", stock: 15, price: 36.99 },
        ],
      },
    ],
    basePrice: 36.99,
    currency: "USD",
    discountPercent: 0,
    material: "95% Modal, 5% Elastane",
    careInstructions: ["Machine wash cold", "Do not bleach", "Lay flat to dry"],
    ratings: { average: 4.7, count: 134 },
    status: "active",
  },
  {
    name: "Canvas Tote Bag",
    description:
      "Durable heavyweight canvas tote with reinforced stitching and internal zip pocket.",
    category: "accessories",
    brand: "StreetVibe",
    tags: ["tote", "canvas", "everyday", "accessories"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_042",
        color: { name: "Natural", hex: "#e8dcc8" },
        images: [
          {
            url: "https://cdn.example.com/tote-natural-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/tote-natural-detail.jpg",
            view: "detail",
          },
        ],
        sizes: [
          { size: "One Size", sku: "ACC-TNT-OS", stock: 60, price: 27.99 },
        ],
      },
      {
        variantId: "var_043",
        color: { name: "Washed Black", hex: "#2a2a2a" },
        images: [
          {
            url: "https://cdn.example.com/tote-black-front.jpg",
            view: "front",
          },
        ],
        sizes: [
          { size: "One Size", sku: "ACC-TBK-OS", stock: 45, price: 27.99 },
        ],
      },
    ],
    basePrice: 27.99,
    currency: "USD",
    discountPercent: 0,
    material: "16oz 100% Cotton Canvas",
    careInstructions: ["Spot clean only", "Air dry"],
    ratings: { average: 4.5, count: 176 },
    status: "active",
  },
];

const seedProducts = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("MONGO_URI is not defined in .env");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("Connected to database");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    const created = await Product.insertMany(products);
    console.log(`Successfully seeded ${created.length} products`);

    await mongoose.disconnect();
    console.log("Disconnected from database");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedProducts();
