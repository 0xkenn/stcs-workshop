import type { DocumentRecord } from '@/features/documents/Types';

// Use these records to preview the layout only.
// Replace them with Inertia page props when the document list endpoint is ready.
export const staticDocuments: DocumentRecord[] = [
    {
        id: 'doc-001',
        name: 'Q3 financial report.pdf',
        extension: 'PDF',
        sizeInBytes: 4_820_000,
        uploadedAt: '2026-08-30T09:24:00+08:00',
    },
    {
        id: 'doc-002',
        name: 'Product requirements.docx',
        extension: 'DOCX',
        sizeInBytes: 1_640_000,
        uploadedAt: '2026-08-29T15:10:00+08:00',
    },
    {
        id: 'doc-003',
        name: 'Customer research notes.pdf',
        extension: 'PDF',
        sizeInBytes: 7_210_000,
        uploadedAt: '2026-08-27T11:45:00+08:00',
    },
    {
        id: 'doc-004',
        name: 'Vendor comparison.xlsx',
        extension: 'XLSX',
        sizeInBytes: 930_000,
        uploadedAt: '2026-08-25T16:32:00+08:00',
    },
];
