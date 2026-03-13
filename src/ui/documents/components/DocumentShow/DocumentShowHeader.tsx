import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import DocumentPDF from "./DocumentPDF";
import { CompanyEntity } from "@/domain/entities/companies/Company";
import { EDITABLE_STATES } from "./DocumentShowHeader.helpers";
import { HeaderTitle, HeaderActions, HeaderMoreMenu } from "./DocumentShowHeader.sections";

interface DocumentShowHeaderProps {
  document: DocumentEntity;
  activeCompany: CompanyEntity;
  onClose: () => void;
}

export default function DocumentShowHeader({
  document,
  activeCompany,
  onClose,
}: DocumentShowHeaderProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const statusKey = document.status?.key || "";
  const isEditable = EDITABLE_STATES.includes(statusKey);
  const module = document.operation === "sale" ? "sales" : "purchases";
  const docTypeCode = document.document_type_code || "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const { pdf: pdfRenderer } = await import("@react-pdf/renderer");
      const blob = await pdfRenderer(<DocumentPDF document={document} activeCompany={activeCompany} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF for print:", error);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleEdit = () => {
    setMenuOpen(false);
    navigate(`/${module}/edit/${docTypeCode}/${document.id}`);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-[#e5e7eb] dark:border-gray-800 flex items-center justify-between p-2 shrink-0">
      <HeaderTitle document={document} onClose={onClose} />

      <div className="flex items-center gap-2" ref={menuRef}>
        <HeaderActions 
          document={document} 
          activeCompany={activeCompany} 
          isPrinting={isPrinting} 
          onPrint={handlePrint} 
        />
        
        <HeaderMoreMenu 
          menuOpen={menuOpen} 
          setMenuOpen={setMenuOpen} 
          isEditable={isEditable} 
          onEdit={handleEdit} 
        />
      </div>
    </header>
  );
}
