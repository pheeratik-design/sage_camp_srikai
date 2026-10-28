// โมดูล C — ปักหมุดประกาศ  ·  branch: feature/pin
// API ที่ต้องทำ: POST /api/announcements/:id/pin
// รายละเอียด: การ์ดงาน (Issue) "C — ปักหมุดประกาศ" บน Board ของทีม
//
// router = express.Router() ที่ mount ไว้ที่ /api แล้ว (เขียน path โดยไม่ต้องมี /api นำหน้า)
// store  = ตัวเก็บข้อมูล: list() · get(id) · create({title, body}) · update(id, patch) · remove(id)

export function register(router, { store }) {
  router.post('/announcements/:id/pin', (req, res) => {
    const id = Number(req.params.id);
    const item = store.get(id);
    if (!item) return res.status(404).json({ error: 'ไม่พบประกาศ' });
    const updated = store.update(id, { pinned: !item.pinned });
    res.json(updated);
  });
}
