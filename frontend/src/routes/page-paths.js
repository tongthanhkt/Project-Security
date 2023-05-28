let DOMAIN = process.env.REACT_APP_FRONTEND_DOMAIN_DEV;
if (!window.location.hostname.includes("localhost")) {
  DOMAIN = process.env.REACT_APP_FRONTEND_DOMAIN;
} else if (window.location.hostname.includes("onrender")) {
  DOMAIN = process.env.REACT_APP_ONRENDER_DOMAIN;
}

const PAGE_PATH = {
  BASE: DOMAIN,
  HOME: "/",

  // Auth
  LOGIN: "/sign-in",
  REGISTER: "/sign-up",

  // Meeting
  MEETING: "/meeting",
  ROOM: "/room",

  // Resource
  UPLOAD: "/upload",

  // Payment
  ORDER: "/order",
  ORDER_RESULTS: "/order-results",

  // Profile
  PROFILE: "/profile",

  // Course
  COURSE_DETAIL: "/course-detail/:id",
  MY_COURSE: "/my-course/:id",
  COURSE_MANAGEMENT: "/course-management",

  // Course management
  COURSE_MANAGEMENT_DASHBOARD(courseId) {
    return courseId
      ? `${this.COURSE_MANAGEMENT}/${courseId}`
      : `${this.COURSE_MANAGEMENT}/:id`;
  },

  // Study
  COURSE_LEARNING: (courseId) =>
    courseId === undefined ? "/learning/:id" : `/learning/${courseId}`,
};

export { PAGE_PATH };
