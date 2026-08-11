import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

export default function BookTextModal({
  open,
  project,
  onClose,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      className="book-modal"
    >
      <DialogTitle className="modal-head">
        Full book text

        <IconButton
          onClick={onClose}
          aria-label="Close"
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="modal-body">
        {project?.bookText || ''}
      </DialogContent>
    </Dialog>
  );
}