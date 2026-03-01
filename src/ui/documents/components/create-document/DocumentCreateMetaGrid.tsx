import { useFormContext, Controller } from "react-hook-form";
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
  } = useDocumentCreate();

  return (
    <section className="doc-meta-grid">
      <div className="doc-meta-cell">
        <label>{copy.partyLabel}</label>
        <select
          className="doc-input doc-input-bold doc-input-primary"
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
      </div>

      <div className="doc-meta-cell">
        <label>SERIE</label>
        <select
          className="doc-input doc-input-bold doc-input-primary"
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
            />
          )}
        />
      </div>

      <div className="doc-meta-cell">
        <label>DIVISA</label>
        <select
          className="doc-input"
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
