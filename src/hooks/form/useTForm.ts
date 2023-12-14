import { RefCallback, useRef, useState } from "react";
import { TFormParamsType } from "../../types/common";
import { Input } from "../../utils/input";
import { Store } from "../../utils/store";

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

const useTForm = (params: TFormParamsType) => {
  const store = useRef(new Store(params)).current;
  const [errors, setErrors] = useState(
    Object.fromEntries(
      Object.entries(store.store).map((store) => [
        store[0],
        store[1].getError(),
      ])
    )
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
    inputName: string,
    mode: "blur" | "change"
  ) => {
    const modeToUpdate =
      mode === "blur" ? params.onBlurMode : params.onChangeMode;
    return (
      modeToUpdate && store.store[inputName].getError().state === errorstate
    );
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
    options: ValidateOptionsType
  ) => {
    Input.setValue(store.store[name], e.target.value);

    if (validate(options, e.target.value)) {
      shoudUpdateState(true, name, "change") &&
        setErrors((prev) => ({
          ...prev,
          [name]: { ...prev[name], state: false },
        }));

      store.store[name].setInputError(false);
    } else {
      shoudUpdateState(false, name, "change") &&
        setErrors((prev) => ({
          ...prev,
          [name]: { ...prev[name], state: true },
        }));

      store.store[name].setInputError(true);
    }
  };

  const getValue = (name: string) => {
    return store.store[name].getValue();
  };

  const onBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    name: string,
    options: ValidateOptionsType
  ) => {
    Input.setValue(store.store[name], e.target.value);

    if (validate(options, e.target.value)) {
      shoudUpdateState(true, name, "blur") &&
        setErrors((prev) => ({
          ...prev,
          [name]: { ...prev[name], state: false },
        }));

      store.store[name].setInputError(false);
    } else {
      shoudUpdateState(false, name, "blur") &&
        setErrors((prev) => ({
          ...prev,
          [name]: { ...prev[name], state: true },
        }));

      store.store[name].setInputError(true);
    }
  };

  const register = (name: string, options?: RegisterOptionType) => {
    const combinedOnChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      onChange: combinedOnChnage,
      ref: ref,
      name: name,
      placeholder: store.store[name].getPlaceholder(),
    };
  };

  const setError = (name: string, errorMessage: string[]) => {
    store.store[name].setInputError(
      store.store[name].getError().state,
      errorMessage
    );
  };

  const error = (name: string) => {
    return store.store[name].getError();
  };

  return {
    getValue,
    register,
    setError,
    error,
    errors,
  };
};

export { useTForm };
