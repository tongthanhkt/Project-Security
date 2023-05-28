export const SUBMIT_STATUS = {
  ERROR: "error",
  SUCCESS: "success",
  LOADING: "loading",
};

export const RESOURCE_TYPE = {
  VIDEO: 1,
  DOCUMENT: 2,
  AUDIO: 3,
  THUMB_COURSE: 4,
};

// Upload status
export const UPLOAD_STATUS = {
  FAILED: "upload_failed",
  SUCCESS: "upload_success",
};

// Exercise
export const EXERCISE_TYPE = {
  MULTI_CHOICE: 1,
  CODING: 2,
};

// Compiler
export const LANG_ID = {
  ASSEMBLY: 45,
  BASH: 46,
  C: 50,
  C_PLUS_PLUS: 54,
  C_SHARP: 51,
  ELIXIR: 57,
  GO: 60,
  JAVA: 62,
  NODEJS: 63,
  KOTLIN: 78,
  OBJECTIVE_C: 79,
  PASCAL: 67,
  PERL: 85,
  PHP: 68,
  PYTHON: 71,
  R: 80,
  RUBY: 72,
  RUST: 73,
  SCALA: 81,
  SWIFT: 83,
  TYPESCRIPT: 74,
  MULTI_FILE: 89,
};

export const LANG_ID_TO_TEXT = {
  45: "ASSEMBLY",
  46: "BASH",
  50: "C",
  54: "C++",
  51: "C#",
  57: "ELIXIR",
  60: "GO",
  62: "JAVA",
  63: "JAVASCRIPTS",
  78: "KOTLIN",
  79: "OBJECTIVE-C",
  67: "PASCAL",
  85: "PERL",
  68: "PHP",
  71: "PYTHON",
  80: "R",
  72: "RUBY",
  73: "RUST",
  81: "SCALA",
  83: "SWIFT",
  74: "TYPESCRIPT",
  89: "MULTI_FILE",
};

export const LANG_LIST = [
  {
    name: "C",
    value: LANG_ID.C,
  },
  {
    name: "C++",
    value: LANG_ID.C_PLUS_PLUS,
  },
  {
    name: "C#",
    value: LANG_ID.C_SHARP,
  },
  {
    name: "Go",
    value: LANG_ID.GO,
  },
  {
    name: "Java",
    value: LANG_ID.JAVA,
  },
  {
    name: "Javascripts",
    value: LANG_ID.NODEJS,
  },
  {
    name: "Python",
    value: LANG_ID.PYTHON,
  },
  {
    name: "Kotlin",
    value: LANG_ID.KOTLIN,
  },
  {
    name: "Object-C",
    value: LANG_ID.OBJECTIVE_C,
  },
  {
    name: "Pascal",
    value: LANG_ID.PASCAL,
  },
  {
    name: "Perl",
    value: LANG_ID.PERL,
  },
  {
    name: "PhP",
    value: LANG_ID.PHP,
  },
  {
    name: "R",
    value: LANG_ID.R,
  },
  {
    name: "Ruby",
    value: LANG_ID.RUBY,
  },
  {
    name: "Rust",
    value: LANG_ID.RUST,
  },
  {
    name: "Swift",
    value: LANG_ID.SWIFT,
  },
  {
    name: "Typescript",
    value: LANG_ID.TYPESCRIPT,
  },
];

export const JUDGE_STATUS = {
  CUSTOM_ERR_NOT_DONE: -1,
  IN_QUEUE: 1,
  PROCESSING: 2,
  ACCEPTED: 3,
  WRONG_ANS: 4,
  TIME_LIMIT_EXCEEDED: 5,
  COMPILATION_ERR: 6,
  RUNTIME_ERR_7: 7,
  RUNTIME_ERR_8: 8,
  RUNTIME_ERR_9: 9,
  RUNTIME_ERR_10: 10,
  RUNTIME_ERR_11: 11,
  RUNTIME_ERR_12: 12,
  INTERNAL_ERR: 13,
  EXEC_FORMAT_ERR: 14,
};

export const EXERCISE_CONTRAINTS = {
  wall_time_limit: 1, // in seconds
  memory_limit: 30 * 1024, // in kilobytes
  max_file_size: 1, // in kilobytes
  enable_network: false,
};

export const EXERCISE_MAX_CONSTRAINT = {
  wall_time_limit: 30, // in seconds
  memory_limit: 100 * 1024, // in kilobytes
  max_file_size: 5 * 1024, // in kilobytes
};

export const OUTPUT_TYPE = {
  CONSOLE: "console",
  FILE: "out_file",
};

//type of drawer
export const TYPE_OF_DRAWER = {
  LESSON_LIST: 1,
  NOTE_LIST: 2,
};
