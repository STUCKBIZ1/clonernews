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

const prependItems = async (ids) => {
    const items = await fetchItems(ids);
    state.allIDs = [...ids, ...state.allIDs];
    state.loadedCount += ids.length;

    items
        .filter((i) => i && !i.deleted && !i.dead)
        .sort((a, b) => b.time - a.time)
        .forEach((item) =>
            ui.postList.insertBefore(buildCard(item), ui.postList.firstChild),
        );
};


setInterval(checkLive, POLL_INTERVAL);
