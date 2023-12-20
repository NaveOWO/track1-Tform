import { Input } from "./input";

describe("Input 테스트", () => {
  let input: Input;

  beforeEach(() => {
    input = new Input({
      defaultValue: "defaultValue",
      placeholder: "placeholder",
    });
  });
  test("setInputValue에 value가 인자로 들어왔을 때 input의 value값이 변경된다.", () => {
    expect(input.getValue()).toBe("defaultValue");

    input.setInputValue("change value");

    expect(input.getValue()).toBe("change value");
  });

  test("setInputError 인자의 state가 true일 때 input의 error의 state는 true이다.", () => {
    expect(input.getError().state).toBeFalsy();

    input.setInputError({ state: true });

    expect(input.getError().state).toBeTruthy();
  });

  test("setInputError 인자의 state가 true인 인자만 들어왔을 때 input의 error의 message는 변하지 않는다.", () => {
    expect(input.getError().message).toEqual([]);

    input.setInputError({ state: true });

    expect(input.getError().message).toEqual([]);
  });

  test("기존 input의 error.message가 빈배열일 경우, setInputError 인자의 message가 들어왔을 때 input의 error의 message가 인자 그대로 변경된다.", () => {
    expect(input.getError().message).toEqual([]);

    input.setInputError({ message: ["error message"] });

    expect(input.getError().message).toEqual(["error message"]);
  });

  test("기존 input의 error.message가 빈배열이 아닐 경우, setInputError 인자의 message가 들어왔을 때 input의 error의 message가 기존 배열에서 인자가 추가된다.", () => {
    expect(input.getError().message).toEqual([]);

    input.setInputError({ message: ["error message"] });

    expect(input.getError().message).toEqual(["error message"]);

    input.setInputError({ message: ["plus message"] });

    expect(input.getError().message).toEqual(["error message", "plus message"]);
  });

  test("setInputError 인자의 message만 들어왔을 때 input의 error의 state는 변하지 않는다.", () => {
    expect(input.getError().state).toBeFalsy();

    input.setInputError({ message: ["error message"] });

    expect(input.getError().state).toBeFalsy();
  });
});

export {};
