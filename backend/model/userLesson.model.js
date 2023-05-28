import UserLesson from "../schemas/userLessonSchema.js";
import User from "../schemas/userSchema.js";
export default {
  
  async isCompleteLesson(userId, lessonId) {
    const isCompleted = await UserLesson.findOne({
      student: userId,
      lesson: lessonId,
      isDone: true,
    });
    return isCompleted ? true : false;
  },
};
