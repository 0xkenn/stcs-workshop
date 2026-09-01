import { describe, expect, it } from 'vitest';

import {
    formatFileSize,
    formatUploadDate,
} from '@/features/documents/formatters';

describe('document formatters', () => {
    it('formats byte sizes for the document list', () => {
        expect(formatFileSize(0)).toBe('1 KB');
        expect(formatFileSize(999_999)).toBe('1000 KB');
        expect(formatFileSize(1_500_000)).toBe('1.5 MB');
    });

    it('formats upload dates consistently', () => {
        expect(formatUploadDate('2026-08-30T09:24:00+08:00')).toBe(
            'Aug 30, 2026',
        );
    });
});
