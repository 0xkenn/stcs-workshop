import type { DocumentContent } from '@/features/documents/types';

// Keep local file parsing disconnected from the template.
// Use the backend preview response when connecting the View button.
export async function createDocumentContent(
    file: File,
): Promise<DocumentContent> {
    if (file.name.toLowerCase().endsWith('.docx')) {
        const mammoth = await import('mammoth');
        const result = await mammoth.default.extractRawText({
            arrayBuffer: await file.arrayBuffer(),
        });
        const paragraphs = result.value
            .split(/\n\s*\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean);

        return {
            kind: 'text',
            heading: file.name.replace(/\.docx$/i, ''),
            paragraphs:
                paragraphs.length > 0
                    ? paragraphs
                    : ['This document does not contain readable text.'],
        };
    }

    return {
        kind: 'file',
        url: URL.createObjectURL(file),
        mimeType: file.type,
    };
}
