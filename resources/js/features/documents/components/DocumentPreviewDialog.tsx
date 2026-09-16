import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/Dialog';
import {
    formatFileSize,
    formatUploadDate,
} from '@/features/documents/Formatters';
import styles from '@/features/documents/styles/DocumentPreviewDialog.module.css';
import type { DocumentRecord } from '@/features/documents/Types';

type DocumentPreviewDialogProps = {
    document: DocumentRecord;
};

export function DocumentPreviewDialog({
    document,
}: DocumentPreviewDialogProps) {
    // Enable View when the backend preview route is ready and the user has access.
    // Load the preview through Wayfinder when the dialog opens.
    // Show loading, unsupported-file, and error states inside the dialog.
    return (
        <Dialog>
            <DialogTrigger
                disabled
                render={<Button variant="ghost" size="sm" />}
            >
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

                {/* Display the content or preview URL returned by the backend here. */}
                <p>Document preview placeholder.</p>

                <DialogFooter showCloseButton />
            </DialogContent>
        </Dialog>
    );
}
