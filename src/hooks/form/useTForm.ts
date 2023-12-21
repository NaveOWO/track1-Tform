import { RefCallback, useRef, useState } from "react";
import { TFormParamsType } from "../../types/common";
import { extractObjectWithEntries } from "../../utils/common/extractedObject";
import { ErrorType, Input } from "../../utils/input/input";
import { Store } from "../../utils/store/store";

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

const useTForm = <Form extends TFormParamsType>(params: Form) => {
  type FieldKey = keyof Form;

  const store = useRef(new Store<Form>(params)).current;

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
    return (
      modeToUpdate && store.store[inputName].getError().state === errorstate
    );
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: FieldKey,
    options: ValidateOptionsType
  ) => {
    Input.setValue(store.store[name], e.target.value);
    store.validateAllInputDirty();
    store.validateAllInputValid();
    store.setTouchedState();

    if (validate(options, e.target.value)) {
      shoudUpdateState(true, name, "change") &&
        setErrors((prev) => ({
          ...prev,
          [name]: { ...prev[name], state: false },
        }));

      store.store[name].setInputError({ state: false });
    } else {
      shoudUpdateState(false, name, "change") &&
        setErrors((prev) => ({
          ...prev,
          [name]: { ...prev[name], state: true },
        }));

      store.store[name].setInputError({ state: true });
    }
  };

  const getValue = (name: FieldKey) => {
    return store.store[name].getValue();
  };

  const onBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    name: FieldKey,
    options: ValidateOptionsType
  ) => {
    Input.setValue(store.store[name], e.target.value);
    store.validateAllInputDirty();
    store.validateAllInputValid();
    store.setTouchedState();

    if (validate(options, e.target.value)) {
      shoudUpdateState(true, name, "blur") &&
        setErrors((prev) => ({
          ...prev,
          [name]: { ...prev[name], state: false },
        }));

      store.store[name].setInputError({ state: false });
    } else {
      shoudUpdateState(false, name, "blur") &&
        setErrors((prev) => ({
          ...prev,
          [name]: { ...prev[name], state: true },
        }));

      store.store[name].setInputError({ state: true });
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
      placeholder: store.store[name].getPlaceholder(),
    };
  };

  const setError = (name: FieldKey, errorMessage: string[]) => {
    store.store[name].setInputError({
      state: store.store[name].getError().state,
      message: errorMessage,
    });
  };

  const error = (name: FieldKey) => {
    return store.store[name].getError();
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

      const validData = extractObjectWithEntries(store.store, "value");
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

export default { useTForm };
