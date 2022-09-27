import * as d3 from "d3";
import csv from "./data/bereal.csv";

// make it look more like a calendar
// make everything smaller
// maybe limit it down to a month or two
// use something other than circles for wearing a mask and a hat
// consolidate categories
// give explanation for each category
// make things hoverable

window.onload = () => {
  const data = csv.map((d) => ({
    date: d.Date,
    circles: [
      { key: "mask", value: d.Mask },
      { key: "hat", value: d.Hat },
      { key: "activity", value: d.Activity },
    ],
  }));

  const activities = new Set([...csv.map((d) => d.Activity)]);
  activities.delete("");
  const color = d3
    .scaleOrdinal()
    .domain(activities)
    .range(d3.schemeCategory10)
    .unknown("transparent");

  const graphic = d3.select("#graphic");

  const legend = graphic.style("position", "relative").append("div");

  legend
    .style("position", "sticky")
    .style("top", 0)
    .style("background-color", "white")
    .style("padding", "1rem")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center")
    .style("flex-wrap", "wrap")
    .style("gap", "1rem")
    .selectAll("div")
    .data(color.domain())
    .join("div")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center")
    .style("gap", "0.25rem")
    .each(function (d) {
      const div = d3.select(this);
      div
        .append("div")
        .style("height", "25px")
        .style("width", "25px")
        .style("border-radius", "50%")
        .style("background-color", color(d));
      div.append("span").text(d);
    });

  const circles = legend
    .append("div")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center")
    .style("gap", "1rem");

  const tmp1 = circles
    .append("div")
    .style("display", "flex")
    .style("gap", "0.5rem");
  tmp1
    .append("div")
    .style("width", "20px")
    .style("height", "20px")
    .style("border-radius", "50%")
    .style("border", "1px dashed black");
  tmp1.append("div").text("Wearing a hat");

  const tmp2 = circles
    .append("div")
    .style("display", "flex")
    .style("gap", "0.5rem");
  tmp2
    .append("div")
    .style("width", "20px")
    .style("height", "20px")
    .style("border-radius", "50%")
    .style("border", "1px solid black");
  tmp2.append("div").text("Wearing a mask");

  const radius = {
    mask: 8,
    hat: 8,
    activity: 20,
  };

  graphic
    .append("figure")
    .style("place-items", "center")
    .selectAll("div")
    .data(data)
    .join("div")
    .each(function (datum) {
      const div = d3.select(this);

      div.append("p").text(datum.date).style("font-weight", "bold");

      const width = 125;
      const height = width;
      const svg = div.append("svg").attr("width", width).attr("height", height);

      svg.each(simulation);

      function simulation(d) {
        let x = width / 2;
        let y = height / 2;

        let sim = d3
          .forceSimulation(d.circles)
          .force("charge", d3.forceManyBody().strength(0))
          .force("center", d3.forceCenter(x, y))
          .force(
            "collision",
            d3.forceCollide().radius((d) => radius[d.key])
          );

        sim.tick(1000);
        ticked(d3.select(this), d.circles);
      }

      function ticked(selection, d) {
        let u = selection.selectAll("circle").data(d);

        u.enter()
          .append("circle")
          .attr("r", (d) => radius[d.key])
          .merge(u)
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("fill", (d) =>
            d.key === "activity" ? color(d.value) : `transparent`
          )
          .attr("stroke", (d) => {
            if (d.key === "mask" || d.key === "hat") {
              return d.value ? "black" : "transparent";
            }
          })
          .attr("stroke-width", (d) => {
            if (d.key === "mask" || d.key === "hat") {
              return "2px";
            }
          })
          .attr("stroke-dasharray", (d) => {
            if (d.key === "hat") {
              return "2,2";
            }
          });

        u.exit().remove();
      }
    });
};
