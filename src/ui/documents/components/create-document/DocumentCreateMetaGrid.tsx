interface DocumentCreateMetaGridProps {
	partyLabel: string;
	partyOptions: string[];
	documentNumber: string;
	currencyOptions: string[];
	topTotal: string;
}

export default function DocumentCreateMetaGrid({
	partyLabel,
	partyOptions,
	documentNumber,
	currencyOptions,
	topTotal
}: DocumentCreateMetaGridProps) {
	return (
		<section className="doc-meta-grid">
			<div className="doc-meta-cell">
				<label>{partyLabel}</label>
				<select
					className="doc-input doc-input-bold doc-input-primary"
					defaultValue={partyOptions[0]}
				>
					{partyOptions.map((party) => (
						<option
							key={party}
							value={party}
						>
							{party}
						</option>
					))}
				</select>
			</div>

			<div className="doc-meta-cell">
				<label>Nº DOCUMENTO</label>
				<input
					className="doc-input doc-input-bold"
					defaultValue={documentNumber}
				/>
			</div>

			<div className="doc-meta-cell">
				<label>FECHA OPERACIÓN</label>
				<input
					className="doc-input"
					defaultValue="26/02/2026"
				/>
			</div>

			<div className="doc-meta-cell">
				<label>VENCIMIENTO</label>
				<input
					className="doc-input doc-input-primary"
					defaultValue="28/03/2026"
				/>
			</div>

			<div className="doc-meta-cell">
				<label>DIVISA</label>
				<select
					className="doc-input"
					defaultValue={currencyOptions[0]}
				>
					{currencyOptions.map((currency) => (
						<option
							key={currency}
							value={currency}
						>
							{currency}
						</option>
					))}
				</select>
			</div>

			<div className="doc-meta-cell doc-meta-total">
				<label>IMP. TOTAL</label>
				<div>{topTotal}</div>
			</div>
		</section>
	);
}
