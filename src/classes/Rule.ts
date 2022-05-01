export class Rule {
	fff: boolean;
	fft: boolean;
	ftf: boolean;
	ftt: boolean;
	tff: boolean;
	tft: boolean;
	ttf: boolean;
	ttt: boolean;
	constructor(fff: boolean, fft: boolean, ftf: boolean, ftt: boolean, tff: boolean, tft: boolean, ttf: boolean, ttt: boolean) {
		this.fff = fff;
		this.fft = fft;
		this.ftf = ftf;
		this.ftt = ftt;
		this.tff = tff;
		this.tft = tft;
		this.ttf = ttf;
		this.ttt = ttt;
	}
	result(colors: [boolean, boolean, boolean]): boolean {
		if (colors[0] === false && colors[1] === false && colors[2] === false) return this.fff;
		if (colors[0] === false && colors[1] === false && colors[2] === true) return this.fft;
		if (colors[0] === false && colors[1] === true && colors[2] === false) return this.ftf;
		if (colors[0] === false && colors[1] === true && colors[2] === true) return this.ftt;
		if (colors[0] === true && colors[1] === false && colors[2] === false) return this.tff;
		if (colors[0] === true && colors[1] === false && colors[2] === true) return this.tft;
		if (colors[0] === true && colors[1] === true && colors[2] === false) return this.ttf;
		if (colors[0] === true && colors[1] === true && colors[2] === true) return this.ttt;

		throw new Error("Result could't be calculated because of wrong parameter type!");
	}
}
