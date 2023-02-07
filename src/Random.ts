export interface Random {
  int: (min: number, max: number) => number
}

export class RealRandom implements Random {
  int (minInclusive: number, maxInclusive: number): number {
    if (minInclusive > maxInclusive) throw new Error('Wrong input')
    if (minInclusive === maxInclusive) return minInclusive

    const min = Math.ceil(minInclusive)
    const max = Math.floor(maxInclusive + 1)
    return Math.floor(Math.random() * (max - min) + min)
  }
}

export class FakeRandom implements Random {
  private readonly nextInt: Map<string, number[]> = new Map<string, number[]>()

  int (min: number, max: number): number {
    const res = this.nextInt.get(this.makeKey(min, max))?.shift()

    if (typeof res !== 'undefined') return res

    throw new Error('Next number in this range not defined')
  }

  setNextForRange (next: number, min: number, max: number): void {
    if (!Number.isInteger(next)) throw new Error('Works only with integers')
    if (min > max) throw new Error('Invalid range')
    if (next > max || next < min) throw new Error('Next is outside of the range')

    const key = this.makeKey(min, max)
    if (!this.nextInt.has(key)) this.nextInt.set(key, [])

    this.nextInt.get(key)?.push(next)
  }

  private makeKey (min: number, max: number): string {
    return [min, max].join('_')
  }

  clear (): void {
    this.nextInt.clear()
  }
}
