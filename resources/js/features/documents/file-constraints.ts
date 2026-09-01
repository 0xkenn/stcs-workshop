const acceptedDocumentExtensions = [
    'pdf',
    'docx',
    'txt',
    'png',
    'jpg',
    'jpeg',
] as const;

export const acceptedDocumentFileTypes = acceptedDocumentExtensions
    .map((extension) => `.${extension}`)
    .join(',');

export const maximumDocumentFileSizeInBytes = 25_000_000;

export function getDocumentFileExtension(fileName: string): string {
    const extension = fileName.split('.').pop();

    return extension?.toUpperCase() || 'FILE';
}

export function getDocumentFileValidationError(file: File): string | null {
    const extension = getDocumentFileExtension(file.name).toLowerCase();

    if (
        !acceptedDocumentExtensions.includes(
            extension as (typeof acceptedDocumentExtensions)[number],
        )
    ) {
        return 'Choose a PDF, DOCX, text, PNG, or JPG file.';
    }

    if (file.size > maximumDocumentFileSizeInBytes) {
        return 'Choose a file smaller than 25 MB.';
    }

    return null;
}
