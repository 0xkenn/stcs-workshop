import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { createDocumentContent } from '@/features/documents/create-document-content';
import { staticDocuments } from '@/features/documents/data/static-documents';
import {
    filterDocuments,
    prependDocument,
    removeDocumentById,
    replaceDocumentById,
} from '@/features/documents/document-collection';
import { getDocumentFileExtension } from '@/features/documents/file-constraints';
import type { DocumentRecord } from '@/features/documents/types';

export function useDocuments() {
    const previewUrls = useRef(new Map<string, string>());
    const [documents, setDocuments] = useState<DocumentRecord[]>(
        () => staticDocuments,
    );
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const activePreviewUrls = previewUrls.current;

        return () => {
            activePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
            activePreviewUrls.clear();
        };
    }, []);

    const visibleDocuments = useMemo(
        () => filterDocuments(documents, searchQuery),
        [documents, searchQuery],
    );

    const uploadDocument = useCallback(async (file: File) => {
        const documentId = crypto.randomUUID();
        const content = await createDocumentContent(file);

        if (content.kind === 'file') {
            previewUrls.current.set(documentId, content.url);
        }

        const uploadedDocument: DocumentRecord = {
            content,
            id: documentId,
            name: file.name,
            extension: getDocumentFileExtension(file.name),
            sizeInBytes: file.size,
            uploadedAt: new Date().toISOString(),
        };

        setDocuments((currentDocuments) =>
            prependDocument(currentDocuments, uploadedDocument),
        );
    }, []);

    const replaceDocument = useCallback(
        async (documentId: string, file: File) => {
            const content = await createDocumentContent(file);
            const currentPreviewUrl = previewUrls.current.get(documentId);

            if (currentPreviewUrl) {
                URL.revokeObjectURL(currentPreviewUrl);
            }

            if (content.kind === 'file') {
                previewUrls.current.set(documentId, content.url);
            } else {
                previewUrls.current.delete(documentId);
            }

            setDocuments((currentDocuments) => {
                const currentDocument = currentDocuments.find(
                    (document) => document.id === documentId,
                );

                if (!currentDocument) {
                    if (content.kind === 'file') {
                        URL.revokeObjectURL(content.url);
                        previewUrls.current.delete(documentId);
                    }

                    return currentDocuments;
                }

                return replaceDocumentById(currentDocuments, {
                    ...currentDocument,
                    content,
                    name: file.name,
                    extension: getDocumentFileExtension(file.name),
                    sizeInBytes: file.size,
                    uploadedAt: new Date().toISOString(),
                });
            });
        },
        [],
    );

    const deleteDocument = useCallback((documentId: string) => {
        const previewUrl = previewUrls.current.get(documentId);

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            previewUrls.current.delete(documentId);
        }

        setDocuments((currentDocuments) =>
            removeDocumentById(currentDocuments, documentId),
        );
    }, []);

    return {
        deleteDocument,
        replaceDocument,
        searchQuery,
        setSearchQuery,
        uploadDocument,
        visibleDocuments,
    };
}
