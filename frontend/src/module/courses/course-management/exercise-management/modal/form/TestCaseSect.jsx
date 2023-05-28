import React from "react";
import SectionDivider from "./SectionDivider";
import TestCaseForm from "./TestCaseForm";

const TestCaseSect = ({
  control,
  errors,
  getValues,
  resetField,
  trigger,
  defFieldArrVal,
  setIsStepValid,
  getFieldState,
  setValue,
}) => {
  const curFormState = getFieldState("testCaseArr");
  React.useEffect(() => {
    if (!curFormState.invalid) {
      setIsStepValid(true);
    } else {
      setIsStepValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curFormState]);

  return (
    <div>
      <SectionDivider sectName="Test cases" />
      <TestCaseForm
        control={control}
        errors={errors}
        getValues={getValues}
        resetField={resetField}
        trigger={trigger}
        defFieldArrVal={defFieldArrVal}
        fieldArrName="testCaseArr"
        setValue={setValue}
      />
    </div>
  );
};

export default TestCaseSect;
