function filterText(array, field, searchVal) {
  const filArr = array?.filter((item) =>
    searchVal?.toLowerCase() === ""
      ? item
      : item[field]?.toLowerCase().includes(searchVal)
  );

  return filArr;
}

export { filterText };
