import { isPrimitive } from './utils'

export type WalkUpdater = <T = any>(key: any, value: T) => T

export default function walk(subject: any, updater: WalkUpdater): any {
  // Subject is an Array
  if (Array.isArray(subject)) return walkArray(subject, updater)
  // Subject is a Map
  if (subject instanceof Map) return walkMap(subject, updater)
  // Subject is an POJO
  return walkObject(subject, updater)
}

function walkArray<T = any>(array: T[], updater: WalkUpdater): T[] {
  return array.reduce((arr, value, index) => {
    const updatedValue = updateEntry(""+index, value, updater)
    if (typeof updatedValue === undefined) {
      return arr
    } else {
      return [...arr, updatedValue]
    }
  }, [])
}

function walkMap<K = string, V = any>(map: Map<K, V>, updater: WalkUpdater): Map<K, V> {
  return Array.from(map.entries()).reduce((m, [key, value]) => {
    const updatedValue = updateEntry(key, value, updater)
    if (typeof updatedValue === undefined) {
      m.delete(key)
      return m
    }
    return m.set(key, updatedValue)
  }, new Map(map))
}

function walkObject(object: {}, updater: WalkUpdater): {} {
  return Object.entries(object).reduce((obj, [key, value]) => {
    const updatedValue = updateEntry(key, value, updater)
    if (typeof updatedValue === undefined) {
      const { [key]: _, ...withoutKey } = obj
      return withoutKey
    }
    return { ...obj, [key]: updatedValue}
  }, object)
}

function updateEntry<K = string, V = any>(key: K, value: V, updater: WalkUpdater): V {
  return isPrimitive(value) 
    ? updater(key, value)
    : updater(key, walk(value, updater))
}