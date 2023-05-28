import { createContext, useContext, useEffect, useState } from "react";

const PasssedContext = createContext();
function PasssedProvider(props) {
  const [listPassed, setListPassed] = useState([]);
  const values = { listPassed, setListPassed };
  const [currentSection, setCurrentSection] = useState(0);
  useEffect(() => {
    if (!hasPassedAllSection() && !listPassed.includes(currentSection)) {
      setListPassed((prev) => [...prev, currentSection]);
    } else window.removeEventListener("scroll", getElVisibilityInScreen, false);
  }, [currentSection]);

  const getElVisibilityInScreen = (listElementId) => {
    const listEl = listElementId.map((el) => document.getElementById(el));
    var listElPosition = listEl?.map((el) => el?.getBoundingClientRect());

    listElPosition.map((po, i) => {
      if (po.top >= 0 && po.top <= po.height / 1.25) {
        // console.log(listElementId[i], po)
        setCurrentSection(listElementId[i].split("st")[1] - 1);
      }
    });
  };
  const hasPassedAllSection = () => {
    const listSections = [...Array(7).keys()];
    return (
      listSections.length === listPassed.length &&
      listSections.every((i, idx) => i === listPassed[idx])
    );
  };
  useEffect(() => {
    const listEl = ["st1", "st2", "st3", "st4"];

    window.addEventListener("scroll", function () {
      getElVisibilityInScreen(listEl);
    });

    return () => {
      // window.removeEventListener("scroll");
    };
  }, []);
  return (
    <PasssedContext.Provider
      value={values}
      {...props}
    ></PasssedContext.Provider>
  );
}
function usePasssed() {
  const context = useContext(PasssedContext);
  if (typeof context === "undefined")
    throw new Error("usePasssed must be used within PasssedProvider");
  return context;
}
export { PasssedProvider, usePasssed };
