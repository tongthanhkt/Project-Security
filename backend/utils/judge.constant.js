export const VALIDATE_TYPE = {
  STDOUT: 1,
  FILE_OUTPUT: 2,
};

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

export const DEFAULT_CONSTRAINT = {
  wall_time_limit: 1, // in seconds
  memory_limit: 30 * 1024, // in kilobytes
  max_file_size: 1, // in kilobytes
  enable_network: false,
};

export const LIMIT_MAX_CONSTRAINT = {
  wall_time_limit: 30, // in seconds
  memory_limit: 100 * 1024, // in kilobytes
  max_file_size: 5 * 1024, // in kilobytes
};

export const NAME_OF_FILE_MAIN = {
  ASSEMBLY: "",
  BASH: "main.sh",
  C: "main.c",
  C_PLUS_PLUS: "main.cpp",
  C_SHARP: "main.cs",
  ELIXIR: "main.exs",
  GO: "main.go",
  JAVA: "Main.java",
  NODEJS: "main.js",
  KOTLIN: "main.kt",
  OBJECTIVE_C: "main.m",
  PASCAL: "main.pas",
  PERL: "main.pl",
  PHP: "main.php",
  PYTHON: "main.py",
  R: "main.r",
  RUBY: "main.rb",
  RUST: "main.rs",
  SCALA: "Main.scala",
  SWIFT: "Main.swift",
  TYPESCRIPT: "main.ts",
};

// ###########################################################

const ASSEMBLY_FILE_RUN = "";
const BASH_FILE_RUN = `#!/bin/bash
  chmod +x main.sh && ./main.sh`;
const C_FILE_RUN = `#!/bin/bash
  ./main`;
const C_PLUS_PLUS_FILE_RUN = `#!/bin/bash
  ./main`;
const C_SHARP_FILE_RUN = `#!/bin/bash
  ./main`;
const ELIXIR_FILE_RUN = `#!/bin/bash
  /usr/local/elixir-1.9.4/bin/elixir main.exs`;
const GO_FILE_RUN = `#!/bin/bash
  ./main`;
const JAVA_FILE_RUN = `#!/bin/bash
  /usr/local/openjdk13/bin/java Main`;
const NODEJS_FILE_RUN = `#!/bin/bash
  /usr/local/node-12.14.0/bin/node main.js`;
const KOTLIN_FILE_RUN = `#!/bin/bash
  /usr/local/openjdk13/bin/java -jar main.jar`;
const OBJECTIVE_C_FILE_RUN = `#!/bin/bash
  ./main`;
const PASCAL_FILE_RUN = `#!/bin/bash
  ./main`;
const PERL_FILE_RUN = `#!/bin/bash
  perl main.pl`;
const PHP_FILE_RUN = `#!/bin/bash
  /usr/local/php-7.4.1/bin/php main.php`;
const PYTHON_FILE_RUN = `#!/bin/bash
  python3 main.py`;
const R_FILE_RUN = `#!/bin/bash
  /usr/local/r-4.0.0/bin/Rscript main.r`;
const RUBY_FILE_RUN = `#!/bin/bash
  /usr/local/ruby-2.7.0/bin/ruby main.rb`;
const RUST_FILE_RUN = `#!/bin/bash
  ./main`;
const SCALA_FILE_RUN = `#!/bin/bash
  /usr/local/scala-2.13.2/bin/scala Main`;
const SWIFT_FILE_RUN = `#!/bin/bash
  ./Main`;
const TYPESCRIPT_FILE_RUN = `#!/bin/bash
  node main.js`;

// =====================================

const ASSEMBLY_FILE_COMPILE = null;
const BASH_FILE_COMPILE = null;
const C_FILE_COMPILE = `#!/bin/bash
  gcc main.c -o main`;
const C_PLUS_PLUS_FILE_COMPILE = `#!/bin/bash
  g++ main.cpp -o main`;
const C_SHARP_FILE_COMPILE = `#!/bin/bash
  /usr/local/mono-6.6.0.161/bin/csc main.cs`;
const ELIXIR_FILE_COMPILE = null;
const GO_FILE_COMPILE = `#!/bin/bash
  /usr/local/go-1.13.5/bin/go build main.go`;
const JAVA_FILE_COMPILE = `#!/bin/bash
  /usr/local/openjdk13/bin/javac Main.java`;
const NODEJS_FILE_COMPILE = `#!/bin/bash
  /usr/local/node-12.14.0/bin/npm i`;
const KOTLIN_FILE_COMPILE = `#!/bin/bash
  /usr/local/kotlin-1.3.70/bin/kotlinc main.kt -include-runtime -d main.jar`;
const OBJECTIVE_C_FILE_COMPILE = `#!/bin/bash
  . /usr/share/GNUstep/Makefiles/GNUstep.sh
  gcc $(gnustep-config --objc-flags) -lgnustep-base main.m -o main`;
const PASCAL_FILE_COMPILE = `#!/bin/bash
  /usr/local/fpc-3.0.4/bin/fpc main.pas`;
const PERL_FILE_COMPILE = null;
const PHP_FILE_COMPILE = null;
const PYTHON_FILE_COMPILE = null;
const R_FILE_COMPILE = null;
const RUBY_FILE_COMPILE = null;
const RUST_FILE_COMPILE = `#!/bin/bash
  /usr/local/rust-1.40.0/bin/rustc main.rs`;
const SCALA_FILE_COMPILE = `#!/bin/bash
  /usr/local/scala-2.13.2/bin/scalac Main.scala`;
const SWIFT_FILE_COMPILE = `#!/bin/bash
  /usr/local/swift-5.2.3/bin/swiftc Main.swift`;
const TYPESCRIPT_FILE_COMPILE = `#!/bin/bash
  tsc main.ts`;

// ==========================================

const FILE_EXEC_CODE_UTILS = new Map();
FILE_EXEC_CODE_UTILS.set(LANG_ID.ASSEMBLY, {
  RUN: ASSEMBLY_FILE_RUN,
  COMPILE: ASSEMBLY_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.ASSEMBLY,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.BASH, {
  RUN: BASH_FILE_RUN,
  COMPILE: BASH_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.BASH,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.C, {
  RUN: C_FILE_RUN,
  COMPILE: C_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.C,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.C_PLUS_PLUS, {
  RUN: C_PLUS_PLUS_FILE_RUN,
  COMPILE: C_PLUS_PLUS_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.C_PLUS_PLUS,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.C_SHARP, {
  RUN: C_SHARP_FILE_RUN,
  COMPILE: C_SHARP_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.C_SHARP,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.ELIXIR, {
  RUN: ELIXIR_FILE_RUN,
  COMPILE: ELIXIR_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.ELIXIR,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.GO, {
  RUN: GO_FILE_RUN,
  COMPILE: GO_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.GO,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.JAVA, {
  RUN: JAVA_FILE_RUN,
  COMPILE: JAVA_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.JAVA,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.NODEJS, {
  RUN: NODEJS_FILE_RUN,
  COMPILE: NODEJS_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.NODEJS,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.KOTLIN, {
  RUN: KOTLIN_FILE_RUN,
  COMPILE: KOTLIN_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.KOTLIN,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.OBJECTIVE_C, {
  RUN: OBJECTIVE_C_FILE_RUN,
  COMPILE: OBJECTIVE_C_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.OBJECTIVE_C,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.PASCAL, {
  RUN: PASCAL_FILE_RUN,
  COMPILE: PASCAL_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.PASCAL,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.PERL, {
  RUN: PERL_FILE_RUN,
  COMPILE: PERL_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.PERL,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.PHP, {
  RUN: PHP_FILE_RUN,
  COMPILE: PHP_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.PHP,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.PYTHON, {
  RUN: PYTHON_FILE_RUN,
  COMPILE: PYTHON_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.PYTHON,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.R, {
  RUN: R_FILE_RUN,
  COMPILE: R_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.R,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.RUBY, {
  RUN: RUBY_FILE_RUN,
  COMPILE: RUBY_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.RUBY,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.RUST, {
  RUN: RUST_FILE_RUN,
  COMPILE: RUST_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.RUST,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.SCALA, {
  RUN: SCALA_FILE_RUN,
  COMPILE: SCALA_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.SCALA,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.SWIFT, {
  RUN: SWIFT_FILE_RUN,
  COMPILE: SWIFT_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.SWIFT,
});
FILE_EXEC_CODE_UTILS.set(LANG_ID.TYPESCRIPT, {
  RUN: TYPESCRIPT_FILE_RUN,
  COMPILE: TYPESCRIPT_FILE_COMPILE,
  MAIN: NAME_OF_FILE_MAIN.TYPESCRIPT,
});

export const FILE_EXEC_CODE = FILE_EXEC_CODE_UTILS;

// ###########################################################

export const NUM_OF_SUBMISSIONS_PER_BATCH = 5;
export const NUM_OF_TOKENS_PER_BATCH = 2;

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

export const DEFAULT_N_RETRY = 3;
export const DEFAULT_SLEEP_MS = 2000;
export const FILE_NOT_FOUND_SEPARATOR = "/~!&^*+0)(#%@~/";
export const STDOUT_FILEOUT_SEPARATOR = ".~@!(#*,#%?+)^-";
