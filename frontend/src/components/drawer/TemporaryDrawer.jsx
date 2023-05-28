import * as React from "react";
import Drawer from "@mui/material/Drawer";

export default function TemporaryDrawer({
  anchor = "right",
  title = "",
  children,
  isOpen = true,
  className = "",
  ...props
}) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    const { setPlaying } = props;
    if (setPlaying) setPlaying(!open);
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div>
      <React.Fragment key={anchor}>
        <div className="cursor-pointer" onClick={toggleDrawer(anchor, true)}>
          {title}
        </div>
        <Drawer
          anchor={anchor}
          open={isOpen && state[anchor]}
          onClose={toggleDrawer(anchor, false)}
        >
          {children}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
