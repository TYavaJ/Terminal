export default function colorCommand(contentDiv, parameter = "") {
    const colorOptions = ["red", "yellow", "green", "blue", "purple", "white"];
    let currentColor = null;
    let intervalId = null;

    const setColorProp = (doc, color) => {
        const root = doc.documentElement;
        root.style.setProperty('--backgroundInner', color.backgroundInner);
        root.style.setProperty('--backgroundOutter', color.backgroundOutter);
        root.style.setProperty('--textColor', color.textColor);
        root.style.setProperty('--opacityColor', color.opacityColor);
        root.setAttribute('data-color-applied', color.name);
    };

    const lowerCaseParam = parameter.toLowerCase();

    if (colorOptions.includes(lowerCaseParam)) {
        const colors = {
            green: {
                name: "green",
                backgroundInner: "rgb(70, 85, 50)",
                backgroundOutter: "rgb(25, 30, 15)",
                textColor: "rgb(200 245 130)",
                opacityColor: "rgb(200 245 130 / 50%)"
            },
            blue: {
                name: "blue",
                backgroundInner: "rgb(100 100 180)",
                backgroundOutter: "rgb(25, 30, 60)",
                textColor: "rgb(150 180 255)",
                opacityColor: "rgb(130 200 245 / 10%)"
            },
            yellow: {
                name: "yellow",
                backgroundInner: "rgb(160 160 70)",
                backgroundOutter: "rgb(70 70 20)",
                textColor: "rgb(255 255 150)",
                opacityColor: "rgb(255 255 150 / 20%)"
            },
            red: {
                name: "red",
                backgroundInner: "rgb(220 80 80)",
                backgroundOutter: "rgb(100, 25, 25)",
                textColor: "rgb(255 140 140)",
                opacityColor: "rgb(255 140 140 / 15%)"
            },
            purple: {
                name: "purple",
                backgroundInner: "rgb(90 50 90)",
                backgroundOutter: "rgb(30 25 30)",
                textColor: "rgb(245 175 255)",
                opacityColor: "rgb(245 175 255 / 10%)"
            },
            white: {
                name: "white",
                backgroundInner: "rgb(100 100 100)",
                backgroundOutter: "rgb(30 30 30)",
                textColor: "rgb(225 225 225)",
                opacityColor: "rgb(255 255 255 / 20%)"
            }
        };

        const color = colors[lowerCaseParam];
        if (color) {
            currentColor = color;

            setColorProp(document, color);

            const applyToIframes = () => {
                const iframes = document.querySelectorAll("iframe");
                iframes.forEach(iframe => {
                    try {
                        if (iframe.contentDocument) {
                            const iframeRoot = iframe.contentDocument.documentElement;
                            if (iframeRoot.getAttribute('data-color-applied') !== color.name) {
                                setColorProp(iframe.contentDocument, color);
                            }
                        }
                    } catch (e) {
                        console.warn(`${e.message}`);
                    }
                });
            };
            applyToIframes();

            if (intervalId) {
                clearInterval(intervalId);
            }

            intervalId = setInterval(() => {
                if (currentColor) {
                    applyToIframes();
                }
            }, 10);

            return `Color set to ${lowerCaseParam.charAt(0).toUpperCase() + lowerCaseParam.slice(1)}`;
        }
    } else {
        return `Terminal Colors:\n - ${colorOptions.map(color => color.charAt(0).toUpperCase() + color.slice(1)).join("\n - ")}`;
    }
}