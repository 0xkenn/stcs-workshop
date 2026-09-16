import type { Auth } from '@/types/Auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            [key: string]: unknown;
        };
    }
}
