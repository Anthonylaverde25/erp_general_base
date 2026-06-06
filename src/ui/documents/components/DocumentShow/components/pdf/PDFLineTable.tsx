import { View, Text } from "@react-pdf/renderer";
import { DocumentLine, ParentDocumentInfo } from "@/domain/entities/documents/DocumentEntity";
import { styles, SECONDARY_COLOR } from "./PDFStyles";

interface PDFLineTableProps {
  pageLines: DocumentLine[];
  formatCurrency: (amount: number) => string;
  hasPredecessors: boolean;
  predecessors?: ParentDocumentInfo[];
  isCreditNote?: boolean;
}

const getSourceDocumentLabel = (
  line: DocumentLine,
  predecessors?: ParentDocumentInfo[],
) => {
  if (!line.source_document_id && !line.source_document_number) return null;
  const pred = predecessors?.find((p) => p.id === line.source_document_id);
  if (pred) {
    const docTypeName = pred.document_type_name || "Documento";
    return `Origen: ${docTypeName} #${pred.number_serie}`;
  }
  return `Origen: #${line.source_document_number || "S/N"}`;
};

export const PDFLineTable = ({
  pageLines,
  formatCurrency,
  hasPredecessors,
  predecessors,
  isCreditNote = false,
}: PDFLineTableProps) => {
  const hasDiscounts = pageLines?.some(
    (line) => (line.discount_percent || 0) > 0,
  );

  // Dynamic width calculation for Description to fill space (sums to 100%)
  const getDescWidth = () => {
    let width = 50; // Base width when no discounts
    if (hasDiscounts) width -= 8;
    return `${width}%`;
  };

  const colDescStyle = { ...styles.colDesc, width: getDescWidth() };

  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={styles.tableHeader}>
        <View style={styles.colIndex}>
          <Text style={[styles.tableHeaderText, { textAlign: "center", width: "100%" }]}>#</Text>
        </View>
        <View style={colDescStyle}>
          <Text style={[styles.tableHeaderText, { textAlign: "left", width: "100%" }]}>Descripción</Text>
        </View>
        <View style={styles.colQty}>
          <Text style={[styles.tableHeaderText, { textAlign: "center", width: "100%" }]}>Cant.</Text>
        </View>
        <View style={styles.colUnit}>
          <Text style={[styles.tableHeaderText, { textAlign: "center", width: "100%" }]}>Ud.</Text>
        </View>
        <View style={styles.colPrice}>
          <Text style={[styles.tableHeaderText, { textAlign: "right", width: "100%" }]}>Precio</Text>
        </View>
        {hasDiscounts && (
          <View style={styles.colDiscount}>
            <Text style={[styles.tableHeaderText, { textAlign: "right", width: "100%" }]}>Dto.%</Text>
          </View>
        )}
        <View style={styles.colTax}>
          <Text style={[styles.tableHeaderText, { textAlign: "right", width: "100%" }]}>Imp.</Text>
        </View>
        <View style={styles.colTotal}>
          <Text style={[styles.tableHeaderText, { textAlign: "right", width: "100%" }]}>Total</Text>
        </View>
      </View>

      {/* Rows */}
      {pageLines?.map((line, index) => {
        const prevLine = index > 0 ? pageLines[index - 1] : null;
        const isFirstOfGroup =
          !prevLine ||
          prevLine.source_document_number !== line.source_document_number;
        const isLastRow = index === pageLines.length - 1;
        const cellStyle = isLastRow ? { borderBottomWidth: 0 } : {};

        const showGroupHeader = isFirstOfGroup && (line.source_document_number || line.source_document_id);
        const groupLabel = showGroupHeader ? getSourceDocumentLabel(line, predecessors) : null;

        return (
          <View key={line.id || index} style={{ flexDirection: "column" }}>
            {groupLabel && (
              <View style={[styles.groupHeaderRow, cellStyle]}>
                <Text style={styles.groupHeaderText}>{groupLabel}</Text>
              </View>
            )}
            <View
              style={[
                styles.tableRow,
                index % 2 === 1 ? styles.tableRowEven : {},
              ]}
            >
              <View style={[styles.colIndex, cellStyle, { backgroundColor: "#f8fafc" }]}>
                <Text style={[styles.itemBold, { color: SECONDARY_COLOR, fontSize: 8, textAlign: "center", width: "100%" }]}>
                  {index + 1}
                </Text>
              </View>

              <View style={[colDescStyle, cellStyle]}>
                <Text style={[styles.itemMain, { textAlign: "left", width: "100%" }]}>
                  {line.name}
                </Text>
              </View>

              <View style={[styles.colQty, cellStyle]}>
                <Text style={[styles.itemValueBold, { textAlign: "center", width: "100%" }]}>{line.quantity}</Text>
              </View>

              <View style={[styles.colUnit, cellStyle]}>
                <Text
                  style={[
                    styles.itemValue,
                    { fontSize: 7, textTransform: "uppercase", textAlign: "center", width: "100%" },
                  ]}
                >
                  {line.unit_short_name || "-"}
                </Text>
              </View>

              <View style={[styles.colPrice, cellStyle]}>
                <Text style={[styles.itemValue, { textAlign: "right", width: "100%" }]}>
                  {formatCurrency(line.unit_price)}
                </Text>
              </View>

              {hasDiscounts && (
                <View style={[styles.colDiscount, cellStyle]}>
                  <Text style={[styles.itemDiscount, { textAlign: "right", width: "100%" }]}>
                    {(line.discount_percent || 0) > 0
                      ? `${line.discount_percent}%`
                      : "-"}
                  </Text>
                </View>
              )}

              <View style={[styles.colTax, cellStyle]}>
                <Text style={[styles.itemValue, { fontSize: 7, textAlign: "right", width: "100%" }]}>
                  {line.tax_labels || "-"}
                </Text>
              </View>

              <View style={[styles.colTotal, cellStyle]}>
                <Text style={[styles.itemBold, { textAlign: "right", width: "100%" }]}>
                  {formatCurrency(isCreditNote ? -line.line_total : line.line_total)}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};
