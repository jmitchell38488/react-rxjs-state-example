const { createContext, useContext } = require("react");

const StateContext = createContext({});
const useStateContext = () => useContext(StateContext);
const StateProvider = StateContext.Provider;
export { StateContext, useStateContext, StateProvider }
