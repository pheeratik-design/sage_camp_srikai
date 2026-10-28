// โมดูล C — ปักหมุดประกาศ  ·  branch: feature/pin
// หน้าเว็บของฟีเจอร์ — ดูเครื่องมือที่ใช้ได้ใน ctx ที่หัวไฟล์ public/app.js

export function init(ctx) {
  ctx.addSorter((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  ctx.addItemHook((item, { title, actions }) => {
    const btn = document.createElement('button');
    btn.className = 'link';
    btn.textContent = item.pinned ? 'เลิกปักหมุด' : 'ปักหมุด';
    btn.onclick = async () => {
      await ctx.api(`/api/announcements/${item.id}/pin`, { method: 'POST' });
      ctx.reload();
    };
    actions.append(btn);

    if (item.pinned) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = '📌 ปักหมุด';
      title.prepend(badge);
    }
  });
}
