import DiceRoller from './DiceRoller'
import { FakeRandom } from './Random'

describe('Dice roller', () => {
  const random = new FakeRandom()
  const diceRoller = new DiceRoller(random)

  afterEach(() => {
    random.clear()
  })

  it('rolls simple 1d4', () => {
    random.setNextForRange(2, 1, 4)
    expect(diceRoller.roll('1d4')).toBe(2)
  })
})
