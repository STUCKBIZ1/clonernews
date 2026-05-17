ui.tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
        ui.tabs.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        loadFeed(btn.dataset.feed);
    });
});

ui.loadMoreBtn.addEventListener("click", loadNextPage);

window.addEventListener("scroll", () => {
    if (state.scrollTimer) return;
    state.scrollTimer = setTimeout(() => {
        state.scrollTimer = null;
        if (
            window.innerHeight + window.scrollY >=
                document.body.scrollHeight - 300 &&
            !state.loading
        ) {
            loadNextPage();
        }
    }, 500);
});

loadFeed("topstories");
