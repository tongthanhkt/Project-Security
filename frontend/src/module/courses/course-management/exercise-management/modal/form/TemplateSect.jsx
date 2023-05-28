import React from "react";
import { LANG_ID } from "../../../../../../common/constants";
import BasicTextBox from "../../../../../../components/input/BasicTextBox";
import CodeEditorAdapter from "../../../../../../components/input/CodeEditorAdapter";
import SectionDivider from "./SectionDivider";

const TemplateSect = ({ control, errors, getValues, setValue }) => {
  const [langId, setLangId] = React.useState(LANG_ID.NODEJS);

  React.useEffect(() => {
    setValue("lang_id", langId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langId]);

  return (
    <div className="relative">
      <SectionDivider sectName="Template" />
      <CodeEditorAdapter
        height="65vh"
        width="100%"
        theme="vs-dark"
        language={langId}
        setLanguage={setLangId}
        handleChange={(values) => {
          setValue("template_val", values, { shouldValidate: true });
        }}
        defaultValue={getValues("template_val")}
      />
      {/* Actual field */}
      <BasicTextBox
        control={control}
        errors={errors.template_val ? errors.template_val.message : null}
        name={"template_val"}
        defaultValue={getValues("template_val")}
        type="textArea"
        hidden
      />
      <BasicTextBox
        control={control}
        errors={errors.lang_id ? errors.lang_id.message : null}
        name={"lang_id"}
        defaultValue={getValues("lang_id")}
        hidden
      />
    </div>
  );
};

export default TemplateSect;
