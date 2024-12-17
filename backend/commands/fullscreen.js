export default function fullscreenCommand(contentDiv, parameter = "") {
    const key = "fullscreenAllowed";
    const lowerCaseParam = String(parameter).toLowerCase();

    const setFullscreen = (value) => {
        localStorage.setItem(key, value);
        return `Fullscreen mode set to ${value}`;
    };

    if (lowerCaseParam === "true" || lowerCaseParam === "false") {
        return setFullscreen(lowerCaseParam === "true");
    }

    const currentSetting = localStorage.getItem(key);

    if (currentSetting === "true") {
        return setFullscreen("false");
    } else {
        return setFullscreen("true");
    }
}