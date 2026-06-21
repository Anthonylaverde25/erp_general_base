import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
	page: {
		padding: 24,
		fontSize: 8,
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
		paddingVertical: 6,
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
	colNum: { width: '15%', fontWeight: 'bold' },
	colPartner: { width: '25%' },
	colDate: { width: '10%', textAlign: 'center' },
	colDueDate: { width: '10%', textAlign: 'center' },
	colTotal: { width: '10%', textAlign: 'right' },
	colPaid: { width: '10%', textAlign: 'right' },
	colBalance: { width: '10%', textAlign: 'right', fontWeight: 'bold' },
	colStatus: { width: '10%', textAlign: 'center' },
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
	textRed: {
		color: '#dc2626'
	}
});

interface PendingPDFDocumentProps {
	title: string;
	subtitle: string;
	companyName?: string;
	partnerHeader: string;
	paidHeader: string;
	data: any[];
}

export default function PendingPDFDocument({
	title,
	subtitle,
	companyName = 'N/A',
	partnerHeader,
	paidHeader,
	data
}: PendingPDFDocumentProps) {
	const currencyFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
	const formatVal = (val: number) => currencyFormatter.format(val || 0);

	const totals = data.reduce(
		(acc, doc) => {
			acc.total += doc.total || 0;
			acc.paid += doc.total_paid || 0;
			acc.balance += doc.balance || 0;
			return acc;
		},
		{ total: 0, paid: 0, balance: 0 }
	);

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
						<Text style={styles.colPartner}>{partnerHeader}</Text>
						<Text style={styles.colDate}>F. Emisión</Text>
						<Text style={styles.colDueDate}>F. Vencimiento</Text>
						<Text style={styles.colTotal}>Total</Text>
						<Text style={styles.colPaid}>{paidHeader}</Text>
						<Text style={styles.colBalance}>Pendiente</Text>
						<Text style={styles.colStatus}>Estado</Text>
					</View>

					{/* Data Rows */}
					{data.map((doc, index) => {
						const rowStyle = index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate;
						const formattedIssueDate = doc.issue_date ? doc.issue_date.split('-').reverse().join('/') : 'N/A';
						const formattedDueDate = doc.due_date ? doc.due_date.split('-').reverse().join('/') : 'N/A';
						const docNumber = doc.number_serie || (doc.operation === 'purchase' && doc.external_reference ? doc.external_reference : '(Borrador)');

						return (
							<View key={doc.id || index} style={rowStyle}>
								<Text style={styles.colNum}>{docNumber}</Text>
								<Text style={styles.colPartner}>{doc.partner_name || 'N/A'}</Text>
								<Text style={styles.colDate}>{formattedIssueDate}</Text>
								<Text style={styles.colDueDate}>{formattedDueDate}</Text>
								<Text style={styles.colTotal}>{formatVal(doc.total)}</Text>
								<Text style={styles.colPaid}>{formatVal(doc.total_paid)}</Text>
								<Text style={[styles.colBalance, doc.balance > 0 ? styles.textRed : {}]}>
									{formatVal(doc.balance)}
								</Text>
								<Text style={styles.colStatus}>{doc.status?.name || 'N/A'}</Text>
							</View>
						);
					})}

					{/* Total Summary Row */}
					<View style={styles.totalRow}>
						<Text style={styles.colNum}>TOTALES</Text>
						<Text style={styles.colPartner}></Text>
						<Text style={styles.colDate}></Text>
						<Text style={styles.colDueDate}></Text>
						<Text style={styles.colTotal}>{formatVal(totals.total)}</Text>
						<Text style={styles.colPaid}>{formatVal(totals.paid)}</Text>
						<Text style={[styles.colBalance, totals.balance > 0 ? styles.textRed : {}]}>
							{formatVal(totals.balance)}
						</Text>
						<Text style={styles.colStatus}></Text>
					</View>
				</View>
			</Page>
		</Document>
	);
}
