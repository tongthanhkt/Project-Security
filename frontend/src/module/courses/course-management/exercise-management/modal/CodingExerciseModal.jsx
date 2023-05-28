import { yupResolver } from "@hookform/resolvers/yup";
import {
  ArrowBackIos,
  ArrowForwardIos,
  CloudUpload,
} from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import { createCodingSchema } from "../../../../../common/form-schema";
import BasicButton from "../../../../../components/button/BasicButton";
import QuestionEdit from "./form/QuestionEdit";
import AdvanceOption from "./form/AdvanceOption";
import { useMutation, useQueryClient } from "react-query";
import { createTestCases } from "../../../../../utils/testCaseHelper";
import RESP from "../../../../../common/respCode";
import {
  addQuizToLesson,
  createCoding,
} from "../../../../../utils/exerciseHelper";
import { reactQueryKey } from "../../../../../utils/fetch";
import ExampleSect from "./form/ExampleSect";
import TestCaseSect from "./form/TestCaseSect";
import {
  EXERCISE_CONTRAINTS,
  OUTPUT_TYPE,
} from "../../../../../common/constants";
import { toast } from "react-toastify";
import TemplateSect from "./form/TemplateSect";
import { createTemplate } from "../../../../../utils/templateHelper";

const defFieldArrVal = {
  // Output
  outType: OUTPUT_TYPE.CONSOLE,
  outputFileName: "",
  out: "",
  outAttach: "",

  // Input
  useStdin: true,
  stdin: "",
  useCmd: false,
  cmd_line_arg: "",

  useInputFile: false,
  inputFile: "",
  inputFileName: "",
  inAttach: "",
};

const CodingExerciseModal = ({ lessonId, closeModal, topicId }) => {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    resetField,
    formState: { errors },
    reset,
    trigger,
    getFieldState,
  } = useForm({
    resolver: yupResolver(createCodingSchema),
    defaultValues: {
      question: "",
      testCaseArr: [defFieldArrVal],
      exampleArr: [defFieldArrVal],

      // Advance
      wall_time_limit: EXERCISE_CONTRAINTS.wall_time_limit,
      memory_limit: EXERCISE_CONTRAINTS.memory_limit,
      max_file_size: EXERCISE_CONTRAINTS.max_file_size,
      enable_network: EXERCISE_CONTRAINTS.enable_network,

      testCaseHaveExample: true,
      include_template: false,

      template_val: "",
    },
    mode: "onChange",
  });

  // Multi step form
  const [isStepValid, setIsStepValid] = React.useState(false);

  const multiStepForm = [
    <QuestionEdit
      control={control}
      errors={errors}
      setValue={setValue}
      getValues={getValues}
      setIsStepValid={setIsStepValid}
      getFieldState={getFieldState}
      trigger={trigger}
    />,
    <ExampleSect
      control={control}
      errors={errors}
      getValues={getValues}
      resetField={resetField}
      trigger={trigger}
      defFieldArrVal={defFieldArrVal}
      setIsStepValid={setIsStepValid}
      getFieldState={getFieldState}
      setValue={setValue}
    />,
    <TestCaseSect
      control={control}
      errors={errors}
      getValues={getValues}
      resetField={resetField}
      trigger={trigger}
      defFieldArrVal={defFieldArrVal}
      setIsStepValid={setIsStepValid}
      getFieldState={getFieldState}
      setValue={setValue}
    />,
    <AdvanceOption
      control={control}
      errors={errors}
      setIsStepValid={setIsStepValid}
      getFieldState={getFieldState}
      getValues={getValues}
      resetField={resetField}
    />,
    <TemplateSect
      control={control}
      errors={errors}
      getValues={getValues}
      setValue={setValue}
    />,
  ];

  const [curStep, setCurStep] = React.useState(0);
  var finalStep;
  if (getValues("include_template")) {
    finalStep = curStep === multiStepForm.length - 1;
  } else {
    finalStep = curStep === multiStepForm.length - 2;
  }
  const firstStep = curStep === 0;

  // Form handle func
  function convertTestCase(testCaseArr) {
    const convTestCase = testCaseArr.map((item) => {
      const newItem = {
        out: item.out,
        outputFileName: item.outputFileName || null,
        inputFile: item.inputFile || null,
        inputFileName: item.inputFileName || null,
        stdin: item.stdin || null,
        cmd_line_arg: item.cmd_line_arg || null,
      };
      return { ...newItem };
    });

    return convTestCase;
  }

  async function onSubmit(data) {
    console.log("🚀 ~ file: CodingExercise.jsx:23 ~ onSubmit ~ data:", data);

    var convertedExampleArr = convertTestCase(data.exampleArr);
    console.log(
      "🚀 ~ file: CodingExerciseModal.jsx:164 ~ onSubmit ~ convertedExampleArr:",
      convertedExampleArr
    );
    var convertedTestCaseArr = convertTestCase(data.testCaseArr);

    const reqData = {
      question: data.question,
      wall_time_limit: data.wall_time_limit,
      memory_limit: data.memory_limit,
      max_file_size: data.max_file_size,
      enable_network: Number(data.enable_network),

      // Template
      template_val: data.include_template ? data.template_val : null,
      lang_id: data.include_template ? data.lang_id : null,
    };

    try {
      const [respCreateExample, respCreateTestCase] = await Promise.all([
        // Create examples
        mutationCreateTestCases.mutateAsync({
          testCasesArr: convertedExampleArr,
        }),
        // Create test cases
        mutationCreateTestCases.mutateAsync({
          testCasesArr: convertedTestCaseArr,
        }),
      ]);

      if (
        respCreateExample.status === RESP.SUCCESS &&
        respCreateTestCase.status === RESP.SUCCESS
      ) {
        // Create success
        console.log("Create test cases success");
        const examplesArr = respCreateExample.data.map((item) => item._id);
        var testCasesArr = respCreateTestCase.data.map((item) => item._id);

        // Merge example to testcase if needed
        if (data.testCaseHaveExample) {
          testCasesArr = [...examplesArr, ...testCasesArr];
        }
        const reqCreateCoding = { ...reqData, testCasesArr, examplesArr };

        mutationCreateCoding.mutate({ ...reqCreateCoding });
      } else {
        toast.error(
          `Tạo test case example thất bại: ${
            respCreateExample.status || respCreateExample.code
          }: ${respCreateExample.msg}`
        );
        toast.error(
          `Tạo test case submit thất bại: ${
            respCreateExample.status || respCreateExample.code
          }: ${respCreateTestCase.msg}`
        );
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: CodingExerciseModal.jsx:154 ~ onSubmit ~ error:",
        error
      );
      toast.error(error);
    }
  }

  // Create test case + add to lesson
  const queryClient = useQueryClient();
  const mutationCreateTestCases = useMutation(({ testCasesArr }) =>
    createTestCases(testCasesArr)
  );

  const mutationCreateCoding = useMutation(
    ({
      question,
      examplesArr,
      testCasesArr,
      wall_time_limit,
      memory_limit,
      max_file_size,
      enable_network,
      template_val,
      lang_id,
    }) =>
      createCoding(
        question,
        examplesArr,
        testCasesArr,
        wall_time_limit,
        memory_limit,
        max_file_size,
        enable_network
      ),
    {
      onError: (error) => {
        toast.error(error);
        console.log(error);
      },
      onSuccess: async (data, variables) => {
        console.log(
          "🚀 ~ file: CodingExercise.jsx:120 ~ CodingExercise ~ data:",
          data
        );
        if (data.status === RESP.SUCCESS) {
          console.log("Create coding success");
          const exerciseId = data.data._id;

          // Add exercise
          try {
            const respAddExercise = await mutationAddExercise.mutateAsync({
              lessonId,
              exerciseId,
            });

            if (variables.lang_id && variables.template_val) {
              const respCreateTemplate =
                await mutationCreateTemplate.mutateAsync({
                  lessonId,
                  exerciseId,
                  langId: variables.lang_id,
                  template: variables.template_val,
                });

              if (respCreateTemplate.status === RESP.SUCCESS) {
                console.log("Tạo template thành công");
              } else {
                toast.error(`Tạo template thất bại: ${respCreateTemplate.msg}`);
              }
            }

            if (respAddExercise.status === RESP.SUCCESS) {
              toast.success("Tạo bài tập thành công");
              // Invalidate to refetch
              queryClient.invalidateQueries(
                reactQueryKey.LESSON_EXERCISES(lessonId)
              );
              queryClient.invalidateQueries(
                reactQueryKey.TOPIC_LESSON(topicId)
              );
              closeModal();
              setCurStep(0);
              reset();
            } else {
              toast.error(`Thêm exercise thất bại: ${respAddExercise.msg}`);
            }
          } catch (error) {
            console.log(error);
            toast.error(error);
          }
        } else {
          console.log(data.message);
          toast.error(data.message);
        }
      },
    }
  );

  const mutationAddExercise = useMutation(({ lessonId, exerciseId }) =>
    addQuizToLesson(lessonId, exerciseId)
  );

  const mutationCreateTemplate = useMutation(
    ({ lessonId, exerciseId, langId, template }) =>
      createTemplate(lessonId, exerciseId, langId, template)
  );

  // Form state
  const creating =
    mutationCreateTestCases.isLoading ||
    mutationCreateCoding.isLoading ||
    mutationAddExercise.isLoading ||
    mutationCreateTemplate.isLoading ||
    Boolean(queryClient.isFetching());

  React.useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const subscription = watch();
    // return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-8">
      {/* Display part of form */}
      {multiStepForm[curStep]}

      <div className="flex gap-x-2">
        {/* Prv step button */}
        <BasicButton
          className={`!text-white !font-semibold !mr-auto ${
            firstStep ? "!hidden" : ""
          } ${!isStepValid ? "bg-none" : ""}`}
          onClick={() => setCurStep((prv) => prv - 1)}
          type="button"
          disabled={!isStepValid}
          startIcon={<ArrowBackIos />}
        >
          Previous step
        </BasicButton>

        {/* Next step button */}
        {finalStep ? (
          <BasicButton
            type="submit"
            className="self-center !font-semibold bg-none !bg-green-500 !ml-auto"
            icon={<CloudUpload />}
            loading={creating}
          >
            Create exercise
          </BasicButton>
        ) : null}

        {!finalStep ? (
          <BasicButton
            className={`!text-white !font-semibold !ml-auto ${
              finalStep ? "!hidden" : ""
            } ${!isStepValid ? "bg-none" : ""}`}
            onClick={() => setCurStep((prv) => prv + 1)}
            type="button"
            disabled={!isStepValid}
            endIcon={<ArrowForwardIos />}
          >
            Next step
          </BasicButton>
        ) : null}
      </div>
      <div className="hidden">{JSON.stringify(watch(), null, 2)}</div>
      {/* <br /> */}
      {/* {JSON.stringify(errors, null, 2)} */}
    </form>
  );
};

export default CodingExerciseModal;
