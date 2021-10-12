import { PubSub } from "./pubsub";

interface EventsMap {
  userAdded: { id: number; name: string };
  userRemoved: { id: number };
}

const makePubSub = () => {
  const addListener = jest.fn();
  const removeListener = jest.fn();

  const userAddedData: EventsMap["userAdded"] = {
    id: 1,
    name: "john"
  };

  const userRemovedData: EventsMap["userRemoved"] = {
    id: 1
  };

  const pubSub = new PubSub<EventsMap>();

  return {
    userAddedData,
    userRemovedData,
    pubSub,
    addListener,
    removeListener
  };
};

describe("PubSub", () => {
  it("a listener should be called when subscribing to such topic", () => {
    const { addListener, pubSub, userAddedData } = makePubSub();

    pubSub.subscribe("userAdded", addListener);
    pubSub.publish("userAdded", userAddedData);

    expect(addListener).toHaveBeenCalledWith(userAddedData);
  });

  it("should be able to listen to mulitple topics", () => {
    const {
      addListener,
      pubSub,
      userAddedData,
      userRemovedData,
      removeListener
    } = makePubSub();

    pubSub.subscribe("userAdded", addListener);
    pubSub.publish("userAdded", userAddedData);

    pubSub.subscribe("userRemoved", removeListener);
    pubSub.publish("userRemoved", userRemovedData);

    expect(addListener).toHaveBeenCalledWith(userAddedData);
    expect(removeListener).toHaveBeenCalledWith(userRemovedData);
  });

  it("should be able to atach multiple listeners to a topic", () => {
    const { addListener, pubSub, userAddedData } = makePubSub();

    const otherAddListener = jest.fn();

    pubSub.subscribe("userAdded", addListener);
    pubSub.subscribe("userAdded", otherAddListener);
    pubSub.publish("userAdded", userAddedData);

    expect(addListener).toBeCalledWith(userAddedData);
    expect(otherAddListener).toBeCalledWith(userAddedData);
  });

  it("should not call a listener from another topic", () => {
    const { addListener, pubSub, userAddedData, removeListener } = makePubSub();

    pubSub.subscribe("userAdded", addListener);
    pubSub.publish("userAdded", userAddedData);

    pubSub.subscribe("userRemoved", removeListener);

    expect(addListener).toHaveBeenCalledTimes(1);
    expect(removeListener).toHaveBeenCalledTimes(0);
  });

  it("should be able to unsubscribe from a topic", () => {
    const { addListener, pubSub, userAddedData } = makePubSub();

    const cleanAddListener = pubSub.subscribe("userAdded", addListener);
    pubSub.publish("userAdded", userAddedData);
    expect(addListener).toHaveBeenCalledTimes(1);

    cleanAddListener();

    pubSub.publish("userAdded", userAddedData);
    expect(addListener).toHaveBeenCalledTimes(1);
  });
});
