import { View, Text } from '@react-pdf/renderer';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { CompanyEntity } from '@/domain/entities/companies/Company';
import { styles } from './PDFStyles';

interface PDFStatusStampProps {
    document: DocumentEntity;
    activeCompany: CompanyEntity;
}

export const PDFStatusStamp = ({ document, activeCompany }: PDFStatusStampProps) => {
    const isQuo = document.document_type_code === 'QUO' || document.document_type_code === 'PQUO';
    const status = document.status?.key;
    const isApproved = status === 'approved';
    const isRejected = status === 'rejected';

    if (!isQuo || (!isApproved && !isRejected)) return null;

    const color = isApproved ? '#065f46' : '#991b1b';
    const borderColor = isApproved ? '#10b981' : '#ef4444';
    const text = isApproved ? 'Aprobado' : 'Rechazado';

    return (
        <View style={[styles.stampContainer, { borderColor }]}>
            <Text style={[styles.stampText, { color }]}>{text}</Text>
            <Text style={[styles.stampSubtext, { color: isApproved ? '#10b981' : '#ef4444' }]}>
                {activeCompany?.name || ''}
            </Text>
        </View>
    );
};
