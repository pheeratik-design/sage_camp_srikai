import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

test('POST /api/announcements/:id/pin สลับค่า pinned เป็น true แล้ว false', async () => {
  const srv = await startTestServer();
  try {
    const first = await srv.request('POST', '/api/announcements/2/pin');
    assert.equal(first.status, 200);
    assert.equal(first.data.pinned, true);

    const second = await srv.request('POST', '/api/announcements/2/pin');
    assert.equal(second.status, 200);
    assert.equal(second.data.pinned, false);
  } finally {
    await srv.close();
  }
});

test('POST /api/announcements/:id/pin ประกาศไม่พบ → 404', async () => {
  const srv = await startTestServer();
  try {
    const res = await srv.request('POST', '/api/announcements/9999/pin');
    assert.equal(res.status, 404);
    assert.equal(res.data.error, 'ไม่พบประกาศ');
  } finally {
    await srv.close();
  }
});
