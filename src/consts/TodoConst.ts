export const TABLE_HEAD = [
  "Title",
  "Description",
  "Status",
  "Due Date",
  "Action",
];

export const ALL_TASK = "All";

export const COMPLETED_TASK = "Completed";

export const PENDING_TASK = "Pending";

export type STATUS_TASK =
  | typeof ALL_TASK
  | typeof COMPLETED_TASK
  | typeof PENDING_TASK;

export const TABS_MARK_STATUS: STATUS_TASK[] = [
  ALL_TASK,
  COMPLETED_TASK,
  PENDING_TASK,
];
