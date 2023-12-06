const timeFn = <T,R>(fn: (...args:T[])=>R) => (...args:T[]):R => {
  console.time(fn.name);
  const result = fn(...args);
  console.timeEnd(fn.name);
  return result;
};

export default timeFn;