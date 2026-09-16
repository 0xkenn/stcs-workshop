import { UploadCloud } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import styles from '@/features/documents/styles/DocumentUpload.module.css';

export function DocumentUpload() {
    // Replace the uploadForm div with an Inertia Form using the Wayfinder upload route.
    // Add file selection and drag-and-drop when that route is ready.
    // Match the accepted file types and size limit to the backend validation rules.
    return (
        <Card className={styles.uploadCard}>
            <CardHeader>
                <div className={styles.cardHeadingRow}>
                    <div className={styles.cardIcon} aria-hidden="true">
                        <UploadCloud size={20} />
                    </div>
                    <div>
                        <CardTitle>Upload a document</CardTitle>
                        <CardDescription>
                            File uploads are unavailable in this template.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className={styles.uploadForm}>
                    <div className={styles.dropZone}>
                        <div className={styles.dropZoneIcon} aria-hidden="true">
                            <UploadCloud size={26} strokeWidth={1.75} />
                        </div>
                        <div className={styles.dropZoneCopy}>
                            <strong>File upload area</strong>
                            <span>
                                File selection and dropping are disabled
                            </span>
                        </div>
                        <Input
                            className={styles.fileInput}
                            type="file"
                            aria-label="Choose a document"
                            aria-describedby="file-requirements"
                            disabled
                        />
                        <span
                            id="file-requirements"
                            className={styles.fileRequirements}
                        >
                            File types and size limits will be shown here.
                        </span>
                    </div>

                    {/* Show the selected file name, size, and a remove button here. */}
                    <Button
                        className={styles.uploadButton}
                        type="button"
                        size="lg"
                        disabled
                    >
                        <UploadCloud data-icon="inline-start" />
                        Upload document
                    </Button>

                    {/* Show upload progress and validation errors here.
                        Clear the picker and show success after the file is saved. */}
                    <div className={styles.uploadStatus} aria-live="polite" />
                </div>
            </CardContent>
        </Card>
    );
}
