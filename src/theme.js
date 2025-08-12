

{/* Confirm add row */}
<UnifiedDialog
  open={openAddDialog}
  onClose={() => setOpenAddDialog(false)}
  severity="confirm"
  title="Confirm"
  confirmText="Add Row"
  onConfirm={handleAddRow}
>
  Are you sure you want to add a new row?
</UnifiedDialog>

{/* Server error */}
<UnifiedDialog
  open={openErrorDialog}
  onClose={() => { setOpenErrorDialog(false); setError(null); }}
  severity="error"
  title="Error occurred"
  confirmText="Close"
  showCancel={false}
>
  {error}
</UnifiedDialog>

{/* Warning / mandatory action */}
<UnifiedDialog
  open={openWarnDialog}
  onClose={() => { setOpenWarnDialog(false); setWarning(null); }}
  severity="warning"
  title="Mandatory Action"
  confirmText="Continue"
>
  {warning}
</UnifiedDialog>

On Tue, Aug 12, 2025, 11:32 AM Sunil Gurung <linusgnurug@gmail.com> wrote:
// components/UnifiedDialog.tsx
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

type Severity = 'error' | 'warning' | 'info' | 'success' | 'confirm';

export interface UnifiedDialogProps {
  open: boolean;
  onClose: () => void;

  /** Content */
  title?: string;
  children?: React.ReactNode;

  /** Visual + behavior */
  severity?: Severity; // default: 'info'
  showCancel?: boolean; // default: true
  confirmText?: string; // default: based on severity
  cancelText?: string; // default: 'Cancel'
  onConfirm?: () => void; // optional
  disableBackdropClose?: boolean; // default: false
}

const CONFIG: Record<Severity, {
  bg: string;
  icon: React.ReactNode;
  btnColor: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  defaultConfirm: string;
}> = {
  error: { bg: '#fdecea', icon: <ErrorOutlineIcon color="error"/>, btnColor: 'error', defaultConfirm: 'Retry' },
  warning: { bg: '#fff4e5', icon: <WarningAmberIcon color="warning"/>, btnColor: 'warning', defaultConfirm: 'Continue' },
  info: { bg: '#e8f4fd', icon: <InfoOutlinedIcon color="info"/>, btnColor: 'info', defaultConfirm: 'OK' },
  success: { bg: '#edf7ed', icon: <CheckCircleOutlineIcon color="success"/>, btnColor: 'success', defaultConfirm: 'Great' },
  confirm: { bg: '#f5f5f5', icon: <HelpOutlineIcon sx={{ color: 'text.secondary' }}/>, btnColor: 'primary', defaultConfirm: 'Confirm' },
};

export default function UnifiedDialog({
  open,
  onClose,
  title,
  children,
  severity = 'info',
  showCancel = true,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  disableBackdropClose = false,
}: UnifiedDialogProps) {

  const cfg = CONFIG[severity];

  const handleClose = (_: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (disableBackdropClose && reason === 'backdropClick') return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      {(title || cfg.icon) && (
        <Box display="flex" alignItems="center" gap={1.25} px={2} py={1.5} sx={{ bgcolor: cfg.bg }}>
          {cfg.icon}
          {title && <DialogTitle sx={{ p: 0 }}>{title}</DialogTitle>}
        </Box>
      )}

      <DialogContent dividers>
        {typeof children === 'string'
          ? <Typography>{children}</Typography>
          : children}
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.5 }}>
        {showCancel && (
          <Button onClick={onClose} variant="outlined">
            {cancelText}
          </Button>
        )}
        <Button
          onClick={onConfirm ?? onClose}
          variant="contained"
          color={cfg.btnColor}
        >
          {confirmText ?? cfg.defaultConfirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
