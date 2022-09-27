import * as d3 from "d3";
import csv from "./data/bereal.csv";

window.onload = () => {
  const iso = d3.timeParse("%Y-%m-%d");
  const data = csv.map((d) => ({ ...d, date: iso(d.date) }));

  const graphic = d3.select("#graphic");

  graphic
    .selectAll("div")
    .data(data)
    .join("div")
    .each(function (d) {
      const parent = d3.select(this);
      parent.attr("class", (d) => `mini parent ${d.activity}`);
      const child = parent.append("div").attr("class", "child");

      let hat = `var(--${d.hat ? "" : "not-"}wearing)`;
      let mask = `var(--${d.mask ? "" : "not-"}wearing)`;

      if (d.hat === null) {
        hat = "transparent";
      }

      if (d.mask === null) {
        mask = "transparent";
      }

      child.style(
        "background",
        `linear-gradient(to bottom, ${hat} 0, ${hat} 50%, ${mask} 50%, ${mask} 100%)`
      );

      if (d.activity === null) {
        parent.style("border-style", "dashed");
        child.style("border-style", "dashed");
      }
    });

  graphic.select("div").style("grid-column", 5);
};