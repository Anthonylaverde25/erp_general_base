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
            {/* Top Row: Logo & Document Title */}
            <View style={styles.topRow}>
                {activeCompany?.logo_url ? (
                    <Image src={activeCompany.logo_url} style={styles.logo} />
                ) : (
                    <Text style={styles.logoPlaceholder}>{activeCompany?.name || ''}</Text>
                )}
                <Text style={styles.invoiceTitle}>{document.document_type_name || 'Documento'}</Text>
            </View>

            {/* Middle Row: Company Info & Document Number */}
            <View style={styles.middleRow}>
                <View style={styles.companyInfo}>
                    <Text style={[styles.companyText, { fontWeight: 'bold', color: '#0f172a', fontSize: 9 }]}>
                        {activeCompany?.name || ''}
                    </Text>
                    {activeCompany?.cif && <Text style={styles.companyText}>NIF/CIF: {activeCompany.cif}</Text>}
                    {activeCompany?.addresses?.[0] ? (
                        <>
                            <Text style={styles.companyText}>{activeCompany.addresses[0].street}</Text>
                            {activeCompany.addresses[0].street_2 ? (
                                <Text style={styles.companyText}>{activeCompany.addresses[0].street_2}</Text>
                            ) : null}
                            <Text style={styles.companyText}>
                                {activeCompany.addresses[0].postal_code} {activeCompany.addresses[0].city} ({activeCompany.addresses[0].state})
                            </Text>
                        </>
                    ) : (
                        activeCompany?.address ? <Text style={styles.companyText}>{activeCompany.address}</Text> : null
                    )}
                    {activeCompany?.contacts?.[0]?.phone && (
                        <Text style={styles.companyText}>Tel: {activeCompany.contacts[0].phone}</Text>
                    )}
                    {activeCompany?.contacts?.[0]?.email && (
                        <Text style={styles.companyText}>Email: {activeCompany.contacts[0].email}</Text>
                    )}
                </View>

                <View style={styles.numberContainer}>
                    <Text style={styles.numberLabel}>Nº Documento</Text>
                    <Text style={styles.numberValue}>#{document.number_serie || '(Borrador)'}</Text>
                </View>
            </View>

            {/* Bottom Row: Dates Bar */}
            <View style={styles.datesBar}>
                <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Fecha Emisión: </Text>
                    <Text style={styles.dateValue}>{formatDate(document.issue_date)}</Text>
                </View>
                {document.due_date && (
                    <View style={styles.dateItem}>
                        <Text style={styles.dateLabel}>Fecha Vencimiento: </Text>
                        <Text style={styles.dateValue}>{formatDate(document.due_date)}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
