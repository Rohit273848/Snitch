// Advanced Search Engine for Velmora Atelier
// Features: Autocomplete, Product Previews, Typo Tolerance (Levenshtein), Synonyms, Natural Language Parsing, Faceted Filtering, Relevance Scoring.

// ─── SYNONYM DICTIONARY ────────────────────────────────────────────────────────
export const SYNONYM_GROUPS = [
    ["trainers", "sneakers", "shoes", "footwear", "kicks", "loafers"],
    ["trouser", "trousers", "pants", "pant", "slacks", "chinos", "bottoms"],
    ["tee", "tees", "t-shirt", "tshirt", "t shirt", "top", "undershirt"],
    ["overshirt", "shacket", "jacket", "outerwear", "coat", "layer"],
    ["shirt", "shirts", "button-down", "dress shirt", "resort shirt"],
    ["jeans", "denim", "vintage denim", "five-pocket"],
    ["cargo", "cargos", "combat", "utility"],
    ["linen", "flax", "resort wear"],
    ["wool", "super 120s", "tailored", "flannel"],
    ["cotton", "supima", "heavyweight cotton", "jersey"],
    ["formal", "suit", "pleated", "tailored", "dress"],
    ["casual", "relaxed", "everyday", "streetwear"],
    ["black", "charcoal", "dark"],
    ["white", "chalk white", "ecru", "cream", "off-white"],
    ["olive", "muted olive", "military green", "sage", "green"],
    ["purple", "dark purple", "violet", "plum"],
    ["brown", "mocha", "mocha brown", "tan", "chocolate"],
    ["blue", "washed blue", "indigo", "navy"],
    ["beige", "khaki", "ecru", "sand", "natural"]
];

// Precompute fast bidirectional synonym lookup map
const SYNONYM_MAP = new Map();
SYNONYM_GROUPS.forEach(group => {
    group.forEach(term => {
        const lower = term.toLowerCase().trim();
        const existing = SYNONYM_MAP.get(lower) || new Set();
        group.forEach(other => {
            if (other.toLowerCase().trim() !== lower) {
                existing.add(other.toLowerCase().trim());
            }
        });
        SYNONYM_MAP.set(lower, existing);
    });
});

export function getSynonyms(term) {
    if (!term) return [];
    const lower = String(term).toLowerCase().trim();
    const set = SYNONYM_MAP.get(lower);
    return set ? Array.from(set) : [];
}

// ─── LEVENSHTEIN DISTANCE FOR SPELL CORRECTION ─────────────────────────────────
export function levenshteinDistance(a, b) {
    if (!a || !b) return (a || "").length + (b || "").length;
    const s1 = a.toLowerCase();
    const s2 = b.toLowerCase();
    if (s1 === s2) return 0;

    const m = s1.length;
    const n = s2.length;
    // Swap to consume less memory
    if (m < n) return levenshteinDistance(b, a);

    let row = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) {
        let prev = i;
        for (let j = 1; j <= n; j++) {
            let val;
            if (s1[i - 1] === s2[j - 1]) {
                val = row[j - 1];
            } else {
                val = Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
            }
            row[j - 1] = prev;
            prev = val;
        }
        row[n] = prev;
    }
    return row[n];
}

// ─── CATALOG DICTIONARY BUILDER ───────────────────────────────────────────────
export function buildCatalogDictionary(products = []) {
    const dict = new Set([
        // Core apparel vocabulary
        "shirt", "overshirt", "tshirt", "t-shirt", "tee", "trouser", "trousers", "pants",
        "jeans", "denim", "cargo", "cargos", "shoes", "sneakers", "trainers", "footwear",
        "cotton", "supima", "wool", "linen", "pleated", "relaxed", "straight", "washed",
        "tactical", "vintage", "formal", "casual", "tailored", "dress", "jacket",
        // Colors
        "black", "white", "olive", "charcoal", "purple", "blue", "beige", "mocha", "brown",
        "chalk", "cream", "navy", "green", "ecru",
        // Brands & Sellers
        "velmora", "snitch", "atelier", "northline", "solly", "allen"
    ]);

    products.forEach(p => {
        if (!p) return;
        // Title words
        if (p.title) {
            p.title.split(/[\s\-_,./]+/).forEach(w => {
                const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
                if (clean.length >= 3) dict.add(clean);
            });
        }
        // Category
        if (p.category) {
            dict.add(p.category.toLowerCase().trim());
        }
        // Description keywords
        if (p.description) {
            p.description.split(/[\s\-_,./]+/).forEach(w => {
                const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
                if (clean.length >= 4 && !STOP_WORDS.has(clean)) dict.add(clean);
            });
        }
        // Colors & Attributes from images / variants
        if (Array.isArray(p.images)) {
            p.images.forEach(img => {
                if (img?.color) {
                    img.color.split(/[\s\-_,./]+/).forEach(c => {
                        const clean = c.toLowerCase().trim();
                        if (clean.length >= 3) dict.add(clean);
                    });
                }
            });
        }
        if (Array.isArray(p.variants)) {
            p.variants.forEach(v => {
                if (v?.attributes) {
                    Object.values(v.attributes).forEach(val => {
                        const clean = String(val).toLowerCase().trim();
                        if (clean.length >= 3) dict.add(clean);
                    });
                }
            });
        }
    });

    return Array.from(dict);
}

const STOP_WORDS = new Set([
    "with", "from", "that", "this", "have", "more", "also", "into", "over", "than",
    "each", "every", "some", "such", "only", "about", "your", "them", "these", "those"
]);

// ─── SPELL CORRECTION ("DID YOU MEAN...?") ─────────────────────────────────────
export function findSpellingCorrection(rawQuery, dictionary = []) {
    if (!rawQuery || typeof rawQuery !== "string") return null;
    const cleanQuery = rawQuery.toLowerCase().trim();
    if (cleanQuery.length < 3) return null;

    const words = cleanQuery.split(/\s+/).filter(Boolean);
    let hasCorrection = false;
    const correctedWords = [];

    for (const word of words) {
        // If word is a number, size or stop word, keep as-is
        if (/^\d+$/.test(word) || STOP_WORDS.has(word) || ["s", "m", "l", "xl", "xxl"].includes(word)) {
            correctedWords.push(word);
            continue;
        }

        // Direct hit in dictionary
        if (dictionary.includes(word)) {
            correctedWords.push(word);
            continue;
        }

        // Check common intentional prefixes/terms
        let bestCandidate = null;
        let minDistance = 999;
        const maxAllowed = word.length <= 4 ? 1 : word.length <= 7 ? 2 : 3;

        for (const candidate of dictionary) {
            // Skip candidates with large length discrepancy
            if (Math.abs(candidate.length - word.length) > maxAllowed) continue;

            const dist = levenshteinDistance(word, candidate);
            if (dist <= maxAllowed && dist < minDistance) {
                minDistance = dist;
                bestCandidate = candidate;
                if (dist === 1) break; // Fast break on 1-edit distance
            }
        }

        if (bestCandidate && bestCandidate !== word) {
            correctedWords.push(bestCandidate);
            hasCorrection = true;
        } else {
            correctedWords.push(word);
        }
    }

    if (hasCorrection) {
        const corrected = correctedWords.join(" ");
        if (corrected.toLowerCase() !== cleanQuery.toLowerCase()) {
            return corrected;
        }
    }

    return null;
}

// ─── NATURAL LANGUAGE SEARCH PARSER ───────────────────────────────────────────
// Examples:
// "black shoes under $100" -> color: black, category: shoes, maxPrice: 100
// "olive shirt under 2500" -> color: olive, category: shirt, maxPrice: 2500
// "relaxed jeans size 32" -> category: jeans, size: 32, query: relaxed
// "men in stock overshirt" -> gender: mens, inStock: true, query: overshirt
export function parseNaturalLanguageQuery(rawQuery) {
    if (!rawQuery || typeof rawQuery !== "string") {
        return {
            rawQuery: "",
            residualQuery: "",
            extractedFilters: {},
            hasNaturalFilters: false,
            explanationParts: [],
        };
    }

    let query = rawQuery.toLowerCase().trim();
    const extractedFilters = {};
    const explanationParts = [];

    // 1. Price Parsing
    // "between 1000 and 2500" or "1000 to 2500" or "1000-2500"
    const betweenPriceRegex = /(?:between\s+)?(?:rs\.?|inr|\$)?\s*(\d{2,6})\s*(?:and|to|-)\s*(?:rs\.?|inr|\$)?\s*(\d{2,6})/i;
    const betweenMatch = query.match(betweenPriceRegex);
    if (betweenMatch) {
        const min = Number(betweenMatch[1]);
        const max = Number(betweenMatch[2]);
        if (!isNaN(min) && !isNaN(max) && min < max) {
            extractedFilters.minPrice = min;
            extractedFilters.maxPrice = max;
            explanationParts.push(`Price: ₹${min.toLocaleString()} – ₹${max.toLocaleString()}`);
            query = query.replace(betweenMatch[0], " ");
        }
    } else {
        // "under $100", "under 2500", "below 2000", "less than 1500", "< 2000", "max 2500", "cheaper than 2000"
        const maxPriceRegex = /(?:under|below|less\s+than|cheaper\s+than|max|<=|<)\s*(?:rs\.?|inr|\$)?\s*(\d{2,6})/i;
        const maxMatch = query.match(maxPriceRegex);
        if (maxMatch) {
            const amount = Number(maxMatch[1]);
            if (!isNaN(amount) && amount > 0) {
                extractedFilters.maxPrice = amount;
                explanationParts.push(`Under ₹${amount.toLocaleString()}`);
                query = query.replace(maxMatch[0], " ");
            }
        }

        // "above 1500", "over 2000", "more than 1500", "min 1000", ">= 1000"
        const minPriceRegex = /(?:above|over|more\s+than|min|>=|>)\s*(?:rs\.?|inr|\$)?\s*(\d{2,6})/i;
        const minMatch = query.match(minPriceRegex);
        if (minMatch) {
            const amount = Number(minMatch[1]);
            if (!isNaN(amount) && amount > 0) {
                extractedFilters.minPrice = amount;
                explanationParts.push(`Above ₹${amount.toLocaleString()}`);
                query = query.replace(minMatch[0], " ");
            }
        }
    }

    // 2. Availability Parsing ("in stock", "available", "ready to ship")
    const stockRegex = /\b(in\s+stock|available|ready\s+to\s+ship)\b/i;
    if (stockRegex.test(query)) {
        extractedFilters.inStock = true;
        explanationParts.push("In Stock");
        query = query.replace(stockRegex, " ");
    }

    // 3. Size Parsing ("size 32", "size M", "size 30", "size XL")
    const sizeRegex = /\b(?:size|sz)\s*([sml]|xl|xxl|28|30|32|34|36|38)\b/i;
    const sizeMatch = query.match(sizeRegex);
    if (sizeMatch) {
        extractedFilters.size = sizeMatch[1].toUpperCase();
        explanationParts.push(`Size: ${sizeMatch[1].toUpperCase()}`);
        query = query.replace(sizeMatch[0], " ");
    } else {
        // Isolated waist sizes like "30 waist" or "waist 32"
        const waistRegex = /\b(28|30|32|34|36|38)\s*(?:waist|in|inch)?\b/i;
        // only match if surrounded by category like pants or jeans
        if (/\b(jeans|trouser|trouser|pant|pants|cargo)\b/i.test(query)) {
            const waistMatch = query.match(waistRegex);
            if (waistMatch) {
                extractedFilters.size = waistMatch[1];
                explanationParts.push(`Size: ${waistMatch[1]}`);
                query = query.replace(waistMatch[0], " ");
            }
        }
    }

    // 4. Color Parsing
    const KNOWN_COLORS = [
        "charcoal", "olive", "white", "black", "purple", "blue", "beige",
        "mocha brown", "mocha", "brown", "cream", "ecru", "navy", "green", "grey", "gray"
    ];
    for (const color of KNOWN_COLORS) {
        const colorRegex = new RegExp(`\\b${color}\\b`, "i");
        if (colorRegex.test(query)) {
            extractedFilters.color = color;
            explanationParts.push(`Color: ${capitalize(color)}`);
            query = query.replace(colorRegex, " ");
            break;
        }
    }

    // 5. Gender Parsing
    if (/\b(men|mens|men's)\b/i.test(query)) {
        extractedFilters.gender = "mens";
        query = query.replace(/\b(men|mens|men's)\b/i, " ");
    } else if (/\b(women|womens|women's|girls|ladies)\b/i.test(query)) {
        extractedFilters.gender = "girls";
        query = query.replace(/\b(women|womens|women's|girls|ladies)\b/i, " ");
    }

    // 6. Category / Synonym Detection in Query
    const CATEGORY_MAP = {
        "shirt": ["shirt", "shirts", "button-down", "resort shirt"],
        "overshirt": ["overshirt", "shacket", "jacket", "coat"],
        "tshirt": ["tshirt", "t-shirt", "tee", "tees", "top"],
        "trouser": ["trouser", "trousers", "slacks", "chinos", "pant", "pants"],
        "jeans": ["jeans", "denim"],
        "cargo": ["cargo", "cargos", "utility pants", "combat pants"],
        "footwear": ["shoes", "sneakers", "trainers", "footwear", "kicks", "loafers"]
    };

    for (const [canonicalCat, variants] of Object.entries(CATEGORY_MAP)) {
        for (const variant of variants) {
            const catRegex = new RegExp(`\\b${variant}\\b`, "i");
            if (catRegex.test(query)) {
                extractedFilters.category = canonicalCat;
                explanationParts.push(`Category: ${capitalize(canonicalCat)}`);
                query = query.replace(catRegex, " ");
                break;
            }
        }
        if (extractedFilters.category) break;
    }

    // 7. Clean up residual text for search query
    const residual = query
        .replace(/\b(for|in|with|and|pieces?|apparel|clothing|collection)\b/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

    const hasNaturalFilters = Object.keys(extractedFilters).length > 0;

    return {
        rawQuery,
        residualQuery: residual,
        extractedFilters,
        hasNaturalFilters,
        explanationParts,
    };
}

// ─── PRODUCT METRIC HELPERS (Stock, Rating, Colors, Sizes) ────────────────────
export function getProductStock(product) {
    if (!product) return { totalStock: 0, status: "sold_out", label: "Sold Out", inStock: false };

    let totalStock = 0;
    if (Array.isArray(product.variants) && product.variants.length > 0) {
        totalStock = product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
    } else if (product.stock !== undefined) {
        totalStock = Number(product.stock) || 0;
    } else {
        totalStock = 20; // fallback sensible stock
    }

    if (totalStock <= 0) {
        return { totalStock: 0, status: "sold_out", label: "Sold Out", inStock: false };
    }
    if (totalStock <= 5) {
        return { totalStock, status: "low_stock", label: `Only ${totalStock} left`, inStock: true };
    }
    return { totalStock, status: "in_stock", label: "In Stock", inStock: true };
}

export function getProductRating(product) {
    if (!product) return { rate: 4.8, count: 42 };
    const rate = product.rating?.rate || product.ratingRate || 4.8;
    const count = product.rating?.count || product.ratingCount || 42;
    return { rate: Number(rate.toFixed(1)), count };
}

export function getProductBrand(product) {
    if (!product) return "Velmora Atelier";
    return (
        product.brand ||
        product.seller?.fullname ||
        product.seller?.name ||
        product.seller?.username ||
        "Velmora Atelier"
    );
}

export function getProductColors(product) {
    if (!product) return [];
    const colors = new Set();
    if (product.color) colors.add(String(product.color).trim());
    if (product.colorway) colors.add(String(product.colorway).trim());
    if (Array.isArray(product.images)) {
        product.images.forEach(img => {
            if (img?.color && String(img.color).trim()) {
                colors.add(String(img.color).trim());
            }
        });
    }
    if (Array.isArray(product.variants)) {
        product.variants.forEach(v => {
            if (v?.attributes) {
                const c = v.attributes.Color || v.attributes.color;
                if (c) colors.add(String(c).trim());
            }
        });
    }
    return Array.from(colors);
}

export function getProductSizes(product) {
    if (!product) return [];
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
        return product.sizes.map(s => String(s).trim().toUpperCase());
    }
    const sizes = new Set();
    if (Array.isArray(product.variants)) {
        product.variants.forEach(v => {
            if (v?.attributes) {
                const sz = v.attributes.Size || v.attributes.size;
                if (sz) sizes.add(String(sz).trim().toUpperCase());
            }
        });
    }
    return Array.from(sizes);
}

export function getProductCoverImage(product) {
    if (!product) return "";
    if (Array.isArray(product.images) && product.images.length > 0) {
        const cover = product.images.find(img => img?.isCover && img?.url);
        if (cover) return cover.url;
        const first = product.images[0];
        return typeof first === "string" ? first : first?.url || "";
    }
    return "";
}

// ─── RELEVANCE SCORING ALGORITHM ──────────────────────────────────────────────
export function scoreProductRelevance(product, rawQuery, parsedNLP = null) {
    if (!product || !rawQuery) return 1;
    const q = rawQuery.toLowerCase().trim();
    if (!q) return 1;

    let score = 0;
    const title = (product.title || "").toLowerCase();
    const desc = (product.description || "").toLowerCase();
    const category = (product.category || "").toLowerCase();
    const brand = getProductBrand(product).toLowerCase();
    const colors = (getProductColors(product) || []).map(c => (c ? String(c).toLowerCase() : ""));
    const sizes = (getProductSizes(product) || []).map(s => (s ? String(s).toLowerCase() : ""));

    // 1. Exact or Prefix Title Matches (Highest priority)
    if (title === q) {
        score += 150;
    } else if (title.startsWith(q)) {
        score += 90;
    } else if (title.includes(q)) {
        score += 60;
    }

    // 2. Token Matching
    const tokens = q.split(/\s+/).filter(Boolean);
    tokens.forEach(tok => {
        if (title.includes(tok)) score += 25;
        if (desc.includes(tok)) score += 10;
        if (category.includes(tok)) score += 30;
        if (brand.includes(tok)) score += 20;
        if (colors.some(c => c.includes(tok))) score += 25;
        if (sizes.some(s => s === tok)) score += 20;

        // Synonym expansion bonus
        const syns = getSynonyms(tok);
        syns.forEach(syn => {
            if (title.includes(syn)) score += 20;
            if (category.includes(syn)) score += 25;
            if (desc.includes(syn)) score += 8;
        });
    });

    // 3. Category match bonus
    if (parsedNLP?.extractedFilters?.category) {
        const targetCat = parsedNLP.extractedFilters.category.toLowerCase();
        if (category.includes(targetCat) || title.includes(targetCat)) {
            score += 40;
        }
    }

    // 4. Color match bonus
    if (parsedNLP?.extractedFilters?.color) {
        const targetColor = parsedNLP.extractedFilters.color.toLowerCase();
        if (colors.some(c => c.includes(targetColor)) || title.includes(targetColor)) {
            score += 35;
        }
    }

    // 5. In-stock bias (slight boost to available items)
    const stockInfo = getProductStock(product);
    if (stockInfo.inStock) {
        score += 10;
    } else {
        score -= 20; // de-prioritize sold out items in search
    }

    // 6. Rating boost
    const ratingInfo = getProductRating(product);
    score += Math.round(ratingInfo.rate * 2);

    return score;
}

// ─── CORE SEARCH FILTERING & SORTING ENGINE ───────────────────────────────────
export function filterAndSortProducts(products = [], options = {}) {
    const {
        searchQuery = "",
        category = "all",
        minPrice = null,
        maxPrice = null,
        brand = "all",
        size = "all",
        color = "all",
        rating = null,
        inStockOnly = false,
        sortBy = "relevance", // 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'title'
    } = options;

    if (!Array.isArray(products)) return [];

    // Parse natural language if search query is provided
    const parsedNLP = searchQuery.trim() ? parseNaturalLanguageQuery(searchQuery.trim()) : null;
    const effectiveSearchText = parsedNLP
        ? (parsedNLP.hasNaturalFilters ? parsedNLP.residualQuery : parsedNLP.rawQuery)
        : "";

    // Merge explicit filters with natural language extracted filters
    const filterCat = category !== "all" ? category : (parsedNLP?.extractedFilters?.category || "all");
    const filterColor = color !== "all" ? color : (parsedNLP?.extractedFilters?.color || "all");
    const filterSize = size !== "all" ? size : (parsedNLP?.extractedFilters?.size || "all");
    const filterMinPrice = minPrice !== null ? minPrice : (parsedNLP?.extractedFilters?.minPrice ?? null);
    const filterMaxPrice = maxPrice !== null ? maxPrice : (parsedNLP?.extractedFilters?.maxPrice ?? null);
    const filterInStock = inStockOnly || Boolean(parsedNLP?.extractedFilters?.inStock);

    // 1. Filter items
    let filtered = products.filter(product => {
        if (!product) return false;

        const productTitle = (product.title || "").toLowerCase();
        const productDesc = (product.description || "").toLowerCase();
        const productCat = (product.category || "").toLowerCase();
        const productBrand = getProductBrand(product).toLowerCase();
        const productColors = (getProductColors(product) || []).map(c => (c ? String(c).toLowerCase() : ""));
        const productSizes = (getProductSizes(product) || []).map(s => (s ? String(s).toLowerCase() : ""));
        const productPrice = Number(product.price?.amount || 0);
        const stockInfo = getProductStock(product);
        const ratingInfo = getProductRating(product);

        // A. Text Search Filtering (Supports multi-token + synonyms)
        if (effectiveSearchText) {
            const tokens = effectiveSearchText.toLowerCase().split(/\s+/).filter(Boolean);
            const matchesAllTokens = tokens.every(token => {
                // Check direct match across fields
                const directMatch =
                    productTitle.includes(token) ||
                    productDesc.includes(token) ||
                    productCat.includes(token) ||
                    productBrand.includes(token) ||
                    productColors.some(c => c.includes(token)) ||
                    productSizes.some(s => s === token);

                if (directMatch) return true;

                // Check synonym matches
                const syns = getSynonyms(token);
                const synonymMatch = syns.some(syn =>
                    productTitle.includes(syn) ||
                    productCat.includes(syn) ||
                    productDesc.includes(syn) ||
                    productColors.some(c => c.includes(syn))
                );

                return synonymMatch;
            });

            if (!matchesAllTokens) return false;
        }

        // B. Category Filter
        if (filterCat !== "all") {
            const catLower = filterCat.toLowerCase();
            const syns = [catLower, ...getSynonyms(catLower)];
            const matchesCategory = syns.some(c =>
                productCat.includes(c) || productTitle.includes(c)
            );
            if (!matchesCategory) return false;
        }

        // C. Color Filter
        if (filterColor !== "all") {
            const cLower = filterColor.toLowerCase();
            const colorMatches = productColors.some(c => c.includes(cLower)) ||
                productTitle.includes(cLower) ||
                productDesc.includes(cLower);
            if (!colorMatches) return false;
        }

        // D. Size Filter
        if (filterSize !== "all") {
            const szLower = filterSize.toLowerCase();
            const sizeMatches = productSizes.includes(szLower);
            if (!sizeMatches) return false;
        }

        // E. Brand Filter
        if (brand !== "all") {
            const bLower = brand.toLowerCase();
            if (!productBrand.includes(bLower)) return false;
        }

        // F. Price Bounds
        if (filterMinPrice !== null && productPrice < filterMinPrice) {
            return false;
        }
        if (filterMaxPrice !== null && productPrice > filterMaxPrice) {
            return false;
        }

        // G. Availability / In Stock
        if (filterInStock && !stockInfo.inStock) {
            return false;
        }

        // H. Rating Filter
        if (rating !== null && ratingInfo.rate < rating) {
            return false;
        }

        return true;
    });

    // 2. Score & Sort
    const scoredProducts = (filtered || []).map(p => ({
        product: p,
        relevanceScore: scoreProductRelevance(p, searchQuery, parsedNLP),
    }));

    if (sortBy === "relevance" && searchQuery.trim()) {
        scoredProducts.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else if (sortBy === "price-low") {
        scoredProducts.sort((a, b) => (a.product.price?.amount || 0) - (b.product.price?.amount || 0));
    } else if (sortBy === "price-high") {
        scoredProducts.sort((a, b) => (b.product.price?.amount || 0) - (a.product.price?.amount || 0));
    } else if (sortBy === "rating") {
        scoredProducts.sort((a, b) => getProductRating(b.product).rate - getProductRating(a.product).rate);
    } else if (sortBy === "title") {
        scoredProducts.sort((a, b) => (a.product.title || "").localeCompare(b.product.title || ""));
    } else {
        // 'newest' or default fallback
        scoredProducts.sort((a, b) => {
            const timeA = new Date(a.product.createdAt || 0).getTime();
            const timeB = new Date(b.product.createdAt || 0).getTime();
            return timeB - timeA;
        });
    }

    return (scoredProducts || []).map(sp => sp.product);
}

// ─── TEXT HIGHLIGHTING HELPER & AUTOCOMPLETE ENGINE ─────────────────────────

// ─── TEXT HIGHLIGHTING HELPER (PURE JS CHUNKS) ────────────────────────────────
export function getMatchChunks(text, query) {
    if (!text) return [];
    if (!query || typeof query !== "string" || !query.trim()) {
        return [{ text: String(text), isMatch: false }];
    }

    const trimmedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${trimmedQuery})`, "gi");
    const parts = String(text).split(regex);

    return parts
        .filter(part => part.length > 0)
        .map(part => ({
            text: part,
            isMatch: new RegExp(`^${trimmedQuery}$`, "i").test(part),
        }));
}

// ─── SAMPLE DESIGN CATALOG ITEMS (Matching Stitch Design Reference) ───────────
// These provide the visual pieces seen in the reference screenshot when previewing
export const STITCH_SAMPLE_PIECES = [
    {
        _id: "stitch-sample-1",
        title: "The Field Overshirt",
        subtitle: "Organic Heavyweight Twill · Double Flap Pockets",
        category: "overshirt",
        collectionLabel: "Velmora Atelier",
        brand: "Velmora Atelier",
        color: "Olive",
        colorway: "Olive",
        price: { amount: 385, currency: "USD" },
        images: [{ url: "/editorial/overshirt_olive_piece.jpg", isCover: true, color: "Peat Wash Olive" }],
        tag: "NEW ATELIER",
        stockStatus: "in_stock",
        stockLabel: "IN STOCK",
        stock: 18,
        rating: { rate: 4.9, count: 43 },
        sizes: ["S", "M", "L", "XL"],
        availability: "in_stock",
        isSample: true,
        description: "Heavy peat wash cotton twill engineered with dual-needle bar tacks, reinforced bellows pockets, and horn buttons.",
        createdAt: "2026-04-10T10:00:00.000Z"
    },
    {
        _id: "stitch-sample-2",
        title: "Heavy Cotton Utility Overshirt",
        subtitle: "Selvedge Japanese Twill · Horn Buttons",
        category: "overshirt",
        collectionLabel: "Velmora Essentials",
        brand: "Velmora Essentials",
        color: "Indigo",
        colorway: "Navy",
        price: { amount: 256, currency: "USD" },
        originalPrice: { amount: 320, currency: "USD" },
        discountPercent: "-20%",
        images: [{ url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80", isCover: true, color: "Deep Indigo" }],
        tag: "-20%",
        stockStatus: "in_stock",
        stockLabel: "IN STOCK",
        stock: 14,
        rating: { rate: 4.8, count: 19 },
        sizes: ["S", "M", "L"],
        availability: "in_stock",
        isSample: true,
        description: "Dense 12oz indigo rope-dyed twill. Finished with tonal stitch details and triple needle armholes.",
        createdAt: "2026-04-09T10:00:00.000Z"
    },
    {
        _id: "stitch-sample-3",
        title: "Brushed Twill Overshirt",
        subtitle: "Raw Sand · Unlined Relaxed Hem",
        category: "overshirt",
        collectionLabel: "Edition Sartorial",
        brand: "Edition Sartorial",
        color: "Cream",
        colorway: "Cream",
        price: { amount: 290, currency: "USD" },
        images: [{ url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80", isCover: true, color: "Raw Sand" }],
        tag: null,
        stockStatus: "low_stock",
        stockLabel: "ONLY 3 REMAINING",
        stock: 3,
        rating: { rate: 4.7, count: 31 },
        sizes: ["S", "M"],
        availability: "in_stock",
        isSample: true,
        description: "Peached organic cotton brushed for exceptional velvet hand feel. Straight hem with side vent gussets.",
        createdAt: "2026-04-08T10:00:00.000Z"
    },
    {
        _id: "stitch-sample-4",
        title: "Relaxed Wool-Blend Shacket",
        subtitle: "Charcoal Melange · Cashmere Infusion",
        category: "overshirt",
        collectionLabel: "Velmora Atelier",
        brand: "Velmora Atelier",
        color: "Charcoal",
        colorway: "Charcoal",
        price: { amount: 440, currency: "USD" },
        images: [{ url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80", isCover: true, color: "Charcoal Melange" }],
        tag: "NEW ATELIER",
        stockStatus: "in_stock",
        stockLabel: "IN STOCK",
        stock: 12,
        rating: { rate: 5.0, count: 8 },
        sizes: ["M", "L", "XL"],
        availability: "in_stock",
        isSample: true,
        description: "Italian melton wool infused with recycled Mongolian cashmere. Designed for effortless transitional layering.",
        createdAt: "2026-04-07T10:00:00.000Z"
    },
    {
        _id: "stitch-sample-5",
        title: "Structured Canvas Workshirt",
        subtitle: "Weathered Tobacco · Triple-Stitched",
        category: "overshirt",
        collectionLabel: "Velmora Essentials",
        brand: "Velmora Essentials",
        color: "Brown",
        colorway: "Brown",
        price: { amount: 275, currency: "USD" },
        images: [{ url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80", isCover: true, color: "Weathered Tobacco" }],
        tag: null,
        stockStatus: "in_stock",
        stockLabel: "IN STOCK",
        stock: 22,
        rating: { rate: 4.8, count: 15 },
        sizes: ["S", "M", "L"],
        availability: "in_stock",
        isSample: true,
        description: "Heritage duck canvas woven from regenerative Portuguese cotton yarn.",
        createdAt: "2026-04-06T10:00:00.000Z"
    },
    {
        _id: "stitch-sample-6",
        title: "Washed Linen-Silk Overshirt",
        subtitle: "Pale Sage · Mother of Pearl Buttons",
        category: "overshirt",
        collectionLabel: "Edition Sartorial",
        brand: "Edition Sartorial",
        color: "Olive",
        colorway: "Olive",
        price: { amount: 360, currency: "USD" },
        images: [{ url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80", isCover: true, color: "Pale Sage" }],
        tag: null,
        stockStatus: "in_stock",
        stockLabel: "IN STOCK",
        stock: 9,
        rating: { rate: 4.9, count: 27 },
        sizes: ["S", "M", "L", "XL"],
        availability: "in_stock",
        isSample: true,
        description: "Delicately blended Belgian flax and mulberry silk, aerated finish with genuine natural shell buttons.",
        createdAt: "2026-04-05T10:00:00.000Z"
    }
];

// Combine real DB products with sample design items safely
export function getUnifiedCatalog(dbProducts = []) {
    const list = Array.isArray(dbProducts) ? [...dbProducts] : [];
    
    // Always include sample design items if not already present by title
    STITCH_SAMPLE_PIECES.forEach(sample => {
        const exists = list.some(p => p.title?.toLowerCase() === sample.title.toLowerCase());
        if (!exists) {
            list.push(sample);
        }
    });

    return list;
}

// ─── AUTOCOMPLETE SUGGESTIONS GENERATOR ────────────────────────────────────────
export function getAutocompleteSuggestions(rawQuery = "", products = [], searchHistory = []) {
    const q = rawQuery.trim();
    const catalog = getUnifiedCatalog(products);
    const dictionary = buildCatalogDictionary(catalog);

    // Default recommendations when search query is empty
    if (!q) {
        const popularSearches = [
            "overshirt for men",
            "cotton overshirt",
            "field overshirt",
            "wool blend overshirt jacket",
            "relaxed pleated trouser",
            "supima heavyweight tee"
        ];

        const popularCategories = [
            { label: "Overshirts", value: "overshirt", count: countCategory(catalog, "overshirt") || 14 },
            { label: "Outerwear", value: "outerwear", count: countCategory(catalog, "outerwear") || 38 },
            { label: "Tailored Jackets", value: "jacket", count: countCategory(catalog, "jacket") || 19 },
            { label: "Trousers & Chinos", value: "trouser", count: countCategory(catalog, "trouser") || 24 },
            { label: "Denim", value: "jeans", count: countCategory(catalog, "jeans") || 18 },
        ];

        const defaultMatchingCategories = [
            { label: "OVERSHIRTS", value: "overshirt", count: countCategory(catalog, "overshirt") || 14 },
            { label: "OUTERWEAR", value: "outerwear", count: countCategory(catalog, "outerwear") || 38 },
            { label: "TAILORED JACKETS", value: "jacket", count: countCategory(catalog, "jacket") || 19 }
        ];

        const defaultSuggestedSearches = (searchHistory && searchHistory.length > 0 ? searchHistory : popularSearches).map((text, idx) => ({
            text,
            iconType: searchHistory && searchHistory.includes(text) ? "history" : (idx === 0 ? "trending" : "search"),
            type: "query",
            badge: null
        }));

        const featuredPreviews = (catalog || []).slice(0, 3).map(formatProductPreview);

        return {
            mode: "empty",
            history: Array.isArray(searchHistory) ? searchHistory.slice(0, 6) : [],
            popularSearches,
            categories: popularCategories,
            matchingCategories: defaultMatchingCategories,
            suggestedSearches: defaultSuggestedSearches.slice(0, 5),
            productPreviews: featuredPreviews,
            totalMatches: catalog.length,
            didYouMean: null,
            naturalLanguageFilter: null,
        };
    }

    // When query is non-empty:
    const parsedNLP = parseNaturalLanguageQuery(q);
    const didYouMean = findSpellingCorrection(q, dictionary);
    const lowerQ = q.toLowerCase();

    // 1. Suggested searches list (Structured with icon type matching the Stitch design)
    const suggestedSearches = [
        {
            text: `${q} for men`,
            iconType: "history",
            type: "query",
            badge: null
        },
        {
            text: `cotton ${q}`,
            iconType: "trending",
            type: "query",
            badge: null
        },
        {
            text: `field ${q}`,
            iconType: "search",
            type: "query",
            badge: null
        },
        {
            text: `wool blend ${q} jacket`,
            iconType: "search",
            type: "query",
            badge: null
        }
    ];

    // Add matching product titles if not already present
    catalog.forEach(p => {
        if (!p?.title) return;
        const titleLower = p.title.toLowerCase();
        if (titleLower.includes(lowerQ) && !suggestedSearches.some(s => s.text.toLowerCase() === titleLower)) {
            suggestedSearches.push({
                text: p.title,
                iconType: "search",
                type: "product",
                badge: p.category ? capitalize(p.category) : "Piece"
            });
        }
    });

    // 2. Matching Categories / Departments
    const matchingCategories = [
        { label: "OVERSHIRTS", value: "overshirt", count: countCategory(catalog, "overshirt") || 14 },
        { label: "OUTERWEAR", value: "outerwear", count: countCategory(catalog, "outerwear") || 38 },
        { label: "TAILORED JACKETS", value: "jacket", count: countCategory(catalog, "jacket") || 19 }
    ];

    // 3. Product Previews (Scored by relevance, exactly 3 matching items as shown in design)
    const matchingProducts = filterAndSortProducts(catalog, {
        searchQuery: q,
        sortBy: "relevance",
    });

    const productPreviews = matchingProducts.slice(0, 3).map(formatProductPreview);

    // Spell check
    let didYouMeanPayload = null;
    if (didYouMean && didYouMean.toLowerCase() !== lowerQ) {
        const correctionMatches = filterAndSortProducts(catalog, {
            searchQuery: didYouMean,
            sortBy: "relevance",
        });
        if (correctionMatches.length > 0) {
            didYouMeanPayload = {
                original: q,
                corrected: didYouMean,
                productCount: correctionMatches.length,
            };
        }
    }

    return {
        mode: "results",
        query: q,
        suggestedSearches: suggestedSearches.slice(0, 5),
        matchingCategories,
        productPreviews,
        totalMatches: matchingProducts.length,
        didYouMean: didYouMeanPayload,
        naturalLanguageFilter: parsedNLP.hasNaturalFilters ? {
            query: q,
            explanation: parsedNLP.explanationParts.join(" • "),
            extractedFilters: parsedNLP.extractedFilters
        } : null,
    };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export function formatProductPreview(product) {
    if (!product) {
        return {
            _id: "",
            title: "Editorial Piece",
            subtitle: "Atelier Cloth",
            coverImage: "",
            priceAmount: 0,
            originalAmount: null,
            currency: "₹",
            category: "Apparel",
            brand: "Velmora Atelier",
            stockStatus: "in_stock",
            stockLabel: "IN STOCK",
            inStock: true,
            ratingRate: 4.8,
            ratingCount: 12,
            tag: null,
            discountPercent: null,
            sizes: ["M", "L"],
            color: "Olive",
        };
    }

    const stockInfo = getProductStock(product);
    const ratingInfo = getProductRating(product);
    const coverImage = getProductCoverImage(product);
    const priceAmount = Number(product.price?.amount || 0);
    const originalAmount = product.originalPrice?.amount ? Number(product.originalPrice.amount) : null;
    const currency = product.price?.currency === "USD" ? "$" : "₹";
    const sizes = (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0)
        ? product.sizes
        : getProductSizes(product);

    return {
        _id: product._id,
        title: product.title || "Editorial Piece",
        subtitle: product.subtitle || (product.images?.[0]?.color ? `${product.images[0].color} · Atelier Cloth` : product.category || "Apparel"),
        coverImage,
        priceAmount,
        originalAmount,
        currency,
        category: product.category || "Apparel",
        brand: getProductBrand(product),
        stockStatus: stockInfo.status,
        stockLabel: stockInfo.label,
        inStock: stockInfo.inStock,
        ratingRate: ratingInfo.rate,
        ratingCount: ratingInfo.count,
        tag: product.tag || null,
        discountPercent: product.discountPercent || null,
        sizes: sizes || [],
        color: product.color || product.images?.[0]?.color || "Olive",
    };
}

export function countCategory(products, catName) {
    if (!Array.isArray(products)) return 0;
    const catLower = catName.toLowerCase();
    const syns = [catLower, ...getSynonyms(catLower)];
    return products.filter(p => {
        const pCat = (p.category || "").toLowerCase();
        const pTitle = (p.title || "").toLowerCase();
        return syns.some(s => pCat.includes(s) || pTitle.includes(s));
    }).length;
}

export function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

