import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';
import { CalendarMonth } from '@mui/icons-material';
import 'react-day-picker/style.css';

interface DatePickerProps {
    value?: string;
    onChange: (date: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    minDate?: string;
}

export default function DatePicker({ value, onChange, placeholder = 'Seleccionar fecha', className = '', disabled = false, minDate }: DatePickerProps) {
    const [open, setOpen] = useState(false);

    const selectedDate = value ? new Date(value + 'T00:00:00') : undefined;
    const minDateObj = minDate ? new Date(minDate + 'T00:00:00') : undefined;

    const handleSelect = (day: Date | undefined) => {
        if (day && !disabled) {
            onChange(format(day, 'yyyy-MM-dd'));
            setOpen(false);
        }
    };

    return (
        <Popover.Root open={disabled ? false : open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={`doc-input doc-input-primary doc-datepicker-trigger ${className}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: disabled ? 'default' : 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        background: disabled ? 'var(--doc-input-disabled-bg, #f5f5f5)' : 'var(--doc-input-bg, #fff)',
                        border: '1px solid var(--doc-border, #e0e0e0)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        minHeight: '28px',
                        opacity: disabled ? 0.7 : 1,
                    }}
                >
                    <span style={{ opacity: (selectedDate && !disabled) ? 1 : 0.5 }}>
                        {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: es }) : placeholder}
                    </span>
                    <CalendarMonth style={{ fontSize: 16, opacity: 0.5 }} />
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    sideOffset={4}
                    align="start"
                    style={{
                        zIndex: 9999,
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        padding: '8px',
                        border: '1px solid #e8e8e8',
                    }}
                >
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        locale={es}
                        showOutsideDays
                        style={{ fontSize: '13px' }}
                        disabled={minDateObj ? { before: minDateObj } : undefined}
                    />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
