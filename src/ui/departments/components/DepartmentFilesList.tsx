import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  InsertDriveFileOutlined,
  CloudUploadOutlined,
  PictureAsPdfOutlined,
  TableChartOutlined,
  ImageOutlined,
  DescriptionOutlined,
  SlideshowOutlined,
  ArchiveOutlined,
} from "@mui/icons-material";
import {
  ArrowDownTrayIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import useGetFilesByFileable from "@/features/files/hooks/useGetFilesByFileable";
import { useDeleteFile } from "@/features/files/hooks/useDeleteFile";
import { useDownloadFile } from "@/features/files/hooks/useDownloadFile";
import { useViewFile } from "@/features/files/hooks/useViewFile";
import DepartmentFileModal from "./DepartmentFileModal";
import { format } from "date-fns";
import { useLocation, useNavigate } from "react-router";

interface DepartmentFilesListProps {
  departmentId: number;
}

export default function DepartmentFilesList({
  departmentId,
}: DepartmentFilesListProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "sheet" | "pdf" | "image" | "other"
  >("all");
  const { files, isLoading } = useGetFilesByFileable(
    "department",
    departmentId,
  );
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile();
  const { mutate: downloadFile, isPending: isDownloading } = useDownloadFile();
  const { mutate: viewFile, isPending: isViewing } = useViewFile();

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este archivo?")) {
      deleteFile(id);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getDocIconColors = (mimeType: string) => {
    if (mimeType.includes("pdf"))
      return { bg: "rgba(239, 68, 68, 0.1)", color: "rgb(220, 38, 38)" };

    if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
      return { bg: "rgba(34, 197, 94, 0.1)", color: "rgb(22, 163, 74)" };

    if (mimeType.includes("word") || mimeType.includes("document"))
      return { bg: "rgba(59, 130, 246, 0.1)", color: "rgb(37, 99, 235)" };

    if (mimeType.includes("image"))
      return { bg: "rgba(234, 179, 8, 0.1)", color: "rgb(202, 138, 4)" };

    return { bg: "rgba(100, 116, 139, 0.1)", color: "rgb(100, 116, 139)" };
  };

  const getDocIcon = (mimeType: string) => {
    const normalizedMimeType = mimeType.toLowerCase();

    if (normalizedMimeType.includes("pdf")) {
      return <PictureAsPdfOutlined fontSize="small" />;
    }

    if (
      normalizedMimeType.includes("excel") ||
      normalizedMimeType.includes("spreadsheet") ||
      normalizedMimeType.includes("csv")
    ) {
      return <TableChartOutlined fontSize="small" />;
    }

    if (normalizedMimeType.includes("image")) {
      return <ImageOutlined fontSize="small" />;
    }

    if (
      normalizedMimeType.includes("powerpoint") ||
      normalizedMimeType.includes("presentation")
    ) {
      return <SlideshowOutlined fontSize="small" />;
    }

    if (
      normalizedMimeType.includes("word") ||
      normalizedMimeType.includes("document") ||
      normalizedMimeType.includes("text")
    ) {
      return <DescriptionOutlined fontSize="small" />;
    }

    if (
      normalizedMimeType.includes("zip") ||
      normalizedMimeType.includes("rar") ||
      normalizedMimeType.includes("7z") ||
      normalizedMimeType.includes("compressed")
    ) {
      return <ArchiveOutlined fontSize="small" />;
    }

    return <InsertDriveFileOutlined fontSize="small" />;
  };

  const matchesFilter = (mimeType: string) => {
    const normalizedMimeType = mimeType.toLowerCase();

    if (activeFilter === "all") return true;

    if (activeFilter === "sheet")
      return (
        normalizedMimeType.includes("excel") ||
        normalizedMimeType.includes("spreadsheet") ||
        normalizedMimeType.includes("csv")
      );

    if (activeFilter === "pdf") return normalizedMimeType.includes("pdf");

    if (activeFilter === "image") return normalizedMimeType.includes("image");

    return (
      !normalizedMimeType.includes("excel") &&
      !normalizedMimeType.includes("spreadsheet") &&
      !normalizedMimeType.includes("csv") &&
      !normalizedMimeType.includes("pdf") &&
      !normalizedMimeType.includes("image")
    );
  };

  const filteredFiles =
    files?.filter((file) => matchesFilter(file.mime_type)) || [];
  const totalFiles = files?.length || 0;
  const matches = location.pathname.match(/^\/departments\/([^/]+)/);
  const departmentCode = matches?.[1];

  return (
    <Box className="col-span-1">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ letterSpacing: "-0.01em" }}
          >
            Documentos asociados
          </Typography>
          <Chip
            label={totalFiles}
            size="small"
            sx={{ height: 20, fontSize: "0.7rem", fontWeight: 600 }}
          />
        </Box>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CloudUploadOutlined />}
          onClick={() => setIsModalOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Subir Archivo
        </Button>
      </Box>
      <Box className="mb-3 flex flex-wrap gap-1.5">
        <Chip
          label="Todos"
          size="small"
          color={activeFilter === "all" ? "primary" : "default"}
          variant={activeFilter === "all" ? "filled" : "outlined"}
          onClick={() => setActiveFilter("all")}
        />
        <Chip
          label="Hojas de cálculo"
          size="small"
          color={activeFilter === "sheet" ? "primary" : "default"}
          variant={activeFilter === "sheet" ? "filled" : "outlined"}
          onClick={() => setActiveFilter("sheet")}
        />
        <Chip
          label="PDF"
          size="small"
          color={activeFilter === "pdf" ? "primary" : "default"}
          variant={activeFilter === "pdf" ? "filled" : "outlined"}
          onClick={() => setActiveFilter("pdf")}
        />
        <Chip
          label="Imágenes"
          size="small"
          color={activeFilter === "image" ? "primary" : "default"}
          variant={activeFilter === "image" ? "filled" : "outlined"}
          onClick={() => setActiveFilter("image")}
        />
        <Chip
          label="Otros"
          size="small"
          color={activeFilter === "other" ? "primary" : "default"}
          variant={activeFilter === "other" ? "filled" : "outlined"}
          onClick={() => setActiveFilter("other")}
        />
      </Box>
      <Box className="flex max-h-[640px] flex-col gap-3 overflow-y-auto rounded-md border bg-slate-50/30 p-3">
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : filteredFiles.length > 0 ? (
          filteredFiles.map((file) => {
            const iconColors = getDocIconColors(file.mime_type);
            const fileIcon = getDocIcon(file.mime_type);
            return (
              <Box
                key={file.id}
                className="flex items-center gap-3 rounded-md border bg-white p-3 shadow-sm transition-colors hover:bg-slate-50"
                sx={{ borderColor: "divider" }}
              >
                <Box
                  sx={{
                    p: 1.25,
                    borderRadius: 1.5,
                    bgcolor: iconColors.bg,
                    color: iconColors.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {fileIcon}
                </Box>
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    sx={{ lineHeight: 1.2, mb: 0.5, color: "text.primary" }}
                    title={file.file_name}
                  >
                    {file.file_name}
                  </Typography>
                  <Box className="flex items-center gap-2">
                    {file.file_type && (
                      <Chip
                        label={file.file_type.name}
                        size="small"
                        sx={{ height: 16, fontSize: "0.65rem" }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontWeight: 500 }}
                    >
                      {formatSize(file.size)} •{" "}
                      {format(new Date(file.created_at), "dd/MM/yyyy")}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Tooltip title="Ver">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => {
                        const mime = file.mime_type.toLowerCase();

                        if (
                          mime.includes("excel") ||
                          mime.includes("spreadsheet") ||
                          mime.includes("csv")
                        ) {
                          navigate(`/departments/analytics/${file.id}`, {
                            state: {
                              fileName: file.file_name,
                              fileTypeName: file.file_type?.name,
                              uploaderName: file.uploader?.name,
                              returnTo: location.pathname,
                              departmentCode,
                            },
                          });
                          return;
                        }

                        viewFile(file.id);
                      }}
                      disabled={isViewing || isDownloading || isDeleting}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Descargar">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => downloadFile(file.id)}
                      disabled={isDownloading}
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ py: 3 }}
          >
            No hay documentos para el filtro seleccionado.
          </Typography>
        )}
      </Box>

      <DepartmentFileModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        departmentId={departmentId}
      />
    </Box>
  );
}
