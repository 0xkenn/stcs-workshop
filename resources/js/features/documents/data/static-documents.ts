import type { DocumentRecord } from '@/features/documents/types';

export const staticDocuments: DocumentRecord[] = [
    {
        content: {
            kind: 'text',
            heading: 'Q3 Financial Report',
            paragraphs: [
                'Revenue reached $4.8 million in the third quarter, an increase of 18% compared with the previous quarter. Growth was led by renewals and expansion across enterprise accounts.',
                'Operating expenses remained within forecast. Investments in customer support and platform reliability increased, while infrastructure costs declined following the July optimization work.',
                'The team enters Q4 with a healthy pipeline and will prioritize customer retention, disciplined hiring, and completion of the reporting platform rollout.',
            ],
            highlights: [
                'Revenue: $4.8M, up 18% quarter over quarter',
                'Gross margin: 71%',
                'Enterprise renewal rate: 94%',
            ],
        },
        id: 'doc-001',
        name: 'Q3 financial report.pdf',
        extension: 'PDF',
        sizeInBytes: 4_820_000,
        uploadedAt: '2026-08-30T09:24:00+08:00',
    },
    {
        content: {
            kind: 'text',
            heading: 'Product Requirements',
            paragraphs: [
                'The document workspace gives teams one place to upload, find, view, replace, and delete working documents.',
                'The first release focuses on a clear file-management workflow. Every action should provide immediate feedback and remain usable on desktop and mobile screens.',
                'The frontend will begin with local sample data. Its data hook will later be replaced by API requests without changing the presentational components.',
            ],
            highlights: [
                'Upload one document at a time',
                'Search documents by filename',
                'Confirm destructive delete actions',
                'Replace a document by re-uploading a new file',
            ],
        },
        id: 'doc-002',
        name: 'Product requirements.docx',
        extension: 'DOCX',
        sizeInBytes: 1_640_000,
        uploadedAt: '2026-08-29T15:10:00+08:00',
    },
    {
        content: {
            kind: 'text',
            heading: 'Customer Research Notes',
            paragraphs: [
                'Participants consistently described file discovery as the most frustrating part of their current workflow. They wanted search to remain visible and predictable.',
                'Most users understood “re-upload” more quickly than a generic “edit” action because the document itself is the item being replaced.',
                'Users also preferred a confirmation step before deletion, especially when a document might be shared with other members of their team.',
            ],
            highlights: [
                'Keep primary actions close to each document',
                'Use explicit labels instead of ambiguous icons',
                'Show document content before destructive actions',
            ],
        },
        id: 'doc-003',
        name: 'Customer research notes.pdf',
        extension: 'PDF',
        sizeInBytes: 7_210_000,
        uploadedAt: '2026-08-27T11:45:00+08:00',
    },
    {
        content: {
            kind: 'table',
            caption: 'Vendor comparison summary',
            columns: ['Vendor', 'Monthly cost', 'Storage', 'Support'],
            rows: [
                ['Northstar', '$120', '500 GB', 'Email'],
                ['Acme Cloud', '$180', '1 TB', '24/7 chat'],
                ['Paperbox', '$150', '750 GB', 'Business hours'],
                ['Vaultline', '$220', '2 TB', 'Dedicated manager'],
            ],
        },
        id: 'doc-004',
        name: 'Vendor comparison.xlsx',
        extension: 'XLSX',
        sizeInBytes: 930_000,
        uploadedAt: '2026-08-25T16:32:00+08:00',
    },
];
