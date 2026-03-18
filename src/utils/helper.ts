export const convertTime = (param: number): string => {
  const paramTransform = param;
  const minutes = Math.trunc(paramTransform / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (paramTransform % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const sleep = async (ms: number = 3000) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve(timer);
    }, ms);
  });
