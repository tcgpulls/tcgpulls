export type ParamsKeysT = {
  locale: string;
  tcgType: string;
  originalId: string;
};

export type ParamsT = Promise<Partial<ParamsKeysT>>;
