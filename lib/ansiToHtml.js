const COLOR_CODES = {
    // bold: { pattern: /\[1m/g, class: `<span className="bold">` },
    // underline: { pattern: /\[4m/g, class: `<span className="italic">` },
    // reversed: { pattern: /\[7m/g, class: "" },
    // // 8 Color
    black: { pattern: /\[30m/g, class: "black" },
    red: { pattern: /\[31m/g, class: "red" },
    green: { pattern: /\[32m/g, class: "green" },
    yellow: { pattern: /\[33m/g, class: "yellow" },
    blue: { pattern: /\[34m/g, class: "blue" },
    magenta: { pattern: /\[35m/g, class: "magenta" },
    cyan: { pattern: /\[36m/g, class: "cyan" },
    white: { pattern: /\[37m/g, class: "white" },
    // // Bright 8 color
    brightBlack: { pattern: /\[1;30m/g, class: "brightBlack" },
    brightRed: { pattern: /\[1;31m/g, class: "brightRed" },
    brightGreen: { pattern: /\[1;32m/g, class: "brightGreen" },
    brightYellow: { pattern: /\[1;33m/g, class: "brightYellow" },
    brightBlue: { pattern: /\[1;34m/g, class: "brightBlue" },
    brightMagenta: { pattern: /\[1;35m/g, class: "brightMagenta" },
    brightCyan: { pattern: /\[1;36m/g, class: "brightCyan" },
    brightWhite: { pattern: /\[1;37m/g, class: "brightWhite" },
    // Alt Codes
    escape: { pattern: /\x1B/g, class: null },
    // Reset
    reset: { pattern: /\[0m/g, class: null },
};

const convertToHtml = (ansi) => {
    const colorEntries = Object.entries(COLOR_CODES).map((c) => {
        return { key: c[0], pattern: c[1].pattern, class: c[1].class };
    });

    let latest = null;
    colorEntries.forEach((entry) => {
        if (!latest) {
            latest = "<span>" + ansi;
        }

        const rawLatest = String.raw`${latest}`;

        const matches = latest.match(entry.pattern);

        const _replaced = rawLatest.replace(
            entry.pattern,
            entry.class ? `<span class="${entry.class}">` : "</span>"
        );

        latest = _replaced;
    });

    // console.log({ original: ansi, latest: latest });

    return latest;
};

module.exports = convertToHtml;
