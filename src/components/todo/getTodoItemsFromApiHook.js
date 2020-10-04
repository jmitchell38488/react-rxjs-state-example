import { useEffect, useState } from "react";
import { useStateContext } from "../../state.context";

export const useGetTodoItemsFromApi = (show) => {
  const { notifyObservers, getStore, subscribeOnStoreUpdate, subscribeOnStore } = useStateContext();
  const [items, setItems] = useState([]);
  const [syncdApi, setSyncdApi] = useState(false);
  const [increment, setIncrement] = useState(0);

  useEffect(() => {
    const subscriptions = [];

    subscriptions.push(
      subscribeOnStoreUpdate("TODOS")
        .subscribe(event => {
          setItems(event.data.items);
        })
    );

    subscriptions.push(
      subscribeOnStore("TODOS", "SET.ITEM")
        .subscribe(event => {
          setItems(getStore("TODOS", "items"));
          setIncrement(increment+1);
        })
    );

    let predicate = "";
    switch (show) {
      case "COMPLETED":
        predicate = ".completed#1";
        break;

      case "IN_PROGRESS":
        predicate = ".completed#0";
        break;
    }

    (async () => {
      if (!syncdApi) {
        const result = await fetch('https://jsonplaceholder.typicode.com/todos/');
        const json = await result.json();
        notifyObservers("TODOS", "SET", json);
        setSyncdApi(true);
      }
      
      console.log(increment);
      const store = getStore("TODOS", `items${predicate}`);
      setItems(store);
    })();

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    }
  }, [show, increment]);

  return { items };
}