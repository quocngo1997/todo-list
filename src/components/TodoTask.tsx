import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  Tabs,
  TabsHeader,
  Tab,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  PencilIcon,
  PlusIcon,
  ShieldCheckIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { XYCoord } from "react-dnd";

import { ITask, DraggableItemType, ElementRect } from "../interfaces/Task";
import { AppDispatch, RootState } from "../redux/store";
import {
  addTask,
  deleteTask,
  dragDropTask,
  editTask,
  setDueDateTask,
  toggleTask,
} from "../redux/slices/todoSlice";
import ModalConfirm from "./ModalConfirm";
import ModalForm from "./ModalForm";
import DroppableContainer from "./DroppableContainer";
import DraggableItemComponent from "./DraggableItem";
import DatePicker from "./DatePicker";
import {
  ALL_TASK,
  COMPLETED_TASK,
  PENDING_TASK,
  STATUS_TASK,
  TABLE_HEAD,
  TABS_MARK_STATUS,
} from "../consts/TodoConst";

function getAllElementRects(elementSelectors: string[]): ElementRect[] {
  const rects: ElementRect[] = [];

  elementSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      // Get the position and size information and add it to the rects array
      const rect = element.getBoundingClientRect();
      rects.push({
        element,
        rect,
      });
    });
  });

  return rects;
}

function TodoTask(): JSX.Element {
  const taskList = useSelector((state: RootState) => state.todos.tasks);
  const [openModalForm, setOpenModalForm] = useState<boolean>(false);
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<ITask>();
  const [taskSelected, setTaskSelected] = useState<ITask>();
  const [taskListState, setTaskListState] = useState<ITask[]>(taskList);
  const [statusTab, setStatusTab] = useState<STATUS_TASK>(ALL_TASK);
  const [allRects, setAllRects] = useState<ElementRect[]>([]);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    switch (statusTab) {
      case COMPLETED_TASK:
        setTaskListState(taskList.filter((task) => task.completed));
        break;
      case PENDING_TASK:
        setTaskListState(taskList.filter((task) => !task.completed));
        break;
      default:
        setTaskListState(taskList);
        break;
    }
  }, [taskList, statusTab]);

  useEffect(() => {
    let elementSelectors: string[] = [];
    taskListState.forEach((task) => elementSelectors.push(`#task-${task.id}`));
    const allRects: ElementRect[] = getAllElementRects(elementSelectors);
    setAllRects(allRects);
  }, [taskListState]);

  const handleOpenModalForm = () => {
    setOpenModalForm((cur) => {
      // when close modal, set task seelected is undefined
      if (cur) setTaskSelected(undefined);
      return !cur;
    });
  };
  const handleOpenModalConfirm = () => setOpenModalConfirm((cur) => !cur);

  // this function handler for case add task and case edit task
  const handleUpdateTask = () => {
    // if case edit use editTask function, case create use addTask function
    dispatch(
      !!taskSelected ? editTask(taskSelected || {}) : addTask(newTask || {})
    );
    handleOpenModalForm();
    toast.success(`${!!taskSelected ? "Edit" : "Create"} task successfully`);
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(taskSelected?.id));
    handleOpenModalConfirm();
    toast.success("Delete task successfully");
    setTaskSelected(undefined);
  };

  // this function toggle status pending to status completed
  const handleToggleTask = (id?: number) => {
    dispatch(toggleTask(id));
    toast.success("Mark the task as completed");
  };

  const handleStateModalFormChange = (item: ITask) => {
    // setState for case edit
    if (!!taskSelected) {
      setTaskSelected({ ...taskSelected, ...item });
    } else {
      // setState for case create
      setNewTask({ ...newTask, ...item });
    }
  };

  const handleDrop = (
    item: DraggableItemType,
    dropPosition: XYCoord | null
  ) => {
    // get index of task drag
    const idTaskDrag = Number(item.id.split("-").pop());
    const indexTaskDrag = taskList.findIndex((task) => task.id === idTaskDrag);
    // get index of task drop
    let indexTaskDrop = allRects.findIndex(
      (rectItem) => dropPosition?.y && rectItem.rect.y > dropPosition.y
    );
    // In case of dragging and dropping tasks on top
    if (indexTaskDrop === 0 && indexTaskDrag < indexTaskDrop) indexTaskDrop = 1;
    // in case the drop is below the last element, set index is the last element
    if (indexTaskDrop === -1) indexTaskDrop = taskListState.length;
    // In case of dragging the task from bottom to top
    if (indexTaskDrag >= indexTaskDrop) {
      indexTaskDrop += 1;
    }

    dispatch(dragDropTask({ indexTaskDrag, indexTaskDrop }));
  };

  const handleSetDueDateTask = (value: any, id?: number) => {
    dispatch(setDueDateTask({ id, dueDate: value }));
  };

  return (
    <div className="p-3">
      <ModalConfirm
        openModal={openModalConfirm}
        handleOpenModal={handleOpenModalConfirm}
        handleConfirm={handleDeleteTask}
      />
      <ModalForm
        openModal={openModalForm}
        task={taskSelected}
        type={!!taskSelected ? "Edit" : "Create"}
        handleOpenModal={handleOpenModalForm}
        handleConfirm={handleUpdateTask}
        handleStateChange={handleStateModalFormChange}
      />
      <Card className="h-full w-full" placeholder={undefined}>
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none"
          placeholder={undefined}
        >
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography
                variant="h5"
                color="blue-gray"
                placeholder={undefined}
              >
                Todo list
              </Typography>
              <Typography
                color="gray"
                className="mt-1 font-normal"
                placeholder={undefined}
              >
                See information about all task.
              </Typography>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Tabs value={statusTab} className="w-full md:w-max">
              <TabsHeader placeholder={undefined}>
                {TABS_MARK_STATUS.map((item) => (
                  <Tab
                    key={item}
                    value={item}
                    className="pl-5 pr-5"
                    placeholder={undefined}
                    onClick={() => setStatusTab(item)}
                  >
                    {item}
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                className="flex items-center gap-3"
                size="sm"
                placeholder={undefined}
                onClick={handleOpenModalForm}
              >
                <PlusIcon className="h-4 w-4" /> Add Task
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0" placeholder={undefined}>
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      placeholder={undefined}
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            {taskListState.length > 0 ? (
              <DroppableContainer onDrop={handleDrop}>
                {taskListState.map((task, index) => {
                  return (
                    <DraggableItemComponent
                      key={task.id}
                      id={`task-${task.id}`}
                      content={
                        <>
                          <td className="p-4 border-b">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                  placeholder={undefined}
                                >
                                  {task.title}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 border-b">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                                placeholder={undefined}
                              >
                                {task.description}
                              </Typography>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-70"
                                placeholder={undefined}
                              >
                                {task.completed}
                              </Typography>
                            </div>
                          </td>
                          <td className="p-4 border-b">
                            <div className="w-max">
                              <Chip
                                variant="ghost"
                                size="sm"
                                value={task.completed ? "COMPLETED" : "PENDING"}
                                color={task.completed ? "green" : "amber"}
                              />
                            </div>
                          </td>
                          <td className="p-4 border-b">
                            {!task.completed && (
                              <DatePicker
                                task={task}
                                handleSetDueDateTask={handleSetDueDateTask}
                              />
                            )}
                          </td>
                          <td className="p-4 border-b">
                            <Tooltip content="Edit Task">
                              <IconButton
                                variant="text"
                                placeholder={undefined}
                                onClick={() => {
                                  handleOpenModalForm();
                                  setTaskSelected(task);
                                }}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Delete Task">
                              <IconButton
                                variant="text"
                                placeholder={undefined}
                                onClick={() => {
                                  handleOpenModalConfirm();
                                  setTaskSelected(task);
                                }}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            {!task.completed && (
                              <Tooltip content="Mark this task completed">
                                <IconButton
                                  variant="text"
                                  placeholder={undefined}
                                  onClick={() => {
                                    handleToggleTask(task.id);
                                  }}
                                >
                                  <ShieldCheckIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </td>
                        </>
                      }
                    />
                  );
                })}
              </DroppableContainer>
            ) : (
              <Typography
                variant="small"
                color="blue-gray"
                className="opacity-70 no-data w-full shadow-md"
                placeholder={undefined}
              >
                No data
              </Typography>
            )}
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default TodoTask;
