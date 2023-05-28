import React from "react";
import { filterText } from "../../utils/textHelper";

const useSearchFilter = (data, onFilterChange = () => {}) => {
  const [searchItem, setSearchItem] = React.useState(null);
  const [filterData, setFilterData] = React.useState(data);

  React.useEffect(() => {
    const filData = filterText(data, "name", searchItem);
    setFilterData(!searchItem ? data : filData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, searchItem]);

  React.useEffect(() => {
    onFilterChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  return { filterData, setSearchItem };
};

export default useSearchFilter;
