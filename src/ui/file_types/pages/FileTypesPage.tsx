import { lazy } from 'react';

const FileTypesTabView = lazy(() => import('../components/FileTypesTabView'));

export default function FileTypesPage() {
    return <FileTypesTabView />;
}
