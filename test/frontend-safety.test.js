import { test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

test('index.html does not contain catastrophic syntax corruption', () => {
    const content = fs.readFileSync(path.resolve(__dirname, '../dashboard/index.html'), 'utf-8');
    
    // Check for broken tags (e.g. "< div" or "</ div")
    expect(content).not.toMatch(/<\s+[a-zA-Z]/);
    expect(content).not.toMatch(/<\/\s+[a-zA-Z]/);
    expect(content).not.toMatch(/--\s+>/); 
});

test('main.js does not contain catastrophic syntax corruption', () => {
    const content = fs.readFileSync(path.resolve(__dirname, '../dashboard/main.js'), 'utf-8');
    
    // Basic checks for orphaned logic usually produced by bad regex replaces
    // E.g. orphaned trailing characters 
    expect(content).not.toMatch(/\s+function\s+\(\)\s+\{/); // Unnamed orphaned functions in global
});
