import { API } from "../common/api";
import { handlePost } from "./fetch";

export const updateAvatar = (avatarFile) => {
  var data = new FormData();
  data.append("img", avatarFile, avatarFile.name);
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.status === 500) {
          resolve({ status: 500, message: "File too large" });
        }
        resolve(JSON.parse(this.responseText));
      }
    });

    xhr.open("POST", API.UPDATE_AVATAR);

    xhr.send(data);
  });
};

export const removeAvatar = async () => {
  try {
    const res = await handlePost(API.REMOVE_AVATAR);
    return res;
  } catch (err) {
    console.log(err);
  }
};
