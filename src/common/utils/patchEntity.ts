import { BaseEntity } from 'common/entities/base.entity'

export type EntityDiff = { key: string; from: string; to: string }
export type InputPatch<T> = { [K in keyof T]?: T[K] | null }

export function patchEntity<T extends BaseEntity, I extends InputPatch<T>>(
  entity: T,
  input: I
): EntityDiff[] {
  const diff: EntityDiff[] = []

  for (const key of Object.keys(entity)) {
    const newValue = input[key as keyof T]
    const oldValue = entity[key as keyof T]
    if (newValue !== undefined && key !== 'id') {
      entity[key as keyof T] = newValue as any
    }

    if (
      Array.isArray(newValue) ||
      typeof newValue == 'object' ||
      typeof newValue == 'symbol' ||
      typeof newValue == 'function' ||
      typeof newValue == 'undefined' ||
      Array.isArray(newValue) ||
      typeof newValue == 'object' ||
      typeof newValue == 'symbol' ||
      typeof newValue == 'function' ||
      typeof newValue == 'undefined' ||
      newValue == oldValue
    ) {
      continue
    }

    const oldValueStr = oldValue?.toString()

    if (oldValueStr !== undefined) {
      diff.push({ key, from: oldValueStr, to: newValue.toString() })
    }
  }

  return diff
}
