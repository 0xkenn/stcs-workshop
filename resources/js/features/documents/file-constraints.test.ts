import { describe, expect, it } from 'vitest';

import {
    acceptedDocumentFileTypes,
    getDocumentFileExtension,
    getDocumentFileValidationError,
    maximumDocumentFileSizeInBytes,
} from '@/features/documents/file-constraints';

function createFile(name: string, sizeInBytes = 1_000): File {
    return new File([new Uint8Array(sizeInBytes)], name);
}

describe('document file constraints', () => {
    it('keeps the picker extensions in sync with validation', () => {
        expect(acceptedDocumentFileTypes).toBe(
            '.pdf,.docx,.txt,.png,.jpg,.jpeg',
        );

        for (const extension of acceptedDocumentFileTypes.split(',')) {
            expect(
                getDocumentFileValidationError(
                    createFile(`document${extension.toUpperCase()}`),
                ),
            ).toBeNull();
        }
    });

    it('rejects unsupported file extensions', () => {
        expect(getDocumentFileValidationError(createFile('archive.zip'))).toBe(
            'Choose a PDF, DOCX, text, PNG, or JPG file.',
        );
    });

    it('rejects files larger than the maximum size', () => {
        expect(
            getDocumentFileValidationError(
                createFile('large.pdf', maximumDocumentFileSizeInBytes + 1),
            ),
        ).toBe('Choose a file smaller than 25 MB.');
    });

    it('returns a normalized extension', () => {
        expect(getDocumentFileExtension('report.final.docx')).toBe('DOCX');
        expect(getDocumentFileExtension('README')).toBe('README');
    });
});
