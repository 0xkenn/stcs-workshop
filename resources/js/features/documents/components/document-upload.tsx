import {
    type ChangeEvent,
    type DragEvent,
    type FormEvent,
    useRef,
    useState,
} from 'react';
import { CheckCircle2, FileText, UploadCloud, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    acceptedDocumentFileTypes,
    getDocumentFileValidationError,
} from '@/features/documents/file-constraints';
import { formatFileSize } from '@/features/documents/formatters';
import styles from '@/features/documents/styles/document-upload.module.css';

type DocumentUploadProps = {
    onUpload: (file: File) => Promise<void>;
};

export function DocumentUpload({ onUpload }: DocumentUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(
        null,
    );

    function selectFile(file?: File): void {
        if (!file) {
            return;
        }

        const validationError = getDocumentFileValidationError(file);

        if (validationError) {
            setSelectedFile(null);
            setUploadedFileName(null);
            setUploadError(validationError);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            return;
        }

        setSelectedFile(file);
        setUploadedFileName(null);
        setUploadError(null);
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
        selectFile(event.target.files?.[0]);
    }

    function handleDrop(event: DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        setIsDragging(false);
        selectFile(event.dataTransfer.files[0]);
    }

    function clearSelectedFile(): void {
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        if (!selectedFile) {
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            await onUpload(selectedFile);
            setUploadedFileName(selectedFile.name);
            clearSelectedFile();
        } catch {
            setUploadError(
                'The document could not be read. Check the file and try again.',
            );
        } finally {
            setIsUploading(false);
        }
    }

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
                            Add a file to your shared workspace.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form className={styles.uploadForm} onSubmit={handleSubmit}>
                    <div
                        className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''}`}
                        onDragEnter={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleDrop}
                    >
                        <div className={styles.dropZoneIcon} aria-hidden="true">
                            <UploadCloud size={26} strokeWidth={1.75} />
                        </div>
                        <div className={styles.dropZoneCopy}>
                            <strong>Drop your file here</strong>
                            <span>or choose a file from your computer</span>
                        </div>
                        <Input
                            ref={fileInputRef}
                            className={styles.fileInput}
                            type="file"
                            accept={acceptedDocumentFileTypes}
                            aria-describedby="file-requirements"
                            onChange={handleFileChange}
                        />
                        <span
                            id="file-requirements"
                            className={styles.fileRequirements}
                        >
                            PDF, DOCX, text, PNG, or JPG files up to 25 MB
                        </span>
                    </div>

                    {selectedFile && (
                        <div className={styles.selectedFile}>
                            <div className={styles.selectedFileIcon}>
                                <FileText size={18} aria-hidden="true" />
                            </div>
                            <div className={styles.selectedFileDetails}>
                                <strong>{selectedFile.name}</strong>
                                <span>{formatFileSize(selectedFile.size)}</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Remove ${selectedFile.name}`}
                                onClick={clearSelectedFile}
                            >
                                <X aria-hidden="true" />
                            </Button>
                        </div>
                    )}

                    <Button
                        className={styles.uploadButton}
                        type="submit"
                        size="lg"
                        disabled={!selectedFile || isUploading}
                        aria-busy={isUploading}
                    >
                        <UploadCloud data-icon="inline-start" />
                        {isUploading ? 'Reading document…' : 'Upload document'}
                    </Button>

                    <div className={styles.uploadStatus} aria-live="polite">
                        {uploadError ? (
                            <span className={styles.uploadError}>
                                {uploadError}
                            </span>
                        ) : uploadedFileName ? (
                            <>
                                <CheckCircle2 size={16} aria-hidden="true" />
                                <span>
                                    {uploadedFileName} was added successfully.
                                </span>
                            </>
                        ) : null}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
