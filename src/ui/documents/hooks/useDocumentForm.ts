import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { documentSchema, type DocumentFormValues } from '../schemas/documentSchema';
import { CURRENCY_OPTIONS, makeEmptyLine } from '../components/create-document/types';
import type { DocumentEntity, DocumentLine, DocumentLineTax } from '@/domain/entities/documents/DocumentEntity';

/** Extracts yyyy-MM-dd from an ISO datetime string or returns today */
function extractDate(d: string | null): string {
	if (!d) return new Date().toISOString().split('T')[0];

	return d.split('T')[0];
}

/** Maps a DocumentEntity (API) → DocumentFormValues (react-hook-form) */
export function mapDocumentToFormValues(doc: DocumentEntity): Partial<DocumentFormValues> {
	return {
		partner_id: doc.partner_id ?? '',
		document_type_code: doc.document_type_code || '',
		number_series_id: doc.number_series_id ?? '',
		issue_date: extractDate(doc.issue_date_raw),
		due_date: doc.due_date_raw ? extractDate(doc.due_date_raw) : '',
		number: doc.number_serie || '',
		currency: CURRENCY_OPTIONS[0],
		notes: doc.notes || '',
		tag: '',
		include_legal: false,
		apply_retention: true,
		auto_send: false,
		item_type: 'product',
		lines:
			doc.lines.length > 0
				? doc.lines.map((line: DocumentLine) => ({
						id: String(line.id),
						item_id: line.item_id ?? undefined,
						code: line.name || '',
						description: line.description || '',
						quantity: String(line.quantity),
						unitPrice: String(line.unit_price),
						discount: String(line.discount_percent ?? 0),
						taxes: line.taxes
							? line.taxes.map((t: DocumentLineTax) => ({
									id: t.tax_rate_id ?? t.id ?? 0,
									name: t.name ?? '',
									rate: t.percentage ?? 0,
									tax_type_id: t.tax_rate_id ?? t.id ?? 0,
									tax_type_code: '',
									operation: (t.tax_operation as 'add' | 'subtract') ?? 'add',
									tax_operation: t.tax_operation ?? 'add'
								}))
							: [],
						subtotal: String(line.tax_base),
						has_serials: line.has_serials ?? false,
						has_batches: line.has_batches ?? false,
						serial_numbers: line.meta?.serial_numbers || []
					}))
				: []
	};
}

/** Maps a DocumentEntity (API) → DocumentFormValues for PRE-FILLING a new document (e.g. Albaran -> Factura) */
export function mapSourceDocumentToFormValues(doc: DocumentEntity, targetCode: string): Partial<DocumentFormValues> {
	const base = mapDocumentToFormValues(doc);
	return {
		...base,
		document_type_code: targetCode,
		number_series_id: '', // Let the user or auto-select choose the series
		number: '',
		issue_date: new Date().toISOString().split('T')[0], // Today
		due_date: '' // User must re-calculate or input
	};
}

/** Maps Multiple DocumentEntities → DocumentFormValues for AGGREGATING into a new document */
export function mapSourceDocumentsToFormValues(
	docs: DocumentEntity[],
	targetCode: string
): Partial<DocumentFormValues> {
	if (docs.length === 0) return {};

	// Use the first doc as a base for partner info
	const firstDoc = docs[0];
	const base = mapDocumentToFormValues(firstDoc);

	// Aggregate all lines from all docs
	const allLines: DocumentFormValues['lines'] = [];

	docs.forEach((doc) => {
		const formValues = mapDocumentToFormValues(doc);

		if (formValues.lines) {
			// Tag each line with its source document info
			const taggedLines = formValues.lines.map((line) => ({
				...line,
				source_document_id: String(doc.id),
				source_document_number: doc.number_serie || String(doc.id)
			}));
			allLines.push(...taggedLines);
		}
	});

	// Re-assign temporary unique IDs for the form (keep them unique across all groups)
	const finalLines = allLines.map((line, index) => ({
		...line,
		id: `agg-${index}`
	}));

	// Aggregate notes
	const allNotes = docs
		.map((doc) => (doc.number_serie ? `Ref: ${doc.number_serie}` : ''))
		.filter(Boolean)
		.join('\n');

	return {
		...base,
		document_type_code: targetCode,
		number_series_id: '',
		number: '',
		issue_date: new Date().toISOString().split('T')[0],
		due_date: '',
		lines: finalLines,
		notes: allNotes
	};
}

interface UseDocumentFormOptions {
	code?: string;
	itemType: 'product' | 'service';
	isEditMode: boolean;
	existingDocument: DocumentEntity | undefined;
	sourceDocument?: DocumentEntity | undefined;
	sourceDocuments?: DocumentEntity[];
}

/**
 * Sets up react-hook-form for document create/edit.
 * Uses the `values` prop to auto-sync the form when `existingDocument` loads.
 */
export function useDocumentForm({
	code,
	itemType,
	isEditMode,
	existingDocument,
	sourceDocument,
	sourceDocuments
}: UseDocumentFormOptions) {
	const existingFormValues = useMemo<Partial<DocumentFormValues> | undefined>(() => {
		if (isEditMode && existingDocument) {
			return mapDocumentToFormValues(existingDocument);
		}

		if (!isEditMode && sourceDocuments && sourceDocuments.length > 0 && code) {
			return mapSourceDocumentsToFormValues(sourceDocuments, code);
		}

		if (!isEditMode && sourceDocument && code) {
			return mapSourceDocumentToFormValues(sourceDocument, code);
		}

		return undefined;
	}, [isEditMode, existingDocument, sourceDocument, sourceDocuments, code]);

	const methods = useForm<DocumentFormValues>({
		resolver: zodResolver(documentSchema),
		// `values` causes RHF to auto-reset the entire form (incl. useFieldArray) when data changes
		values: existingFormValues as DocumentFormValues | undefined,
		defaultValues: {
			partner_id: '',
			document_type_code: code || '',
			number_series_id: '',
			issue_date: new Date().toISOString().split('T')[0],
			due_date: '',
			number: '',
			currency: CURRENCY_OPTIONS[0],
			notes: '',
			tag: '',
			include_legal: false,
			apply_retention: true,
			auto_send: false,
			item_type: itemType,
			lines: [makeEmptyLine(0)]
		}
	});

	return methods;
}
