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
import { DocumentLine } from "@/domain/entities/documents/DocumentEntity";
import { formatCurrency } from "./paperUtils";

interface DocumentLinesTableProps {
  pageLines: DocumentLine[];
  isDark: boolean;
  hasPredecessors: boolean;
  hasDiscounts: boolean;
  isProcessableDocType: boolean;
  descriptionMinWidth: number;
}

export function DocumentLinesTable({
  pageLines,
  isDark,
  hasPredecessors,
  hasDiscounts,
  isProcessableDocType,
  descriptionMinWidth,
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
          "& .MuiTableCell-root": {
            px: 1.75,
            py: 1.35,
            verticalAlign: "top",
          },
          "& .MuiTableCell-head": {
            py: 1.6,
          },
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: isDark ? "#1e293b" : "#f8fafc",
            }}
          >
            {hasPredecessors && (
              <TableCell
                sx={{
                  fontWeight: 800,
                  fontSize: "11px",
                  color: isDark ? "#f8fafc" : "#0f172a",
                  width: "1%",
                  whiteSpace: "nowrap",
                  borderBottom: isDark
                    ? "1px solid #334155"
                    : "1px solid #e2e8f0",
                }}
              >
                Origen
              </TableCell>
            )}
            <TableCell
              sx={{
                fontWeight: 800,
                fontSize: "11px",
                color: isDark ? "#f8fafc" : "#0f172a",
                minWidth: descriptionMinWidth,
                borderBottom: isDark
                  ? "1px solid #334155"
                  : "1px solid #e2e8f0",
              }}
            >
              Descripcion
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 800,
                fontSize: "11px",
                color: isDark ? "#f8fafc" : "#0f172a",
                width: "1%",
                whiteSpace: "nowrap",
                borderBottom: isDark
                  ? "1px solid #334155"
                  : "1px solid #e2e8f0",
              }}
            >
              Cant.
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 800,
                fontSize: "11px",
                color: isDark ? "#f8fafc" : "#0f172a",
                width: "1%",
                whiteSpace: "nowrap",
                borderBottom: isDark
                  ? "1px solid #334155"
                  : "1px solid #e2e8f0",
              }}
            >
              Ud.
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 800,
                fontSize: "11px",
                color: isDark ? "#f8fafc" : "#0f172a",
                width: "1%",
                whiteSpace: "nowrap",
                borderBottom: isDark
                  ? "1px solid #334155"
                  : "1px solid #e2e8f0",
              }}
            >
              Precio
            </TableCell>
            {hasDiscounts && (
              <TableCell
                align="right"
                sx={{
                  fontWeight: 800,
                  fontSize: "11px",
                  color: isDark ? "#f8fafc" : "#0f172a",
                  width: "1%",
                  whiteSpace: "nowrap",
                  borderBottom: isDark
                    ? "1px solid #334155"
                    : "1px solid #e2e8f0",
                }}
              >
                Dto.%
              </TableCell>
            )}
            <TableCell
              align="right"
              sx={{
                fontWeight: 800,
                fontSize: "11px",
                color: isDark ? "#f8fafc" : "#0f172a",
                width: "1%",
                whiteSpace: "nowrap",
                borderBottom: isDark
                  ? "1px solid #334155"
                  : "1px solid #e2e8f0",
              }}
            >
              Impuestos
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 800,
                fontSize: "11px",
                color: isDark ? "#f8fafc" : "#0f172a",
                width: "1%",
                whiteSpace: "nowrap",
                borderBottom: isDark
                  ? "1px solid #334155"
                  : "1px solid #e2e8f0",
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

            return (
              <TableRow
                key={line.id || `${line.name}-${rowIndex}`}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.02)"
                      : "#fbfcfd",
                  },
                }}
              >
                {hasPredecessors && (
                  <TableCell
                    sx={{
                      fontSize: "10px",
                      borderBottom: isDark
                        ? "1px solid #1e293b"
                        : "1px solid #f1f5f9",
                      color: "#2563eb",
                      fontWeight: 800,
                      fontStyle: "italic",
                    }}
                  >
                    {isFirstOfGroup
                      ? `#${line.source_document_number || "S/N"}`
                      : ""}
                  </TableCell>
                )}

                <TableCell
                  sx={{
                    width: descriptionMinWidth,
                    minWidth: descriptionMinWidth,
                    maxWidth: descriptionMinWidth,
                    borderBottom: isDark
                      ? "1px solid #1e293b"
                      : "1px solid #f1f5f9",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  <Box className="flex flex-col gap-1">
                    <Typography style={{ fontSize: "13px", fontWeight: 600 }}>
                      {line.item_code ? `[${line.item_code}] ` : ""}
                      {line.name}
                    </Typography>
                    {line.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        className="leading-tight italic"
                      >
                        {line.description}
                      </Typography>
                    )}
                  </Box>
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "1%",
                    whiteSpace: "nowrap",
                    borderBottom: isDark
                      ? "1px solid #1e293b"
                      : "1px solid #f1f5f9",
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
                    borderBottom: isDark
                      ? "1px solid #1e293b"
                      : "1px solid #f1f5f9",
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
                    borderBottom: isDark
                      ? "1px solid #1e293b"
                      : "1px solid #f1f5f9",
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
                      borderBottom: isDark
                        ? "1px solid #1e293b"
                        : "1px solid #f1f5f9",
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
                    borderBottom: isDark
                      ? "1px solid #1e293b"
                      : "1px solid #f1f5f9",
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
                    borderBottom: isDark
                      ? "1px solid #1e293b"
                      : "1px solid #f1f5f9",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: isDark ? "#60a5fa" : "#0f172a",
                  }}
                >
                  {formatCurrency(line.line_total)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
