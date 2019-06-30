import { select } from "d3";
import { drawCBlock, cBlockDimensions } from "./blocks";

const message = "This is a test";

const messages = [
  "This is the first",
  "This is the second",
  "This is the third",
  "x",
  "This is the next-to-last",
  "This is the last"
];

const { width, height } = cBlockDimensions(message, messages);

const svg = select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height + 35);

drawCBlock(svg, message, messages);
