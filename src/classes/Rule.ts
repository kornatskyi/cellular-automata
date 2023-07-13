export class Rule {
  fff: boolean
  fft: boolean
  ftf: boolean
  ftt: boolean
  tff: boolean
  tft: boolean
  ttf: boolean
  ttt: boolean
  constructor(fff: boolean, fft: boolean, ftf: boolean, ftt: boolean, tff: boolean, tft: boolean, ttf: boolean, ttt: boolean) {
    this.fff = fff
    this.fft = fft
    this.ftf = ftf
    this.ftt = ftt
    this.tff = tff
    this.tft = tft
    this.ttf = ttf
    this.ttt = ttt
  }
  getRuleInFormOfBooleans(): boolean[] {
    return [this.fff, this.fft, this.ftf, this.ftt, this.tff, this.tft, this.ttf, this.ttt]
  }
  setRuleByIndex(index: number, value: boolean) {
    switch (index) {
      case 0:
        this.fff = value
        break
      case 1:
        this.fft = value
        break
      case 2:
        this.ftf = value
        break
      case 3:
        this.ftt = value
        break
      case 4:
        this.tff = value
        break
      case 5:
        this.tft = value
        break
      case 6:
        this.ttf = value
        break
      case 7:
        this.ttt = value
        break
      default:
        throw Error('Wrong rule index should be in range from 0 to 7!')
        break
    }
  }

  getRuleNumber(): number {
    const dNums = [128, 64, 32, 16, 8, 4, 2, 1]
    const r = dNums
      .map((n, i) => {
        return this.getRuleInFormOfBooleans()[i] ? n : 0
      })
      .reduce((e, acum) => e + acum, 0)
    console.log(r)

    return r
  }

  result(colors: [boolean, boolean, boolean]): boolean {
    if (colors[0] === false && colors[1] === false && colors[2] === false) return this.fff
    if (colors[0] === false && colors[1] === false && colors[2] === true) return this.fft
    if (colors[0] === false && colors[1] === true && colors[2] === false) return this.ftf
    if (colors[0] === false && colors[1] === true && colors[2] === true) return this.ftt
    if (colors[0] === true && colors[1] === false && colors[2] === false) return this.tff
    if (colors[0] === true && colors[1] === false && colors[2] === true) return this.tft
    if (colors[0] === true && colors[1] === true && colors[2] === false) return this.ttf
    if (colors[0] === true && colors[1] === true && colors[2] === true) return this.ttt

    throw new Error("Result could't be calculated because of wrong parameter type!")
  }
}
