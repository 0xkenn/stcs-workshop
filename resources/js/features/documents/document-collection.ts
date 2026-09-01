import type { DocumentRecord } from '@/features/documents/types';

export function filterDocuments(
    documents: DocumentRecord[],
    searchQuery: string,
): DocumentRecord[] {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
        return documents;
    }

    return documents.filter((document) =>
        document.name.toLowerCase().includes(normalizedQuery),
    );
}

export function prependDocument(
    documents: DocumentRecord[],
    document: DocumentRecord,
): DocumentRecord[] {
    return [document, ...documents];
}

export function replaceDocumentById(
    documents: DocumentRecord[],
    replacement: DocumentRecord,
): DocumentRecord[] {
    return documents.map((document) =>
        document.id === replacement.id ? replacement : document,
    );
}

export function removeDocumentById(
    documents: DocumentRecord[],
    documentId: string,
): DocumentRecord[] {
    return documents.filter((document) => document.id !== documentId);
}
