import { API } from "../common/api";
import { handleGet } from "./fetch";

export const searchTA = async (key) => {
  try {
    const res = await handleGet(API.SEARCH_TA(key));
    return res.data.taList;
  } catch (error) {
    console.log(error);
  }
};
