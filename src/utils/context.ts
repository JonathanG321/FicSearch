export function createDefaultContext<T extends object>() {
  return new Proxy<T>({} as T, {
    get(target, prop) {
      throw new Error(
        `Dev Error: You are using this context outside of the Provider. Cannot access ${prop.toString()}.`
      );
    },
  });
}
