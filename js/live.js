const checkLive = async () => {
    if (state.liveChecking) return;
    state.liveChecking = true;

    try {
        const fresh = await fetchFeedIDs(state.currentFeed);
        const known = new Set(state.allIDs);
        state.liveNewIDs = fresh.filter((id) => !known.has(id));

        if (state.liveNewIDs.length) {
            ui.liveBanner.style.display = "block";
            ui.liveBanner.textContent = `🔴 ${state.liveNewIDs.length} new item${state.liveNewIDs.length !== 1 ? "s" : ""} — click to load`;
        }
    } catch (e) {
    } finally {
        state.liveChecking = false;
    }
};

ui.liveBanner.addEventListener("click", async () => {
    ui.liveBanner.style.display = "none";
    if (state.liveNewIDs.length) {
        const ids = [...state.liveNewIDs];
        const feed = state.currentFeed;
        state.liveNewIDs = [];
        await prependItems(ids, feed);
    }
});

setInterval(checkLive, POLL_INTERVAL);
