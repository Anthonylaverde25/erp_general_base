import { useFormContext, Controller, useWatch } from "react-hook-form";
import { DocumentFormValues } from "../../schemas/documentSchema";
import { useDocumentCreate } from "../../context/DocumentCreateContext";
import { CURRENCY_OPTIONS } from "./types";
import DatePicker from "./DatePicker";
import { PartnerAutocomplete } from "./PartnerAutocomplete";
import { useParams } from "react-router";

export default function DocumentCreateMetaGrid() {
  const { register, control } = useFormContext<DocumentFormValues>();
  const {
    partnerOptions,
    numberSeries,
    copy,
    isReadOnly,
    currentDocumentType,
  } = useDocumentCreate();

  const selectedPartnerId = useWatch({ control, name: "partner_id" });
  const selectedPartner = partnerOptions.find((p) => String(p.id) === String(selectedPartnerId));
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
              disabled={isReadOnly}
              initialPartner={selectedPartner}
              isQuoteDocument={isQuoteDocument}
              label={copy.partyLabel}
            />
          )}
        />
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
