import { test, expect } from 'vitest';
import fs from 'fs';
import { execSync } from 'child_process';

test('no secret files tracked by git', () => {
    try {
        const tracked = execSync('git ls-files', { encoding: 'utf-8' });
        const badFiles = ['.env', '.dev.vars', '.env.local', '.env.production'];
        const found = badFiles.filter(f => tracked.split('\n').includes(f));
        expect(found, `Secret files tracked: ${found.join(', ')}`).toEqual([]);
    } catch (e) {
        // If not in a git repo, skip
        console.warn('warning: not a git repo or git not found');
    }
});

test('.gitignore contains required security patterns', () => {
    if (fs.existsSync('.gitignore')) {
        const gitignore = fs.readFileSync('.gitignore', 'utf-8');
        expect(gitignore).toContain('.env');
    }
});

test('no hardcoded secrets in source files', () => {
    const dangerousPatterns = [
        /sk-[a-zA-Z0-9]{40,}/g, // openai/anthropic style tokens
        /AIzaSy[a-zA-Z0-9_-]{33}/g, // Gemini token style
    ];
    const srcDir = 'server';
    if (!fs.existsSync(srcDir)) return;
    
    function scanDir(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const stat = fs.statSync(`${dir}/${file}`);
            if (stat.isDirectory()) {
                scanDir(`${dir}/${file}`);
            } else if (file.endsWith('.js') || file.endsWith('.ts')) {
                const content = fs.readFileSync(`${dir}/${file}`, 'utf-8');
                for (const pattern of dangerousPatterns) {
                    expect(content, `${file} contains potential AI secret token`).not.toMatch(pattern);
                }
            }
        }
    }
    scanDir(srcDir);
});
