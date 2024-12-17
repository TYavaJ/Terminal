export default function filterToggleCommand(contentDiv, parameter = "") {
    const key = "filterModeActive";
    const lowerCaseParam = String(parameter).toLowerCase();

    const removeFilter = () => {
        document.querySelectorAll("svg").forEach(svg => svg.remove());

        const styleSheet = document.getElementById("filter-style");
        if (styleSheet) {
            styleSheet.remove();
        }

        const globalStyleSheet = Array.from(document.styleSheets).find(sheet => sheet.href && sheet.href.includes("./frontend/css/global.css"));
        if (globalStyleSheet) {
            try {
                Array.from(globalStyleSheet.cssRules).forEach((rule, index) => {
                    if (rule.selectorText === ".scanlines:before" || rule.selectorText === ".scanlines:after") {
                        globalStyleSheet.deleteRule(index);
                    }
                });
            } catch (error) {
                console.error("Unable to modify global stylesheet:", error);
            }
        }

        localStorage.setItem(key, "false");
        return "Filter mode deactivated";
    };

    const addFilter = () => {
        let styleSheet = document.getElementById("filter-style");
        if (!styleSheet) {
            styleSheet = document.createElement("style");
            styleSheet.id = "filter-style";
            styleSheet.textContent = `
                .scanlines:before {
                    width: 100%;
                    height: 2px;
                    z-index: 2;
                    background: rgba(0, 0, 0, 0.3);
                    opacity: 0.75;
                    animation: scanline 6s linear infinite;
                    content: "";
                    position: absolute;
                }
                .scanlines:after {
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 1;
                    background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.3) 50%);
                    background-size: 100% 4px;
                    animation: scanlines 1s steps(60) infinite;
                    content: "";
                    position: absolute;
                }
            `;
            document.head.appendChild(styleSheet);
        }

        localStorage.setItem(key, "true");
        return "Filter mode activated";
    };

    if (lowerCaseParam === "true" || lowerCaseParam === "false") {
        return lowerCaseParam === "true" ? addFilter() : removeFilter();
    }

    const currentSetting = localStorage.getItem(key);

    if (currentSetting === "true") {
        return removeFilter();
    } else {
        return addFilter();
    }
}