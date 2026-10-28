// โมดูล B — ค้นหาประกาศ  ·  branch: feature/search
// API ที่ต้องทำ: GET /api/search?q=
// รายละเอียด: การ์ดงาน (Issue) "B — ค้นหาประกาศ" บน Board ของทีม
//
// router = express.Router() ที่ mount ไว้ที่ /api แล้ว (เขียน path โดยไม่ต้องมี /api นำหน้า)
// store  = ตัวเก็บข้อมูล: list() · get(id) · create({title, body}) · update(id, patch) · remove(id)

export function register(router, { store }) {
  // GET /api/search?q=<คำค้น> — ค้นใน title และ body ไม่สนตัวพิมพ์ใหญ่-เล็ก
  // ไม่ใช้ RegExp จากคำค้น (ใช้ includes) เพื่อให้อักขระพิเศษ เช่น "(" ไม่ทำให้ server พัง
  router.get('/search', (req, res) => {
    // Express อาจได้ q เป็น array หรือ object ถ้าส่งซ้ำ จึงรับเฉพาะ string
    const raw = typeof req.query.q === 'string' ? req.query.q : '';
    const keyword = raw.trim().toLowerCase();
    const items = store.list();

    if (!keyword) return res.json(items);

    const results = items.filter(
      (item) =>
        String(item.title ?? '').toLowerCase().includes(keyword) ||
        String(item.body ?? '').toLowerCase().includes(keyword),
    );
    res.json(results);
  });
}
