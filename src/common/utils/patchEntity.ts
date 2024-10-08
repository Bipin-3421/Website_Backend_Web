import { BaseEntity } from 'common/entities/base.entity'

export type InputPatch<T> = { [K in keyof T]?: T[K] | null }

export function patchEntity<T extends BaseEntity, I extends InputPatch<T>>(
  entity: T,
  input: I
): T {
  for (const key of Object.keys(entity)) {
    const value = input[key as keyof T]
    if (value !== undefined && key !== 'id') {
      entity[key as keyof T] = value as any
    }
  }

  return entity
}
