// โมดูล B — ค้นหาประกาศ  ·  branch: feature/search
// หน้าเว็บของฟีเจอร์ — ดูเครื่องมือที่ใช้ได้ใน ctx ที่หัวไฟล์ public/app.js

// สไตล์ใช้ตัวแปรสีของหน้าเว็บ (--accent, --card, --text, --muted) เพื่อให้เข้ากับธีม
const STYLE = `
  .search-input {
    flex: 1 1 260px;
    min-width: 0;
    padding: 10px 12px;
    border: 2px solid var(--accent);
    border-radius: 8px;
    background: var(--card);
    color: var(--text);
    font: inherit;
  }
  .search-input::placeholder { color: var(--muted); opacity: 1; }
  .search-input:focus { outline: 3px solid #f59e0b; outline-offset: 1px; }
`;

export function init(ctx) {
  // ช่องค้นหาอยู่ใน toolbar — พิมพ์แล้วกรองทันที (ไม่มีปุ่มกด)
  if (!document.getElementById('search-style')) {
    const style = document.createElement('style');
    style.id = 'search-style';
    style.textContent = STYLE;
    document.head.append(style);
  }

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'search-input';
  input.placeholder = 'ค้นหาประกาศ...';
  input.setAttribute('aria-label', 'ค้นหาประกาศ');

  // ตัวกรอง: อ่านคำค้นจากช่องทุกครั้ง — ว่างหรือมีแต่ช่องว่างจะแสดงทุกรายการ
  // แสดงประกาศที่ title หรือ body มีคำค้น (ไม่สนตัวพิมพ์ใหญ่-เล็ก, ไม่ใช้ RegExp)
  ctx.addFilter((item) => {
    const keyword = input.value.trim().toLowerCase();
    if (!keyword) return true;
    return item.title.toLowerCase().includes(keyword) || item.body.toLowerCase().includes(keyword);
  });

  input.addEventListener('input', () => ctx.render());

  ctx.toolbar.append(input);
}
