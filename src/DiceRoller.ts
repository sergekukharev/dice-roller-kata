import { type Random } from './Random'

export default class DiceRoller {
  private readonly _random: Random

  constructor (random: Random) {
    this._random = random
  }

  roll (spec: string): number {
    const parts = spec.split('d')
    const times = Number.parseInt(parts[0])

    let result = 0
    for (let i = 0; i < times; i++) {
      result += this._random.int(1, Number.parseInt(parts[1]))
    }

    return result
  }
}
