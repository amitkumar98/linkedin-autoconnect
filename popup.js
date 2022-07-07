import { getActiveTab, randomIntFromInterval } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTab();

  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const searchQuery = urlParameters.get("keywords");
  // chrome.storage.sync.clear();

  if (
    activeTab.url.includes("linkedin.com/search/results/people") &&
    searchQuery
  ) {
    chrome.storage.sync.get([searchQuery], (data) => {
      if (data[searchQuery] === 1) {
        const container =
          document.getElementsByClassName("progress-container")[0];
        container.innerHTML =
          '<div class="title-container"><span>Already invited everyone on this page to connect</span></div>';
      }
    });

    const progressBar = document.getElementById("bar");
    const loadingMsg = document.getElementById("loading");
    const progress = document.getElementById("progress");
    const completedMsg = document.getElementById("completed");
    let barWidth = 0;

    let duration = randomIntFromInterval(5, 10) * 1000;
    const animate = () => {
      barWidth++;
      progressBar.style.width = `${barWidth}%`;
      setTimeout(() => {
        loadingMsg.innerHTML = `${barWidth}% Completed`;
      }, duration);
    };

    const button = document.getElementById("start-stop-button");

    button.onclick = function () {
      chrome.tabs.sendMessage(activeTab.id, {
        type: button.innerText.toUpperCase(),
        interval: duration,
        searchQuery,
      });
      if (button.innerText === "Start") {
        button.innerText = "Stop";
        progressBar.style.display = "block";
        loadingMsg.style.display = "block";
        progress.style.display = "block";
      } else if (button.innerText === "Stop") {
        button.innerText = "Start";
      }
      setTimeout(() => {
        let intervalID = setInterval(() => {
          if (barWidth === 100) {
            clearInterval(intervalID);
            completedMsg.style.display = "block";
            button.style.display = "none";
            loadingMsg.style.display = "none";
            chrome.storage.sync.set({
              [searchQuery]: 1,
            });
          } else if (button.innerText === "Stop") {
            progressBar.style.background = "#4267b2";
            animate();
          } else if (button.innerText === "Start") {
            progressBar.style.background = "red";
          }
        }, duration / 10);
      }, 0);
    };
  } else {
    // For all other pages
    const container = document.getElementsByClassName("progress-container")[0];
    container.innerHTML =
      '<div class="title-container"><span>This is not a LinkedIn search page</span></div>';
  }
});
