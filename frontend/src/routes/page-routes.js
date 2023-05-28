import { lazy } from "react";
import LAYOUT_LIST from "../layout/layout-list";
import { PAGE_PATH } from "./page-paths";

const DELAY_TIME = 500;

// ================================= Components =================================
// Authen
const SignupPage = lazy(() =>
  Promise.all([
    import("../pages/authen/RegisterPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);
const SignInPage = lazy(() =>
  Promise.all([
    import("../pages/authen/LoginPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

// Meeting
const MeetingPage = lazy(() =>
  Promise.all([
    import("../pages/meeting/MeetingPage"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);
const JoinMeetingPage = lazy(() =>
  Promise.all([
    import("../pages/meeting/JoinMeetingPage"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

// Upload
const UploadResourcePage = lazy(() =>
  Promise.all([
    import("../pages/resource/UploadResourcePage"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

// Payment
const OrderPage = lazy(() =>
  Promise.all([
    import("../pages/payment/OrderPage"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);
const OrderSuccessPage = lazy(() =>
  Promise.all([
    import("../pages/payment/OrderResultsPage"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

// Profile
const ProfilePage = lazy(() =>
  Promise.all([
    import("../pages/profile/ProfilePage"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

// Course
const CourseDetailPage = lazy(() =>
  Promise.all([
    import("../pages/course/CourseDetailPage"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);
const MyCoursePage = lazy(() =>
  Promise.all([
    import("../pages/course/MyCoursePage"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);
const CourseManagementPage = lazy(() =>
  Promise.all([
    import("../pages/course/CourseManagementPage"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

// Course management
const CourseManagementDashboard = lazy(() =>
  Promise.all([
    import("../pages/course/managemet/CourseManagementDashboard"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

// Learning
const CourseLearningPage = lazy(() =>
  Promise.all([
    import("../pages/learning/CourseLearningPage"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

// Misc
const HomePage = lazy(() =>
  Promise.all([
    import("../pages/HomePage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

// ================================= Routes =================================
// Constructor
function pageRoute(
  path,
  component,
  stopWhenLogin,
  noLayout,
  layout = LAYOUT_LIST.BASIC
) {
  this.path = path;
  this.component = component;
  this.stopWhenLogin = stopWhenLogin;
  this.noLayout = noLayout;
  this.layout = layout;
}

// Protected
const protectedRoutes = [
  // Auth
  new pageRoute(PAGE_PATH.LOGIN, SignInPage, true, true),
  new pageRoute(PAGE_PATH.REGISTER, SignupPage, true, true),

  // Meeting
  new pageRoute(PAGE_PATH.MEETING, MeetingPage, false, false),
  new pageRoute(PAGE_PATH.ROOM, JoinMeetingPage, false, false),

  // Resource
  new pageRoute(PAGE_PATH.UPLOAD, UploadResourcePage, false, false),

  // Payment
  new pageRoute(PAGE_PATH.ORDER, OrderPage, false, false),
  new pageRoute(PAGE_PATH.ORDER_RESULTS, OrderSuccessPage, false, false),

  // Profile
  new pageRoute(PAGE_PATH.PROFILE, ProfilePage, false, false),

  // Course
  new pageRoute(PAGE_PATH.COURSE_DETAIL, CourseDetailPage, false, false),
  new pageRoute(PAGE_PATH.MY_COURSE, MyCoursePage, false, false),
  new pageRoute(
    PAGE_PATH.COURSE_MANAGEMENT,
    CourseManagementPage,
    false,
    false
  ),

  // Course management
  new pageRoute(
    PAGE_PATH.COURSE_MANAGEMENT_DASHBOARD(),
    CourseManagementDashboard,
    false,
    false,
    LAYOUT_LIST.WITH_SIDEBAR
  ),

  // Learning
  new pageRoute(
    PAGE_PATH.COURSE_LEARNING(),
    CourseLearningPage,
    false,
    false,
    LAYOUT_LIST.LEARNING_LAYOUT
  ),
];

// Public
const publicRoutes = [new pageRoute(PAGE_PATH.HOME, HomePage, false, false)];

export { protectedRoutes, publicRoutes };
