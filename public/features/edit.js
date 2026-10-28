// โมดูล A — แก้ไขประกาศ  ·  branch: feature/edit
// หน้าเว็บของฟีเจอร์ — ดูเครื่องมือที่ใช้ได้ใน ctx ที่หัวไฟล์ public/app.js

export function init(ctx) {
  ctx.addItemHook((item, { actions }) => {
    const edit = el('button', 'link', 'แก้ไข');
    edit.onclick = async () => {
      const title = prompt('หัวข้อใหม่', item.title);
      if (title === null) return;
      const body = prompt('รายละเอียดใหม่', item.body);
      if (body === null) return;
      const res = await ctx.api(`/api/announcements/${item.id}`, {
        method: 'PATCH',
        body: { title, body },
      });
      if (!res.ok) return ctx.notify(res.data.error);
      ctx.reload();
    };
    actions.append(edit);
  });

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
}
