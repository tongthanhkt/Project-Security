import React from "react";
import CodeEditorAdapter from "../../../../../components/input/CodeEditorAdapter";
import IconButton from "./../../../../../components/button/IconButton";
import { Add, AddCircle, Delete, Edit } from "@mui/icons-material";
import {
  useIsFetching,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { reactQueryKey } from "./../../../../../utils/fetch";
import { useSearchParams } from "react-router-dom";
import {
  createTemplate,
  deleteTemplate,
  getTemplate,
} from "../../../../../utils/templateHelper";
import Empty from "./../../../../../components/empty/Empty";
import { LANG_ID_TO_TEXT, LANG_LIST } from "../../../../../common/constants";
import BasicModal from "./../../../../../components/modal/BasicModal";
import usePopup from "./../../../../../hooks/usePopup";
import BasicButton from "./../../../../../components/button/BasicButton";
import { toast } from "react-toastify";
import RESP from "../../../../../common/respCode";
import LoadingSkeleton from "../../../../../components/loading/LoadingSkeleton";
import ConfirmPopup from "./../../../../../components/modal/ConfirmPopup";
import { CircularProgress } from "@mui/material";

const TemplateEditTab = ({ templateLangIds }) => {
  const [searchParams] = useSearchParams();
  const exerciseId = searchParams.get("exerciseId");
  const lessonId = searchParams.get("lessonId");

  // State
  const [curLang, setCurLang] = React.useState(null);

  // Fetch data
  const {
    data: curTemplate,
    isLoading,
    error,
  } = useQuery(
    reactQueryKey.TEMPLATE_INFO(lessonId, exerciseId, curLang),
    () => getTemplate(lessonId, exerciseId, curLang),
    { enabled: !!curLang }
  );

  // Loading
  const isFetchingExercise = Boolean(
    useIsFetching({
      queryKey: reactQueryKey.LESSON_EXERCISES(lessonId),
    })
  );

  function renderIcon(icon) {
    if (isFetchingExercise) {
      return <CircularProgress size={24} className="!text-slate-600" />;
    } else {
      return icon;
    }
  }

  // *** Modal ***
  // Add
  const {
    open: isOpenAdd,
    handleClosePopup: closeAdd,
    handleOpenPopup: openAdd,
  } = usePopup();
  // Confirm delete
  const {
    open: isOpenDel,
    handleClosePopup: closeDel,
    handleOpenPopup: openDel,
  } = usePopup();

  const selected = "bg-gradient text-white";

  React.useEffect(() => {
    if (templateLangIds.length > 0) {
      setCurLang(templateLangIds[0]);
    }
  }, [templateLangIds]);

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      {templateLangIds.length > 0 ? (
        <>
          {/* {!isFetchingExercise ? (
            <OverlayLoading width="100%" height="100vh" />
          ) : null} */}

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-2xl font-semibold">Tempaltes</p>
            <div className="flex gap-x-2">
              <IconButton
                type="button"
                disabled={isFetchingExercise}
                onClick={() => console.log("Edit")}
              >
                {renderIcon(<Edit />)}
              </IconButton>
              <IconButton
                type="button"
                onClick={openDel}
                disabled={isFetchingExercise}
                className="text-red-500"
              >
                {renderIcon(<Delete />)}
              </IconButton>
            </div>
          </div>

          {/* Content */}

          {isFetchingExercise ? (
            <TemplateLoading />
          ) : (
            <div className="flex gap-x-2 relative">
              {/* Sidebar */}
              <div className="side-bar-language rounded-md w-[20%] max-h-[65vh] overflow-y-auto px-4">
                {templateLangIds.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCurLang(item)}
                    className={`rounded-md p-2 mb-2 w-full shadow-md font-medium hover:bg-slate-200 ${
                      item === curLang ? selected : ""
                    }`}
                  >
                    {LANG_ID_TO_TEXT[item]}
                  </button>
                ))}
                {/* Add template button */}
                {templateLangIds.length !== LANG_LIST.length ? (
                  <IconButton
                    type="button"
                    className={`rounded-md p-2 mb-2 w-full shadow-md`}
                    handleOnClick={openAdd}
                  >
                    <Add /> <span className="font-medium">Template</span>
                  </IconButton>
                ) : null}
              </div>
              {/* Code editor */}
              {isLoading ? (
                <LoadingSkeleton width={"80%"} height={"65vh"} />
              ) : (
                <CodeEditorAdapter
                  theme="vs-dark"
                  noHeader={true}
                  width="80%"
                  height="65vh"
                  defaultValue={curTemplate?.data.template}
                  language={curTemplate?.data.langId}
                  readOnly={true}
                />
              )}
            </div>
          )}
        </>
      ) : (
        <div className="h-minus-footer flex justify-center items-center">
          <div className="text-center text-slate-400">
            <Empty
              message="Chưa có template"
              imgSrc="/images/empty_state_images/no_files_found.png"
            />
            <IconButton onClick={openAdd}>
              <Add /> <span className="font-medium">Thêm template</span>
            </IconButton>
          </div>
        </div>
      )}
      <div className="modal-template">
        {/* Add modal */}
        {templateLangIds.length !== LANG_LIST.length ? (
          <AddTemplateModal
            isOpenAdd={isOpenAdd}
            closeAdd={closeAdd}
            templateLangIds={templateLangIds}
          />
        ) : null}

        <DelTemplateModal
          isOpen={isOpenDel}
          close={closeDel}
          templateId={curTemplate?.data?._id}
        />
      </div>
    </>
  );
};

const AddTemplateModal = ({ isOpenAdd, closeAdd, templateLangIds }) => {
  const [searchParams] = useSearchParams();
  const exerciseId = searchParams.get("exerciseId");
  const lessonId = searchParams.get("lessonId");

  // Editor state
  const [remainLangList, setRemainLangList] = React.useState([]);
  const [editorVal, setEditorVal] = React.useState("");
  const [curLangId, setCurLangId] = React.useState(remainLangList[0]?.value);

  // Handle func
  function handleCreateTemplate() {
    if (editorVal) {
      mutationCreate.mutate({
        template: editorVal,
        langId: curLangId,
      });
    } else {
      toast.error("Template không được để trống");
    }
  }

  const queryClient = useQueryClient();
  // Add template
  const mutationCreate = useMutation(
    ({ langId, template }) =>
      createTemplate(lessonId, exerciseId, langId, template),
    {
      onError: (error) => {
        console.log(error);
        toast.error(error);
      },
      onSuccess: (data) => {
        console.log(
          "🚀 ~ file: TemplateEditTab.jsx:171 ~ TemplateEditTab ~ data:",
          data
        );
        // Invalidate to refetch
        closeAdd();
        if (data.status === RESP.SUCCESS) {
          queryClient.invalidateQueries(
            reactQueryKey.LESSON_EXERCISES(lessonId)
          );
          toast.success("Tạo template thành công");
        } else {
          toast.error(data.message);
        }
      },
    }
  );

  // Reset add template modal
  React.useEffect(() => {
    if (remainLangList.length > 0) {
      setCurLangId(remainLangList[0].value);
      setEditorVal("");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainLangList]);

  // Get remain lang list
  React.useEffect(() => {
    // No template yet
    if (templateLangIds.length === 0) {
      setRemainLangList(LANG_LIST);
    } else {
      const remain = LANG_LIST.filter(
        (item) => !templateLangIds.includes(item.value)
      );

      setRemainLangList(remain);
    }
  }, [templateLangIds]);

  return (
    <BasicModal open={isOpenAdd} handleClose={closeAdd}>
      {/* Code editor */}
      <CodeEditorAdapter
        theme="vs-dark"
        height="65vh"
        langList={remainLangList}
        language={curLangId}
        setLanguage={setCurLangId}
        defaultValue={editorVal}
        handleChange={(values) => setEditorVal(values)}
      />

      {/* Create btn */}
      <BasicButton
        icon={<AddCircle />}
        onClick={handleCreateTemplate}
        loading={mutationCreate.isLoading}
        className="!mt-2 w-40 !font-semibold !m-auto"
      >
        Tạo template
      </BasicButton>
    </BasicModal>
  );
};

const DelTemplateModal = ({ isOpen, close, templateId }) => {
  const [searchParams] = useSearchParams();
  const exerciseId = searchParams.get("exerciseId");
  const lessonId = searchParams.get("lessonId");

  const queryClient = useQueryClient();
  const mutationDel = useMutation(
    ({ templateId }) => deleteTemplate(lessonId, exerciseId, templateId),
    {
      onError: (error) => {
        console.log(error);
        toast.error(error);
      },
      onSuccess: (data) => {
        console.log(
          "🚀 ~ file: TemplateEditTab.jsx:52 ~ TemplateEditTab ~ data:",
          data
        );
        // Invalidate to refetch
        queryClient.invalidateQueries(reactQueryKey.LESSON_EXERCISES(lessonId));
        if (data.status === RESP.SUCCESS) {
          toast.success("Xóa template thành công");
          close();
        } else {
          toast.error(data.message);
        }
      },
    }
  );

  return (
    <ConfirmPopup
      isOpen={isOpen}
      handleReject={close}
      handleConfirm={() => mutationDel.mutate({ templateId })}
      isConfirming={mutationDel.isLoading}
      closeOnConfirm={false}
    ></ConfirmPopup>
  );
};

const TemplateLoading = () => {
  return (
    <div className="w-full h-[65vh] flex gap-x-2">
      <div className="w-[20%] h-full flex flex-col gap-y-4">
        <LoadingSkeleton width={"100%"} height={"40px"} />
        <LoadingSkeleton width={"100%"} height={"40px"} />
        <LoadingSkeleton width={"100%"} height={"40px"} />
      </div>
      <LoadingSkeleton width={"80%"} height={"100%"} />
    </div>
  );
};

export default TemplateEditTab;
