import { select } from "d3";
import { CBlock, BlockSequence, Text, CommandBlock } from "./blocks";

const messages = [
  "This is the first",
  "This is the second",
  "This is the third"
];

const block = new BlockSequence([
  new CommandBlock(new Text("Beginning")),
  new CBlock(
    new Text("Outer"),
    new BlockSequence([
      ...messages.map(m => new CommandBlock(new Text(m))),
      new CBlock(
        new Text("Inner"),
        new BlockSequence([...messages.map(m => new CommandBlock(new Text(m)))])
      ),
      new CommandBlock(new Text("This is another"))
    ])
  ),
  new CommandBlock(new Text("Ending"))
]);

const svg = select("body")
  .append("svg")
  .attr("width", block.width)
  .attr("height", block.height + 35);

block.draw(svg);
