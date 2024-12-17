import notFound from "./commands/notFound.js?v0.83";
import helpCommand from "./commands/help.js?v0.83";
import clearCommand from "./commands/clear.js?v0.83";
import colorCommand from "./commands/color.js?v0.83";
import fullscreenCommand from "./commands/fullscreen.js?v0.83";
import disconnectCommand from "./commands/disconnect.js?v0.83";
import historyCommand from "./commands/history.js?v0.83";
import fpsCommand from "./commands/fps.js?v0.83";
import filterCommand from "./commands/filter.js?v0.83";

const commandRegistry = {
    help: helpCommand,
    clear: clearCommand,
    color: colorCommand,
    fullscreen: fullscreenCommand,
    disconnect: disconnectCommand,
    history: historyCommand,
    fps: fpsCommand,
    filter: filterCommand
};

export default function executeCommand(command, contentDiv) {
    const [cmd, ...params] = command.trim().split(" ");
    const handler = commandRegistry[cmd.toLowerCase()];
    if (handler) {
        return handler(contentDiv, params.join(" "));
    } else {
        return notFound(command);
    }
}