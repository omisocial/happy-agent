import { test, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../server/index.js'; // The exported express app

test('GET /api/skills returns skills list', async () => {
    const res = await request(app).get('/api/skills');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

test('POST /api/jobs expects valid input and should handle missing payload gracefully', async () => {
    const res = await request(app)
        .post('/api/jobs')
        .send({}); // missing skill and profile

    // We expect the server NOT to crash. 
    // Wait, the current implementation doesn't validate and will just use undefined, which doesn't crash but is bad.
    // Let's assert it returns success because currently there's no validation. 
    // In our verification phase, we will FIX the source code to fail properly. For now we will test what happens.
    // Let's write the expected correct behavior: it should return 400 Bad Request.
    expect(res.status).toBe(400); 
    expect(res.body.success).toBe(false);
});
