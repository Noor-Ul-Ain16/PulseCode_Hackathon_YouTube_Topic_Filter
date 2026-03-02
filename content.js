// ======================================================
// Safety Check
// ======================================================

if (!chrome.runtime || !chrome.runtime.id) {
    console.warn("Extension context invalidated");
}

// ======================================================
// Topic Mapping (Lightweight NLP Classifier)
// ======================================================

const topicMap = {
    politics: [
        "election","government","pm","president",
        "assembly","parliament","senate",
        "policy","minister","national"
    ],

    sports: [
        "match","football","cricket","goal",
        "tournament","league","world cup"
    ],

    entertainment: [
        "movie","trailer","celebrity",
        "drama","film","song","music"
    ],

    tech: [
        "ai","machine learning","nvidia",
        "iphone","android","gpu","coding"
    ]
};

// ======================================================
// Text Cleaning
// ======================================================

function cleanText(text){
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g,"")
        .trim();
}

// ======================================================
// Topic Detection Engine
// ======================================================

function detectTopic(text, blockedTopics){

    const cleaned = cleanText(text);

    for(let topic of blockedTopics){

        if(topicMap[topic]){

            for(let word of topicMap[topic]){
                if(cleaned.includes(word)){
                    return true;
                }
            }

        }

    }

    return false;
}

// ======================================================
// Sentiment Detection Engine
// ======================================================

function getSentimentScore(text){

    const negativeLexicon = [
        "shocking","exposed","fake","scam",
        "hate","worst","terrible","angry",
        "drama","controversy","insane",
        "crying","gone wrong","disaster",
        "lies","clickbait","must watch",
        "truth revealed","you wont believe"
    ];

    let score = 0;
    let lowerText = text.toLowerCase();

    negativeLexicon.forEach(word=>{
        if(lowerText.includes(word)){
            score++;
        }
    });

    if(text === text.toUpperCase() && text.length > 15){
        score++;
    }

    if((text.match(/!/g)||[]).length >= 2){
        score++;
    }

    return score;
}

// ======================================================
// Main Filtering Engine
// ======================================================

function filterVideos(){

    chrome.storage.sync.get(
        ["keywords","topics","mode"],
        function(result){

            let keywords = (result.keywords || []).map(k=>k.toLowerCase());
            let blockedTopics = (result.topics || []).map(t=>t.toLowerCase());
            let mode = result.mode || "block";

            const cards = document.querySelectorAll(
                "ytd-video-renderer,"+
                "ytd-grid-video-renderer,"+
                "ytd-rich-item-renderer,"+
                "ytd-compact-video-renderer,"+
                "ytd-reel-item-renderer,"+
                "ytd-reel-video-renderer"
            );

            cards.forEach(card=>{

                if(card.dataset.filtered === "true") return;
                card.dataset.filtered = "true";

                let rawText = card.innerText || "";
                let text = rawText.toLowerCase();

                card.style.display = "";
                card.style.border = "";

                let keywordMatch =
                    keywords.some(word=>text.includes(word));

                let topicMatch =
                    detectTopic(text, blockedTopics);

                let sentimentScore =
                    getSentimentScore(text);

                let hide = false;
                let highlight = false;

                // Block Mode
                if(mode === "block"){
                    if(keywordMatch || topicMatch){
                        hide = true;
                    }
                }

                // Highlight Mode
                else if(mode === "highlight"){
                    if(keywordMatch || topicMatch){
                        highlight = true;
                    }
                }

                // Whitelist Mode
                else if(mode === "whitelist"){
                    if(!(keywordMatch || topicMatch)){
                        hide = true;
                    }
                }

                // Sentiment Mode
                else if(mode === "sentiment"){
                    if(sentimentScore >= 2){
                        hide = true;
                    }
                }

                if(hide){
                    card.style.display = "none";
                }

                if(highlight){
                    card.style.border = "3px solid yellow";
                    card.style.borderRadius = "12px";
                }

            });

        }
    );

}

// ======================================================
// SPA Mutation Observer (YouTube Dynamic Loading)
// ======================================================

function startObserver(){

    const observer = new MutationObserver(()=>{
        filterVideos();
    });

    observer.observe(document.body,{
        childList:true,
        subtree:true
    });

}

// ======================================================
// Auto Run System
// ======================================================

filterVideos();

startObserver();

setInterval(filterVideos,1500);