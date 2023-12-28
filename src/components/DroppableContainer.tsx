import React, { ReactNode } from "react";
import { XYCoord, useDrop } from "react-dnd";
import { DraggableItemType } from "../interfaces/Task";

interface DroppableContainerProps {
  onDrop: (item: DraggableItemType, monitor: XYCoord | null) => void;
  children: ReactNode;
}

const DroppableContainer: React.FC<DroppableContainerProps> = ({
  onDrop,
  children,
}) => {
  const [, drop] = useDrop({
    accept: "ITEM",
    drop: (item: DraggableItemType, monitor) =>
      onDrop(item, monitor.getSourceClientOffset()),
  });

  return <tbody ref={drop}>{children}</tbody>;
};

export default DroppableContainer;
