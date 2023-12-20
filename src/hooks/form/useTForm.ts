import { RefCallback, useRef, useState } from "react";
import { TFormParamsType } from "../../types/common";
import { extractObjectWithEntries } from "../../utils/common/extractedObject";
import { ErrorType, Input } from "../../utils/input/input";
import { Store } from "../../utils/store/store";

export type ParamsValueType = {
  defaultValue?: string | string[];
  placeholder?: string;
  type?: "file" | "text" | "checkbox";
  onChangeMode?: boolean;
  onBlurMode?: boolean;
};

type ValidateOptionsType = {
  rules?: RegExp[];
  required?: boolean;
  maxLength?: number;
};

type RegisterOptionType = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  rules?: ValidateOptionsType["rules"];
  required?: ValidateOptionsType["required"];
  maxLength?: ValidateOptionsType["maxLength"];
};

type StoreType<Form extends TFormParamsType = TFormParamsType> = Record<
  keyof Form,
  Input
>;

const useTForm = <Form extends TFormParamsType>(params: Form) => {
  type FieldKey = keyof Form;

  const store = useRef(new Store<Form>(params)).current;
  const realStore = store.store as StoreType<Form>;

  const [errors, setErrors] = useState<Record<FieldKey, ErrorType>>(
    Object.fromEntries(
      (Object.entries(store.store) as unknown as [FieldKey, Input][]).map(
        (store) => [store[0], store[1].getError()]
      )
    ) as unknown as Record<FieldKey, ErrorType>
  );

  const validate = (options: ValidateOptionsType, target: string) => {
    if (options.rules && !options.rules.every((rule) => rule.test(target))) {
      return false;
    }

    if (options.required && target.length === 0) {
      return false;
    }

    if (options.maxLength && target.length > options.maxLength) {
      return false;
    }

    return true;
  };

  const shoudUpdateState = (
    errorstate: boolean,
    inputName: FieldKey,
    mode: "blur" | "change"
  ) => {
    const modeToUpdate =
      mode === "blur" ? params.onBlurMode : params.onChangeMode;
    return modeToUpdate && realStore[inputName].getError().state === errorstate;
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: FieldKey,
    options: ValidateOptionsType
  ) => {
    Input.setValue(realStore[name], e.target.value);
    store.validateAllInputDirty();
    store.validateAllInputValid();
    store.setTouchedState();

    if (validate(options, e.target.value)) {
      shoudUpdateState(true, name, "change") &&
        setErrors((prev) => ({
          ...prev,
          [name]: { ...prev[name], state: false },
        }));

      realStore[name].setInputError(false);
    } else {
      shoudUpdateState(false, name, "change") &&
        setErrors((prev) => ({
          ...prev,
          [name]: { ...prev[name], state: true },
        }));

      realStore[name].setInputError(true);
    }
  };

  const getValue = (name: FieldKey) => {
    return realStore[name].getValue();
  };

  const onBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    name: FieldKey,
    options: ValidateOptionsType
  ) => {
    Input.setValue(realStore[name], e.target.value);
    store.validateAllInputDirty();
    store.validateAllInputValid();
    store.setTouchedState();

    if (validate(options, e.target.value)) {
      shoudUpdateState(true, name, "blur") &&
        setErrors((prev) => ({
          ...prev,
          [name]: { ...prev[name], state: false },
        }));

      realStore[name].setInputError(false);
    } else {
      shoudUpdateState(false, name, "blur") &&
        setErrors((prev) => ({
          ...prev,
          [name]: { ...prev[name], state: true },
        }));

      realStore[name].setInputError(true);
    }
  };

  const register = (name: FieldKey, options?: RegisterOptionType) => {
    const combinedOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e, name, {
        rules: options?.rules,
        required: options?.required,
        maxLength: options?.maxLength,
      });
      options?.onChange?.(e);
    };

    const combinedOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur(e, name, {
        rules: options?.rules,
        required: options?.required,
        maxLength: options?.maxLength,
      });
      options?.onBlur?.(e);
    };

    const ref: RefCallback<HTMLInputElement> = (instance) => {
      if (!instance) return;
    };

    return {
      onBlur: combinedOnBlur,
      onChange: combinedOnChange,
      ref: ref,
      name: name,
      placeholder: realStore[name].getPlaceholder(),
    };
  };

  const setError = (name: FieldKey, errorMessage: string[]) => {
    realStore[name].setInputError(
      realStore[name].getError().state,
      errorMessage
    );
  };

  const error = (name: FieldKey) => {
    return realStore[name].getError();
  };

  type ValidDataType = {
    [k: string]: Record<keyof Form, Input>[keyof Form][keyof Record<
      keyof Form,
      Input
    >[keyof Form]];
  };
  type InValidDataType = {
    [k: string]: Record<keyof Form, Input>[keyof Form][keyof Record<
      keyof Form,
      Input
    >[keyof Form]];
  };

  const handleSubmit =
    (
      onValid: (data: ValidDataType) => void,
      onInValid?: (data: InValidDataType) => void
    ) =>
    (e: React.FormEvent<HTMLFormElement>) => {
      const isFormValid = store.getValidState();

      const validData = extractObjectWithEntries(realStore, "value");
      const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        isFormValid ? onValid(validData) : onInValid?.(validData);
      };

      submit(e);
    };

  const formState = {
    isValid: store.getValidState(),
    isDirty: store.getDirtyState(),
    isTouched: store.getTouchedState(),
  };

  return {
    getValue,
    register,
    setError,
    error,
    errors,
    handleSubmit,
    formState,
  };
};

export { useTForm };
