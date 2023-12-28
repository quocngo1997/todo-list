import { ReactNode } from "react";

export interface ITask {
  id?: number;
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
}

export interface DraggableItemType {
  content: ReactNode;
  id: string;
}

export interface ElementRect {
  element: Element;
  rect: DOMRect;
}
