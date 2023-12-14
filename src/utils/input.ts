import { ParamsValueType } from "../types/common";

type ErrorType = {
  state: boolean;
  message: string[];
};

type InputParamsType = Omit<ParamsValueType, "type" | "onChnageMode">;

export class Input {
  private value?: string = "";
  private placeholder?: string = "";
  private error: ErrorType = { state: false, message: [""] };

  isValid: boolean = false;
  isDirty: boolean = false;
  isTouched: boolean = false;

  constructor(props: InputParamsType) {
    this.value = props.defaultValue;
    this.placeholder = props.placeholder;
  }

  setInputValue(value: string) {
    this.value = value;
  }

  setInputError(state?: boolean, message?: string[]) {
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
