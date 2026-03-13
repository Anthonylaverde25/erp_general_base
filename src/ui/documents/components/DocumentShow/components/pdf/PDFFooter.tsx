import { View, Text } from '@react-pdf/renderer';
import { CompanyEntity } from '@/domain/entities/companies/Company';
import { styles } from './PDFStyles';

interface PDFFooterProps {
    activeCompany: CompanyEntity;
    pageIndex: number;
    totalPages: number;
}

export const PDFFooter = ({ activeCompany, pageIndex, totalPages }: PDFFooterProps) => {
    return (
        <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Generado por {activeCompany?.name || ''}. Documento generado electrónicamente.</Text>
            <Text style={styles.pageNumberInfo}>Página {pageIndex + 1} de {totalPages}</Text>
        </View>
    );
};
