// https://dev.to/ecyrbe/how-to-use-advanced-typescript-to-define-a-pipe-function-381h
type AnyFunc = (...arg: any) => any;

type PipeArgs<F extends AnyFunc[], Acc extends AnyFunc[] = []> = F extends [(...args: infer A) => infer B]
  ? [...Acc, (...args: A) => B]
  : F extends [(...args: infer A) => any, ...(infer Tail)]
  ? Tail extends [(arg: infer B) => any, ...any[]]
    ? PipeArgs<Tail, [...Acc, (...args: A) => B]>
    : Acc
  : Acc;

  type LastFnReturnType<F extends Array<AnyFunc>, Else = never> = F extends [...any[], (...arg: any) => infer R]
  ? R
  : Else;


/**
 * Take a series of functions and call the function with the results of the previous function.
 * ```
 * const result = pipe(a, b, c)("bob");
 * ```
 * this will result in the similar imperitive code execution
 * ```
 * const input = "bob";
 * const aResult = a(input);
 * const bResult = b(aResult);
 * const result = c(bResult);
 * ```
 * @param firstFn 
 * @param fns 
 * @returns 
 */
export function pipe<FirstFn extends AnyFunc, F extends AnyFunc[]>(
  firstFn: FirstFn,
  ...fns: PipeArgs<F> extends F ? F : PipeArgs<F>
): (arg: Parameters<FirstFn>[0]) => LastFnReturnType<F, ReturnType<FirstFn>> {
  return (args: Parameters<FirstFn>) => (fns as AnyFunc[]).reduce((acc, fn) => fn(acc), firstFn(args));
};