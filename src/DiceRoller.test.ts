import { DiceRollSpec, DiceRoller } from './DiceRoller'
import { FakeRandom } from './Random'

describe('DiceRoller', () => {
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
  it('rolls 2d4', () => {
    const a = 2
    const b = 4

    random.setNextForRange(a, 1, 4)
    random.setNextForRange(b, 1, 4)

    expect(diceRoller.roll('2d4')).toBe(a + b)
  })
  it('can roll any (x)d(y)', () => {
    random.setNextForRange(3, 1, 12)
    random.setNextForRange(5, 1, 12)
    random.setNextForRange(1, 1, 12)
    random.setNextForRange(12, 1, 12)

    expect(diceRoller.roll('4d12')).toBe(3 + 5 + 1 + 12)
  })

  it('can roll 1d4+1', () => {
    random.setNextForRange(2, 1, 4)

    expect(diceRoller.roll('1d4+1')).toBe(2 + 1)
  })

  it('can roll (x)d(y)+z', () => {
    random.setNextForRange(13, 1, 100)
    random.setNextForRange(44, 1, 100)

    expect(diceRoller.roll('2d100+23')).toBe(13 + 44 + 23)
  })

  it('can roll 2d4 + 1d8 + 3', () => {
    random.setNextForRange(1, 1, 4)
    random.setNextForRange(4, 1, 4)
    random.setNextForRange(3, 1, 8)

    expect(diceRoller.roll('2d4 + 1d8 + 3')).toBe(1 + 4 + 3 + 3)
  })
  it('works with negative modifiers', () => {
    random.setNextForRange(2, 1, 4)

    expect(diceRoller.roll('1d4-1')).toBe(2 - 1)
  })

  it('rolls result that is always non-negative', () => {
    random.setNextForRange(1, 1, 4)

    expect(diceRoller.roll('1d4-300')).toBe(0)
  })

  it('handles very complex cases well', () => {
    random.setNextForRange(1, 1, 4)
    random.setNextForRange(4, 1, 4)
    random.setNextForRange(3, 1, 8)
    random.setNextForRange(1, 1, 4)
    random.setNextForRange(2, 1, 4)
    random.setNextForRange(3, 1, 4)

    expect(diceRoller.roll('2d4 - 1d8 + 3 + 3d4 + 4 - 1')).toBe(1 + 4 - 3 + 3 + 1 + 2 + 3 + 4 - 1)
  })

  it('should always return at minimum 1 for 1d100', () => {
    random.setNextForRange(1, 1, 100)

    expect(diceRoller.roll('1d100')).toBe(1)
  })

  /*
                                    Intentionally didn't do:
                                    - "1d4++1d4" case
                                     */
})

describe('DiceRollSpec', () => {
  it('has canonical dice roll spec representation', () => {
    expect(new DiceRollSpec('1d4 + 2d6 + 1').canonical()).toBe('1d4 + 2d6 + 1')
  })

  it('parses simple specs like "1d4"', () => {
    const roll = new DiceRollSpec('1d4')

    expect(roll.positiveRolls()).toEqual(new Map<number, number>([[4, 1]]))
  })

  it('parses negative specs', () => {
    const roll = new DiceRollSpec('-1d4')

    expect(roll.negativeRolls()).toEqual(new Map<number, number>([[4, 1]]))
  })

  it('parses one roll with multiple but same dice', () => {
    const roll = new DiceRollSpec('2d4')

    expect(roll.positiveRolls()).toEqual(new Map<number, number>([[4, 2]]))
  })

  it('parses multiple rolls of the same die', () => {
    const roll = new DiceRollSpec('1d4 + 1d4')

    expect(roll.positiveRolls()).toEqual(new Map<number, number>([[4, 2]]))
  })

  it('parses absolute modifiers', () => {
    const roll = new DiceRollSpec('1d4 + 3')

    expect(roll.absoluteModifier()).toEqual(3)
  })

  it('parses positive and negative rolls of the same die size', () => {
    const roll = new DiceRollSpec('2d4 - 1d4')

    expect(roll.positiveRolls()).toEqual(new Map<number, number>([[4, 2]]))
    expect(roll.negativeRolls()).toEqual(new Map<number, number>([[4, 1]]))
  })
  it('parses modifier only (positive)', () => {
    const roll = new DiceRollSpec('3')

    expect(roll.absoluteModifier()).toEqual(3)
  })
  it('parses modifier only (positive)', () => {
    const roll = new DiceRollSpec('-3')

    expect(roll.absoluteModifier()).toEqual(-3)
  })

  it('handles very complex cases well', () => {
    const spec = new DiceRollSpec('2d4 - 1d8 + 3 + 3d4 + 1d6 + 4 - 1')
    expect(spec.positiveRolls()).toEqual(new Map<number, number>([[4, 5], [6, 1]]))
    expect(spec.negativeRolls()).toEqual(new Map<number, number>([[8, 1]]))
    expect(spec.absoluteModifier()).toBe(6)
  })
})
