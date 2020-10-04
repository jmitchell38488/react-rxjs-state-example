import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

const initialiseState = () => {
  let revisions = 0;
  const stateHistory = {};
  const currentState = {
    version: 0,
    time: new Date(),
    data: {}
  };

  const notifySubject = new BehaviorSubject({
    store: "",
    action: "init",
    data: {}
  });

  const getCurrentState = () => {
    return { ...currentState.data };
  }

  const updateCurrentState = (data) => {
    insertCurrentIntoHistory();
    currentState.version = revisions * 1;
    currentState.time = new Date();
    currentState.data = { ...data };
  }

  const getStore = (store, index = undefined) => {
    if (!currentState.data[store]) {
      return undefined;
    }

    if (!index) {
      return getState(store);
    }

    return getState(`${store}.${index}`);
  }

  const getState = (index, data = undefined) => {
    const curData = data ? getClonedData(data) : getClonedData(currentState.data);

    const segments = index.split(".");
    const segment = segments[0];
    let retVal = undefined;

    // Array index filter
    if (Array.isArray(curData) && segments.length === 1 && segment.includes("#")) {
      const [ field, value ] = segment.split("#");
      if (!field || !value) {
        return retVal;
      }

      retVal = curData.filter(val => {
        if (Object(val) === val) { // Cheap object assertion
          return val[field] == value; // don't do strict equals since the type could be number/string/boolean
        }
        
        return val == value;
      })
    }

    if (!curData.hasOwnProperty(segment)) {
      return retVal;
    }

    if (segments.length === 1) {
      retVal = getClonedData(curData[segment]);
    } else {
      retVal = getState(segments.slice(1).join("."), getClonedData(curData[segment]));
    }

    return retVal;
  }

  const recurseSetUpdatedState = (index, newData, refData = undefined) => {
    const curData = refData || { ...currentState.data };
    const segments = index.split(".");
    const segment = segments[0];

    if (segments.length === 1) {
      curData[segment] = newData;
      return curData;
    }

    if (!curData.hasOwnProperty(segment)) {
      curData[segment] = {};
    }

    recurseSetUpdatedState(segments.slice(1).join("."), newData, curData[segment]);

    return curData;
  }

  const getCurrentRevision = () => currentState.version * 1;
  const getRevisionCount = () => revisions * 1;
  const insertCurrentIntoHistory = () => {
    stateHistory[currentState.version * 1] = getClonedData(currentState);
    ++revisions;
  }

  const getClonedData = (data) => {
    if (Array.isArray(data)) {
      return [...data];
    }

    if (Object(data) === data) {
      return { ...data };
    }

    return data;
  }

  const setState = (index, data, overwrite = true) => {
    const newData = !!overwrite
      ? getClonedData(data)
      : { ...getClonedData(getState(index)), ...getClonedData(data) };

    const newState = recurseSetUpdatedState(index, newData);
    updateCurrentState({ ...newState });
  }

  const notifyObservers = (store, action, data = undefined) => {
    notifySubject.next({
      store,
      action,
      data: data
    });
  }

  const registerStoreReducer = (store, cb) => {
    return notifySubject
      .pipe(filter(event => event.store === store))
      .subscribe(sub => cb(sub));
  }

  const subscribeOnStore = (store, action) => {
    return notifySubject
      .pipe(filter(event => event.store === store && event.action === action));
  }

  const subscribeOnStoreUpdate = (store) => {
    return subscribeOnStore(store, "UPDATE");
  }

  return {
    getStore,
    getState,
    setState,
    notifyObservers,
    getCurrentRevision,
    getRevisionCount,
    getCurrentState,
    getClonedData,
    subscribeOnStore,
    subscribeOnStoreUpdate,
    registerStoreReducer
  }
}

export {
  initialiseState
};