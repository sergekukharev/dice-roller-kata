import { type Random } from './Random'

export default class DiceRoller {
  private readonly _random: Random

  constructor (random: Random) {
    this._random = random
  }

  roll (spec: string): number {
    return this._random.int(1, 4)
  }
}
