import { ParamsValueType, TFormParamsType } from "../hooks/form/useTForm";

type ErrorType = {
  state: boolean;
  message: string[];
};

type InputParamsType = Omit<ParamsValueType, "type" | "onChnageModeㄹ">;

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

type StoreType = {
  [Name in keyof TFormParamsType]: Input;
};

export class Store {
  store: StoreType = {} as StoreType;

  private isValid: boolean = false;
  private isDirty: boolean = false;
  private isTouched: boolean = false;

  constructor(inputs: TFormParamsType) {
    for (const input in inputs) {
      this.store[input] = new Input(inputs[input]);
    }
  }

  private setValidState(state: boolean) {
    this.isValid = state;
  }

  private setDirtyState(state: boolean) {
    this.isDirty = state;
  }

  private setTouchedState(state: boolean) {
    this.isTouched = state;
  }

  validateAllInputValid() {
    const validState = Object.keys(this.store).every(
      (input) => this.store[input].isValid === true
    );
    this.setValidState(validState);
  }

  validateAllInputDirty() {
    const dirtyState = Object.keys(this.store).every(
      (input) => this.store[input].isDirty === true
    );
    this.setDirtyState(dirtyState);
  }

  validateAllInputTouched() {
    const touchedState = Object.keys(this.store).every(
      (input) => this.store[input].isTouched === true
    );
    this.setTouchedState(touchedState);
  }

  getValidState() {
    return this.isValid;
  }

  getDirtyState() {
    return this.isDirty;
  }

  getTouchedState() {
    return this.isTouched;
  }
}
