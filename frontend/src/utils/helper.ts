export const convertTime = (param: number): string => {
  console.log(param);
  const paramTransform = param;
  const minutes = Math.trunc(paramTransform / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (paramTransform % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const timeLeftInSeconds = (param: Date) => {
  return Math.floor((new Date(param).getTime() - Date.now()) / 1000);
};

export const sleep = async (ms: number = 3000) =>
  new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(timer);
    }, ms);
  });

export const formatCurrency = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
