let isDisconnected = false;

export default function disconnectCommand(contentDiv) {
    if (isDisconnected) return;
    isDisconnected = true;

    contentDiv.innerHTML = "";
    setTimeout(() => {
        contentDiv.innerHTML = `
        <link rel="stylesheet" href="../frontend/css/programs/disconnected.css?v0.70">
            <div class="disconnectedWrapper">
                <div id="disconnect">
                    <p>NO SIGNAL</p>
                </div>
            </div>
            <p id="command">
                <span class="user"></span>
                <span class="caret"></span>
            </p>
        `;
    }, 500);
    return null;
}

function checkMobile(contentDiv) {
    setInterval(() => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const isDisconnectedElement = contentDiv.querySelector('div#disconnect');
        if (!isDisconnectedElement && (screenWidth <= 280 || screenHeight <= 625)) {
            disconnectCommand(contentDiv);
        }
    }, 1000);
}

function checkInternetConnection(contentDiv) {
    const handleOffline = () => {
        disconnectCommand(contentDiv);
    };

    if (!navigator.onLine) {
        handleOffline(contentDiv);
    }

    window.addEventListener('offline', () => handleOffline(contentDiv));
    window.addEventListener('online', () => {
        contentDiv.innerHTML = "";

        setTimeout(() => {
            contentDiv.innerHTML = `
            <link rel="stylesheet" href="../frontend/css/programs/disconnected.css?v0.70">
                <div class="disconnectedWrapper">
                    <div id="disconnect">
                        <p>SIGNAL RESTORED</p>
                    </div>
                </div>
                <p id="command">
                    <span class="user"></span>
                    <span class="caret"></span>
                </p>
            `;
        }, 500);
    });
}

const contentDiv = document.querySelector(".content");
if (contentDiv) {
    checkMobile(contentDiv);
    checkInternetConnection(contentDiv);
}