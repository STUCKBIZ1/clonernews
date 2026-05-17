const loadFeed = async (feed) => {
    clearTimeout(state.feedTimer);

    state.feedTimer = setTimeout(async () => {
        state.currentFeed = feed;
        state.allIDs = [];
        state.loadedCount = 0;
        state.loading = false;
        state.liveNewIDs = [];

        ui.postList.innerHTML = '<div id="status">Loading…</div>';
        ui.loadMoreBtn.disabled = true;
        ui.liveBanner.style.display = "none";
        `  `;

        state.allIDs = (await fetchFeedIDs(feed)).sort((a, b) => b - a);
        const statusEl = document.getElementById("status");
        statusEl?.remove();
        await loadNextPage();
    }, DEBOUNCE_DELAY);
};

const loadNextPage = async () => {
    if (state.loading) return;
    state.loading = true;
    ui.loadMoreBtn.disabled = true;
    ui.loadMoreBtn.textContent = "Loading…";

    const slice = state.allIDs.slice(
        state.loadedCount,
        state.loadedCount + PAGE_SIZE,
    );

    if (!slice.length) {
        ui.loadMoreBtn.textContent = "No more posts";
        state.loading = false;
        return;
    }

    const items = await fetchItems(slice);
    const statusEl = document.getElementById("status");
    statusEl?.remove();

    items
        .filter(
            (i) =>
                i &&
                !i.deleted &&
                !i.dead &&
                (state.currentFeed !== "askstories" || i.type === "poll"),
        )
        .sort((a, b) => b.time - a.time)
        .forEach((item) => ui.postList.appendChild(buildCard(item)));

    state.loadedCount += slice.length;
    state.loading = false;
    ui.loadMoreBtn.disabled = false;
    ui.loadMoreBtn.textContent = "Load more";
};
