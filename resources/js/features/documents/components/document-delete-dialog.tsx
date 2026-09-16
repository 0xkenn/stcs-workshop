import { Trash2 } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import styles from '@/features/documents/styles/document-actions.module.css';
import type { DocumentRecord } from '@/features/documents/types';

type DocumentDeleteDialogProps = {
    document: DocumentRecord;
};

export function DocumentDeleteDialog({ document }: DocumentDeleteDialogProps) {
    // Enable Delete when the backend route is ready and the user has permission.
    // Send the document ID to the Wayfinder DELETE route after confirmation.
    // Disable confirmation while deleting and show any errors in the dialog.
    // Close the dialog and refresh the list after the request succeeds.
    return (
        <AlertDialog>
            <AlertDialogTrigger
                disabled
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className={styles.deleteButton}
                    />
                }
            >
                <Trash2 />
                <span className="sr-only">Delete {document.name}</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia>
                        <Trash2 aria-hidden="true" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete this document?</AlertDialogTitle>
                    <AlertDialogDescription>
                        “{document.name}” will be removed from the document
                        list. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" disabled>
                        Delete document
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
