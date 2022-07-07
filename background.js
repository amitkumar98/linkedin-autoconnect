chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("linkedin.com/search/results/people")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      searchQuery: urlParameters.get("keywords"),
    });
  }
});
