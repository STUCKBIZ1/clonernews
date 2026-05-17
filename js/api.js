const fetchJSON = (url) => {
    if (pending[url]) return pending[url];
    pending[url] = fetch(url)
        .then((r) => r.json())
        .finally(() => delete pending[url]);
    return pending[url];
};

const fetchItem = async (id) => {
    if (cache[id]) return cache[id];
    const url = `${API}/item/${id}.json`;
    const item = await fetchJSON(url);
    return (cache[id] = item);
};

const fetchItems = (ids) => Promise.all(ids.map(fetchItem));

const fetchFeedIDs = (name) => {
    const url = `${API}/${name}.json`;
    return fetchJSON(url);
};

const timeAgo = (unix) => {
    const sec = Math.floor((Date.now() - unix * 1000) / 1000);
    if (sec < 60) return `${sec}s ago`;
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
    return `${Math.floor(sec / 86400)}d ago`;
};
