import * as React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Divider,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import { X, Mail, MoreVertical } from "lucide-react";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";

interface DocumentDetailsHeaderProps {
  document: DocumentEntity;
  onClose: () => void;
}

export function DocumentDetailsHeader({ document, onClose }: DocumentDetailsHeaderProps) {
  return (
    <AppBar
      elevation={0}
      sx={{
        position: "fixed",
        bgcolor: "white",
        color: "text.primary",
        borderBottom: "1px solid #E5E7EB",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: "56px !important",
          px: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton edge="start" size="small" onClick={onClose}>
            <X size={18} />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, my: "auto" }} />
          <Box>
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {document.document_type_name} {document.number_serie || "(Borrador)"}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#6B7280" }}>
              #{document.id} · {document.partner_name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.2, color: "#6B7280" }}>
              {document.partner_email && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, fontSize: "0.66rem" }}>
                  <Mail size={12} />
                  <span>{document.partner_email}</span>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip
            label={document.status?.name}
            sx={{
              height: 22,
              fontSize: "0.6rem",
              fontWeight: 800,
              textTransform: "uppercase",
              bgcolor: "#F3F4F6",
              color: "#374151",
              borderRadius: "5px",
              border: "1px solid #E5E7EB",
            }}
          />
          <Tooltip title="Más opciones">
            <span>
              <IconButton size="small">
                <MoreVertical size={16} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
