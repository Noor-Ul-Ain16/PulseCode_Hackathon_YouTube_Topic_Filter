document.addEventListener("DOMContentLoaded", () => {

  const saveBtn = document.getElementById("saveBtn");
  const modeSelect = document.getElementById("modeSelect");
  const keywordInput = document.getElementById("keywordInput");
  const keywordList = document.getElementById("keywordList");

  if (!saveBtn || !modeSelect || !keywordInput || !keywordList) {
    console.error("Popup elements not found. Check popup.html IDs.");
    return;
  }

  function loadKeywords() {
    chrome.storage.sync.get(["keywords", "mode"], (result) => {

      keywordList.innerHTML = "";

      const keywords = result.keywords || [];
      const mode = result.mode || "block";

      modeSelect.value = mode;

      keywords.forEach((word) => {

        const li = document.createElement("li");
        li.innerHTML = `${word} <button class="del">X</button>`;

        li.querySelector(".del").addEventListener("click", () => {
          const updated = keywords.filter(k => k !== word);
          chrome.storage.sync.set({ keywords: updated }, loadKeywords);
        });

        keywordList.appendChild(li);
      });

    });
  }

  saveBtn.addEventListener("click", () => {

    const keyword = keywordInput.value.trim().toLowerCase();
    if (!keyword) return;

    chrome.storage.sync.get(["keywords"], (result) => {

      const keywords = result.keywords || [];

      if (!keywords.includes(keyword)) {
        keywords.push(keyword);
      }

      chrome.storage.sync.set({ keywords }, loadKeywords);
    });

    keywordInput.value = "";
  });

  modeSelect.addEventListener("change", () => {
    chrome.storage.sync.set({ mode: modeSelect.value });
  });

  loadKeywords();
});