chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && tab.url.includes("youtube.com/@")) {
        const url = tab.url;
        const regex = /@(.*)\//;
        const match = url.match(regex);
        const channelName = match[1];
        chrome.tabs.sendMessage(tabId, {
            type: "opened_channel",
            channelName: channelName,
        });
    }
});
