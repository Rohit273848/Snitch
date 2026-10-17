import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from Backend root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI not found in environment variables.");
    process.exit(1);
}

const SEED_PRODUCTS = [
    {
        title: "The Field Overshirt",
        description: "Spun from 100% textured organic cotton with durable dual-needle construction, reinforced button placket, and functional chest bellows pockets. Built for versatile transitional layering across brisk climates.",
        category: "shirt",
        gender: "mens",
        price: { amount: 2490, currency: "INR" },
        images: [
            {
                url: "/editorial/overshirt_olive_piece.jpg",
                fileId: "",
                color: "Muted Olive",
                isCover: true,
            },
        ],
        attributeKeys: ["Color", "Size"],
        variants: [
            { attributes: { Color: "Muted Olive", Size: "S" }, stock: 8, price: { amount: 2490, currency: "INR" }, images: [] },
            { attributes: { Color: "Muted Olive", Size: "M" }, stock: 15, price: { amount: 2490, currency: "INR" }, images: [] },
            { attributes: { Color: "Muted Olive", Size: "L" }, stock: 12, price: { amount: 2490, currency: "INR" }, images: [] },
            { attributes: { Color: "Muted Olive", Size: "XL" }, stock: 6, price: { amount: 2490, currency: "INR" }, images: [] },
        ],
    },
    {
        title: "Heavyweight Supima Tee",
        description: "Cut from 280 GSM combed Supima jersey cotton. Features a dense ribbed micro-collar that retains its clean structure wash after wash, with dropped shoulder tailoring and tactile drape.",
        category: "tshirt",
        gender: "mens",
        price: { amount: 1290, currency: "INR" },
        images: [
            {
                url: "/editorial/supima_tee_piece.jpg",
                fileId: "",
                color: "Chalk White",
                isCover: true,
            },
        ],
        attributeKeys: ["Color", "Size"],
        variants: [
            { attributes: { Color: "Chalk White", Size: "S" }, stock: 10, price: { amount: 1290, currency: "INR" }, images: [] },
            { attributes: { Color: "Chalk White", Size: "M" }, stock: 20, price: { amount: 1290, currency: "INR" }, images: [] },
            { attributes: { Color: "Chalk White", Size: "L" }, stock: 18, price: { amount: 1290, currency: "INR" }, images: [] },
            { attributes: { Color: "Chalk White", Size: "XL" }, stock: 8, price: { amount: 1290, currency: "INR" }, images: [] },
        ],
    },
    {
        title: "Relaxed Pleated Trouser",
        description: "Tailored from Italian Super 120s wool blend with classic double inward pleats, extended tab closure, and concealed side adjusters. Includes complimentary bespoke hemming and cuffing.",
        category: "trouser",
        gender: "mens",
        price: { amount: 2890, currency: "INR" },
        images: [
            {
                url: "/editorial/pleated_trouser_piece.jpg",
                fileId: "",
                color: "Deep Charcoal",
                isCover: true,
            },
            {
                url: "/editorial/trouser_cuff_detail.jpg",
                fileId: "",
                color: "Deep Charcoal",
                isCover: false,
            },
        ],
        attributeKeys: ["Color", "Size"],
        variants: [
            { attributes: { Color: "Deep Charcoal", Size: "30" }, stock: 6, price: { amount: 2890, currency: "INR" }, images: [] },
            { attributes: { Color: "Deep Charcoal", Size: "32" }, stock: 14, price: { amount: 2890, currency: "INR" }, images: [] },
            { attributes: { Color: "Deep Charcoal", Size: "34" }, stock: 10, price: { amount: 2890, currency: "INR" }, images: [] },
            { attributes: { Color: "Deep Charcoal", Size: "36" }, stock: 5, price: { amount: 2890, currency: "INR" }, images: [] },
        ],
    },
    {
        title: "Dark Purple Slim Fit Shirt",
        description: "Premium washed cotton slim fit shirt with structured spread collar and rounded cuffs. Engineered for evening gatherings and sharp streetwear aesthetics.",
        category: "shirt",
        gender: "mens",
        price: { amount: 1190, currency: "INR" },
        images: [
            {
                url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
                fileId: "",
                color: "Purple",
                isCover: true,
            },
        ],
        attributeKeys: ["Color", "Size"],
        variants: [
            { attributes: { Color: "Purple", Size: "S" }, stock: 10, price: { amount: 1190, currency: "INR" }, images: [] },
            { attributes: { Color: "Purple", Size: "M" }, stock: 15, price: { amount: 1190, currency: "INR" }, images: [] },
            { attributes: { Color: "Purple", Size: "L" }, stock: 8, price: { amount: 1190, currency: "INR" }, images: [] },
            { attributes: { Color: "Purple", Size: "XL" }, stock: 0, price: { amount: 1190, currency: "INR" }, images: [] },
            { attributes: { Color: "Black", Size: "M" }, stock: 6, price: { amount: 1190, currency: "INR" }, images: [] },
        ],
    },
    {
        title: "Regular Fit Washed Jeans",
        description: "Classic five-pocket vintage blue denim with subtle fading, reinforced copper rivets, and a durable heavyweight weave.",
        category: "jeans",
        gender: "mens",
        price: { amount: 1899, currency: "INR" },
        images: [
            {
                url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
                fileId: "",
                color: "Blue",
                isCover: true,
            },
        ],
        attributeKeys: ["Color", "Size"],
        variants: [
            { attributes: { Color: "Blue", Size: "28" }, stock: 5, price: { amount: 1899, currency: "INR" }, images: [] },
            { attributes: { Color: "Blue", Size: "30" }, stock: 12, price: { amount: 1899, currency: "INR" }, images: [] },
            { attributes: { Color: "Blue", Size: "32" }, stock: 18, price: { amount: 1899, currency: "INR" }, images: [] },
            { attributes: { Color: "Blue", Size: "34" }, stock: 10, price: { amount: 1899, currency: "INR" }, images: [] },
        ],
    },
    {
        title: "Relaxed Fit Washed Jeans",
        description: "Charcoal dark-wash relaxed denim cut loose through the thigh with gentle taper. Finished with vintage whiskering.",
        category: "jeans",
        gender: "mens",
        price: { amount: 1990, currency: "INR" },
        images: [
            {
                url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
                fileId: "",
                color: "Charcoal",
                isCover: true,
            },
        ],
        attributeKeys: ["Color", "Size"],
        variants: [
            { attributes: { Color: "Charcoal", Size: "30" }, stock: 8, price: { amount: 1990, currency: "INR" }, images: [] },
            { attributes: { Color: "Charcoal", Size: "32" }, stock: 14, price: { amount: 1990, currency: "INR" }, images: [] },
            { attributes: { Color: "Charcoal", Size: "34" }, stock: 4, price: { amount: 1990, currency: "INR" }, images: [] },
        ],
    },
    {
        title: "Straight Fit Stretch Jeans",
        description: "Versatile beige/ecru straight leg stretch denim engineered for all-day comfort with natural mineral wash.",
        category: "jeans",
        gender: "mens",
        price: { amount: 1499, currency: "INR" },
        images: [
            {
                url: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80",
                fileId: "",
                color: "Beige",
                isCover: true,
            },
        ],
        attributeKeys: ["Color", "Size"],
        variants: [
            { attributes: { Color: "Beige", Size: "30" }, stock: 9, price: { amount: 1499, currency: "INR" }, images: [] },
            { attributes: { Color: "Beige", Size: "32" }, stock: 15, price: { amount: 1499, currency: "INR" }, images: [] },
        ],
    },
    {
        title: "Straight Fit Washed Jeans",
        description: "Medium vintage wash straight jeans with natural fading and soft hand feel.",
        category: "jeans",
        gender: "mens",
        price: { amount: 1690, currency: "INR" },
        images: [
            {
                url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
                fileId: "",
                color: "Blue",
                isCover: true,
            },
        ],
        attributeKeys: ["Color", "Size"],
        variants: [
            { attributes: { Color: "Blue", Size: "30" }, stock: 10, price: { amount: 1690, currency: "INR" }, images: [] },
            { attributes: { Color: "Blue", Size: "32" }, stock: 12, price: { amount: 1690, currency: "INR" }, images: [] },
        ],
    },
    {
        title: "Pleated Olive Dress Trousers",
        description: "Tailored smart-casual olive trousers with double front pleats and side adjusters.",
        category: "trouser",
        gender: "mens",
        price: { amount: 2299, currency: "INR" },
        images: [
            {
                url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
                fileId: "",
                color: "Olive",
                isCover: true,
            },
        ],
        attributeKeys: ["Color", "Size"],
        variants: [
            { attributes: { Color: "Olive", Size: "30" }, stock: 6, price: { amount: 2299, currency: "INR" }, images: [] },
            { attributes: { Color: "Olive", Size: "32" }, stock: 14, price: { amount: 2299, currency: "INR" }, images: [] },
        ],
    },
    {
        title: "Vintage Mocha Heavyweight T-Shirt",
        description: "240 GSM combed cotton drop-shoulder streetwear tee with ribbed neckline.",
        category: "tshirt",
        gender: "mens",
        price: { amount: 999, currency: "INR" },
        images: [
            {
                url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
                fileId: "",
                color: "Mocha Brown",
                isCover: true,
            },
        ],
        attributeKeys: ["Color", "Size"],
        variants: [
            { attributes: { Color: "Mocha Brown", Size: "S" }, stock: 12, price: { amount: 999, currency: "INR" }, images: [] },
            { attributes: { Color: "Mocha Brown", Size: "M" }, stock: 20, price: { amount: 999, currency: "INR" }, images: [] },
            { attributes: { Color: "Mocha Brown", Size: "L" }, stock: 15, price: { amount: 999, currency: "INR" }, images: [] },
        ],
    },
    {
        title: "Tactical Relaxed Cargo Pants",
        description: "Multi-pocket durable cotton ripstop cargo pants with drawstring cuff toggles.",
        category: "cargo",
        gender: "mens",
        price: { amount: 2499, currency: "INR" },
        images: [
            {
                url: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80",
                fileId: "",
                color: "Olive",
                isCover: true,
            },
        ],
        attributeKeys: ["Color", "Size"],
        variants: [
            { attributes: { Color: "Olive", Size: "30" }, stock: 8, price: { amount: 2499, currency: "INR" }, images: [] },
            { attributes: { Color: "Olive", Size: "32" }, stock: 12, price: { amount: 2499, currency: "INR" }, images: [] },
        ],
    },
    {
        title: "Cropped Linen Resort Shirt",
        description: "Airy relaxed cropped silhouette with breathable natural linen weave.",
        category: "shirt",
        gender: "girls",
        price: { amount: 1090, currency: "INR" },
        images: [
            {
                url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
                fileId: "",
                color: "Chalk White",
                isCover: true,
            },
        ],
        attributeKeys: ["Color", "Size"],
        variants: [
            { attributes: { Color: "Chalk White", Size: "S" }, stock: 10, price: { amount: 1090, currency: "INR" }, images: [] },
            { attributes: { Color: "Chalk White", Size: "M" }, stock: 14, price: { amount: 1090, currency: "INR" }, images: [] },
        ],
    },
];

async function seed() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB successfully.");

        // 1. Resolve or create seller
        let seller = await userModel.findOne({ role: "seller" });
        if (!seller) {
            console.log("No seller found. Creating default 'Velmora Atelier' seller account...");
            seller = await userModel.create({
                email: "atelier@velmora.co",
                password: "VelmoraAtelier2026!",
                fullname: "Velmora Atelier",
                contact: "+91 9876543210",
                role: "seller",
            });
            console.log(`Created default seller: ${seller.fullname} (${seller.email}) - ID: ${seller._id}`);
        } else {
            console.log(`Using existing seller: ${seller.fullname} (${seller.email}) - ID: ${seller._id}`);
        }

        // 2. Insert or update products
        let createdCount = 0;
        let updatedCount = 0;

        for (const item of SEED_PRODUCTS) {
            const existing = await productModel.findOne({ title: item.title });

            const productData = {
                title: item.title,
                description: item.description,
                category: item.category,
                gender: item.gender,
                seller: seller._id,
                price: item.price,
                images: item.images,
                attributeKeys: item.attributeKeys,
                variants: item.variants,
            };

            if (existing) {
                await productModel.findByIdAndUpdate(existing._id, productData, { new: true });
                updatedCount++;
                console.log(`Updated product: "${item.title}" [${item.category}]`);
            } else {
                await productModel.create(productData);
                createdCount++;
                console.log(`Created product: "${item.title}" [${item.category}]`);
            }
        }

        console.log("\n==============================================");
        console.log(`Seeding complete! Created: ${createdCount}, Updated: ${updatedCount}, Total: ${SEED_PRODUCTS.length}`);
        console.log("==============================================\n");

        await mongoose.disconnect();
        console.log("MongoDB disconnected cleanly.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
}

seed();
