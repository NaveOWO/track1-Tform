import { TFormParamsType } from "../types/common";
import { Input } from "./input";

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
