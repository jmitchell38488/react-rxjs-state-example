import React, { useState } from "react";
import { useGetTodoItemsFromApi } from "./getTodoItemsFromApiHook";
import { TodoItem } from "./item";

export const TodoList = () => {
  const [id, setId] = useState(undefined);
  const [show, setShow] = useState("ALL");
  const { items } = useGetTodoItemsFromApi(show);

  if (items.length < 1) {
    return <div>Loading items...</div>
  }

  const showTodo = (ev, id) => {
    ev.preventDefault();
    setId(id);
  }

  const goBack = () => {
    setId(undefined);
  }

  const setShowState = (ev, state) => {
    ev.preventDefault();
    if (!["ALL", "COMPLETED", "IN_PROGRESS"].includes(state)) {
      setShow("ALL");
      return;
    }

    setShow(state);
  }

  if (id) {
    return <TodoItem id={id} goBack={goBack} />
  }

  return (
    <>
      <div>
        <button onClick={(e) => setShowState(e, "ALL")}>Show ALL</button>
        <button onClick={(e) => setShowState(e, "COMPLETED")}>Show COMPLETED</button>
        <button onClick={(e) => setShowState(e, "IN_PROGRESS")}>Show IN PROGRESS</button>
      </div>
      <div>
        {items.map(item => (
          <div key={`item-${item.userId}-${item.id}`}>
            <a href={`#${item.id}`} onClick={(e) => showTodo(e, item.id)}>{item.id}: {item.title}{item.completed ? <span> (completed)</span> : null}</a>
          </div>
        ))
        }
      </div>
    </>
  )
}

