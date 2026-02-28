function filterVideos() {

  try {

    chrome.storage.sync.get(["keywords", "mode"], function(result) {

      let keywords = result.keywords || [];
      let mode = result.mode || "block";

      
     let videos = document.querySelectorAll(
  "ytd-video-renderer, " +
  "ytd-grid-video-renderer, " +
  "ytd-rich-item-renderer, " +
  "ytd-compact-video-renderer, " +
  "ytd-reel-item-renderer, " +
  "ytd-reel-video-renderer, " +
  "ytd-rich-grid-media"
);

      videos.forEach(video => {

        
        video.style.display = "";
        video.style.border = "";

        
        let titleEl =
          video.querySelector("#video-title") ||
          video.querySelector("h3") ||
          video.querySelector("a#video-title");

        let titleText = titleEl ? titleEl.innerText.toLowerCase() : "";

       
        let channelEl =
          video.querySelector("#channel-name") ||
          video.querySelector("ytd-channel-name");

        let channelText = channelEl ? channelEl.innerText.toLowerCase() : "";

        
        let combinedText = titleText + " " + channelText;

        let matched = keywords.some(word =>
          combinedText.includes(word)
        );

        if (matched) {
          if (mode === "block") {
            video.style.display = "none";
          } else {
            video.style.border = "3px solid yellow";
          }
        }

      });

    });

  } catch (error) {
    console.log("Extension error:", error);
  }

}

// Run once
filterVideos();

const observer = new MutationObserver(() => {

  requestAnimationFrame(() => {
    filterVideos();
  });

});

observer.observe(document.body, {
  childList: true,
  subtree: true
});