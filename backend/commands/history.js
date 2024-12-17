export default function historyCommand(contentDiv, params) {
    let history = JSON.parse(localStorage.getItem('commandHistory')) || [];

    if (params.trim().toLowerCase().includes("clear")) {
        const isDesc = params.trim().toLowerCase().includes("desc");
        const clearParams = params
            .trim()
            .replace(/desc|clear/g, "")
            .trim();
        const rangeMatch = clearParams.match(/\((\d+)\.\.(\d+)\)/);
        const singleMatch = clearParams.match(/\((\d+)\)/);

        const sortedHistory = isDesc ? [...history].reverse() : history;

        if (rangeMatch) {
            const start = parseInt(rangeMatch[1], 10);
            const end = parseInt(rangeMatch[2], 10);
            if (start >= 1 && end <= sortedHistory.length && start <= end) {
                const toRemove = sortedHistory.slice(start - 1, end);
                history = history.filter((cmd) => !toRemove.includes(cmd));
                localStorage.setItem('commandHistory', JSON.stringify(history));
                return `Removed items ${start} to ${end} from history.`;
            } else {
                return `Invalid range. Please select a range between 1 and ${sortedHistory.length}.`;
            }
        } else if (singleMatch) {
            const index = parseInt(singleMatch[1], 10);
            if (index >= 1 && index <= sortedHistory.length) {
                const toRemove = sortedHistory[index - 1];
                history = history.filter((cmd) => cmd !== toRemove);
                localStorage.setItem('commandHistory', JSON.stringify(history));
                return `Removed item ${index} from history.`;
            } else {
                return `Invalid index. Please select a number between 1 and ${sortedHistory.length}.`;
            }
        } else {
            localStorage.removeItem('commandHistory');
            return "Command history cleared.";
        }
    }

    if (history.length === 0) return "No command history available.";

    const args = params.trim().split(" ");
    const sortOrder = args.includes("desc") ? "desc" : "asc";
    const pageNumber = parseInt(args.find((arg) => !isNaN(arg)), 10) || 1;

    const itemsPerPage = 9;
    const totalPages = Math.ceil(history.length / itemsPerPage);

    if (pageNumber < 1 || pageNumber > totalPages) {
        return `Invalid page number. Please select a page between 1 and ${totalPages}.`;
    }

    const sortedHistory = sortOrder === "desc" ? [...history].reverse() : history;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, sortedHistory.length);

    let output = `History (${sortOrder.toUpperCase()}) - Page ${pageNumber}/${totalPages}:\n`;
    for (let i = startIndex; i < endIndex; i++) {
        output += `${i + 1}: ${sortedHistory[i]}\n`;
    }

    return output.trim();
}