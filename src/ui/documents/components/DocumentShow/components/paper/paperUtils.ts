import { DocumentLine } from "@/domain/entities/documents/DocumentEntity";

export const LINES_PER_PAGE = 25;

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
};

export const sortLinesByPredecessor = (
  lines: DocumentLine[],
  predecessors: { id: number }[] = [],
) => {
  return [...lines].sort((a, b) => {
    const indexA = predecessors.findIndex((p) => p.id === a.source_document_id);
    const indexB = predecessors.findIndex((p) => p.id === b.source_document_id);
    return indexA - indexB;
  });
};
