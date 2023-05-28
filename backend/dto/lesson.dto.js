export default class LessonDto {
  constructor(lesson) {
    (this._id = lesson._id),
      (this.ts = lesson.ts),
      (this.name = lesson.name),
      (this.topic = lesson.topic), // topicId
      (this.course = lesson.course), // courseId
      (this.description = lesson.description),
      (this.resources = lesson.description), // resourceId
      (this.exercises = lesson.exercises),
      (this.isVisible = lesson.isVisible);
  }
}
