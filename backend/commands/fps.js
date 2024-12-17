let fpsInterval = null;

export default function fpsCommand(contentDiv) {
    if (fpsInterval) {
        clearInterval(fpsInterval);
        fpsInterval = null;
    }

    const fpsElement = document.createElement("div");
    fpsElement.id = "fpsDisplay";
    contentDiv.appendChild(fpsElement);

    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fps = 0;

    function calculateFPS() {
        const now = performance.now();
        frameCount++;

        if (now - lastFrameTime >= 500) {
            fps = Math.round((frameCount * 1000) / (now - lastFrameTime));
            lastFrameTime = now;
            frameCount = 0;

            fpsElement.textContent = `Frames Per Second: ${fps} fps`;
        }
        requestAnimationFrame(calculateFPS);
    }

    requestAnimationFrame(calculateFPS);

    fpsInterval = setInterval(() => {
        fpsElement.textContent = `Frames Per Second: ${fps} fps`;
    }, 500);

    return "Live FPS counter started. Type 'clear' to remove.";
}