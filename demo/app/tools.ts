export const isJSON = (str:string) => {
  try {
    eval(`const r = ${str}`)
  } catch (e) {
    return false;
  }
  return true;
};
