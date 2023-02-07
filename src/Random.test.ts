import { FakeRandom, RealRandom } from './Random'

describe('RealRandom class', () => {
  const realRandom = new RealRandom()
  it('generates integers inclusively', () => {
    for (let i = 0; i < 1000; i++) {
      expect([0, 1, 2, 3, 4]).toContain(realRandom.int(0, 4))
    }
  })

  it('works well with custom ranges', () => {
    for (let i = 0; i < 1000; i++) {
      expect([3, 4, 5, 6, 7, 8, 9, 10]).toContain(realRandom.int(3, 10))
    }
  })

  it('works well with short ranges', () => {
    for (let i = 0; i < 1000; i++) {
      expect([3, 4]).toContain(realRandom.int(3, 4))
    }
  })

  it('works with no range', () => {
    for (let i = 0; i < 100; i++) {
      expect(realRandom.int(3, 3)).toBe(3)
    }
  })

  it('throws when invalid range is provided', () => {
    expect(() => realRandom.int(3, 2)).toThrow()
  })

  it('works with negative numbers', () => {
    for (let i = 0; i < 1000; i++) {
      expect([-3, -2, -1]).toContain(realRandom.int(-3, -1))
    }
  })

  it('works with negative-to-positive ranges', () => {
    for (let i = 0; i < 1000; i++) {
      expect([-3, -2, -1, 0, 1, 2]).toContain(realRandom.int(-3, 2))
    }
  })
})

describe('FakeRandom class', () => {
  const random = new FakeRandom()

  it('throws when uninitiated', () => {
    expect(() => random.int(1, 2)).toThrow()
  })

  it('allows to define next returned integer per range', () => {
    const next = 3
    const min = 3
    const max = 5

    random.setNextForRange(next, min, max)

    expect(random.int(min, max)).toBe(next)
  })

  // TODO range does not exist
  // TODO do not allow setting non-integers
  // TODO validate range
  // TODO validate next is within range
})
