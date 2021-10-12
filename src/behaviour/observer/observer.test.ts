import { Observer } from "./observer";

interface Changes {
  value: string;
}

const makeObserver = () => {
  const listener = {
    update: jest.fn()
  };
  const changes: Changes = {
    value: "system updated"
  };

  const observer = new Observer<Changes>();

  return {
    changes,
    observer,
    listener
  };
};

describe("Observer", () => {
  it("a listener should be called on notify", () => {
    const { listener, changes, observer } = makeObserver();

    observer.subscribe(listener);
    observer.notify(changes);

    expect(listener.update).toHaveBeenCalledWith(changes);
  });

  it("a listener should be able to unsubscribe from changes", () => {
    const { listener, changes, observer } = makeObserver();

    observer.subscribe(listener);
    observer.notify(changes);
    expect(listener.update).toBeCalledTimes(1);

    observer.unsubscribe(listener);
    expect(listener.update).toBeCalledTimes(1);
  });
});
