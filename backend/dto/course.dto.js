export default class CourseDto {
  constructor(body) {
    const { name, description, requirement, thumb } = body;
    if (name !== undefined) {
      this.name = name;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (thumb !== undefined) {
      this.thumb = thumb;
    }
    if (requirement !== undefined) {
      this.requirement = requirement;
    }
  }
}
