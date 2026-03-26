import { useFormContext } from "react-hook-form";
import { DocumentFormValues } from "../../schemas/documentSchema";
import { useDocumentCreate } from "../../context/DocumentCreateContext";

interface DocumentCreateFooterProps {
  discountEnabled: boolean;
  onDiscountEnabledChange: (enabled: boolean) => void;
}

export default function DocumentCreateFooter({
  discountEnabled,
  onDiscountEnabledChange,
}: DocumentCreateFooterProps) {
  const { register } = useFormContext<DocumentFormValues>();
  const { totals, isReadOnly } = useDocumentCreate();

  return (
    <footer className="doc-footer">
      <div className="doc-footer-section doc-footer-params">
        <h3>Parámetros</h3>
        <label>
          <input
            type="checkbox"
            {...register("include_legal")}
            disabled={isReadOnly}
          />
          <span>Incluir cláusulas legales</span>
        </label>
        {/* <label>
					<input
						type="checkbox"
						{...register("apply_retention")}
						disabled={isReadOnly}
					/>
					<span>Aplicar retención IRPF (15%)</span>
				</label> */}
        <label>
          <input
            type="checkbox"
            {...register("auto_send")}
            disabled={isReadOnly}
          />
          <span>Envío automático Email</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={discountEnabled}
            onChange={(e) => onDiscountEnabledChange(e.target.checked)}
            disabled={isReadOnly}
          />
          <span>Habilitar descuento por línea</span>
        </label>
      </div>

      <div className="doc-footer-section doc-footer-notes">
        <div>
          <h3>Observaciones</h3>
          <textarea
            placeholder="Notas de facturación interna..."
            {...register("notes")}
            disabled={isReadOnly}
          />
        </div>
        <div>
          <h3>Etiquetado</h3>
          <input
            type="text"
            placeholder="Presupuesto, Urgente..."
            {...register("tag")}
            disabled={isReadOnly}
          />
          <div className="doc-tag-wrap">
            {/* Las etiquetas se agregarán dinámicamente en el futuro */}
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
