import { select } from "d3";
import { drawCommands, commandsDimensions } from "./blocks";

const messages = [
  "This is the first",
  "This is the second",
  "This is the third"
];

const { width, height } = commandsDimensions(messages);

const svg = select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height + 5);

drawCommands(svg, messages);
