import Topic from "../schemas/topicSchema.js";
export default {
  async isExist(id) {
    const response = await Topic.findById({ _id: id });
    return response ? 1 : 0;
  },
  async isExistName(name) {
    const isExist = await Topic.findOne({ name: name });
    console.log(isExist);
    return isExist != null ? true : false;
  },
};
