import { type Random } from './Random'

export class DiceRoller {
  private readonly _random: Random

  constructor (random: Random) {
    this._random = random
  }

  roll (spec: DiceRollSpec): number {
    let sum = 0
    spec._positiveRolls().forEach((times, size) => {
      sum += this.rollMultipleOfSame(times, size)
    })

    spec._negativeRolls().forEach((times, size) => {
      sum -= this.rollMultipleOfSame(times, size)
    })

    sum += spec._absoluteModifier()

    return sum > 0 ? sum : 0
  }

  private rollMultipleOfSame (times: number, size: number): number {
    let result = 0
    for (let i = 0; i < times; i++) {
      result += this.rollOneDie(size)
    }

    return result
  }

  private rollOneDie (size: number): number {
    return this._random.int(1, size)
  }
}

export class DiceRollSpec {
  private readonly _spec: string
  private readonly positiveRolls: Map<number, number> = new Map<number, number>()
  private readonly negativeRolls: Map<number, number> = new Map<number, number>()
  private absoluteModifier: number = 0

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
      isPositive ? this.absoluteModifier += Number.parseInt(parts[0]) : this.absoluteModifier -= Number.parseInt(parts[0])
      return
    }

    const times = Number.parseInt(parts[0])
    const size = Number.parseInt(parts[1])

    if (isPositive) {
      const current = this.positiveRolls.get(size) ?? 0
      this.positiveRolls.set(size, current + times)
    } else {
      const current = this.negativeRolls.get(size) ?? 0
      this.negativeRolls.set(size, current + times)
    }
  }

  canonical (): string {
    return this._spec
  }

  _positiveRolls (): Map<number, number> {
    return this.positiveRolls
  }

  _negativeRolls (): Map<number, number> {
    return this.negativeRolls
  }

  _absoluteModifier (): number {
    return this.absoluteModifier
  }
}
