import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
	page: {
		padding: 24,
		fontSize: 7.5,
		fontFamily: 'Helvetica',
		backgroundColor: '#ffffff'
	},
	headerContainer: {
		borderBottomWidth: 1.5,
		borderBottomColor: '#0f172a',
		paddingBottom: 8,
		marginBottom: 12,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end'
	},
	titleSection: {
		display: 'flex',
		flexDirection: 'column'
	},
	title: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#0f172a'
	},
	subtitle: {
		fontSize: 8,
		color: '#475569',
		marginTop: 2
	},
	companyInfo: {
		textAlign: 'right',
		fontSize: 8,
		color: '#334155'
	},
	table: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%'
	},
	tableHeaderRow: {
		flexDirection: 'row',
		backgroundColor: '#f1f5f9',
		borderBottomWidth: 1,
		borderBottomColor: '#94a3b8',
		paddingVertical: 5,
		paddingHorizontal: 4,
		fontWeight: 'bold'
	},
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: 0.5,
		borderBottomColor: '#cbd5e1',
		paddingVertical: 5,
		paddingHorizontal: 4,
		alignItems: 'center'
	},
	tableRowAlternate: {
		flexDirection: 'row',
		borderBottomWidth: 0.5,
		borderBottomColor: '#cbd5e1',
		backgroundColor: '#f8fafc',
		paddingVertical: 5,
		paddingHorizontal: 4,
		alignItems: 'center'
	},
	colNum: { width: '10%', fontWeight: 'bold' },
	colPartner: { width: '18%' },
	colDate: { width: '8%', textAlign: 'center' },
	colBase: { width: '8%', textAlign: 'right' },
	colIva: { width: '10%', textAlign: 'right' },
	colWithholding: { width: '9%', textAlign: 'right' },
	colSurcharge: { width: '9%', textAlign: 'right' },
	colDiscount: { width: '7%', textAlign: 'right' },
	colTotal: { width: '9%', textAlign: 'right', fontWeight: 'bold' },
	colPayment: { width: '7%', textAlign: 'center' },
	colStatus: { width: '5%', textAlign: 'center' },
	totalRow: {
		flexDirection: 'row',
		borderTopWidth: 1.5,
		borderTopColor: '#0f172a',
		backgroundColor: '#f1f5f9',
		paddingVertical: 6,
		paddingHorizontal: 4,
		fontWeight: 'bold',
		marginTop: 6
	},
	textSecondary: {
		color: '#475569'
	},
	textRed: {
		color: '#dc2626'
	}
});

interface AccountingPDFDocumentProps {
	title: string;
	subtitle: string;
	companyName?: string;
	data: any[];
}

export default function AccountingPDFDocument({ title, subtitle, companyName = 'N/A', data }: AccountingPDFDocumentProps) {
	const currencyFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
	const formatVal = (val: number) => currencyFormatter.format(val || 0);

	// Calculate totals for the document
	const totals = data.reduce(
		(acc, doc) => {
			acc.subtotal += doc.subtotal || 0;
			acc.discount += doc.discount_total || 0;
			acc.total += doc.total || 0;

			// Aggregate taxes by type
			(doc.tax_summaries || []).forEach((s: any) => {
				if (s.tax_type_code === 'vat') acc.iva += s.tax_amount || 0;
				else if (s.tax_type_code === 'withholding') acc.withholding += s.tax_amount || 0;
				else if (s.tax_type_code === 'surcharge') acc.surcharge += s.tax_amount || 0;
			});

			return acc;
		},
		{ subtotal: 0, iva: 0, withholding: 0, surcharge: 0, discount: 0, total: 0 }
	);

	const renderTaxSummary = (doc: any, typeCode: 'vat' | 'withholding' | 'surcharge') => {
		const summaries = (doc.tax_summaries || []).filter((s: any) => s.tax_type_code === typeCode);
		if (summaries.length === 0) return 'No aplica';
		return summaries.map((s: any) => `${s.name}: ${formatVal(s.tax_amount)}`).join('\n');
	};

	return (
		<Document>
			<Page size="A4" orientation="landscape" style={styles.page}>
				{/* Header Section */}
				<View style={styles.headerContainer}>
					<View style={styles.titleSection}>
						<Text style={styles.title}>{title}</Text>
						<Text style={styles.subtitle}>{subtitle}</Text>
					</View>
					<View style={styles.companyInfo}>
						<Text style={{ fontWeight: 'bold' }}>{companyName}</Text>
						<Text style={styles.subtitle}>Fecha de Generación: {new Date().toLocaleDateString('es-ES')}</Text>
					</View>
				</View>

				{/* Table Grid */}
				<View style={styles.table}>
					{/* Header Row */}
					<View style={styles.tableHeaderRow}>
						<Text style={styles.colNum}>Número</Text>
						<Text style={styles.colPartner}>Cliente/Proveedor</Text>
						<Text style={styles.colDate}>Fecha</Text>
						<Text style={styles.colBase}>Base Imp.</Text>
						<Text style={styles.colIva}>IVA</Text>
						<Text style={styles.colWithholding}>Retenciones</Text>
						<Text style={styles.colSurcharge}>Recargo Eq.</Text>
						<Text style={styles.colDiscount}>Descuento</Text>
						<Text style={styles.colTotal}>Total</Text>
						<Text style={styles.colPayment}>Método Pago</Text>
						<Text style={styles.colStatus}>Estado</Text>
					</View>

					{/* Data Rows */}
					{data.map((doc, index) => {
						const rowStyle = index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate;
						const formattedDate = doc.issue_date ? doc.issue_date.split('-').reverse().join('/') : 'N/A';

						return (
							<View key={doc.id || index} style={rowStyle}>
								<Text style={styles.colNum}>{doc.number_serie}</Text>
								<Text style={styles.colPartner}>{doc.partner_name || 'N/A'}</Text>
								<Text style={styles.colDate}>{formattedDate}</Text>
								<Text style={styles.colBase}>{formatVal(doc.subtotal)}</Text>
								<Text style={styles.colIva}>{renderTaxSummary(doc, 'vat')}</Text>
								<Text style={[styles.colWithholding, (doc.tax_summaries || []).some((s: any) => s.tax_type_code === 'withholding') ? styles.textRed : {}]}>
									{renderTaxSummary(doc, 'withholding')}
								</Text>
								<Text style={styles.colSurcharge}>{renderTaxSummary(doc, 'surcharge')}</Text>
								<Text style={[styles.colDiscount, doc.discount_total > 0 ? styles.textRed : {}]}>
									{formatVal(doc.discount_total)}
								</Text>
								<Text style={styles.colTotal}>{formatVal(doc.total)}</Text>
								<Text style={styles.colPayment}>{doc.payment_method_name || 'N/A'}</Text>
								<Text style={styles.colStatus}>{doc.status?.name || 'N/A'}</Text>
							</View>
						);
					})}

					{/* Total Summary Row */}
					<View style={styles.totalRow}>
						<Text style={styles.colNum}>TOTALES</Text>
						<Text style={styles.colPartner}></Text>
						<Text style={styles.colDate}></Text>
						<Text style={styles.colBase}>{formatVal(totals.subtotal)}</Text>
						<Text style={styles.colIva}>{formatVal(totals.iva)}</Text>
						<Text style={[styles.colWithholding, totals.withholding > 0 ? styles.textRed : {}]}>
							{formatVal(totals.withholding)}
						</Text>
						<Text style={styles.colSurcharge}>{formatVal(totals.surcharge)}</Text>
						<Text style={[styles.colDiscount, totals.discount > 0 ? styles.textRed : {}]}>
							{formatVal(totals.discount)}
						</Text>
						<Text style={styles.colTotal}>{formatVal(totals.total)}</Text>
						<Text style={styles.colPayment}></Text>
						<Text style={styles.colStatus}></Text>
					</View>
				</View>
			</Page>
		</Document>
	);
}
