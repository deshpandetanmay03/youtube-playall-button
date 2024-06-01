chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("youtube.com/@")) {
    const url = tab.url;
    chrome.tabs.sendMessage(tabId, {
      type: "opened_channel",
      url: url,
    });
  }
});
