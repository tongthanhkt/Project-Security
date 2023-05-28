import * as React from "react";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value}°C`;
}

const marks = [
  {
    value: 0,
    label: "0°C",
  },
  {
    value: 20,
    label: "20°C",
  },
  {
    value: 37,
    label: "37°C",
  },
  {
    value: 100,
    label: "100°C",
  },
];

export default function VerticalProgress({ className = "", value = 0 }) {
  return (
    <Stack className={className} spacing={1} direction="row">
      <Slider
        orientation="vertical"
        valueLabelDisplay="auto"
        defaultValue={value}
      />
    </Stack>
  );
}
