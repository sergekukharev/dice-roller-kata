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

  it('rolls all the standard dice', () => {
    random.setNextForRange(1, 1, 6)
    random.setNextForRange(2, 1, 8)
    random.setNextForRange(3, 1, 10)
    random.setNextForRange(10, 1, 12)
    random.setNextForRange(20, 1, 20)
    random.setNextForRange(1, 1, 100)
    expect(diceRoller.roll('1d6')).toBe(1)
    expect(diceRoller.roll('1d8')).toBe(2)
    expect(diceRoller.roll('1d10')).toBe(3)
    expect(diceRoller.roll('1d12')).toBe(10)
    expect(diceRoller.roll('1d20')).toBe(20)
    expect(diceRoller.roll('1d100')).toBe(1)
  })
  it('works well with multiple rolls of the same die', () => {
    random.setNextForRange(1, 1, 6)
    random.setNextForRange(4, 1, 6)

    expect(diceRoller.roll('1d6')).toBe(1)
    expect(diceRoller.roll('1d6')).toBe(4)
  })
})
