// Global config & state
const API = "https://hacker-news.firebaseio.com/v0";
const PAGE_SIZE = 20;
const POLL_INTERVAL = 5000;
const MAX_DEPTH = 2;
const DEBOUNCE_DELAY = 300;

let cache = {};
let pending = {};
let state = {
    allIDs: [],
    loadedCount: 0,
    loading: false,
    currentFeed: "topstories",
    liveNewIDs: [],
    scrollTimer: null,
    feedTimer: null,
    liveChecking: false,
};
