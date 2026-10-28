// โมดูล A — แก้ไขประกาศ  ·  branch: feature/edit
// API ที่ต้องทำ: PATCH /api/announcements/:id
// รายละเอียด: การ์ดงาน (Issue) "A — แก้ไขประกาศ" บน Board ของทีม
//
// router = express.Router() ที่ mount ไว้ที่ /api แล้ว (เขียน path โดยไม่ต้องมี /api นำหน้า)
// store  = ตัวเก็บข้อมูล: list() · get(id) · create({title, body}) · update(id, patch) · remove(id)
import { validateAnnouncement } from '../validation.js';

export function register(router, { store }) {
  // PATCH = แก้บางส่วน: ฟิลด์ที่ไม่ได้ส่งมาใช้ค่าเดิม แก้ได้เฉพาะ title และ body
  router.patch('/announcements/:id', (req, res) => {
    const current = store.get(Number(req.params.id));
    if (!current) return res.status(404).json({ error: 'ไม่พบประกาศ' });

    const input = req.body;
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
      return res.status(400).json({ error: 'ข้อมูลต้องเป็นอ็อบเจกต์ JSON' });
    }
    for (const key of ['title', 'body']) {
      if (key in input && typeof input[key] !== 'string') {
        return res.status(400).json({ error: `${key} ต้องเป็นข้อความ` });
      }
    }

    // รวมค่าที่ส่งมากับค่าเดิม แล้วตรวจด้วยกติกาชุดเดียวกับตอนสร้างประกาศ
    const merged = {
      title: 'title' in input ? input.title : current.title,
      body: 'body' in input ? input.body : current.body,
    };
    const { errors, value } = validateAnnouncement(merged);
    if (errors.length) return res.status(400).json({ error: errors.join(', ') });

    // บันทึกเฉพาะ title และ body เท่านั้น ฟิลด์อื่นที่ส่งมา (เช่น pinned) จะไม่ถูกบันทึก
    res.json(store.update(current.id, { title: value.title, body: value.body }));
  });
}
