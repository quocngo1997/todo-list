import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";

interface ModalConfirmProps {
  openModal: boolean;
  handleOpenModal: () => void;
  handleConfirm: () => void;
}

function ModalConfirm(props: ModalConfirmProps): JSX.Element {
  return (
    <Dialog
      size="sm"
      open={props.openModal}
      handler={props.handleOpenModal}
      placeholder={undefined}
    >
      <DialogHeader placeholder={undefined}>
        <Typography placeholder={undefined} variant="h5">
          Are you sure you want to delete the task?
        </Typography>
      </DialogHeader>
      <DialogFooter placeholder={undefined}>
        <Button
          variant="gradient"
          onClick={props.handleOpenModal}
          className="mr-1"
          placeholder={undefined}
        >
          <span>Cancel</span>
        </Button>
        <Button
          variant="gradient"
          color="red"
          placeholder={undefined}
          onClick={props.handleConfirm}
        >
          <span>Delete</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default ModalConfirm;
