type Listener<T> = (change: T) => {};

export class PubSub<T> {
  private topics: Partial<Record<keyof T, Listener<T[keyof T]>[]>> = {};

  subscribe = <K extends keyof T>(topic: K, listener: Listener<T[K]>) => {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }

    this.topics[topic].push(listener);

    return () => {
      this.topics[topic] = this.topics[topic].filter((l) => l !== listener);
    };
  };

  publish = <K extends keyof T>(topic: K, change: T[K]) => {
    this.topics[topic].forEach((listener) => listener(change));
  };
}
