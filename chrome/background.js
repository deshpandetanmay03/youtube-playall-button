chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && tab.url.includes("youtube.com/@")) {
        const url = tab.url;
        const channelName = url.split("@")[1].split("/")[0];
        chrome.tabs.sendMessage(tabId, {
            type: "opened_channel",
            channelName: channelName,
        });
    }
});
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && tab.url.includes("youtube.com/@")) {
        const url = tab.url;
        const channelName = url.split("@")[1].split("/")[0];
        chrome.tabs.sendMessage(activeInfo.tabId, {
            type: "opened_channel",
            channelName: channelName,
        });
    }
});
