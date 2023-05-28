import * as yup from "yup";
import {
  EXERCISE_CONTRAINTS,
  EXERCISE_MAX_CONSTRAINT,
  OUTPUT_TYPE,
} from "./constants";

const loginSchema = yup.object({
  email: yup.string().email("Email not valid").required("Required"),
  password: yup.string().required("Required"),
});

const registerSchema = yup.object({
  name: yup.string().required("Required"),
  email: yup.string().email("Email not valid").required("Required"),
  password: yup
    .string()
    .required("Required")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .when("password-lowercase", (password, field) => {
      if (!/[a-z]+/.test(password)) {
        return field.matches(
          /[a-z]+/,
          "Password too weak - should include atlest 1 lowercase"
        );
      }
    })
    .when("password-number", (password, field) => {
      if (!/[0-9]+/.test(password)) {
        return field.matches(
          /[0-9]+/,
          "Password too weak - should include atlest 1 number"
        );
      }
    })
    .when("password-uppercase", (password, field) => {
      if (!/[A-Z]+/.test(password)) {
        return field.matches(
          /[A-Z]+/,
          "Password too weak - should include atlest 1 uppercase"
        );
      }
    })
    .when("password-special", (password, field) => {
      if (!/[@$!%*#?&]+/.test(password)) {
        return field.matches(
          /[@$!%*#?&]+/,
          "Password too weak - should include atlest 1 special character"
        );
      }
    }),
  addr: yup.string().required("Required"),
  Cpwd: yup
    .string()
    .required("Required")
    .oneOf([yup.ref("password"), null], "Passwords not match"),
});

const createCourseSchema = yup.object({
  name: yup.string().required("Vui lòng nhập tên khoá học"),
  description: yup.string().required("Vui lòng nhập mô tả khoá học"),
  requirement: yup.string().required("Vui lòng nhập yêu cầu khoá học"),
});

// Exercise
const fieldsSchema = yup.object({
  title: yup.string().required("Vui lòng nhập câu hỏi"),
  answers: yup.array().of(
    yup.object().shape({
      ans: yup.string().required("Vui lòng nhập lựa chọn"),
      // isCorrect: yup.boolean(),
    })
  ),
  correctIndex: yup.number().required("Vui lòng đánh dấu câu trả lời đúng"),
});

const exerciseSchema = {
  // Output file
  outputFileName: yup.string().when("outType", {
    is: OUTPUT_TYPE.FILE,
    then: yup.string().required("Required"),
  }),
  out: yup.string().required("Required"),
  outType: yup.string().required("Required").default(OUTPUT_TYPE.CONSOLE),
  outAttach: yup.mixed(),

  // stdin + cmd_arg
  useStdin: yup.boolean(),
  stdin: yup
    .string()
    .default("")
    .when("useStdin", {
      is: true,
      then: yup.string().required("Required"),
    }),
  useCmd: yup.boolean(),
  cmd_line_arg: yup
    .string()
    .default("")
    .when("useCmd", {
      is: true,
      then: yup.string().required("Required"),
    }),

  // Input file
  useInputFile: yup.boolean(),
  inputFile: yup
    .string()
    .default("")
    .when("useInputFile", {
      is: true,
      then: yup.string().required("Required"),
    }),
  inputFileName: yup
    .string()
    .default("")
    .when("useInputFile", {
      is: true,
      then: yup.string().required("Required"),
    }),
  inAttach: yup.mixed(),
};

const createCodingSchema = yup.object({
  question: yup.string().required("Required"),
  testCaseArr: yup.array().of(yup.object().shape(exerciseSchema)),
  exampleArr: yup.array().of(yup.object().shape(exerciseSchema)),
  testCaseHaveExample: yup.boolean().default(true),

  // Advance
  wall_time_limit: yup
    .number()
    .typeError("Required")
    .integer("Please use integer")
    .min(
      EXERCISE_CONTRAINTS.wall_time_limit,
      `Min time limit ${EXERCISE_CONTRAINTS.wall_time_limit} seconds`
    )
    .max(
      EXERCISE_MAX_CONSTRAINT.wall_time_limit,
      `Max time limit ${EXERCISE_MAX_CONSTRAINT.wall_time_limit} seconds`
    ),

  memory_limit: yup
    .number()
    .typeError("Required")
    .integer("Please use integer")
    .min(
      EXERCISE_CONTRAINTS.memory_limit,
      `Min ram limit ${EXERCISE_CONTRAINTS.memory_limit}KB`
    )
    .max(
      EXERCISE_MAX_CONSTRAINT.memory_limit,
      `Max ram limit ${EXERCISE_MAX_CONSTRAINT.memory_limit}KB`
    ),

  max_file_size: yup
    .number()
    .typeError("Required")
    .integer("Please use integer")
    .min(
      EXERCISE_CONTRAINTS.max_file_size,
      `Min file size ${EXERCISE_CONTRAINTS.max_file_size}KB`
    )
    .max(
      EXERCISE_MAX_CONSTRAINT.max_file_size,
      `Max file size ${EXERCISE_MAX_CONSTRAINT.max_file_size}KB`
    ),

  enable_network: yup.boolean(),
  include_template: yup.boolean(),

  template_val: yup.string().when("include_template", {
    is: true,
    then: yup.string().required("Required"),
  }),
  lang_id: yup.string().when("include_template", {
    is: true,
    then: yup.string().required("Required"),
  }),
});

export {
  loginSchema,
  registerSchema,
  createCourseSchema,
  fieldsSchema,
  createCodingSchema,
};
