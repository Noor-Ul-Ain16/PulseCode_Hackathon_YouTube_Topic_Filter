# PulseCode Hackathon YouTube Topic Filter

**Problem Understanding**
---

YouTube contains an enormous variety of content, which can sometimes be overwhelming or distracting for users. Videos may include clickbait, misleading titles, controversial topics, or content that users may wish to avoid. Currently, there is no lightweight, user-friendly solution that allows real-time filtering of videos directly in the YouTube feed based on keywords, topics, or sentiment. The challenge is to provide an extension that gives users control over what content they see, while remaining efficient and unobtrusive.
______________

**Approach**
---


To solve this problem, the extension uses a combination of keyword detection, topic mapping, and sentiment analysis:
1.	User Input: Users can add, edit, or delete keywords and choose a filtering mode (Block, Highlight, Whitelist, or Sentiment).
2.	Data Storage: All keywords and settings are stored using chrome.storage.sync for persistence and cross-device syncing.
3.	Content Script: The extension injects a script (content.js) into YouTube pages, which scans the DOM for video cards.
4.	Filtering Engine:
o	Checks each video’s title and metadata against stored keywords.
o	Performs lightweight topic detection using a predefined keyword-topic map.
o	Calculates a sentiment score to detect clickbait or sensational content.
o	Applies the selected mode to hide, highlight, or whitelist videos.
5.	Dynamic Updates: A MutationObserver and periodic checks ensure new videos loaded via infinite scroll are filtered in real time.
______________
**Challenges Faced**
---

•	Dynamic Content Loading: YouTube’s infinite scroll required a reliable way to detect newly loaded video cards, solved with a combination of MutationObserver and periodic filtering.

•	Efficient Filtering: Scanning all DOM nodes could slow down the browser, so we optimized by marking already-processed video cards and debouncing observer triggers.

•	Accurate Matching: Simple substring matching led to false positives (e.g., "ai" in "daily vlog"), which was mitigated using word boundaries and careful text cleaning.

•	User Experience: Allowing users to add, edit, and delete keywords in the popup while immediately reflecting changes in the content required smooth UI and event handling logic.
______________
**Implemented By Myself**
---

All core functionality was designed and implemented independently, including:

•	The popup UI for managing keywords and selecting filter modes.

•	The content script for scanning video cards, detecting topics, calculating sentiment scores, and applying filtering logic.

•	The topic mapping and heuristic sentiment detection, creating a lightweight NLP-like system without external libraries.

•	Handling real-time dynamic updates of YouTube pages using MutationObserver and setInterval.

•	The mode-based filtering system, supporting block, highlight, whitelist, and sentiment modes.
This project demonstrates a full end-to-end Chrome Extension, combining front-end UI, storage management, and real-time DOM manipulation logic.
