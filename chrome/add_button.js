(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const {type, url} = obj;
        if (type == "opened_channel" && url.endsWith("videos")) {
            const req = `https://tanmays-helpers.vercel.app/get_playlist?url=${url}`;
            fetch(req)
                .then(response => response.json())
                .then(data => {
                    let parentElement = document.querySelectorAll('#chips');
                    while (!parentElement) {
                        parentElement = document.querySelectorAll('#chips');
                    }
                    const button = document.createElement("a");
                    button.href = data["url"];
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
                    parentElement.forEach(element => {
                        element.appendChild(button);
                    });
                })
                .catch(error => {
                    console.error("CHANNEL PLAYLIST - ", error);
                });
        }
    })
})()
