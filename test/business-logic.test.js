import { test, expect } from 'vitest';

export function parseStdout(line) {
    if (line.includes('Error:') || line.includes('ERR')) return 'error';
    if (line.includes('Done') || line.includes('completed')) return 'completed';
    return 'running';
}

test('parseStdout classifies logs correctly', () => {
    expect(parseStdout('[CLI] Done processing')).toBe('completed');
    expect(parseStdout('[CLI ERR] Cannot find element')).toBe('error');
    expect(parseStdout('Navigating to url...')).toBe('running');
});
