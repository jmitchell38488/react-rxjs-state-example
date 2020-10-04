export const registerReducers = (state) => {
  registerTodoSetReducer(state);
  registerTodoSetItemReducer(state);
};

const registerTodoSetReducer = (state) => {
  state.registerStoreReducer("TODOS", event => {
    if (event.action === "SET") {
      state.setState("TODOS.items", event.data);
      state.notifyObservers(event.store, "UPDATE", state.getStore("TODOS"));
    }
  });
};

const registerTodoSetItemReducer = (state) => {
  state.registerStoreReducer("TODOS", event => {
    if (event.action === "SET.ITEM") {
      let updatedItem = undefined;
      const items = state.getStore("TODOS", "items")
        .map(item => {
          if (item.id === event.data.id) {
            updatedItem = {
              ...item,
              ...event.data
            };
            return updatedItem;
          }

          return item
        });

      state.setState("TODOS.items", items);
      state.notifyObservers(event.store, `UPDATE.ITEM.${event.data.id}`, state.getClonedData(updatedItem));
    }
  })
}
