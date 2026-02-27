import type { DocumentFooterTotals } from './types';

interface DocumentCreateFooterProps {
	totals: DocumentFooterTotals;
}

export default function DocumentCreateFooter({ totals }: DocumentCreateFooterProps) {
	return (
		<footer className="doc-footer">
			<div className="doc-footer-section doc-footer-params">
				<h3>Parámetros</h3>
				<label>
					<input type="checkbox" />
					<span>Incluir cláusulas legales</span>
				</label>
				<label>
					<input
						type="checkbox"
						defaultChecked
					/>
					<span>Aplicar retención IRPF (15%)</span>
				</label>
				<label>
					<input type="checkbox" />
					<span>Envío automático Email</span>
				</label>
			</div>

			<div className="doc-footer-section doc-footer-notes">
				<div>
					<h3>Observaciones</h3>
					<textarea placeholder="Notas de facturación interna..." />
				</div>
				<div>
					<h3>Etiquetado</h3>
					<input
						type="text"
						placeholder="Presupuesto, Urgente..."
					/>
					<div className="doc-tag-wrap">
						<span className="doc-tag doc-tag-primary">Ventas_Q1</span>
						<span className="doc-tag">Internacional</span>
					</div>
				</div>
			</div>

			<div className="doc-footer-section doc-footer-totals">
				<div className="doc-total-card">
					<div>
						<span>Base Imponible</span>
						<strong>{totals.taxBase}</strong>
					</div>
					<div>
						<span>IVA Total</span>
						<strong>{totals.taxAmount}</strong>
					</div>
					<div>
						<span className="doc-text-danger">Retención IRPF</span>
						<strong className="doc-text-danger">{totals.withholding}</strong>
					</div>
					<div className="doc-total-separator"></div>
					<div className="doc-net-total">
						<span>Neto a Pagar</span>
						<strong>{totals.netPayable}</strong>
					</div>
				</div>
			</div>
		</footer>
	);
}
