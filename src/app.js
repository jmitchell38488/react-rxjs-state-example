import * as React from "react";
import * as ReactDOM from "react-dom";
import { initialiseState } from "./state";
import { TodoList } from "./components/todo/list";
import { registerReducers } from "./state.reducers";
import { StateProvider } from "./state.context";

const state = initialiseState();
registerReducers(state);
state.setState("TODOS.items", []);

ReactDOM.render(
  <StateProvider value={state}>
    <TodoList />
  </StateProvider>
  , document.getElementById("main")
)