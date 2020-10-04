# react-rxjs-state-example
_An example project using RxJS to manage ReactJS application state_

## Introduction
This is a test application to demonstrate that RxJS can be used to manage application state in ReactJS.

### Alternatives
[MobX][mobx] and [Redux][redux] are the two primary options for state management in a ReactJS application at the moment. They take different approaches, but fundamentally wrap your components with higher-order components to trigger renders when the application state changes.

The approach taken in this test application is to allow a component to 'subscribe' to those change events if it so wishes. Yes, it would be easier to wrap a lot of this functionality in HOC's, but also dramatically adds to the complexity.

### Reducers?
With RxJS, you have Redux-like reduces straight out of the box using `filter`:

```javascript
subject
  .pipe(filter(event => event.someData === myInput))
  .subscribe(...)
```

The functional programming nature of RxJS is more aesthetic to use than Redux, is simpler and it just makes more sense. The concept of stores, history, back tracking, etc. is easily achieved through maps, while immutability can be replicated by always returning cloned objects and values.

### Immutability
This example app doesn't go too deep into immutability, but it is definitely possible to do, and relatively straight forward. The primary concept of stores is that there's a primary data structure that maintains all of the stores in one location, so that any update to any node within a store, automatically inserts the entire data node into the history structure. That way, you could backtrack on need.

Immutability is simulated using object/array destructuring. Original key references and deep-nested objects could still be manipulated because the focus wasn't on true immutability, but simulating immutability. Using a library like [Immutable JS][immutablejs] would help, but so would deep cloning, which would achieve the same result.

### Context API
Like Redux, this test application uses the Context API to provide the state to your application where it needs it, rather than relying on imports. This allows an application to define different data stores in different segments of their application. This can be useful when isolating data from the main store.

### What next
Taking this example app, you could:

* Create HOC to automatically update props and refresh components
* True data immutability
* Exporting history and loading history
* Add API functionality to save data on change

[rxjs]: https://github.com/ReactiveX/rxjs
[mobx]: https://github.com/mobxjs/mobx
[redux]: https://github.com/reduxjs/redux
[immutablejs]: https://github.com/immutable-js/immutable-js