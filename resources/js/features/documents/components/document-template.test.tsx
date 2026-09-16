import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { DocumentList } from '@/features/documents/components/document-list';
import { DocumentUpload } from '@/features/documents/components/document-upload';
import { staticDocuments } from '@/features/documents/data/static-documents';

describe('document template', () => {
    it('shows sample rows with every document control disabled', () => {
        const markup = renderToStaticMarkup(
            <>
                <DocumentUpload />
                <DocumentList documents={staticDocuments} />
            </>,
        );
        const controls = markup.match(/<(?:button|input)\b[^>]*>/g) ?? [];

        expect(markup).toContain('Q3 financial report.pdf');
        expect(markup).toContain(
            'File uploads are unavailable in this template.',
        );
        expect(controls.length).toBeGreaterThan(0);

        for (const control of controls) {
            expect(control).toMatch(/\sdisabled=""/);
        }

        expect(markup).not.toContain('<form');
        expect(markup).not.toContain('<iframe');
        expect(markup).not.toContain('role="dialog"');
        expect(markup).not.toContain('role="alertdialog"');
    });
});
