// LocalStorage manager for e-commerce search history

const HISTORY_KEY = "velmora_search_history";
const LEGACY_HISTORY_KEY = "snitch_search_history";
const MAX_HISTORY_ITEMS = 8;

export function getSearchHistory() {
    try {
        const stored = localStorage.getItem(HISTORY_KEY) || localStorage.getItem(LEGACY_HISTORY_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            return parsed.filter(item => typeof item === "string" && item.trim().length > 0);
        }
        return [];
    } catch (e) {
        console.error("Failed to read search history:", e);
        return [];
    }
}

export function saveSearchHistory(query) {
    if (!query || typeof query !== "string") return;
    const trimmed = query.trim();
    if (!trimmed) return;

    try {
        const current = getSearchHistory();
        // Remove duplicate if it already exists (case-insensitive check)
        const filtered = current.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
        const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error("Failed to save search history:", e);
    }
}

export function removeSearchHistoryItem(queryToRemove) {
    if (!queryToRemove) return;
    try {
        const current = getSearchHistory();
        const updated = current.filter(item => item.toLowerCase() !== queryToRemove.toLowerCase());
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error("Failed to remove search history item:", e);
    }
}

export function clearSearchHistory() {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
        console.error("Failed to clear search history:", e);
    }
}
