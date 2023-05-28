const tsToDate = (ts, withTime = false) => {
  var date = new Date(ts);
  var formattedTime = date.toLocaleDateString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: withTime ? "2-digit" : undefined,
    minute: withTime ? "2-digit" : undefined,
  });

  return formattedTime;
};

export { tsToDate };
