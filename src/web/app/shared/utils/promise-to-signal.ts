export const promiseToSignal = <T>(value: Promise<T>) => {
  return value.then(value => {})
}
