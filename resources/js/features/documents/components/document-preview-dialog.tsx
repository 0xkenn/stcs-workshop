import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    formatFileSize,
    formatUploadDate,
} from '@/features/documents/formatters';
import styles from '@/features/documents/styles/document-preview.module.css';
import type {
    DocumentContent,
    DocumentRecord,
} from '@/features/documents/types';

type DocumentPreviewDialogProps = {
    document: DocumentRecord;
};

export function DocumentPreviewDialog({
    document,
}: DocumentPreviewDialogProps) {
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="ghost" size="sm" />}>
                <Eye data-icon="inline-start" />
                View
            </DialogTrigger>
            <DialogContent className={styles.previewDialog}>
                <DialogHeader>
                    <DialogTitle>{document.name}</DialogTitle>
                    <DialogDescription>
                        {document.extension} ·{' '}
                        {formatFileSize(document.sizeInBytes)} · Updated{' '}
                        {formatUploadDate(document.uploadedAt)}
                    </DialogDescription>
                </DialogHeader>

                <DocumentContentPreview
                    content={document.content}
                    documentName={document.name}
                />

                <DialogFooter showCloseButton />
            </DialogContent>
        </Dialog>
    );
}

type DocumentContentPreviewProps = {
    content: DocumentContent;
    documentName: string;
};

function DocumentContentPreview({
    content,
    documentName,
}: DocumentContentPreviewProps) {
    if (content.kind === 'file') {
        if (content.mimeType.startsWith('image/')) {
            return (
                <div className={styles.filePreview}>
                    <img src={content.url} alt={`Preview of ${documentName}`} />
                </div>
            );
        }

        return (
            <iframe
                className={styles.filePreviewFrame}
                src={content.url}
                title={`Preview of ${documentName}`}
            />
        );
    }

    if (content.kind === 'table') {
        return (
            <div className={styles.tablePreview}>
                <table>
                    <caption>{content.caption}</caption>
                    <thead>
                        <tr>
                            {content.columns.map((column) => (
                                <th key={column} scope="col">
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {content.rows.map((row) => (
                            <tr key={row.join('-')}>
                                {row.map((cell, index) => (
                                    <td key={`${index}-${cell}`}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <article className={styles.textPreview}>
            <h2>{content.heading}</h2>
            {content.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
            ))}
            {content.highlights && (
                <section>
                    <h3>Highlights</h3>
                    <ul>
                        {content.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                        ))}
                    </ul>
                </section>
            )}
        </article>
    );
}
