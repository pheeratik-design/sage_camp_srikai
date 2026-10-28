// โมดูล B — ค้นหาประกาศ  ·  branch: feature/search
// หน้าเว็บของฟีเจอร์ — ดูเครื่องมือที่ใช้ได้ใน ctx ที่หัวไฟล์ public/app.js

export function init(ctx) {
  // ช่องค้นหาอยู่ใน toolbar — พิมพ์แล้วกรองทันที (ไม่มีปุ่มกด)
  const input = document.createElement('input');
  input.type = 'search';
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
