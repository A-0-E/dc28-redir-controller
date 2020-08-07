// @ts-ignore
import fromEntries from 'core-js-pure/features/object/from-entries'
import { useLocation, useHistory } from 'react-router-dom'

export const qs = <T extends Record<string, string>>(v: T) => {
  return Object.keys(v).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(v[k])}`).join('&')
}
export const fromQs = (s: string) => {
  return fromEntries(s.split('&').map(i => i.split('=', 2)))
}
export const useQs = <T>(): T => {
  const { search } = useLocation()
  return fromQs(search.substr(1))
}
export const usePushQsPartial = <T extends Record<string, string>>(pathname: string, old: T) => {
  const history = useHistory()
  return (opt: Partial<T>) => {
    history.push({
      pathname,
      search: qs<T>({
        ...old,
        ...opt,
      }),
    })
  }
}
export const usePushQs = <T extends Record<string, string>>(pathname: string) => {
  const history = useHistory()
  return (opt: T) => {
    history.push({
      pathname,
      search: qs<T>({
        ...opt,
      }),
    })
  }
}
export const useQsState = <T extends Record<string, string>>(pathname: string) => {
  const state = useQs<T>()
  const setState = usePushQsPartial(pathname, state)
  return [state, setState] as const
}
