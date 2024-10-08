import { Between, LessThan, MoreThan } from 'typeorm'

export function dateFilter(from: Date | undefined, to: Date | undefined) {
  return from && to
    ? Between(from, to)
    : from
      ? MoreThan(from)
      : to
        ? LessThan(to)
        : undefined
}
