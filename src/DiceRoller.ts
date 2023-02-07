import { type Random } from './Random'

export class DiceRoller {
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

export class DiceRoll {
  private readonly _spec: string
  private readonly _positiveRolls: Map<number, number> = new Map<number, number>()
  private readonly _negativeRolls: Map<number, number> = new Map<number, number>()

  constructor (spec: string) {
    this._spec = spec

    this.parse(spec)
  }

  private parse (spec: string): void {
    let start = 0

    let isPositive = true
    for (let i = 0; i < spec.length; i++) {
      if (spec[i] === '+') {
        this.parseGroup(spec.substring(start, i), isPositive)
        start = i + 1
        isPositive = true
      } else if (spec[i] === '-') {
        this.parseGroup(spec.substring(start, i), isPositive)
        start = i + 1
        isPositive = false
      }
    }

    if (start < spec.length) this.parseGroup(spec.substring(start, spec.length), isPositive)
  }

  private parseGroup (spec: string, isPositive: boolean): void {
    const parts = spec.split('d')

    if (parts.length === 1) {
      // TODO
      return
    }

    const times = Number.parseInt(parts[0])
    const size = Number.parseInt(parts[1])

    if (isPositive) {
      const current = this._positiveRolls.get(size) ?? 0
      this._positiveRolls.set(size, current + times)
    } else {
      const current = this._negativeRolls.get(size) ?? 0
      this._negativeRolls.set(size, current + times)
    }
  }

  canonical (): string {
    return this._spec
  }

  positiveRolls (): Map<number, number> {
    return this._positiveRolls
  }

  negativeRolls (): Map<number, number> {
    return this._negativeRolls
  }
}
