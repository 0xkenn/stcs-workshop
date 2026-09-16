import { Head } from '@inertiajs/react';
import { Files } from 'lucide-react';

import { DocumentList } from '@/features/documents/components/document-list';
import { DocumentUpload } from '@/features/documents/components/document-upload';
import { staticDocuments } from '@/features/documents/data/static-documents';
import '@/features/documents/styles/document-theme.module.css';
import styles from '@/features/documents/styles/document-page.module.css';

export default function DocumentManagementPage() {
    // Keep master as a template. Leave document actions disabled.
    // Replace staticDocuments with documents passed by the controller through Inertia.
    // Enable each action when its backend route and permissions are ready.

    return (
        <>
            <Head title="Documents" />

            <div className={styles.page}>
                <header className={styles.header}>
                    <div className={styles.headerInner}>
                        <div className={styles.brand}>
                            <span className={styles.brandMark}>
                                <Files size={19} aria-hidden="true" />
                            </span>
                            Document Management
                        </div>
                    </div>
                </header>

                <main className={styles.main}>
                    <section className={styles.hero}>
                        <span className={styles.eyebrow}>
                            Document workspace template
                        </span>
                        <h1>Everything important, in one calm place.</h1>
                        <p>
                            Sample documents show the workspace layout. All
                            document actions are disabled in this template.
                        </p>
                    </section>

                    <section className={styles.workspaceGrid}>
                        <DocumentUpload />
                        <DocumentList documents={staticDocuments} />
                    </section>
                </main>
            </div>
        </>
    );
}
