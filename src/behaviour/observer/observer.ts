interface Listener<T> {
  update(changes: T): void;
}

export class Observer<T> {
  private listeners: Listener<T>[] = [];

  subscribe = (listener: Listener<T>) => {
    this.listeners.push(listener);
  };

  unsubscribe = (listener: Listener<T>) => {
    return this.listeners.filter((l) => l !== listener);
  };

  notify = (changes: T) => {
    this.listeners.forEach((listener) => listener.update(changes));
  };
}
