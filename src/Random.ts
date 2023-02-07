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
