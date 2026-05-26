"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = "error",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      disableScrollLock
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          //   justifyContent: "space-between",
          padding: "16px",
        }}
      >
        <Button
          size="medium"
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          size="medium"
          variant="contained"
          onClick={onConfirm}
          color={confirmButtonColor}
          disabled={loading}
          loading={loading}
          loadingPosition="start"
          //   loadingIndicator={loading ? "Deleting..." : confirmText}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
