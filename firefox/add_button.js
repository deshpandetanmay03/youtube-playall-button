function createButton(url) {
    const button = document.createElement("a");
    button.href = url;
    button.target = "_";
    button.textContent = "Playlist";
    button.style = `
    margin-left: 12px;
    background-color: var(--yt-spec-badge-chip-background);
    color: var(--yt-spec-text-primary);
    border-radius: 8px;
    min-width: 12px;
    transition: background-color 0.5s cubic-bezier(0.05, 0, 0, 1) 0s;
    padding: 0 var(--ytd-margin-3x);
    display: inline-block;
    text-decoration: none;
    font-family: Roboto, Arial, sans-serif;
    padding-block: 6px;
    font-size: 1.4rem;
    line-height: 2rem;
    font-weight: 500;
    vertical-align: top;`;
    return button;
}
async function fetchPlaylist() {
    const req = `https://tanmays-helpers.vercel.app/api/get_playlist?url=${window.location.href}`;
    const response = await fetch(req);
    const data = await response.json();
    return data["url"];
}
// Use browser namespace for Firefox, fallback to chrome for compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

async function getPlaylistUrlWithCache(channelName) {
    try {
        const result = await browserAPI.storage.sync.get([channelName]);
        if (Object.keys(result).length === 0) {
            const playlistUrl = await fetchPlaylist();
            await browserAPI.storage.sync.set({[channelName]: playlistUrl});
            return playlistUrl;
        } else {
            const playlistUrl = result[channelName];
            return playlistUrl;
        }
    } catch (error) {
        console.error("Error accessing storage:", error);
        // Fallback to fetching a new playlist URL if storage access fails
        return await fetchPlaylist();
    }
}
browserAPI.runtime.onMessage.addListener(async (obj, sender, response) => {
    const {type, channelName} = obj;
    const url = window.location.href;

    if (type != "opened_channel" || !url.endsWith("videos")) return;

    const playlistUrl = await getPlaylistUrlWithCache(channelName)

    let parentElement = document.querySelectorAll('#chips, .chip-bar-contents');
    while (!parentElement || parentElement.length < 1) {
        parentElement = document.querySelectorAll('#chips, .chip-bar-contents');
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const button = createButton(playlistUrl);
    parentElement.forEach(element => {
        if (element.childElementCount < 4) {
            element.appendChild(button);
        }
    });
})
