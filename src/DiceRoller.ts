import { type Random } from './Random'

export default class DiceRoller {
  private readonly _random: Random

  constructor (random: Random) {
    this._random = random
  }

  roll (spec: string): number {
    let start = 0

    let sum = 0
    let nextSign = 1
    for (let i = 0; i < spec.length; i++) {
      if (spec[i] === '+') {
        sum += nextSign * this.rollGroup(spec.substring(start, i))
        start = i + 1
        nextSign = 1
      } else if (spec[i] === '-') {
        sum += nextSign * this.rollGroup(spec.substring(start, i))
        start = i + 1
        nextSign = -1
      }
    }

    if (start < spec.length) sum += nextSign * this.rollGroup(spec.substring(start, spec.length))

    return sum > 0 ? sum : 0
  }

  rollGroup (spec: string): number {
    const parts = spec.split('d')

    if (parts.length === 1) return Number.parseInt(parts[0])

    const times = Number.parseInt(parts[0])
    const size = Number.parseInt(parts[1])

    return this.rollMultipleOfSame(times, size)
  }

  rollMultipleOfSame (times: number, size: number): number {
    let result = 0
    for (let i = 0; i < times; i++) {
      result += this.rollOneDie(size)
    }

    return result
  }

  rollOneDie (size: number): number {
    return this._random.int(1, size)
  }
}
