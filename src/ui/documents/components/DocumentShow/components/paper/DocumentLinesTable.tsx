import { Fragment } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { DocumentLine, ParentDocumentInfo } from "@/domain/entities/documents/DocumentEntity";
import { formatCurrency } from "./paperUtils";

interface DocumentLinesTableProps {
  pageLines: DocumentLine[];
  isDark: boolean;
  hasPredecessors: boolean;
  hasDiscounts: boolean;
  isProcessableDocType: boolean;
  descriptionMinWidth: number;
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

export function DocumentLinesTable({
  pageLines,
  isDark,
  hasPredecessors,
  hasDiscounts,
  isProcessableDocType,
  descriptionMinWidth,
  predecessors,
  isCreditNote = false,
}: DocumentLinesTableProps) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 0,
        border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
        maxWidth: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        "&::-webkit-scrollbar": {
          height: 8,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: isDark ? "#334155" : "#cbd5e1",
          borderRadius: 999,
        },
      }}
    >
      {/* Legacy AG Grid implementation is intentionally kept in git history. */}
      <Table
        size="small"
        sx={{
          tableLayout: "auto",
          width: "max-content",
          minWidth: "100%",
          borderCollapse: "collapse",
          "& .MuiTableCell-root": {
            px: 1.5,
            py: 1,
            verticalAlign: "middle",
            borderRight: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
            borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
          },
          "& .MuiTableCell-root:last-child": {
            borderRight: "none",
          },
          "& .MuiTableCell-head": {
            py: 1.2,
            backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
            fontWeight: 800,
            fontSize: "11px",
            color: isDark ? "#f8fafc" : "#0f172a",
            borderBottom: isDark ? "1px solid #334155" : "1px solid #cbd5e1",
            borderRight: isDark ? "1px solid #334155" : "1px solid #cbd5e1",
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{
                width: "40px",
                minWidth: "40px",
                maxWidth: "40px",
                userSelect: "none",
                color: isDark ? "#94a3b8" : "#64748b",
              }}
            >
              #
            </TableCell>

            <TableCell
              sx={{
                minWidth: descriptionMinWidth,
              }}
            >
              Descripción
            </TableCell>
            <TableCell
              align="center"
              sx={{
                width: "1%",
                whiteSpace: "nowrap",
              }}
            >
              Cant.
            </TableCell>
            <TableCell
              align="center"
              sx={{
                width: "1%",
                whiteSpace: "nowrap",
              }}
            >
              Ud.
            </TableCell>
            <TableCell
              align="right"
              sx={{
                width: "1%",
                whiteSpace: "nowrap",
              }}
            >
              Precio
            </TableCell>
            {hasDiscounts && (
              <TableCell
                align="right"
                sx={{
                  width: "1%",
                  whiteSpace: "nowrap",
                }}
              >
                Dto.%
              </TableCell>
            )}
            <TableCell
              align="right"
              sx={{
                width: "1%",
                whiteSpace: "nowrap",
              }}
            >
              Impuestos
            </TableCell>
            <TableCell
              align="right"
              sx={{
                width: "1%",
                whiteSpace: "nowrap",
              }}
            >
              Total
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pageLines.map((line, rowIndex) => {
            const prevLine = pageLines[rowIndex - 1];
            const isFirstOfGroup =
              !prevLine ||
              prevLine.source_document_number !== line.source_document_number;
            const progress = line.quantity
              ? (line.processed_quantity / line.quantity) * 100
              : 0;
            const isDone = progress >= 99.9;

            const showGroupHeader = isFirstOfGroup && (line.source_document_number || line.source_document_id);
            const groupLabel = showGroupHeader ? getSourceDocumentLabel(line, predecessors) : null;

            return (
              <Fragment key={line.id || `${line.name}-${rowIndex}`}>
                {groupLabel && (
                  <TableRow
                    sx={{
                      backgroundColor: isDark
                        ? "rgba(37, 99, 235, 0.08)"
                        : "rgba(37, 99, 235, 0.05)",
                    }}
                  >
                    <TableCell
                      colSpan={hasDiscounts ? 8 : 7}
                      sx={{
                        py: 0.75,
                        px: 1.5,
                        fontWeight: 800,
                        fontSize: "11px",
                        color: "#2563eb",
                        borderRight: "none",
                        borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
                      }}
                    >
                      {groupLabel}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.01)"
                        : "#fcfdfe",
                    },
                    "&:hover": {
                      backgroundColor: isDark
                        ? "rgba(96, 165, 250, 0.06) !important"
                        : "rgba(37, 99, 235, 0.03) !important",
                    },
                    transition: "background-color 0.1s ease",
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 700,
                      fontSize: "11px",
                      color: isDark ? "#64748b" : "#94a3b8",
                      backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                      borderRight: isDark ? "1px solid #334155" : "1px solid #cbd5e1",
                      userSelect: "none",
                    }}
                  >
                    {rowIndex + 1}
                  </TableCell>

                  <TableCell
                    sx={{
                      width: descriptionMinWidth,
                      minWidth: descriptionMinWidth,
                      maxWidth: descriptionMinWidth,
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <Box className="flex flex-col gap-1">
                      <Typography style={{ fontSize: "13px", fontWeight: 600 }}>
                        {line.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      width: "1%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {!isProcessableDocType ? (
                      <Typography style={{ fontSize: "13px", fontWeight: 700 }}>
                        {line.quantity}
                      </Typography>
                    ) : (
                      <Tooltip
                        title={`Procesado: ${line.processed_quantity} de ${line.quantity}`}
                      >
                        <Box className="flex flex-col w-full px-2 py-1">
                          <Box className="flex justify-between items-baseline mb-0.5">
                            <Typography
                              style={{ fontSize: "12px", fontWeight: 700 }}
                            >
                              {line.quantity}
                            </Typography>
                            {line.processed_quantity > 0 && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: isDone ? "success.main" : "warning.main",
                                  fontWeight: 800,
                                  fontSize: "9px",
                                }}
                              >
                                {line.processed_quantity} OK
                              </Typography>
                            )}
                          </Box>
                          {line.processed_quantity > 0 && (
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                height: 3,
                                borderRadius: 1,
                                bgcolor: isDark
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.05)",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor: isDone ? "#22c55e" : "#f59e0b",
                                },
                              }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    )}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      width: "1%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: isDark ? "#94a3b8" : "#64748b",
                      }}
                      className="uppercase tracking-tighter"
                    >
                      {line.unit_short_name || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      width: "1%",
                      whiteSpace: "nowrap",
                      fontSize: "12px",
                    }}
                  >
                    {formatCurrency(line.unit_price)}
                  </TableCell>

                  {hasDiscounts && (
                    <TableCell
                      align="right"
                      sx={{
                        width: "1%",
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                        color: "#f59e0b",
                        fontWeight: 600,
                      }}
                    >
                      {line.discount_percent > 0
                        ? `${line.discount_percent}%`
                        : "-"}
                    </TableCell>
                  )}

                  <TableCell
                    align="right"
                    sx={{
                      width: "1%",
                      whiteSpace: "nowrap",
                      fontSize: "10px",
                      fontWeight: 500,
                    }}
                  >
                    {line.tax_labels || "-"}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      width: "1%",
                      whiteSpace: "nowrap",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: isDark ? "#60a5fa" : "#0f172a",
                    }}
                  >
                    {formatCurrency(isCreditNote ? -line.line_total : line.line_total)}
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
