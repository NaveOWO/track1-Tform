export type ParamsValueType = {
  defaultValue?: string;
  placeholder?: string;
  type?: "file" | "text" | "checkbox";
  onChangeMode?: boolean;
  onBlurMode?: boolean;
};

export type TFormParamsType = Record<string, ParamsValueType>;
