import { select, easeCubicOut } from "d3";
import textDimensions from "./text-dimensions";
import { fontProperties, blockProperties } from "./constants";

export function drawCommands(svg, messages) {
  svg
    .selectAll("g")
    .data(commandsData(messages))
    .enter()
    .append("g")
    .attr("transform", d => `translate(0,${d.offsetY + 30})`)
    .attr("opacity", 0.0)
    .transition()
    .duration(500)
    .ease(easeCubicOut)
    .delay((d, i) => i * 100)
    .attr("transform", d => `translate(0,${d.offsetY})`)
    .attr("opacity", 1.0)
    .each(function(d) {
      drawCommand(select(this), d.message);
    });
}

export function commandsDimensions(messages) {
  const data = commandsData(messages);

  return {
    height: data[data.length - 1].offsetY + data[data.length - 1].height,
    width: Math.max(...data.map(d => d.width))
  };
}

function commandsData(messages) {
  const data = [];

  for (let message of messages) {
    const dimensions = commandDimensions(message);
    data.push({
      message,
      height: dimensions.height,
      width: dimensions.width,
      offsetY: data.reduce(
        (acc, d) => acc + d.height + blockProperties.offset,
        0
      )
    });
  }

  return data;
}

export function drawCommand(svg, message) {
  const dimensions = commandDimensions(message);
  const td = textDimensions(message);

  svg
    .append("path")
    .attr("d", commandPath(dimensions.width, dimensions.height))
    .attr("fill", "#6ea5ff");

  svg
    .append("text")
    .attr("x", fontProperties.margins.right)
    .attr("y", fontProperties.margins.top + td.baseLine)
    .attr("font-family", fontProperties.family)
    .attr("font-size", fontProperties.size)
    .attr("fill", "white")
    .text(message);
}

function commandDimensions(message) {
  const td = textDimensions(message);
  const minWidth = 60 + blockProperties.borderRadius;
  const minHeight = 2 * blockProperties.borderRadius;

  return {
    width: Math.max(
      td.width + fontProperties.margins.right + fontProperties.margins.left,
      minWidth
    ),
    height: Math.max(
      td.height + fontProperties.margins.top + fontProperties.margins.bottom,
      minHeight
    )
  };
}

function commandPath(width, height) {
  return `M 0 ${blockProperties.borderRadius}
            A ${blockProperties.borderRadius} ${
    blockProperties.borderRadius
  } 0 0 1 ${blockProperties.borderRadius} 0
            L 20 0
            L 25 5
            L 45 5
            L 50 0
            L ${width - blockProperties.borderRadius} 0
            A ${blockProperties.borderRadius} ${
    blockProperties.borderRadius
  } 0 0 1 ${width} ${blockProperties.borderRadius}
            L ${width} ${height - blockProperties.borderRadius}
            A ${blockProperties.borderRadius} ${
    blockProperties.borderRadius
  } 0 0 1 ${width - blockProperties.borderRadius} ${height}
            L ${50 - blockProperties.offset / Math.SQRT2} ${height} 
            L ${45 - blockProperties.offset / Math.SQRT2} ${height + 5}
            L ${25 + blockProperties.offset / Math.SQRT2} ${height + 5}
            L ${20 + blockProperties.offset / Math.SQRT2} ${height}
            L ${blockProperties.borderRadius} ${height}
            A ${blockProperties.borderRadius} ${
    blockProperties.borderRadius
  } 0 0 1 0 ${height - blockProperties.borderRadius}
            Z`;
}

export function drawCBlock(svg, message, messages) {
  const dimensions = cBlockDimensions(message, messages);
  const td = textDimensions(message);

  svg
    .append("path")
    .attr(
      "d",
      cBlockPath(
        dimensions.width,
        td.height + fontProperties.margins.top + fontProperties.margins.bottom,
        dimensions.height
      )
    )
    .attr("fill", "#8d42f5");

  svg
    .append("text")
    .attr("x", fontProperties.margins.right)
    .attr("y", fontProperties.margins.top + td.baseLine)
    .attr("font-family", fontProperties.family)
    .attr("font-size", fontProperties.size)
    .attr("fill", "white")
    .text(message);

  const g = svg
    .append("g")
    .attr(
      "transform",
      d =>
        `translate(10,${td.height +
          fontProperties.margins.top +
          fontProperties.margins.bottom +
          blockProperties.offset})`
    );

  drawCommands(g, messages);
}

function cBlockPath(width, height, height2) {
  return `M 0 ${blockProperties.borderRadius}
            A ${blockProperties.borderRadius} ${
    blockProperties.borderRadius
  } 0 0 1 ${blockProperties.borderRadius} 0
            L 20 0
            L 25 5
            L 45 5
            L 50 0
            L ${width - blockProperties.borderRadius} 0
            A ${blockProperties.borderRadius} ${
    blockProperties.borderRadius
  } 0 0 1 ${width} ${blockProperties.borderRadius}
            L ${width} ${height - blockProperties.borderRadius}
            A ${blockProperties.borderRadius} ${
    blockProperties.borderRadius
  } 0 0 1 ${width - blockProperties.borderRadius} ${height}
            L ${60 - blockProperties.offset / Math.SQRT2} ${height} 
            L ${55 - blockProperties.offset / Math.SQRT2} ${height + 5}
            L ${35 + blockProperties.offset / Math.SQRT2} ${height + 5}
            L ${30 + blockProperties.offset / Math.SQRT2} ${height}
            L ${blockProperties.borderRadius + 10} ${height}
            A ${blockProperties.borderRadius +
              blockProperties.offset} ${blockProperties.borderRadius +
    blockProperties.offset} 0 0 0 ${10 - blockProperties.offset} ${height +
    blockProperties.borderRadius +
    blockProperties.offset}
            L ${10 - blockProperties.offset} ${height2 -
    blockProperties.borderRadius -
    blockProperties.offset}
            A ${blockProperties.borderRadius +
              blockProperties.offset} ${blockProperties.borderRadius +
    blockProperties.offset} 0 0 0 ${10 +
    blockProperties.borderRadius} ${height2}
            L 0 ${height2}
            Z`;
}

export function cBlockDimensions(message, messages) {
  const td = textDimensions(message);
  const cd = commandsDimensions(messages);

  return {
    width: Math.max(
      td.width + fontProperties.margins.right + fontProperties.margins.left,
      10 + cd.width
    ),
    height:
      td.height +
      fontProperties.margins.top +
      fontProperties.margins.bottom +
      blockProperties.offset * 2 +
      cd.height
  };
}
