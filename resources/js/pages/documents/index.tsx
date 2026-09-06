import { Head } from '@inertiajs/react';
import { Files } from 'lucide-react';

import { DocumentList } from '@/features/documents/components/document-list';
import { DocumentUpload } from '@/features/documents/components/document-upload';
import { useDocuments } from '@/features/documents/hooks/use-documents';
import '@/features/documents/styles/document-theme.module.css';
import styles from '@/features/documents/styles/document-page.module.css';

export default function DocumentManagementPage() {
    const { searchQuery, setSearchQuery, visibleDocuments } = useDocuments();

    // Supply onUpload, onReplace, and onDelete when the API is ready.

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
                            Document workspace
                        </span>
                        <h1>Everything important, in one calm place.</h1>
                        <p>
                            Upload, find, view, replace, and delete your team’s
                            documents from one simple workspace.
                        </p>
                    </section>

                    <section className={styles.workspaceGrid}>
                        <DocumentUpload />
                        <DocumentList
                            documents={visibleDocuments}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    </section>
                </main>
            </div>
        </>
    );
}
