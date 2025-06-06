// Use browser namespace for Firefox, fallback to chrome for compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

browserAPI.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && !(tab.url.includes("youtube.com/watch") || tab.url.includes("youtube.com/playlist") || !tab.url.includes("@"))) {
        try {
            const url = tab.url;
            const channelName = url.split("@")[1].split("/")[0];
            browserAPI.tabs.sendMessage(tabId, {
                type: "opened_channel",
                channelName: channelName,
            });
        } catch (error) {
            console.error("Error processing tab update:", error);
        }
    }
});

browserAPI.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await browserAPI.tabs.get(activeInfo.tabId);
        if (tab.url && !(tab.url.includes("youtube.com/watch") || tab.url.includes("youtube.com/playlist") || !tab.url.includes("@"))) {
            const url = tab.url;
            const channelName = url.split("@")[1].split("/")[0];
            browserAPI.tabs.sendMessage(activeInfo.tabId, {
                type: "opened_channel",
                channelName: channelName,
            });
        }
    } catch (error) {
        console.error("Error processing tab activation:", error);
    }
});
