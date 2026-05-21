import { useFormContext, Controller, useWatch } from "react-hook-form";
import { DocumentFormValues } from "../../schemas/documentSchema";
import { useDocumentCreate } from "../../context/DocumentCreateContext";
import { CURRENCY_OPTIONS } from "./types";
import DatePicker from "./DatePicker";
import { PartnerAutocomplete } from "./PartnerAutocomplete";
import { useParams } from "react-router";

export default function DocumentCreateMetaGrid() {
  const { register, control, formState: { errors } } = useFormContext<DocumentFormValues>();
  const {
    partnerOptions,
    sourcePartner,
    numberSeries,
    copy,
    isReadOnly,
    isRestricted,
    currentDocumentType,
    operation,
  } = useDocumentCreate();

  const selectedPartnerId = useWatch({ control, name: "partner_id" });
  const issueDate = useWatch({ control, name: "issue_date" });
  const selectedPartner = partnerOptions.find((p) => String(p.id) === String(selectedPartnerId)) || (String(sourcePartner?.id) === String(selectedPartnerId) ? sourcePartner : undefined);
  const { code } = useParams();
  const isQuoteDocument = ['QUO', 'PQUO'].includes(code?.toUpperCase() || '');

  return (
    <section className="doc-meta-grid">
      <div className="doc-meta-cell" style={{ padding: 0 }}>
        <Controller
          name="partner_id"
          control={control}
          render={({ field }) => (
            <PartnerAutocomplete
              value={field.value}
              onChange={field.onChange}
              type={copy.partyLabel === 'Cliente' ? 'customer' : (copy.partyLabel === 'Proveedor' ? 'supplier' : undefined)}
              disabled={isReadOnly || isRestricted}
              initialPartner={selectedPartner}
              isQuoteDocument={isQuoteDocument}
              label={copy.partyLabel}
            />
          )}
        />
      </div>

      <div className="doc-meta-cell">
        <label>{operation === 'sale' ? 'SERIE' : 'CENTRO COSTES'}</label>
        <select
          className="doc-input doc-input-bold doc-input-primary"
          disabled={isReadOnly || isRestricted || operation === 'purchase'}
          {...register("number_series_id")}
        >
          <option value="" disabled>
            {operation === 'sale' ? 'Seleccionar serie' : 'N/A'}
          </option>
          {operation === 'sale' && numberSeries.map((ns) => (
            <option key={ns.id} value={ns.id}>
              {ns.serie} ({ns.year})
            </option>
          ))}
        </select>
      </div>

      <div className="doc-meta-cell">
        <label>{operation === 'sale' ? 'Nº DOCUMENTO' : 'REF. PROVEEDOR'}</label>
        <input
          className={`doc-input doc-input-bold ${operation === 'purchase' ? 'doc-input-highlight' : ''}`}
          disabled={isReadOnly || isRestricted}
          placeholder={operation === 'purchase' ? "Ej: FAC-2024/001" : ""}
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
              className={errors.due_date ? 'doc-input-error' : ''}
              minDate={issueDate}
            />
          )}
        />
        {errors.due_date && (
          <span
            className="doc-error-text"
            style={{
              color: 'var(--doc-danger, #ef4444)',
              fontSize: '11px',
              marginTop: '2px',
              display: 'block',
              fontWeight: 600,
            }}
          >
            {errors.due_date.message}
          </span>
        )}
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
