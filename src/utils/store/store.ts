import { TFormParamsType } from "../../types/common";
import { Input } from "../input/input";
import { getInvariantObjectValues, invariantOf } from "../common/invariantType";

export type StoreType<Form extends TFormParamsType = TFormParamsType> = Record<
  keyof Form,
  Input
>;

export class Store<Form extends TFormParamsType> {
  store: StoreType<Form> = {} as StoreType<Form>;

  private isValid: boolean = false;
  private isDirty: boolean = false;
  private isTouched: boolean = false;

  constructor(inputs: Form) {
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

  setTouchedState() {
    const touchedState = getInvariantObjectValues(invariantOf(this.store)).some(
      (input) => input.defaultValue !== input.value
    );

    this.isTouched = touchedState;
  }

  validateAllInputValid() {
    const validState = Object.keys(this.store).every(
      (input) => this.store[input].isValid === true
    );
    this.setValidState(validState);
  }

  validateAllInputDirty() {
    const dirtyState = Object.keys(this.store).some(
      (input) => this.store[input].isDirty === true
    );
    this.setDirtyState(dirtyState);
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
