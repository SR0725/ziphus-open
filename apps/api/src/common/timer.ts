/**
 * Timer
 * 可以輸入一個間隔時間，並回傳觸發函數與清空函數
 */

export const Timer = (interval: number) => {
  let timer: NodeJS.Timeout | -1 = -1;
  return {
    start: (callback: () => void) => {
      if (timer !== -1) {
        return;
      }
      timer = setInterval(callback, interval);
    },
    clear: () => {
      timer = -1;
      clearInterval(timer);
    },
  };
};
