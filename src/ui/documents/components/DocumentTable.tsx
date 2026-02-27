import { useMemo } from 'react';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { DocumentColumns } from './DocumentColumns';
import DataTable from '@/components/data-table/DataTable';

interface DocumentTableProps {
    documents: DocumentEntity[] | undefined;
    isLoading?: boolean;
}

export default function DocumentTable(props: DocumentTableProps) {
    const { documents, isLoading } = props;
    const columns = useMemo(() => DocumentColumns, []);

    return (
        <DataTable
            data={documents || []}
            columns={columns}
            state={{ isLoading }}
            enablePagination
            initialState={{
                density: 'compact',
                pagination: { pageSize: 15, pageIndex: 0 },
            }}
        />
    );
}
