import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../common/api";
import Loading from "../../components/loading/Loading";
import { handleDelete } from "../../utils/fetch";
import { getListNote } from "../../utils/noteHelper";
import NoteItem from "./NoteItem";
import { getCourseTopics, getLessonDetail } from "../../utils/courseHelper";

//

const NoteContent = () => {
  const [noteList, setNoteList] = useState();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const { id } = useParams();
  const [topicInfo, setTopicInfo] = useState({});
  const [lessonInfo, setLessonInfo] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const res = await getListNote(lessonId);
      const { notes, lesson: idLesson } = res?.data?.userNote;
      const { topicId } = res?.data;

      const { data: topics } = await getCourseTopics(id);
      topics?.forEach((topic) => {
        if (topic?._id === topicId) {
          setTopicInfo(topic);
          return;
        }
      });
      const resLesson = await getLessonDetail(lessonId);
      const { lessonInfo: lesson } = resLesson?.data;
      setLessonInfo(lesson);
      setLoading(false);

      setNoteList(notes);
    };
    fetchData();
  }, []);
  const handleDeleteNote = async (noteId) => {
    const res = await handleDelete(API.DELETE_NOTE(lessonId), {
      noteId,
    });
    if (res.status === 200) {
      toast.success("Xóa ghi chú thành công");
      const newNoteList = res?.data?.data?.notes;

      setNoteList(newNoteList);
    } else {
      toast.error("Xóa ghi chú không thành công");
    }
  };
  return (
    <>
      {!loading ? (
        <div className="w-full h-full">
          {noteList?.length > 0 ? (
            noteList.map((note) => (
              <NoteItem
                key={note._id}
                data={note}
                handleDelete={handleDeleteNote}
                lesson={lessonInfo}
                topic={topicInfo}
              />
            ))
          ) : (
            <div className="w-full absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
              <div className="w-[300px]">
                <img
                  className="w-full"
                  src="/images/resource/empty_lessons.png"
                  alt=""
                />
              </div>
              <h5 className="text-slate-400 text-xl mt-2 font-semibold">
                Chưa có ghi chú
              </h5>
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default NoteContent;
