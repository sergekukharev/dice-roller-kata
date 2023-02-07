import { RealRandom } from './Random'

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
