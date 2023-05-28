import React from "react";
import { BasicEditor } from "../../../../../../components/input/BasicEditor";
import SectionDivider from "./SectionDivider";

const QuestionEdit = ({
  control,
  errors,
  setValue,
  getValues,
  setIsStepValid,
  getFieldState,
  trigger,
}) => {
  function handleConvertPlainText(html) {
    if (
      html.replace(/<(.|\n)*?>/g, "").trim().length === 0 &&
      !html.includes("<img")
    ) {
      // Empty editor
      return "";
    } else {
      // Not empty editor
      return html;
    }
  }

  const curFormState = getFieldState("question");
  React.useEffect(() => {
    if (!curFormState.invalid) {
      setIsStepValid(true);
    } else {
      setIsStepValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curFormState]);

  React.useEffect(() => {
    trigger("question");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="question-edit">
      <SectionDivider sectName="Task description" />
      {/* Hidden controlled field */}
      {/* <BasicTextBox
        control={control}
        name="question"
        errors={errors.question ? errors.question.message : null}
        // type="hidden"
        type="textArea"
        className="rounded-md outline-none focus:border-black focus:text-black"
      /> */}
      <BasicEditor
        name="question"
        value={getValues("question")}
        control={control}
        handleChange={(html) =>
          setValue("question", handleConvertPlainText(html), {
            shouldValidate: true,
          })
        }
        className="h-[200px] mb-[50px]"
      />
      <p className="text-red-600 mt-2">
        {errors.question ? errors.question.message : null}
      </p>
    </div>
  );
};

export default QuestionEdit;
