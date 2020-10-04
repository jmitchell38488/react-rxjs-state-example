import React, { useEffect, useState } from "react";
import { useStateContext } from "../../state.context";

export const TodoItem = ({ id, goBack }) => {
  const { notifyObservers, getStore, subscribeOnStore } = useStateContext();
  const [item, setItem] = useState(undefined);

  if (!item) {
    const storeItem = getStore("TODOS", `items.id#${id}`).shift();
    setItem(storeItem);
  }

  useEffect(() => {
    const subscription = subscribeOnStore("TODOS", `UPDATE.ITEM.${id}`)
      .subscribe(event => {
        setItem(event.data);
      });

      return () => {
        subscription.unsubscribe();
      }
  }, [])

  const setCompleted = (ev) => {
    ev.preventDefault();
    item.completed = !item.completed;
    notifyObservers("TODOS", "SET.ITEM", item);
  }

  const handleBackClick = (ev) => {
    ev.preventDefault();
    goBack();
  }

  if (!item) {
    return (
      <>
        <div><a href="#" onClick={() => goBack()}>Back</a></div>
        <div>Could not find item</div>
      </>
    )
  }

  return (
    <div>
      <div><a href="#" onClick={(e) => handleBackClick(e)}>Back</a></div>
      <div>{item.id}: {item.title}{item.completed ? <span> (completed)</span> : null}</div>
      <button onClick={(e) => setCompleted(e)}>Set {item.completed ? "not " : ""}completed</button>
    </div>
  )
}