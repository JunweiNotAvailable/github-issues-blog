import { User } from "./interfaces";

// return true if the color is regarded as a dark color
export const isDark = (hexColor: string): boolean => {
  return parseInt(hexColor.replaceAll('#', ''), 16) < 0xffffff * .6;
}

// get the distance of now and the given time
export const getTimeFromNow = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = (now.getTime() - date.getTime()) / 1000;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`; // < 1h
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`; // < 1 day
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days`; // < 30 days
  const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
  if (months < 12) return `${months} months`; // < 365 days
  return `${Math.floor(months / 12)} years`;
}

// remove duplicated objects with same id
export const removeDuplicate = (array: User[]) => Array.from(array.reduce((map, obj) => map.set(obj.id, obj), new Map()).values());

// get random items in an array
export const getRandomItems = (array: any[], count: number) => {
  return array.slice().sort(() => Math.random() - 0.5).slice(0, count);
}

// format the number
export const formatNumber = (value: number) => {
  const suffixes = ['', 'k', 'm', 'b'];
  const order = Math.floor(Math.log10(Math.abs(value)) / 3);
  const suffix = suffixes[Math.min(order, suffixes.length - 1)];
  const formattedValue = value / Math.pow(10, order * 3);
  return `${Number.isInteger(formattedValue) ? formattedValue.toFixed(0) : formattedValue.toFixed(1)}${suffix}`;
}