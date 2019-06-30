import { select } from "d3";
import textDimensions from "./text-dimensions";
import { fontProperties } from "./constants";

const message = "This is just a test";
const td = textDimensions(message);

const svg = select("body")
  .append("svg")
  .attr(
    "width",
    td.width + fontProperties.margins.right + fontProperties.margins.left
  )
  .attr(
    "height",
    td.height + fontProperties.margins.top + fontProperties.margins.bottom + 5
  );

svg
  .append("path")
  .attr(
    "d",
    path(
      td.width + fontProperties.margins.right + fontProperties.margins.left,
      td.height + fontProperties.margins.top + fontProperties.margins.bottom,
      10
    )
  )
  .attr("fill", "green");

svg
  .append("text")
  .attr("x", fontProperties.margins.right)
  .attr("y", fontProperties.margins.top + td.baseLine)
  .attr("font-family", fontProperties.family)
  .attr("font-size", fontProperties.size)
  .attr("fill", "white")
  .text(message);

function path(width, height, borderRadius) {
  const minWidth = 60 + borderRadius;
  const minHeight = 2 * borderRadius;
  const calcWidth = Math.max(width, minWidth);
  const calcHeight = Math.max(height, minHeight);

  return `M 0 ${borderRadius}
          A ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} 0
          L 20 0
          L 25 5
          L 45 5
          L 50 0
          L ${calcWidth - borderRadius} 0
          A ${borderRadius} ${borderRadius} 0 0 1 ${calcWidth} ${borderRadius}
          L ${calcWidth} ${calcHeight - borderRadius}
          A ${borderRadius} ${borderRadius} 0 0 1 ${calcWidth -
    borderRadius} ${calcHeight}
          L 50 ${calcHeight} 
          L 45 ${calcHeight + 5}
          L 25 ${calcHeight + 5}
          L 20 ${calcHeight}
          L ${borderRadius} ${calcHeight}
          A ${borderRadius} ${borderRadius} 0 0 1 0 ${calcHeight - borderRadius}
          Z`;
}
