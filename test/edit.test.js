import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

test('PATCH /api/announcements/:id แก้หัวข้อได้ และ body คงค่าเดิม', async () => {
  const srv = await startTestServer();
  try {
    const res = await srv.request('PATCH', '/api/announcements/1', { title: 'Updated title' });
    assert.equal(res.status, 200);
    assert.equal(res.data.title, 'Updated title');
    assert.equal(res.data.body, 'แอปนี้ใช้ฝึก Git, Pull Request, CI และการ Deploy ด้วย Docker / PM2');

    const got = await srv.request('GET', '/api/announcements/1');
    assert.equal(got.data.title, 'Updated title');
  } finally {
    await srv.close();
  }
});

test('PATCH หัวข้อว่าง → 400', async () => {
  const srv = await startTestServer();
  try {
    const res = await srv.request('PATCH', '/api/announcements/1', { title: '   ' });
    assert.equal(res.status, 400);
    assert.ok(res.data.error);
  } finally {
    await srv.close();
  }
});

test('PATCH ประกาศที่ไม่มีอยู่ → 404', async () => {
  const srv = await startTestServer();
  try {
    const res = await srv.request('PATCH', '/api/announcements/9999', { title: 'x' });
    assert.equal(res.status, 404);
    assert.equal(res.data.error, 'ไม่พบประกาศ');
  } finally {
    await srv.close();
  }
});

test('PATCH ฟิลด์อื่นที่ส่งมา (pinned) ต้องไม่ถูกบันทึก', async () => {
  const srv = await startTestServer();
  try {
    const res = await srv.request('PATCH', '/api/announcements/1', { title: 'Again', pinned: true });
    assert.equal(res.status, 200);
    assert.equal(res.data.pinned, undefined);
    assert.equal(srv.store.get(1).pinned, undefined);
  } finally {
    await srv.close();
  }
});

test('PATCH ส่งแค่ body ได้ และ title ที่ไม่ใช่ข้อความ → 400', async () => {
  const srv = await startTestServer();
  try {
    const bad = await srv.request('PATCH', '/api/announcements/1', { title: 123 });
    assert.equal(bad.status, 400);

    const ok = await srv.request('PATCH', '/api/announcements/1', { body: 'รายละเอียดใหม่' });
    assert.equal(ok.status, 200);
    assert.equal(ok.data.body, 'รายละเอียดใหม่');
    assert.equal(ok.data.title, 'ยินดีต้อนรับสู่บอร์ดประกาศ');
  } finally {
    await srv.close();
  }
});
