import { ParamsValueType } from "../../types/common";
import { Store } from "./store";

type TStore = Record<"test1" | "test2", ParamsValueType>;

describe("Store 테스트", () => {
  let store: Store<TStore>;

  beforeEach(() => {
    store = new Store<TStore>({
      test1: {
        defaultValue: "defaultValue",
        placeholder: "placeholder",
      },
      test2: {
        defaultValue: "defaultValue",
        placeholder: "placeholder",
      },
    });
  });
  test("모든 input의 isValid가 true일 때 store의 isValid는 true이다.", () => {
    expect(store.getValidState()).toBeFalsy();

    store.store.test1.isValid = true;
    store.store.test2.isValid = true;

    store.validateAllInputValid();

    expect(store.getValidState()).toBeTruthy();
  });

  test("모든 input의 isValid가 true가 아닐 때 store의 isValid는 false이다.", () => {
    expect(store.getValidState()).toBeFalsy();

    store.store.test1.isValid = true;
    store.store.test2.isValid = false;

    store.validateAllInputValid();

    expect(store.getValidState()).toBeFalsy();
  });

  test("모든 input의 isDirty가 false일 때 store의 isDirty는 false이다.", () => {
    expect(store.getDirtyState()).toBeFalsy();

    store.store.test1.isDirty = false;
    store.store.test2.isDirty = false;

    store.validateAllInputDirty();

    expect(store.getDirtyState()).toBeFalsy();
  });

  test("input들 중 하나 이상의 isDirty가 true일 때 store의 isDirty는 true이다.", () => {
    expect(store.getDirtyState()).toBeFalsy();

    store.store.test1.isDirty = true;

    store.validateAllInputDirty();

    expect(store.getDirtyState()).toBeTruthy();
  });

  test("input들 중 하나 이상의 input의 defaultValue와 value가 다를 때 store의 isTouched는 true이다.", () => {
    expect(store.getTouchedState()).toBeFalsy();

    store.store.test1.setInputValue("change defaultValue");

    store.setTouchedState();

    expect(store.getTouchedState()).toBeTruthy();
  });

  test("모든 input의 defaultValue와 value가 같을 때 store의 isTouched는 false이다.", () => {
    expect(store.getTouchedState()).toBeFalsy();

    store.setTouchedState();

    expect(store.getTouchedState()).toBeFalsy();
  });
});

export {};
