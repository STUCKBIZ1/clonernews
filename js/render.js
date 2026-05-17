const badge = (type) => {
  const s = document.createElement("span");
  s.className = `badge badge-${type}`;
  s.textContent = type;
  return s;
};

const buildCard = (item) => {
  const card = document.createElement("div");
  card.className = "post-card";

  const title = document.createElement("h2");
  const link = document.createElement("a");
  link.textContent = item.title || "(untitled)";
  if (item.url) {
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener";
  }
  title.appendChild(badge(item.type));
  title.appendChild(link);
  card.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `${item.score ? "▲ " + item.score + "  " : ""}by ${item.by || "?"}  •  ${timeAgo(item.time)}`;
  card.appendChild(meta);

  if (item.text) {
    const body = document.createElement("div");
    body.style.cssText = "font-size: 0.82rem; margin-bottom: 6px;";
    body.innerHTML = item.text;
    card.appendChild(body);
  }

  if (item.type === "poll" && item.parts?.length) {
    const wrap = document.createElement("div");
    wrap.className = "poll-options";
    wrap.textContent = "Loading options…";
    card.appendChild(wrap);
    fetchItems(item.parts).then((parts) => {
      wrap.textContent = "";
      parts.forEach((p) => {
        if (!p) return;
        const row = document.createElement("div");
        row.className = "poll-option";
        row.textContent = `${p.text || "?"}  — ${p.score || 0} votes`;
        wrap.appendChild(row);
      });
    });
  }

  if (item.kids?.length) {
    const btn = document.createElement("button");
    btn.className = "comments-btn";
    btn.textContent = `💬 ${item.kids.length} comment${item.kids.length !== 1 ? "s" : ""}`;

    const list = document.createElement("div");
    list.className = "comment-list";
    let loaded = false;

    btn.addEventListener("click", async () => {
      list.classList.toggle("open");
      if (!loaded) {
        loaded = true;
        list.textContent = "Loading comments…";
        const comments = await fetchItems(item.kids);
        list.textContent = "";
        comments
          .filter((c) => c && !c.deleted && !c.dead)
          .sort((a, b) => b.time - a.time)
          .forEach((c) => list.appendChild(buildComment(c)));
      }
    });

    card.appendChild(btn);
    card.appendChild(list);
  }

  return card;
};

const buildComment = (item, depth = 0) => {
  const div = document.createElement("div");
  div.className = "comment";

  const meta = document.createElement("div");
  meta.className = "comment-meta";
  meta.textContent = `${item.by || "[deleted]"}  •  ${timeAgo(item.time)}`;
  div.appendChild(meta);

  const body = document.createElement("div");
  body.innerHTML = item.text || "";
  div.appendChild(body);

  if (item.kids && depth < MAX_DEPTH) {
    fetchItems(item.kids).then((children) => {
      children
        .filter((c) => c && !c.deleted && !c.dead)
        .sort((a, b) => b.time - a.time)
        .forEach((child) => div.appendChild(buildComment(child, depth + 1)));
    });
  }

  return div;
};
