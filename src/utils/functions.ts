// return true if the color is regarded as a dark color
export const isDark = (hexColor: string): boolean => {
  return parseInt(hexColor.slice(1), 16) < 0xffffff * .6;
}