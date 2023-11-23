import { writable, type Writable } from 'svelte/store';

export class DebounceStore<T> implements Writable<T> {
  private store: Writable<T>;
  private timeout: number | undefined;

  constructor(initialValue: T, private delay: number = 300) {
    this.store = writable(initialValue);
  }

  subscribe(run: (value: T) => void) {
    return this.store.subscribe(run);
  }

  set(value: T) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.store.set(value), this.delay);
  }

  update(updater: (value: T) => T) {
    this.store.update(updater);
  }
}