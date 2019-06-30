import { select } from "d3";
import { drawCommands, commandsDimensions } from "./blocks";

const messages = [
  "This is the first",
  "This is the second",
  "This is the third",
  "x",
  "This is the next-to-last",
  "This is the last"
];

const { width, height } = commandsDimensions(messages);

const svg = select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height + 35);

drawCommands(svg, messages);
