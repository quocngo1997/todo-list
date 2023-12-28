import React from "react";
import { ToastContainer } from "react-toastify";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import TodoTask from "./components/TodoTask";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App(): JSX.Element {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <TodoTask />
      </DndProvider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
}

export default App;
