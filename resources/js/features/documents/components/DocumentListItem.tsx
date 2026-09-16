import { File, FileSpreadsheet, FileText } from 'lucide-react';

import { DocumentDeleteDialog } from '@/features/documents/components/DocumentDeleteDialog';
import { DocumentPreviewDialog } from '@/features/documents/components/DocumentPreviewDialog';
import { DocumentReplaceButton } from '@/features/documents/components/DocumentReplaceButton';
import {
    formatFileSize,
    formatUploadDate,
} from '@/features/documents/Formatters';
import styles from '@/features/documents/styles/DocumentList.module.css';
import type { DocumentRecord } from '@/features/documents/Types';

type DocumentListItemProps = {
    document: DocumentRecord;
};

export function DocumentListItem({ document }: DocumentListItemProps) {
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
                <DocumentReplaceButton />
                <DocumentDeleteDialog document={document} />
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
