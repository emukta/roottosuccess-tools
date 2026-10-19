const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBn(value) {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[d]);
}

export function toEnDigits(value) {
  return String(value).replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

export function fmtBytes(n) {
  if (!n && n !== 0) return "—";
  if (n < 1024) return toBn(n) + " B";
  if (n < 1048576) return toBn((n / 1024).toFixed(1)) + " KB";
  return toBn((n / 1048576).toFixed(2)) + " MB";
}

export function fmtNum(n) {
  return toBn(Number(n).toLocaleString("en-IN"));
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function baseName(name = "image") {
  return (
    String(name)
      .replace(/\.[^.]+$/, "")
      .replace(/[^\w\-.ঀ-৿\s]+/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100) || "image"
  );
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
