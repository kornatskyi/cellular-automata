/* eslint-disable @typescript-eslint/no-explicit-any */
export const html = (strings: TemplateStringsArray, ...values: any) => {
	// console.log(values)

	return strings.reduce((acc: string, string: string, i: number) => {
		return acc + string + (values[i] ? values[i] : "");
	}, "");
};
