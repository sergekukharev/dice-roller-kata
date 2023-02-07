import { type Random } from './Random'

export default class DiceRoller {
  private readonly _random: Random

  constructor (random: Random) {
    this._random = random
  }

  roll (spec: string): number {
    const parts = spec.split('d')

    return this._random.int(Number.parseInt(parts[0]), Number.parseInt(parts[1]))
  }
}
