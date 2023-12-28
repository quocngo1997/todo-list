import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { ITask } from "../interfaces/Task";
import "./styles/ModalForm.css";

interface ModalFormProps {
  openModal: boolean;
  handleOpenModal: () => void;
  handleConfirm: () => void;
  handleStateChange: (item: ITask) => void;
  type: "Create" | "Edit";
  task?: ITask;
}

interface Validation {
  isTitleValid?: boolean;
  isDescriptionValid?: boolean;
}

const defaultValidation: Validation = {
  isTitleValid: true,
  isDescriptionValid: true,
};

function ModalForm(props: ModalFormProps): JSX.Element {
  const [state, setState] = useState<ITask>(props.task || {});
  const [validation, setValidation] = useState<Validation>(defaultValidation);

  useEffect(() => {
    setState(props.task || {});
  }, [props.task, props.openModal]);

  useEffect(() => {
    if (!props.openModal) {
      setValidation(defaultValidation);
    }
  }, [props.openModal]);

  const handleChangeTitle = (title: string) => {
    setState({ ...state, title });
    setValidation({ ...validation, isTitleValid: !!title.trim() });
    props.handleStateChange({ title });
  };

  const handleChangeDescription = (description: string) => {
    setState({ ...state, description });
    setValidation({ ...validation, isDescriptionValid: !!description.trim() });
    props.handleStateChange({ description });
  };

  return (
    <Dialog
      size="sm"
      open={props.openModal}
      handler={props.handleOpenModal}
      placeholder={undefined}
    >
      <Card placeholder={undefined}>
        <CardBody className="flex flex-col gap-4" placeholder={undefined}>
          <Typography variant="h4" color="blue-gray" placeholder={undefined}>
            {props.type} Task
          </Typography>
          <Typography
            className="mb-3 font-normal"
            variant="paragraph"
            color="gray"
            placeholder={undefined}
          >
            Enter title and description to {props.type} Task.
          </Typography>
          <Input
            className="p-0"
            variant="outlined"
            crossOrigin={undefined}
            value={state.title}
            onChange={(e) => handleChangeTitle(e.target.value)}
            error={!validation.isTitleValid}
            label="Title"
          />
          {!validation.isTitleValid && (
            <Typography
              className="message-validation-title opacity-70"
              variant="small"
              color="red"
              placeholder={undefined}
            >
              Please enter a title
            </Typography>
          )}
          <Textarea
            variant="outlined"
            size="lg"
            value={state.description}
            onChange={(e) => handleChangeDescription(e.target.value)}
            error={!validation.isDescriptionValid}
            label="Description"
          />
          {!validation.isDescriptionValid && (
            <Typography
              className="message-validation-description opacity-70"
              variant="small"
              color="red"
              placeholder={undefined}
            >
              Please enter a description
            </Typography>
          )}
        </CardBody>
        <CardFooter className="pt-0" placeholder={undefined}>
          <Button
            variant="gradient"
            fullWidth
            placeholder={undefined}
            onClick={props.handleConfirm}
            disabled={!state.title?.trim() || !state.description?.trim()}
          >
            {props.type}
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}

export default ModalForm;
