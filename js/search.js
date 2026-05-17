function doSearch() {
  const q = document.getElementById("search-input").value.toLowerCase().trim();
  if (!q) return;

  // ค้นหาใน section, card, t-card ทุกประเภท
  const targets = document.querySelectorAll(
    "section[id], .lesson-card, .t-card, .vocab-card, .dl-card, .ex-card"
  );

  let firstMatch = null;

  targets.forEach((el) => {
    if (el.textContent.toLowerCase().includes(q)) {
      if (!firstMatch) firstMatch = el;
    }
  });

  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    alert("No results found for: " + q);
  }
}