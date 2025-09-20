/**
 * assert
 */

export function ASSERT(cond: any, message?: string): asserts cond {
  if (__DEV__) {
    if (!cond) {
      // 2025-09-09 10:56:31.978 이런 포맷으로 찍히도록
      const now = new Date();
      const pad = (n: number, width: number) => n.toString().padStart(width, '0');
      const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1, 2)}-${pad(now.getDate(), 2)} ${pad(
        now.getHours(),
        2
      )}:${pad(now.getMinutes(), 2)}:${pad(now.getSeconds(), 2)}.${pad(now.getMilliseconds(), 3)}`;
      console.error(`[${ts}] ASSERT ${message}`);
      // captureOwnerStack();
      throw new Error(message);
    }
  }
}

// ☺︎
// ☹︎
// ☠︎
// ❣︎
// ❤︎
// ☘︎
// ⛸︎
// ♠︎
// ♥︎
// ♦︎
// ♣︎
// ♟︎
// ⛷︎
// ⛰︎
// ⛩︎
// ♨︎
// ⛴︎
// ✈︎
// ☀︎
// ⏱︎
// ⏲︎
// ☁︎
// ⛈︎
// ☂︎
// ⛱︎
// ❄︎
// ☃︎
// ☄︎
// ⛑︎
// ☎︎
// ⌨︎
// ✏︎
// ✒︎
// ✉︎
// ✂︎
// ⛏︎
// ⚒︎
// ⚔︎
// ⚙︎
// ⚖︎
// ⛓︎
// ⚗︎
// ⚰︎
// ⚱︎
// ⚠︎
// ☢︎
// ☣︎
// ⬆︎
// ↗︎
// ➡︎
// ↘︎
// ⬇︎
// ↙︎
// ⬅︎
// ↖︎
// ↕︎
// ↔︎
// ↩︎
// ↪︎
// ⤴︎
// ⤵︎
// ⚛︎
// ✡︎
// ☸︎
// ☯︎
// ✝︎
// ☦︎
// ☪︎
// ☮︎
// ▶︎
// ⏭︎
// ⏯︎
// ◀︎
// ⏮︎
// ⏸︎
// ⏹︎
// ⏺︎
// ⏏︎
// ♀︎
// ♂︎
// ⚧︎
// ✖︎
// ♾︎
// ‼︎
// ⁉︎
// ⚕︎
// ♻︎
// ⚜︎
// ☑︎
// ✔︎
// 〽︎
// ✳︎
// ✴︎
// ❇︎
// ©︎
// ®︎
// ™︎
// 🅰︎
// 🅱︎
// ℹ︎
// Ⓜ︎
// 🅾︎
// 🅿︎
// 🈂︎
// 🈷︎
// ㊗︎
// ㊙︎
// ◼︎
// ◻︎
// ▪︎
// ▫︎
