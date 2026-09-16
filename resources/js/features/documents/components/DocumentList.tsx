import { Search } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { DocumentListItem } from '@/features/documents/components/DocumentListItem';
import styles from '@/features/documents/styles/DocumentList.module.css';
import type { DocumentRecord } from '@/features/documents/Types';

type DocumentListProps = {
    documents: DocumentRecord[];
};

export function DocumentList({ documents }: DocumentListProps) {
    return (
        <Card className={styles.documentsCard}>
            <CardHeader>
                <div className={styles.listHeader}>
                    <div>
                        <CardTitle>Documents</CardTitle>
                        <CardDescription>
                            Sample rows for the document list layout.
                        </CardDescription>
                    </div>
                    <div className={styles.searchField}>
                        <Search size={16} aria-hidden="true" />
                        {/* Send the search query to the list route using Wayfinder.
                            Display the filtered results and pagination from Inertia props.
                            Add loading and empty states when search is connected. */}
                        <Input
                            type="search"
                            aria-label="Search documents"
                            placeholder="Search documents"
                            disabled
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className={styles.documentListContent}>
                <div className={styles.listLabels} aria-hidden="true">
                    <span>Document</span>
                    <span>Updated</span>
                    <span>Actions</span>
                </div>

                {documents.length > 0 ? (
                    <ul className={styles.documentList}>
                        {documents.map((document) => (
                            <DocumentListItem
                                key={document.id}
                                document={document}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className={styles.emptyState}>
                        <Search size={22} aria-hidden="true" />
                        <strong>No documents found</strong>
                        <span>Try another file name.</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
