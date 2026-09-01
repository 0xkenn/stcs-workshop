import { describe, expect, it } from 'vitest';

import {
    filterDocuments,
    prependDocument,
    removeDocumentById,
    replaceDocumentById,
} from '@/features/documents/document-collection';
import type { DocumentRecord } from '@/features/documents/types';

function createDocument(
    id: string,
    name = `Document ${id}.pdf`,
): DocumentRecord {
    return {
        content: {
            kind: 'text',
            heading: name,
            paragraphs: ['Document content'],
        },
        id,
        name,
        extension: 'PDF',
        sizeInBytes: 1_000,
        uploadedAt: '2026-08-30T09:24:00+08:00',
    };
}

describe('document collection', () => {
    it('filters by file name without changing the source collection', () => {
        const documents = [
            createDocument('1', 'Quarterly Report.pdf'),
            createDocument('2', 'Meeting Notes.docx'),
        ];

        const result = filterDocuments(documents, '  REPORT ');

        expect(result).toEqual([documents[0]]);
        expect(documents).toHaveLength(2);
    });

    it('returns the source collection for an empty query', () => {
        const documents = [createDocument('1')];

        expect(filterDocuments(documents, '   ')).toBe(documents);
    });

    it('prepends a document without mutating the source collection', () => {
        const documents = [createDocument('1')];
        const uploadedDocument = createDocument('2');

        expect(prependDocument(documents, uploadedDocument)).toEqual([
            uploadedDocument,
            documents[0],
        ]);
        expect(documents).toHaveLength(1);
    });

    it('replaces only the matching document', () => {
        const documents = [createDocument('1'), createDocument('2')];
        const replacement = createDocument('2', 'Updated document.docx');

        expect(replaceDocumentById(documents, replacement)).toEqual([
            documents[0],
            replacement,
        ]);
    });

    it('removes only the matching document', () => {
        const documents = [createDocument('1'), createDocument('2')];

        expect(removeDocumentById(documents, '1')).toEqual([documents[1]]);
        expect(documents).toHaveLength(2);
    });
});
