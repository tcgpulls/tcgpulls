const delayPromise = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default delayPromise;
