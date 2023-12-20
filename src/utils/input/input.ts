import { ParamsValueType } from "../../types/common";

export type ErrorType = {
  state: boolean;
  message: string[];
};

type ErrorParamsType = {
  state?: boolean;
  message?: string[];
};

type InputParamsType = Omit<ParamsValueType, "type" | "onChnageMode">;

export class Input {
  defaultValue?: string = "";
  value?: string = "";
  placeholder?: string = "";
  error: ErrorType = { state: false, message: [] };

  isValid: boolean = false;
  isDirty: boolean = false;

  constructor(props: InputParamsType) {
    this.defaultValue = props.defaultValue;
    this.value = props.defaultValue;
    this.placeholder = props.placeholder;
  }

  setInputValue(value: string) {
    this.value = value;
  }

  setInputError({ state, message }: ErrorParamsType) {
    this.error.state = state ?? this.error.state;
    this.error.message = message
      ? [...this.error.message, ...message]
      : this.error.message;
  }

  getValue() {
    return this.value;
  }

  getPlaceholder() {
    return this.placeholder;
  }

  getError() {
    return this.error;
  }

  static setValue(target: Input, currentValue: string) {
    target.value = currentValue;
  }
}
