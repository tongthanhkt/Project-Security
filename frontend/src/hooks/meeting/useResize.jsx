import React from "react";
import {
  defHeight,
  defWidth,
  resizedHeight,
  resizedWidth,
} from "../../common/jitsi-config";

const useResize = () => {
  const [curHeight, setCurHeight] = React.useState(defHeight);
  const [curWidth, setCurWidth] = React.useState(defWidth);
  const [isMaximize, setIsMaximize] = React.useState(true);

  const handleResize = () => {
    setIsMaximize((isMaximize) => !isMaximize);
  };

  function resetSize() {
    setIsMaximize(true);
  }

  React.useEffect(() => {
    setCurHeight(isMaximize ? defHeight : resizedHeight);
    setCurWidth(isMaximize ? defWidth : resizedWidth);
  }, [isMaximize]);
  return { curHeight, curWidth, handleResize, resetSize };
};

export default useResize;
