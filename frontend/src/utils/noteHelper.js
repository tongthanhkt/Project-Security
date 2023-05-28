import { API } from "../common/api";
import { handleGet, handlePost } from "./fetch";

export async function createNote(start, end, content, lessonId) {
  try {
    const data = {
      startTs: start,
      endTs: end,
      note: content,
    };

    const res = await handlePost(API.CREATE_NOTE(lessonId), data);
    return res;
  } catch (error) {
    console.log("🚀 ~ file: exerciseHelper.js:26 ~ createQuiz ~ error:", error);
  }
}

export const getListNote = async (lessionId) => {
  const res = await handleGet(API.LIST_NOTE(lessionId));
  return res;
};
