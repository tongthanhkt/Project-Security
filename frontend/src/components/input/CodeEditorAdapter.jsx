import React from "react";
import MonacoEditorComponent from "./code-editor/MonacoEditorComponent";
import { LANG_ID, LANG_LIST } from "./../../common/constants";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const CodeEditorAdapter = (
  {
    language = LANG_ID.NODEJS,
    setLanguage = () => {},
    theme = "light",
    defaultValue = "",
    height = "74vh",
    width = "50vw",
    handleChange = (values) => {},
    noHeader = false,
    langList = LANG_LIST,
    readOnly,
  },
  ref
) => {
  // Value get from editor
  const [curTheme, setCurTheme] = React.useState(theme);
  const [editorHeight] = React.useState(height);

  const editorRef = React.useRef();

  React.useImperativeHandle(ref, () => ({
    getEitorValue,
  }));

  const themeList = [
    {
      name: "Light",
      value: "light",
    },
    {
      name: "Dark",
      value: "vs-dark",
    },
  ];

  const LANG_ID_TO_MONACO = {
    50: "c",
    54: "cpp",
    51: "csharp",
    60: "go",
    62: "java",
    63: "javascript",
    71: "python",
    78: "kotlin",
    79: "objective-c",
    67: "pascal",
    85: "perl",
    68: "php",
    80: "r",
    72: "ruby",
    73: "rust",
    83: "swift",
    74: "typescript",

    // ASSEMBLY: 45,
    // BASH: 46,
    // ELIXIR: 57,
    // SCALA: 81,
    // MULTI_FILE: 89,
  };

  // Get editor value
  function getEitorValue() {
    return editorRef.current.getValue();
  }

  function handleEditorChange(values) {
    handleChange(values);
  }

  // Handle get submit history 1st time load
  // React.useEffect(() => {
  //   const historyList = submitHistory?.data;
  //   if (historyList && historyList?.docs?.length > 0) {
  //     const lastSubmit =
  //       formatTestCase(historyList.docs, SUBMIT_TYPE.SUBMIT_CODE) || [];
  //     if (isRunComplete(testCaseResult, "status") === false) {
  //       queryClient.invalidateQueries(
  //         reactQueryKey.SUBMIT_CODE_INFO(lessonId, exercise._id, submitId)
  //       );
  //       // Set interval for running until done
  //       interValRunCode.current = setInterval(() => {
  //         queryClient.invalidateQueries(
  //           reactQueryKey.SUBMIT_CODE_INFO(lessonId, exercise._id, submitId)
  //         );
  //       }, DELAY);
  //     }
  //     setTestCaseResult(lastSubmit);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [submitHistory]);

  return (
    <div style={{ width: width }}>
      {/* Header */}
      {!noHeader ? (
        <div className="flex justify-end items-center p-2">
          {/* File list */}
          <ul className="flex flex-wrap text-sm font-medium text-center">
            {/* Run button */}
            <li className="ml-2 font-semibold inline-block p-2 w-52">
              {langList.length !== 0 &&
              langList.filter((item) => item.value === language).length > 0 ? (
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Language
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    value={language}
                    label="Ngôn ngữ"
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      // console.log(e.target.value);
                    }}
                    className="text-left"
                  >
                    {langList.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
            </li>
            <li className="ml-2 font-semibold inline-block p-2 w-52">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Theme</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={theme}
                  label="Theme"
                  onChange={(e) => setCurTheme(e.target.value)}
                  className="text-left"
                >
                  {themeList.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </li>
          </ul>
        </div>
      ) : null}

      {/* Editor goes here... */}
      <MonacoEditorComponent
        defaultLanguage={language}
        theme={curTheme}
        height={editorHeight}
        defaultValue={defaultValue}
        ref={editorRef}
        LANG_ID_TO_MONACO={LANG_ID_TO_MONACO}
        handleChange={handleEditorChange}
        readOnly={readOnly}
      />
    </div>
  );
};

export default React.forwardRef(CodeEditorAdapter);
