import executeCommand from "../../backend/commandRegistery.js?v0.83";

document.addEventListener("DOMContentLoaded", () => {
    const contentDiv = document.querySelector(".content");
    let currentWordSpan = null;
    let currentInput = "";

    let dynamicCharCount = 65;

    function updateResponseWidth() {
        const screenWidth = window.innerWidth;

        dynamicCharCount = Math.floor(screenWidth / 15);

        updateDynamicBreaks();
    }

    function updateDynamicBreaks() {
        const commandReturnParagraph = document.querySelector("#commandReturn");
        if (commandReturnParagraph) {
            const formattedOutput = commandReturnParagraph.innerHTML.split("\n").map(line => {
                const lineSpan = document.createElement("span");
                let charCount = 0;

                line.split("").forEach(char => {
                    const charSpan = document.createElement("span");
                    if (char === " ") {
                        const spaceSpan = document.createElement("span");
                        spaceSpan.className = "space";
                        lineSpan.appendChild(spaceSpan);
                    } else if (char === "<") {
                        lineSpan.innerHTML += `<span>&lt;</span>`;
                    } else if (char === ">") {
                        lineSpan.innerHTML += `<span>&gt;</span>`;
                    } else {
                        charSpan.textContent = char;
                        charSpan.style.display = "none";
                        lineSpan.appendChild(charSpan);
                    }

                    charCount++;
                    if (charCount >= dynamicCharCount) {
                        lineSpan.innerHTML += "<br>";
                        charCount = 0;
                    }
                });

                return lineSpan.outerHTML + "<br>";
            }).join("");

            commandReturnParagraph.innerHTML = formattedOutput;
        }
    }

    function playSound() {
        const audio = new Audio("./frontend/keyPress.mp3");
        audio.play();
    }

    function goFullscreen() {
        const fullscreenAllowed = localStorage.getItem('fullscreenAllowed') === 'true';
    
        if (fullscreenAllowed) {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                }
            }
        } else {
            if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }
    }    

    function typewriterEffect(paragraph, playSound = true) {
        const spans = paragraph.querySelectorAll("span");
        let index = 0;

        function revealNextCharacter() {
            if (index < spans.length) {
                spans[index].style.display = "inline";
                if (playSound) {
                    playSound();
                }
                index++;
                setTimeout(revealNextCharacter, 25);
            }
        }

        revealNextCharacter();
    }

    function processCommand(command) {
        saveCommandToHistory(command);
    
        const oldCommandParagraph = document.querySelector("#command");
        if (oldCommandParagraph) oldCommandParagraph.remove();
    
        const userInputParagraph = document.createElement("p");
        userInputParagraph.id = "userInput";
    
        const userSpan = document.createElement("span");
        userSpan.id = "word";
        userSpan.innerHTML = `$ <span>${command}</span>`;
        userInputParagraph.appendChild(userSpan);
    
        contentDiv.appendChild(userInputParagraph);
    
        const output = executeCommand(command.trim(), contentDiv);
    
        if (output) {
            const commandReturnParagraph = document.createElement("pre");
            commandReturnParagraph.id = "commandReturn";
    
            const formattedOutput = output.split("\n").map(line => {
                const lineSpan = document.createElement("span");
                let charCount = 0;
    
                line.split("").forEach(char => {
                    const charSpan = document.createElement("span");
                    if (char === " ") {
                        const spaceSpan = document.createElement("span");
                        spaceSpan.className = "space";
                        spaceSpan.textContent = " ";
                        spaceSpan.style.display = "none";
                        lineSpan.appendChild(spaceSpan);
                    } else if (char === "<") {
                        lineSpan.innerHTML += `<span style="display: inline;">&lt;</span>`;
                    } else if (char === ">") {
                        lineSpan.innerHTML += `<span style="display: inline;">&gt;</span>`;
                    } else {
                        charSpan.textContent = char;
                        charSpan.style.display = "none";
                        lineSpan.appendChild(charSpan);
                    }
    
                    charCount++;
                    if (charCount >= dynamicCharCount) {
                        lineSpan.innerHTML += "<br>";
                        charCount = 0;
                    }
                });
    
                return lineSpan.outerHTML + "<br>";
            }).join("");
    
            commandReturnParagraph.innerHTML = formattedOutput;
    
            contentDiv.appendChild(commandReturnParagraph);
            typewriterEffect(commandReturnParagraph, false);
        }
    
        resetCommandLine();
    }
    
    function saveCommandToHistory(command) {
        let history = JSON.parse(localStorage.getItem('commandHistory')) || [];
    
        history.unshift(command);
    
        if (history.length > 150) {
            history = history.slice(0, 150);
        }
    
        localStorage.setItem('commandHistory', JSON.stringify(history));
    }
    
    function resetCommandLine() {
        const newCommandParagraph = document.createElement("p");
        newCommandParagraph.id = "command";

        const userSpan = document.createElement("span");
        userSpan.className = "user";
        newCommandParagraph.appendChild(userSpan);

        const wordSpan = document.createElement("span");
        wordSpan.id = "word";
        newCommandParagraph.appendChild(wordSpan);

        const caret = document.createElement("span");
        caret.className = "caret";
        newCommandParagraph.appendChild(caret);

        contentDiv.appendChild(newCommandParagraph);

        const caretElement = document.querySelector(".caret");
        if (caretElement) {
            caretElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }

        currentWordSpan = null;
        currentInput = "";
    }

    document.addEventListener("keydown", (event) => {
        const caretSpan = document.querySelector(".caret");

        if (event.key === "Backspace") {
            playSound();
            const lastCharacter = caretSpan.previousSibling;

            if (lastCharacter) {
                if (lastCharacter.nodeType === Node.TEXT_NODE) {
                    lastCharacter.remove();
                } else if (lastCharacter.tagName === "SPAN") {
                    const lastChar = lastCharacter.lastChild;
                    if (lastChar) {
                        lastChar.remove();
                    }
                    if (!lastCharacter.childNodes.length) {
                        lastCharacter.remove();
                        currentWordSpan = null;
                    }
                }

                currentInput = currentInput.slice(0, -1);
            }
        } else if (event.key === "Enter") {
            if (currentInput.trim() !== "") {
                processCommand(currentInput);
            }
        } else if (event.key === " " || event.key.length === 1) {
            if (event.key === " ") {
                currentWordSpan = null;

                const spaceSpan = document.createElement("span");
                spaceSpan.className = "space";
                spaceSpan.textContent = " ";
                caretSpan.parentNode.insertBefore(spaceSpan, caretSpan);

                currentInput += " ";
            } else {
                if (!currentWordSpan) {
                    currentWordSpan = document.createElement("span");
                    currentWordSpan.id = "word";
                    caretSpan.parentNode.insertBefore(currentWordSpan, caretSpan);
                }

                const charSpan = document.createElement("span");
                charSpan.textContent = event.key;
                currentWordSpan.appendChild(charSpan);

                currentInput += event.key;
            }

            playSound();
            goFullscreen();
        }
    });

    window.addEventListener('resize', updateResponseWidth);

    updateResponseWidth();
});