import { GeneralInfoContent } from "./create-new-course-content/GeneralInfoContent";
import { AssignTAContent } from "./create-new-course-content/AssignTAContent";

export const CreateCourseFormContent = ({
  file,
  setFile,
  step,
  errors,
  control,
  setValue,
  getValues,
  listSelectedTA,
  setListSelectedTA,
}) => {
  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <GeneralInfoContent
            file={file}
            setFile={setFile}
            setValue={setValue}
            getValues={getValues}
            control={control}
            errors={errors}
          ></GeneralInfoContent>
        );
      case 2:
        return (
          <AssignTAContent
            listSelectedTA={listSelectedTA}
            setListSelectedTA={setListSelectedTA}
          ></AssignTAContent>
        );
      default:
        return <div></div>;
    }
  };
  return <>{renderContent()}</>;
};
