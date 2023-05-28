import { yupResolver } from "@hookform/resolvers/yup";
import {
  AddCircle,
  CheckCircle,
  CircleOutlined,
  Close,
  CloudUpload,
} from "@mui/icons-material";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { fieldsSchema } from "../../../../../common/form-schema";
import RESP from "../../../../../common/respCode";
import {
  addQuizToLesson,
  createQuiz,
} from "../../../../../utils/exerciseHelper";
import { reactQueryKey } from "../../../../../utils/fetch";
import BasicButton from "./../../../../../components/button/BasicButton";

const MAX_ANS = 4;
const MIN_ANS = 2;

const MultiChoice = ({ lessonId, closeModal, topicId }) => {
  // Form
  const {
    register,
    handleSubmit,
    // eslint-disable-next-line no-unused-vars
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(fieldsSchema),
    defaultValues: {
      title: "Câu hỏi",
      answers: [{ ans: "Trả lời 1" }, { ans: "Trả lời 1" }],
      correctIndex: 0,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });
  const [markIndex, setMarkIndex] = React.useState(0);
  const isMaxAns = fields.length === MAX_ANS;
  const isMinAns = fields.length === MIN_ANS;

  // Form handle func
  function handleAddAns() {
    if (fields.length < MAX_ANS) {
      append({ ans: "Câu trả lời" });
    }
  }

  function handleRemoveAns(index) {
    if (fields.length > MIN_ANS) {
      remove(index);

      // Reset mark index
      setMarkIndex(0);
      setValue("correctIndex", 0);
    }
  }

  function handleMarkAns(index) {
    setValue("correctIndex", index);
    // console.log(getValues(`answers`));
    setMarkIndex(index);
  }

  const queryClient = useQueryClient();

  const mutationCreate = useMutation(
    ({ question, trueAnsIndex, answers }) =>
      createQuiz(question, trueAnsIndex, answers),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(
          "🚀 ~ file: MultiChoice.jsx:87 ~ MultiChoice ~ data:",
          data
        );

        // handle next step
        if (data.status === RESP.SUCCESS) {
          console.log("Create exercise success");
          const reqAdd = {
            lessonId: lessonId,
            exerciseId: data.data._id,
          };
          mutationAdd.mutate(reqAdd);
        } else {
          alert(data.message);
        }
      },
    }
  );

  const mutationAdd = useMutation(
    ({ lessonId, exerciseId }) => addQuizToLesson(lessonId, exerciseId),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(
          "🚀 ~ file: MultiChoice.jsx:112 ~ MultiChoice ~ data:",
          data
        );
        // Invalidate to refetch
        queryClient.invalidateQueries(reactQueryKey.LESSON_EXERCISES(lessonId));
        queryClient.invalidateQueries(reactQueryKey.TOPIC_LESSON(topicId));

        // Alert msg
        if (data.status === RESP.SUCCESS) {
          console.log("Add exercise success");
          closeModal();
        } else {
          alert(data.message);
        }
      },
    }
  );

  async function onSubmit(data) {
    console.log("🚀 ~ file: MultiChoice.jsx:68 ~ onSubmit ~ data:", data);
    const reqData = {
      question: data.title,
      trueAnsIndex: data.correctIndex,
      answers: Array.from(data.answers, (item) => item.ans),
    };
    mutationCreate.mutate(reqData);
  }

  const confirming =
    mutationCreate.isLoading ||
    mutationAdd.isLoading ||
    Boolean(queryClient.isFetching());

  return (
    <div className="flex flex-col gap-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            {...register(`title`)}
            className="w-full text-4xl font-medium text-slate-400 border-b border-slate-400 outline-none p-2 
          focus:border-black focus:text-black transition-all"
          />
          <p className="text-red-500 font-medium">
            {errors.title ? errors.title.message : null}
          </p>
        </div>
        {fields.map((item, index) => {
          return (
            <div key={item.id} className="mb-4">
              <div className="flex gap-x-2 items-center relative">
                <button
                  type="button"
                  onClick={() => handleMarkAns(index)}
                  className="absolute left-2"
                >
                  {markIndex === index ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <CircleOutlined />
                  )}
                </button>
                <input
                  {...register(`answers[${index}].ans`)}
                  autoComplete="off"
                  className="w-full px-10 py-2 outline-none border rounded-md border-slate-400
                focus:border-black focus:font-medium transition-all"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveAns(index)}
                  className={`absolute right-2 ${isMinAns ? "hidden" : ""}`}
                >
                  <Close />
                </button>
              </div>
              <p className="text-red-500 font-medium">
                {errors.answers ? errors.answers[index]?.ans.message : null}
              </p>
            </div>
          );
        })}
        <button
          type="button"
          onClick={handleAddAns}
          className={`mb-4 p-2 border border-slate-400 rounded-md w-full flex items-center 
          justify-center gap-x-1 text-slate-400 ${isMaxAns ? "!hidden" : ""}`}
        >
          <AddCircle />
          <span>Thêm câu trả lời</span>
        </button>
        <input {...register(`correctIndex`)} hidden defaultValue={0} />
        <BasicButton
          icon={<CloudUpload />}
          type="submit"
          loading={confirming}
          className="w-full"
        >
          Tạo bài tập
        </BasicButton>
      </form>
    </div>
  );
};

export default MultiChoice;
