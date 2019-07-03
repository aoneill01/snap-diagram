import { select, easeCubicOut } from "d3";
import textDimensions from "./text-dimensions";
import { fontProperties, blockProperties } from "./constants";

export class Text {
  constructor(text) {
    this.text = text;
    this.textDimensions = textDimensions(this.text);
  }

  get width() {
    return (
      this.textDimensions.width +
      fontProperties.margins.left +
      fontProperties.margins.right
    );
  }

  get height() {
    return (
      this.textDimensions.height +
      fontProperties.margins.top +
      fontProperties.margins.bottom
    );
  }

  draw(svg, x, y) {
    svg
      .append("text")
      .attr("x", x + fontProperties.margins.right)
      .attr("y", y + fontProperties.margins.top + this.textDimensions.baseLine)
      .attr("font-family", fontProperties.family)
      .attr("font-size", fontProperties.size)
      .attr("fill", "white")
      .text(this.text);
  }
}

export class CommandBlock {
  constructor(text) {
    this.text = text;
  }

  get width() {
    const minWidth = 60 + blockProperties.borderRadius;
    return Math.max(this.text.width, minWidth);
  }

  get height() {
    const minHeight = 2 * blockProperties.borderRadius;
    return Math.max(this.text.height, minHeight);
  }

  get path() {
    return `M 0 ${blockProperties.borderRadius}
            A ${blockProperties.borderRadius} ${
      blockProperties.borderRadius
    } 0 0 1 ${blockProperties.borderRadius} 0
            L 20 0
            L 25 5
            L 45 5
            L 50 0
            L ${this.width - blockProperties.borderRadius} 0
            A ${blockProperties.borderRadius} ${
      blockProperties.borderRadius
    } 0 0 1 ${this.width} ${blockProperties.borderRadius}
            L ${this.width} ${this.height - blockProperties.borderRadius}
            A ${blockProperties.borderRadius} ${
      blockProperties.borderRadius
    } 0 0 1 ${this.width - blockProperties.borderRadius} ${this.height}
            L ${50 - blockProperties.offset / Math.SQRT2} ${this.height} 
            L ${45 - blockProperties.offset / Math.SQRT2} ${this.height + 5}
            L ${25 + blockProperties.offset / Math.SQRT2} ${this.height + 5}
            L ${20 + blockProperties.offset / Math.SQRT2} ${this.height}
            L ${blockProperties.borderRadius} ${this.height}
            A ${blockProperties.borderRadius} ${
      blockProperties.borderRadius
    } 0 0 1 0 ${this.height - blockProperties.borderRadius}
            Z`;
  }

  draw(svg) {
    svg
      .append("path")
      .attr("d", this.path)
      .attr("fill", "#6ea5ff");

    this.text.draw(svg, 0, 0);
  }
}

export class CBlock {
  constructor(text, blockSequence) {
    this.text = text;
    this.blockSequence = blockSequence;
  }

  get width() {
    return Math.max(this.text.width, 10 + this.blockSequence.width);
  }

  get height() {
    return (
      this.text.height +
      this.blockSequence.height +
      2 * blockProperties.offset +
      20
    );
  }

  get path() {
    return `M 0 ${blockProperties.borderRadius}
            A ${blockProperties.borderRadius} ${
      blockProperties.borderRadius
    } 0 0 1 ${blockProperties.borderRadius} 0
            L 20 0
            L 25 5
            L 45 5
            L 50 0
            L ${this.width - blockProperties.borderRadius} 0
            A ${blockProperties.borderRadius} ${
      blockProperties.borderRadius
    } 0 0 1 ${this.width} ${blockProperties.borderRadius}
            L ${this.width} ${this.text.height - blockProperties.borderRadius}
            A ${blockProperties.borderRadius} ${
      blockProperties.borderRadius
    } 0 0 1 ${this.width - blockProperties.borderRadius} ${this.text.height}
            L ${60 - blockProperties.offset / Math.SQRT2} ${this.text.height} 
            L ${55 - blockProperties.offset / Math.SQRT2} ${this.text.height +
      5}
            L ${35 + blockProperties.offset / Math.SQRT2} ${this.text.height +
      5}
            L ${30 + blockProperties.offset / Math.SQRT2} ${this.text.height}
            L ${blockProperties.borderRadius + 10} ${this.text.height}
            A ${blockProperties.borderRadius +
              blockProperties.offset} ${blockProperties.borderRadius +
      blockProperties.offset} 0 0 0 ${10 - blockProperties.offset} ${this.text
      .height +
      blockProperties.borderRadius +
      blockProperties.offset}
            L ${10 - blockProperties.offset} ${this.height -
      blockProperties.borderRadius -
      blockProperties.offset -
      20}
            A ${blockProperties.borderRadius +
              blockProperties.offset} ${blockProperties.borderRadius +
      blockProperties.offset} 0 0 0 ${10 + blockProperties.borderRadius} ${this
      .height - 20}
            L 30 ${this.height - 20}
            L 35 ${this.height - 15} 
            L 55 ${this.height - 15}
            L 60 ${this.height - 20}
            L ${this.width - blockProperties.borderRadius} ${this.height - 20}
            A ${blockProperties.borderRadius} ${
      blockProperties.borderRadius
    } 0 0 1 ${this.width} ${this.height - 20 + blockProperties.borderRadius}
            L ${this.width} ${this.height - blockProperties.borderRadius}
            A ${blockProperties.borderRadius} ${
      blockProperties.borderRadius
    } 0 0 1 ${this.width - blockProperties.borderRadius} ${this.height}
            L ${50 - blockProperties.offset / Math.SQRT2} ${this.height} 
            L ${45 - blockProperties.offset / Math.SQRT2} ${this.height + 5}
            L ${25 + blockProperties.offset / Math.SQRT2} ${this.height + 5}
            L ${20 + blockProperties.offset / Math.SQRT2} ${this.height}
            L ${blockProperties.borderRadius} ${this.height}
            A ${blockProperties.borderRadius} ${
      blockProperties.borderRadius
    } 0 0 1 0 ${this.height - blockProperties.borderRadius}
            Z`;
  }

  draw(svg) {
    svg
      .append("path")
      .attr("d", this.path)
      .attr("fill", "#8d42f5");

    this.text.draw(svg, 0, 0);

    const g = svg
      .append("g")
      .attr(
        "transform",
        d => `translate(10,${this.text.height + blockProperties.offset})`
      );

    this.blockSequence.draw(g);
  }
}

export class BlockSequence {
  constructor(blocks) {
    this.blocks = BlockSequence.blockInfo(blocks);
  }

  get width() {
    return Math.max(...this.blocks.map(b => b.block.width));
  }

  get height() {
    return (
      this.blocks[this.blocks.length - 1].offsetY +
      this.blocks[this.blocks.length - 1].block.height
    );
  }

  draw(svg) {
    svg
      .selectAll("g")
      .data(this.blocks)
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
        d.block.draw(select(this));
      });
  }

  static blockInfo(blocks) {
    const result = [];

    for (let block of blocks) {
      result.push({
        block,
        offsetY: result.reduce(
          (acc, d) => acc + d.block.height + blockProperties.offset,
          0
        )
      });
    }

    return result;
  }
}
