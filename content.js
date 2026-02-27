function filterVideos() {

  try {

    chrome.storage.sync.get(["keywords", "mode"], function(result) {

      let keywords = result.keywords || [];
      let mode = result.mode || "block";

      let videos = document.querySelectorAll(
        "ytd-video-renderer, ytd-grid-video-renderer"
      );

      videos.forEach(video => {

        let title = video.querySelector("#video-title");
        if (!title) return;

        let text = title.innerText.toLowerCase();

        keywords.forEach(word => {

          if (text.includes(word)) {

            if (mode === "block") {
              video.style.display = "none";
            } else {
              video.style.border = "3px solid yellow";
            }

          }

        });

      });

    });

  } catch (error) {
    console.log("Extension error:", error);
  }

}

setInterval(filterVideos, 2000);