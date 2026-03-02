document.addEventListener("DOMContentLoaded", () => {

const saveBtn = document.getElementById("saveBtn");

const keywordInput = document.getElementById("keywordInput");

const keywordList = document.getElementById("keywordList");

const modeSelect = document.getElementById("modeSelect");

if (!saveBtn || !keywordInput || !keywordList || !modeSelect) {

console.error("Popup elements not found.");

return;

}

// ==========================================

// 🔄 LOAD DATA FROM STORAGE

// ==========================================

function loadData() {

chrome.storage.sync.get(["keywords", "mode"], (result) => {



  const keywords = result.keywords || [];

  const mode = result.mode || "block";



  modeSelect.value = mode;



  // Clear UI

  keywordList.innerHTML = "";



  // Render each keyword

  keywords.forEach((word, index) => {



    const li = document.createElement("li");



    li.innerHTML = `

      <span class="text">${word}</span>

      <div>

        <button class="edit">Edit</button>

        <button class="del">X</button>

      </div>

    `;



    const editBtn = li.querySelector(".edit");

    const delBtn = li.querySelector(".del");



    // ======================

    // ❌ DELETE

    // ======================

    delBtn.addEventListener("click", () => {

      const updated = keywords.filter((_, i) => i !== index);

      chrome.storage.sync.set({ keywords: updated }, loadData);

    });



    // ======================

    // ✏️ EDIT

    // ======================

    editBtn.addEventListener("click", () => {



      const input = document.createElement("input");

      input.value = word;

      input.style.width = "100%";



      li.innerHTML = "";

      li.appendChild(input);



      input.focus();



      input.addEventListener("blur", saveEdit);

      input.addEventListener("keydown", (e) => {

        if (e.key === "Enter") saveEdit();

      });



      function saveEdit() {

        const newValue = input.value.trim().toLowerCase();



        if (!newValue) {

          loadData();

          return;

        }



        chrome.storage.sync.get(["keywords"], (res) => {



          let updatedKeywords = res.keywords || [];



          if (!updatedKeywords.includes(newValue)) {

            updatedKeywords[index] = newValue;

          }



          chrome.storage.sync.set(

            { keywords: updatedKeywords },

            loadData

          );



        });



      }



    });



    keywordList.appendChild(li);



  });



});

}

// ==========================================

// ➕ ADD KEYWORD

// ==========================================

saveBtn.addEventListener("click", () => {

const keyword = keywordInput.value.trim().toLowerCase();

if (!keyword) return;



chrome.storage.sync.get(["keywords"], (result) => {



  let keywords = result.keywords || [];



  if (!keywords.includes(keyword)) {

    keywords.push(keyword);



    chrome.storage.sync.set(

      { keywords },

      loadData

    );

  }



});



keywordInput.value = "";

});

// ==========================================

// 🔁 MODE CHANGE

// ==========================================

modeSelect.addEventListener("change", () => {

chrome.storage.sync.set({

  mode: modeSelect.value

});

});

// Initial load

loadData();

});