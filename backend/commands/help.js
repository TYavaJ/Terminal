export default function helpCommand(params) {
    const helpPages = [
{
    content: `
- Clear
    Clears the terminal screen
- Filter [True / False]
    Toggles between showing special effects *helps with lag*`
},
{
content: `
- Color [Color]
    Allows you to change the style of your terminal.
- Disconnect
    Will disconnect you from the terminal.`
},
{
content: `
- Help [Soon: Command
    Displays this menu.
- Fullscreen [True / False]
    Toggles the automatic fullscreen feature.`
},
{
content: `
- Fullscreen [True / False]
    Toggles the automatic fullscreen feature.
- History [Page]
    Displays your local history.`
},
{
content: `
- History [Page]
    Displays your local history.
- History [Clear]
    Clears your local history.`
},
{
content: `
- History [Clear(#)]
    Clears a specific item in history.
- History [Clear(#..#)]
    Clears a range of items in history.`
}
];

    const totalPages = helpPages.length;

    if (typeof params !== "string") {
        params = String(params);
    }

    const args = params.trim().split(" ");
    const pageNumber = parseInt(args.find((arg) => !isNaN(arg)), 10) || 1;

    if (pageNumber < 1 || pageNumber > totalPages) {
        return `Invalid page number. Please select a page between 1 and ${totalPages}.`;
    }

    return `Help (Page ${pageNumber}/${totalPages}):\n${helpPages[pageNumber - 1].content}`;
}