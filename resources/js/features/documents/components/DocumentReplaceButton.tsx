import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/Button';

export function DocumentReplaceButton() {
    // Accept the document ID and add a file picker for its replacement.
    // Submit the file through an Inertia form using the Wayfinder replacement route.
    // Show validation errors and disable the button while saving.
    // Refresh the row after success. Keep the original document if the request fails.
    return (
        <Button type="button" variant="outline" size="sm" disabled>
            <RefreshCw data-icon="inline-start" />
            Re-upload
        </Button>
    );
}
