import * as React from "react";
import { Card, Box, Typography, Stack } from "@mui/material";
import { StickyNote } from "lucide-react";
import { formatEuropeanDate } from "../utils/formatters";

interface Note {
  id: string;
  title: string;
  text: string;
  author: string;
  date: string;
}

interface DocumentNotesListProps {
  notes: Note[];
}

export function DocumentNotesList({ notes }: DocumentNotesListProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        overflow: "hidden"
      }}
    >
      <Box sx={{ px: 2, py: 1.2, borderBottom: '1px solid #F3F4F6', display: "flex", alignItems: "center", gap: 1, bgcolor: '#F9FAFB' }}>
        <StickyNote size={14} color="#6B7280" />
        <Typography sx={{ fontSize: "0.62rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Notas del Documento
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Stack spacing={1.1}>
          {notes.map((note) => (
            <Box
              key={note.id}
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                p: 1.2,
                bgcolor: "#F9FAFB",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.4 }}>
                <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>
                  {note.title}
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#9CA3AF" }}>
                  {formatEuropeanDate(note.date)}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "0.76rem", color: "#4B5563" }}>
                {note.text}
              </Typography>
              <Typography sx={{ mt: 0.4, fontSize: "0.65rem", fontWeight: 700, color: "#6366F1" }}>
                {note.author}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Card>
  );
}
