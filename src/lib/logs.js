// Latest meaningful line of a terminal's log array — the one-line outcome a
// TerminalPanel shows on phones. Skips " " spacer lines and pure punctuation
// (a terraform plan ends on a lone "}", which is accurate and useless).
export const lastLine = (lines) => {
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const l = lines[i];
    if (typeof l === 'string' && /[a-z0-9]/i.test(l)) return l.trim();
  }
  return '';
};
