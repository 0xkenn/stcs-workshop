export function formatFileSize(sizeInBytes: number): string {
    if (sizeInBytes < 1_000_000) {
        return `${Math.max(1, Math.round(sizeInBytes / 1_000))} KB`;
    }

    return `${(sizeInBytes / 1_000_000).toFixed(1)} MB`;
}

export function formatUploadDate(uploadedAt: string): string {
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(uploadedAt));
}
