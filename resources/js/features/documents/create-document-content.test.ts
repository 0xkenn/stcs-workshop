import mammoth from 'mammoth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createDocumentContent } from '@/features/documents/create-document-content';

vi.mock('mammoth', () => ({
    default: {
        extractRawText: vi.fn(),
    },
}));

describe('createDocumentContent', () => {
    beforeEach(() => {
        vi.mocked(mammoth.extractRawText).mockReset();
    });

    it('extracts readable paragraphs from a DOCX file', async () => {
        vi.mocked(mammoth.extractRawText).mockResolvedValue({
            messages: [],
            value: 'First paragraph.\n\nSecond paragraph.',
        });

        const content = await createDocumentContent(
            new File(['document'], 'Project brief.docx'),
        );

        expect(content).toEqual({
            kind: 'text',
            heading: 'Project brief',
            paragraphs: ['First paragraph.', 'Second paragraph.'],
        });
    });

    it('provides an empty-document message for a DOCX without text', async () => {
        vi.mocked(mammoth.extractRawText).mockResolvedValue({
            messages: [],
            value: '   ',
        });

        const content = await createDocumentContent(
            new File(['document'], 'Empty.docx'),
        );

        expect(content).toMatchObject({
            kind: 'text',
            paragraphs: ['This document does not contain readable text.'],
        });
    });
});
