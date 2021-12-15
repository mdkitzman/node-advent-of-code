import { cloneDeep } from "lodash";

export default function safeRecord<T>(defaultVal:T, obj: Record<string, T> = {}) {
  const defaulter: ProxyHandler<Record<string, T>> = {
    get: function(target: Record<string, T>, prop: string | Symbol, receiver) {
      const key = String(prop);
      if (target[key] === undefined)
        target[key] = cloneDeep(defaultVal);
      return target[key];
    },
    set: function(target: Record<string, T>, prop: string | Symbol, value:T) {
      const key = String(prop);
      target[key] = value;
      return true;
    }
  };

  return new Proxy(obj, defaulter);
};