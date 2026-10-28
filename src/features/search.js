// โมดูล B — ค้นหาประกาศ  ·  branch: feature/search
// API ที่ต้องทำ: GET /api/search?q=
// รายละเอียด: การ์ดงาน (Issue) "B — ค้นหาประกาศ" บน Board ของทีม
//
// router = express.Router() ที่ mount ไว้ที่ /api แล้ว (เขียน path โดยไม่ต้องมี /api นำหน้า)
// store  = ตัวเก็บข้อมูล: list() · get(id) · create({title, body}) · update(id, patch) · remove(id)

export function register(router, { store }) {
  // GET /api/search?q=<คำค้น> — ค้นใน title และ body ไม่สนตัวพิมพ์ใหญ่-เล็ก
  // ใช้ includes แทน RegExp เพื่อให้อักขระพิเศษ เช่น "(" ไม่ทำให้ server พัง
  router.get('/search', (req, res) => {
    // ถ้าส่ง q ซ้ำ Express จะได้ array — รับเฉพาะ string
    const keyword = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
    const items = store.list();

    if (!keyword) return res.json(items);
    res.json(items.filter((item) => matches(item, keyword)));
  });
}

// title และ body ผ่าน validateAnnouncement มาแล้วเสมอ จึงเป็น string
function matches(item, keyword) {
  return item.title.toLowerCase().includes(keyword) || item.body.toLowerCase().includes(keyword);
}
