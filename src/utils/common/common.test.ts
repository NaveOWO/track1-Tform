import { extractObjectWithEntries } from "./extractedObject";
import {
  getInvariantObjectEntries,
  getInvariantObjectKeys,
  getInvariantObjectValues,
  InvariantOf,
  invariantOf,
} from "./invariantType";

describe("invariantType 테스트", () => {
  test("(인자의 타입이 number일 때) invariantOf 함수는 인자로 들어오는 값과 같으면서 InvariantOfType 에 해당하는 값을 반환한다.", () => {
    const value: number = 7;
    const result = invariantOf(value);
    const typeMatchedResult: InvariantOf<number> = result;

    expect(invariantOf(value)).toBe(typeMatchedResult);
  });

  test("(인자의 타입이 string일 때) invariantOf 함수는 인자로 들어오는 값과 같으면서 InvariantOfType 에 해당하는 값을 반환한다.", () => {
    const value: string = "nave";
    const result = invariantOf(value);
    const typeMatchedResult: InvariantOf<string> = result;

    expect(invariantOf(value)).toBe(typeMatchedResult);
  });

  test("(인자의 타입이 object일 때) invariantOf 함수는 인자로 들어오는 값과 같으면서 InvariantOfType 에 해당하는 값을 반환한다.", () => {
    type InfoType = { name: string; age: number };
    const value: InfoType = { name: "nave", age: 26 };
    const result = invariantOf(value);
    const typeMatchedResult: InvariantOf<InfoType> = result;

    expect(invariantOf(value)).toBe(typeMatchedResult);
  });
});

type ObjType = {
  name: string;
  age: number;
  adress: string;
};

const obj: ObjType = {
  name: "nave",
  age: 26,
  adress: "seoul",
};

const invariantOfObject = invariantOf(obj);
test("getInvariantObjectKeys 함수는 인자로 들어온 객체의 타입이 추론되는 key값의 배열을 반환한다.", () => {
  const result = getInvariantObjectKeys(invariantOfObject);
  const typeMatchedResult: (keyof ObjType)[] = result;

  expect(typeMatchedResult).toEqual(["name", "age", "adress"]);
});

test("getInvariantObjectValues 함수는 인자로 들어온 객체의 타입이 추론되는 value값의 배열을 반환한다.", () => {
  const result = getInvariantObjectValues(invariantOfObject);
  const typeMatchedResult: ObjType[keyof ObjType][] = result;

  expect(typeMatchedResult).toEqual(["nave", 26, "seoul"]);
});

test("getInvariantObjectEntries 함수는 인자로 들어온 객체의 타입이 추론되는 [key,value] 배열을 반환한다.", () => {
  const result = getInvariantObjectEntries(invariantOfObject);
  const typeMatchedResult: [keyof ObjType, ObjType[keyof ObjType]][] = result;

  expect(typeMatchedResult).toEqual([
    ["name", "nave"],
    ["age", 26],
    ["adress", "seoul"],
  ]);
});

describe("extractedObject 테스트", () => {
  test("첫번째 인자에 해당하는 이중객체에서 두번째 인자에 해당하는 property 속성만 갖고있는 새로운 객체를 생성한다.", () => {
    const obj = {
      test1: {
        value: "test1",
        error: false,
      },
      test2: {
        value: "test2",
        error: true,
      },
      test3: {
        value: "test3",
        error: false,
      },
    };
    const targetProperty = "value";
    const result = {
      test1: "test1",
      test2: "test2",
      test3: "test3",
    };

    expect(extractObjectWithEntries(obj, targetProperty)).toEqual(result);
  });
});

export {};
