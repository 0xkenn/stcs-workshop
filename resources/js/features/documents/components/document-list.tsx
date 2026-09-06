import { File, FileSpreadsheet, FileText, Search } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DocumentDeleteDialog } from '@/features/documents/components/document-delete-dialog';
import { DocumentPreviewDialog } from '@/features/documents/components/document-preview-dialog';
import { DocumentReplaceButton } from '@/features/documents/components/document-replace-button';
import {
    formatFileSize,
    formatUploadDate,
} from '@/features/documents/formatters';
import styles from '@/features/documents/styles/document-list.module.css';
import type { DocumentRecord } from '@/features/documents/types';

type DocumentListProps = {
    documents: DocumentRecord[];
    searchQuery: string;
    onDelete?: (documentId: string) => void;
    onReplace?: (documentId: string, file: File) => Promise<void>;
    onSearchChange: (query: string) => void;
};

export function DocumentList({
    documents,
    searchQuery,
    onDelete,
    onReplace,
    onSearchChange,
}: DocumentListProps) {
    return (
        <Card className={styles.documentsCard}>
            <CardHeader>
                <div className={styles.listHeader}>
                    <div>
                        <CardTitle>Documents</CardTitle>
                        <CardDescription>
                            Search, view, replace, or delete a document.
                        </CardDescription>
                    </div>
                    <div className={styles.searchField}>
                        <Search size={16} aria-hidden="true" />
                        <Input
                            type="search"
                            value={searchQuery}
                            aria-label="Search documents"
                            placeholder="Search documents"
                            onChange={(event) =>
                                onSearchChange(event.target.value)
                            }
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className={styles.documentListContent}>
                <div className={styles.listLabels} aria-hidden="true">
                    <span>Document</span>
                    <span>Updated</span>
                    <span>Actions</span>
                </div>

                {documents.length > 0 ? (
                    <ul className={styles.documentList}>
                        {documents.map((document) => (
                            <DocumentListItem
                                key={document.id}
                                document={document}
                                onDelete={onDelete}
                                onReplace={onReplace}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className={styles.emptyState}>
                        <Search size={22} aria-hidden="true" />
                        <strong>No documents found</strong>
                        <span>Try another file name.</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

type DocumentListItemProps = {
    document: DocumentRecord;
    onDelete?: (documentId: string) => void;
    onReplace?: (documentId: string, file: File) => Promise<void>;
};

export function DocumentListItem({
    document,
    onDelete,
    onReplace,
}: DocumentListItemProps) {
    const DocumentIcon = getDocumentIcon(document.extension);

    return (
        <li className={styles.documentRow}>
            <div className={styles.documentIdentity}>
                <div
                    className={`${styles.documentIcon} ${styles[`documentIcon${document.extension}`] ?? ''}`}
                >
                    <DocumentIcon size={19} aria-hidden="true" />
                </div>
                <div className={styles.documentName}>
                    <strong>{document.name}</strong>
                    <span>
                        {document.extension} ·{' '}
                        {formatFileSize(document.sizeInBytes)}
                    </span>
                </div>
            </div>

            <time dateTime={document.uploadedAt}>
                {formatUploadDate(document.uploadedAt)}
            </time>

            <div className={styles.documentActions}>
                <DocumentPreviewDialog document={document} />
                <DocumentReplaceButton
                    document={document}
                    onReplace={onReplace}
                />
                <DocumentDeleteDialog document={document} onDelete={onDelete} />
            </div>
        </li>
    );
}

function getDocumentIcon(extension: string) {
    if (['XLS', 'XLSX', 'CSV'].includes(extension)) {
        return FileSpreadsheet;
    }

    if (['PDF', 'DOC', 'DOCX', 'TXT'].includes(extension)) {
        return FileText;
    }

    return File;
}
