import { type ChangeEvent, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    acceptedDocumentFileTypes,
    getDocumentFileValidationError,
} from '@/features/documents/file-constraints';
import styles from '@/features/documents/styles/document-actions.module.css';
import type { DocumentRecord } from '@/features/documents/types';

type DocumentReplaceButtonProps = {
    document: DocumentRecord;
    onReplace: (documentId: string, file: File) => Promise<void>;
};

export function DocumentReplaceButton({
    document,
    onReplace,
}: DocumentReplaceButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isReplacing, setIsReplacing] = useState(false);
    const [replaceError, setReplaceError] = useState<string | null>(null);

    async function handleFileChange(
        event: ChangeEvent<HTMLInputElement>,
    ): Promise<void> {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const validationError = getDocumentFileValidationError(file);

        if (validationError) {
            setReplaceError(validationError);
            event.target.value = '';

            return;
        }

        setIsReplacing(true);
        setReplaceError(null);

        try {
            await onReplace(document.id, file);
        } catch {
            setReplaceError('The replacement file could not be read.');
        } finally {
            setIsReplacing(false);
            event.target.value = '';
        }
    }

    return (
        <>
            <Input
                ref={fileInputRef}
                className={styles.hiddenFileInput}
                type="file"
                tabIndex={-1}
                accept={acceptedDocumentFileTypes}
                aria-hidden="true"
                onChange={handleFileChange}
            />
            <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isReplacing}
                aria-busy={isReplacing}
                onClick={() => fileInputRef.current?.click()}
            >
                <RefreshCw data-icon="inline-start" />
                {isReplacing ? 'Reading…' : 'Re-upload'}
            </Button>
            {replaceError && (
                <span className={styles.actionError} role="alert">
                    {replaceError}
                </span>
            )}
        </>
    );
}
