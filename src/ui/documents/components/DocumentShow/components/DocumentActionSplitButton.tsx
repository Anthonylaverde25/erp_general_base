import * as React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Divider from '@mui/material/Divider';
import ClickAwayListener, { ClickAwayListenerProps } from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { NextAction } from '../DocumentShowFloatingActions.helpers';

interface DocumentActionSplitButtonProps {
  primaryAction: NextAction | null;
  fastTrackAction: NextAction | null;
  onAction: (status: string) => void;
  disabled?: boolean;
}

const CTA_VARIANTS = {
  indigo: {
    bg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    border: 'border-indigo-700'
  },
  green: {
    bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    border: 'border-emerald-700'
  },
} as const;

// Mapper to use MUI icons instead of Lucide
const getMuiIcon = (iconName: string) => {
  switch (iconName) {
    case 'CheckCircle': return CheckCircleIcon;
    case 'SendHorizonal': return SendIcon;
    case 'Truck': return LocalShippingIcon;
    case 'Zap': return BoltIcon;
    case 'ClipboardCheck': return CheckCircleIcon; // Fallback to CheckCircle for validation
    default: return CheckCircleIcon;
  }
};

export default function DocumentActionSplitButton({
  primaryAction,
  fastTrackAction,
  onAction,
  disabled
}: DocumentActionSplitButtonProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleMenuItemClick = (status: string) => {
    onAction(status);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const variant = primaryAction ? CTA_VARIANTS[primaryAction.variant] : CTA_VARIANTS.indigo;
  const PrimaryIcon = primaryAction ? getMuiIcon(primaryAction.Icon) : ArrowDropDownIcon;

  return (
    <React.Fragment>
      <div className="flex items-center h-full" ref={anchorRef}>
        <div className="flex items-center h-7 overflow-hidden rounded shadow-sm border border-transparent">
          <button
            onClick={primaryAction ? () => onAction(primaryAction.nextStatus) : handleToggle}
            disabled={disabled}
            className={`px-4 h-full text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors disabled:opacity-60 border-r border-white/10 ${variant.bg}`}
          >
            {primaryAction ? (
              <>
                <PrimaryIcon sx={{ fontSize: 16 }} />
                {primaryAction.label}
              </>
            ) : (
              <>
                <PrimaryIcon sx={{ fontSize: 18 }} />
                Acciones
              </>
            )}
          </button>
          {fastTrackAction && (
            <button
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="select action"
              aria-haspopup="menu"
              onClick={handleToggle}
              className={`px-1.5 h-full flex items-center justify-center transition-colors disabled:opacity-60 ${variant.bg}`}
            >
              <ArrowDropDownIcon sx={{ fontSize: 20 }} />
            </button>
          )}
        </div>
      </div>
      <Popper
        sx={{
          zIndex: 10,
          width: anchorRef.current?.clientWidth || 'auto',
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom-end"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-end' ? 'right top' : 'right bottom',
            }}
          >
            <Paper className="mt-1 shadow-xl bg-white dark:bg-gray-900 border-none overflow-hidden rounded-md">
              <ClickAwayListener
                onClickAway={handleClose}
                children={
                  <div style={{ outline: 'none' }}>
                    <MenuList id="split-button-menu" autoFocusItem className="py-0" onKeyDown={e => e.key === 'Tab' && setOpen(false)}>
                      {fastTrackAction && (() => {
                        const FastIcon = getMuiIcon(fastTrackAction.Icon);
                        return (
                          <MenuItem
                            className="px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-3 transition-colors"
                            onClick={() => handleMenuItemClick(fastTrackAction.nextStatus)}
                          >
                            <FastIcon sx={{ fontSize: 18 }} className="flex-shrink-0" />
                            {fastTrackAction.label}
                          </MenuItem>
                        );
                      })()}
                    </MenuList>
                  </div>
                }
              />
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
