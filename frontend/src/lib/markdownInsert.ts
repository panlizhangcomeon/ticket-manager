/** 在 textarea 中插入 Markdown 片段后的文本与选区（用于 setState + setSelectionRange） */

export type InsertResult = { value: string; selStart: number; selEnd: number };

export function wrapSelection(
  value: string,
  start: number,
  end: number,
  left: string,
  right: string,
  emptyPlaceholder?: string
): InsertResult {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const selected = value.slice(start, end);

  if (selected) {
    const ins = left + selected + right;
    const next = before + ins + after;
    const pos = start + ins.length;
    return { value: next, selStart: pos, selEnd: pos };
  }

  if (emptyPlaceholder) {
    const ins = left + emptyPlaceholder + right;
    const next = before + ins + after;
    return {
      value: next,
      selStart: start + left.length,
      selEnd: start + left.length + emptyPlaceholder.length,
    };
  }

  const ins = left + right;
  const next = before + ins + after;
  const mid = start + left.length;
  return { value: next, selStart: mid, selEnd: mid };
}

export function insertSnippet(
  value: string,
  start: number,
  end: number,
  snippet: string,
  selStartInSnippet: number,
  selEndInSnippet: number
): InsertResult {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const next = before + snippet + after;
  const base = before.length;
  return {
    value: next,
    selStart: base + selStartInSnippet,
    selEnd: base + selEndInSnippet,
  };
}

/** 在当前行前插入前缀（如 ## ） */
export function prefixCurrentLine(value: string, cursor: number, prefix: string): InsertResult {
  const lineStart = value.lastIndexOf('\n', cursor - 1) + 1;
  const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  const delta = prefix.length;
  return {
    value: next,
    selStart: cursor + delta,
    selEnd: cursor + delta,
  };
}

/** 在光标处插入带前缀的新行（列表、引用等） */
export function insertLinePrefix(value: string, start: number, end: number, prefix: string): InsertResult {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const needsNl = start > 0 && value[start - 1] !== '\n';
  const ins = (needsNl ? '\n' : '') + prefix;
  const next = before + ins + after;
  const pos = before.length + ins.length;
  return { value: next, selStart: pos, selEnd: pos };
}

/** 在光标处插入原始字符（如换行） */
export function insertRaw(value: string, start: number, end: number, raw: string): InsertResult {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const next = before + raw + after;
  const pos = before.length + raw.length;
  return { value: next, selStart: pos, selEnd: pos };
}
