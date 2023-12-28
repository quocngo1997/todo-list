import React from "react";
import { useDrag } from "react-dnd";
import { DraggableItemType } from "../interfaces/Task";

const DraggableItemComponent: React.FC<DraggableItemType> = ({
  content,
  id,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ITEM",
    item: { id, content },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <tr ref={drag} id={id} className={`${isDragging ? "opacity-50" : ""}`}>
      {content}
    </tr>
  );
};

export default DraggableItemComponent;
