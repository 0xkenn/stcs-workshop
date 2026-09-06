import { useMemo, useState } from 'react';

import { staticDocuments } from '@/features/documents/data/static-documents';
import { filterDocuments } from '@/features/documents/document-collection';

export function useDocuments() {
    const [searchQuery, setSearchQuery] = useState('');

    const visibleDocuments = useMemo(
        () => filterDocuments(staticDocuments, searchQuery),
        [searchQuery],
    );

    return {
        searchQuery,
        setSearchQuery,
        visibleDocuments,
    };
}
