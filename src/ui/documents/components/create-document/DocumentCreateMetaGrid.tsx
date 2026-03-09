import { useFormContext, Controller, useWatch } from "react-hook-form";
import { DocumentFormValues } from "../../schemas/documentSchema";
import { useDocumentCreate } from "../../context/DocumentCreateContext";
import { CURRENCY_OPTIONS } from "./types";
import DatePicker from "./DatePicker";

export default function DocumentCreateMetaGrid() {
  const { register, control } = useFormContext<DocumentFormValues>();
  const {
    partnerOptions,
    numberSeries,
    copy,
    isReadOnly,
  } = useDocumentCreate();

  const selectedPartnerId = useWatch({ control, name: "partner_id" });
  const selectedPartner = partnerOptions.find((p) => String(p.id) === String(selectedPartnerId));

  return (
    <section className="doc-meta-grid">
      <div className="doc-meta-cell">
        <label>{copy.partyLabel}</label>
        <select
          className="doc-input doc-input-bold doc-input-primary"
          disabled={isReadOnly}
          {...register("partner_id")}
        >
          <option value="" disabled>
            Seleccionar {copy.partyLabel}
          </option>
          {partnerOptions.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.name}
            </option>
          ))}
        </select>
        {selectedPartner && (selectedPartner.cif || selectedPartner.vat_number) && (
          <div style={{ fontSize: '0.52rem', color: 'var(--doc-text-muted)', marginTop: '0.15rem', display: 'flex', gap: '0.4rem', fontWeight: 600 }}>
            {selectedPartner.cif && <span>CIF: {selectedPartner.cif}</span>}
            {selectedPartner.cif && selectedPartner.vat_number && <span>|</span>}
            {selectedPartner.vat_number && <span>VAT: {selectedPartner.vat_number}</span>}
          </div>
        )}
      </div>

      <div className="doc-meta-cell">
        <label>SERIE</label>
        <select
          className="doc-input doc-input-bold doc-input-primary"
          disabled={isReadOnly}
          {...register("number_series_id")}
        >
          <option value="" disabled>
            Seleccionar serie
          </option>
          {numberSeries.map((ns) => (
            <option key={ns.id} value={ns.id}>
              {ns.serie} ({ns.year})
            </option>
          ))}
        </select>
      </div>

      <div className="doc-meta-cell">
        <label>Nº DOCUMENTO</label>
        <input
          className="doc-input doc-input-bold"
          disabled={isReadOnly}
          {...register("number")}
        />
      </div>

      <div className="doc-meta-cell">
        <label>FECHA OPERACIÓN</label>
        <Controller
          name="issue_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder="Fecha de emisión"
              disabled={isReadOnly}
            />
          )}
        />
      </div>

      <div className="doc-meta-cell">
        <label>VENCIMIENTO</label>
        <Controller
          name="due_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Fecha de vencimiento"
              disabled={isReadOnly}
            />
          )}
        />
      </div>

      <div className="doc-meta-cell">
        <label>DIVISA</label>
        <select
          className="doc-input"
          disabled={isReadOnly}
          {...register("currency")}
        >
          {CURRENCY_OPTIONS.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
