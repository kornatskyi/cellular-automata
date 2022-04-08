export const html = (strings: TemplateStringsArray, ...values: any) => {
  // console.log(values)

  return strings.reduce((acc: any, string: any, i: number) => {
    return acc + string + (values[i] ? values[i] : '')
  }, '')
}
