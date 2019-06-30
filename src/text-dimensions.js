import { select } from "d3";
import { fontProperties } from "./constants";

const textSvg = select("body")
  .append("svg")
  .attr("width", 0)
  .attr("height", 0);

export default function textDimensions(text) {
  var result;

  textSvg
    .append("text")
    .attr("font-family", fontProperties.family)
    .attr("font-size", fontProperties.size)
    .text(text)
    .each(function() {
      result = this.getBBox();
      this.remove();
    });

  return {
    width: result.width,
    height: result.height,
    baseLine: -result.y
  };
}
