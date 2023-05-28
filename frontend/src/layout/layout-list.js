import { lazy } from "react";

// Import
const DELAY_TIME = 500;

const BasicLayout = lazy(() =>
  Promise.all([
    import("./BasicLayout"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

const NoFooterLayout = lazy(() =>
  Promise.all([
    import("./NoFooterLayout"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

const LearningLayout = lazy(() =>
  Promise.all([
    import("./LearningLayout"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);

const SidebarLayout = lazy(() =>
  Promise.all([
    import("./SidebarLayout"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME)),
  ]).then(([module]) => module)
);
// Export
const LAYOUT_LIST = {
  BASIC: BasicLayout,
  NO_FOOTER: NoFooterLayout,
  LEARNING_LAYOUT: LearningLayout,
  WITH_SIDEBAR: SidebarLayout,
};

export default LAYOUT_LIST;
