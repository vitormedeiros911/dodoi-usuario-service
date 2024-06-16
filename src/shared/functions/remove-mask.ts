export function removeMask(string: string) {
  if (string) return string.replace(/[^0-9]+/g, '');
}
