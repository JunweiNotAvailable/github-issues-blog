// return true if the color is regarded as a dark color
export const isDark = (hexColor: string): boolean => {
  return parseInt(hexColor.slice(1), 16) < 0xffffff * .6;
}

// return a random integer
export const randInt = (a: number, b: number) => {
  return Math.floor(Math.random() * (b - a)) + a;
}