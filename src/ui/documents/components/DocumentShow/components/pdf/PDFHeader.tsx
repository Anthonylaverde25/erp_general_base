import { View, Text, Image } from '@react-pdf/renderer';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { CompanyEntity } from '@/domain/entities/companies/Company';
import { styles } from './PDFStyles';
import { formatDate } from './PDFUtils';

interface PDFHeaderProps {
    document: DocumentEntity;
    activeCompany: CompanyEntity;
    isFirstPage: boolean;
}

export const PDFHeader = ({ document, activeCompany, isFirstPage }: PDFHeaderProps) => {
    if (!isFirstPage) {
        return (
            <View style={styles.miniHeader}>
                {activeCompany?.logo_url ? (
                    <Image src={activeCompany.logo_url} style={styles.miniHeaderLogo} />
                ) : (
                    <Text style={styles.miniHeaderText}>{activeCompany?.name || ''}</Text>
                )}
                <View style={styles.miniHeaderMetaRow}>
                    <Text style={styles.miniHeaderText}>Nº {document.number_serie || '(Borrador)'}</Text>
                    <Text style={styles.miniHeaderText}>• </Text>
                    <Text style={styles.miniHeaderText}>{formatDate(document.issue_date)}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.header}>
            <View style={styles.companyInfo}>
                {activeCompany?.logo_url ? (
                    <Image src={activeCompany.logo_url} style={styles.logo} />
                ) : (
                    <Text style={styles.logoPlaceholder}>{activeCompany?.name || ''}</Text>
                )}
                <Text style={styles.companyText}>{activeCompany?.name || ''}</Text>
                {activeCompany?.cif && <Text style={styles.companyText}>CIF: {activeCompany.cif}</Text>}
                <Text style={styles.companyText}>{activeCompany?.address || ''}</Text>
            </View>

            <View style={styles.headerRight}>
                <Text style={styles.invoiceTitle}>{document.document_type_name || 'Documento'}</Text>
                <View style={styles.metaGrid}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Nº Documento</Text>
                        <Text style={styles.metaValue}>#{document.number_serie || '(Borrador)'}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Fecha</Text>
                        <Text style={styles.metaValue}>{formatDate(document.issue_date)}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
