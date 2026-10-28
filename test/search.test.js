import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let srv;

before(async () => {
  srv = await startTestServer();
});

after(() => srv.close());

test('GET /api/search ค้นไม่สนตัวพิมพ์ใหญ่-เล็ก และเจอประกาศ id 1 (Docker)', async () => {
  const res = await srv.request('GET', '/api/search?q=DOCKER');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.data));
  assert.deepEqual(
    res.data.map((item) => item.id),
    [1],
  );
});

test('GET /api/search ไม่ใส่ q → ได้ทุกรายการ', async () => {
  const res = await srv.request('GET', '/api/search');
  assert.equal(res.status, 200);
  assert.equal(res.data.length, 2);
});

test('GET /api/search ค้นไม่พบ → array ว่าง', async () => {
  const res = await srv.request('GET', '/api/search?q=zzzz');
  assert.equal(res.status, 200);
  assert.deepEqual(res.data, []);
});

test('GET /api/search ค้นได้ทั้งใน title และ body', async () => {
  const byTitle = await srv.request('GET', '/api/search?q=' + encodeURIComponent('เครือข่าย'));
  assert.equal(byTitle.status, 200);
  assert.deepEqual(
    byTitle.data.map((item) => item.id),
    [2],
  );

  const byBody = await srv.request('GET', '/api/search?q=' + encodeURIComponent('อาคาร 1'));
  assert.equal(byBody.status, 200);
  assert.deepEqual(
    byBody.data.map((item) => item.id),
    [2],
  );
});

test('GET /api/search ตัดช่องว่างหัว-ท้ายคำค้นก่อนค้น', async () => {
  const res = await srv.request('GET', '/api/search?q=' + encodeURIComponent('   docker   '));
  assert.equal(res.status, 200);
  assert.deepEqual(
    res.data.map((item) => item.id),
    [1],
  );
});

test('GET /api/search คำค้นที่มีแต่ช่องว่าง → ได้ทุกรายการ', async () => {
  const res = await srv.request('GET', '/api/search?q=' + encodeURIComponent('   '));
  assert.equal(res.status, 200);
  assert.equal(res.data.length, 2);
});

test('GET /api/search คำค้นอักขระพิเศษ "(" ไม่ทำให้ server พัง', async () => {
  const res = await srv.request('GET', '/api/search?q=' + encodeURIComponent('('));
  assert.equal(res.status, 200);
  assert.deepEqual(res.data, []);
});

test('GET /api/search ส่ง q ซ้ำ (array) ไม่ทำให้ server พัง', async () => {
  const res = await srv.request('GET', '/api/search?q=a&q=b');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.data));
});

test('GET /api/search ไม่แก้ไขข้อมูลใน store', async () => {
  const snapshot = JSON.stringify(srv.store.list());
  await srv.request('GET', '/api/search?q=docker');
  await srv.request('GET', '/api/search');
  assert.equal(JSON.stringify(srv.store.list()), snapshot);
});
