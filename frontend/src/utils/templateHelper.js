import { API } from "../common/api";
import { handleGet, handlePost } from "./fetch";

export async function createTemplate(lessonId, exerciseId, langId, template) {
  try {
    const reqCreate = {
      lessonId,
      exerciseId,
      langId,
      template,
    };
    const res = await handlePost(API.CREATE_TEMPLATE, reqCreate);
    console.log("🚀 ~ file: templateHelper.js:13 ~ createTemplate ~ res:", res);
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: templateHelper.js:16 ~ createTemplate ~ error:",
      error
    );
  }
}

export async function getTemplate(lessonId, exerciseId, langId) {
  try {
    const res = await handleGet(API.GET_TEMPLATE(lessonId, exerciseId, langId));
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: templateHelper.js:34 ~ getTemplate ~ error:",
      error
    );
  }
}

export async function deleteTemplate(lessonId, exerciseId, templateId) {
  try {
    const reqDel = {
      lessonId,
      exerciseId,
      templateId,
    };
    const res = await handlePost(API.DELETE_TEMPLATE, reqDel);
    return res;
  } catch (error) {
    console.log(
      "🚀 ~ file: templateHelper.js:45 ~ deleteTemplate ~ error:",
      error
    );
  }
}
