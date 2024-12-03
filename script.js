<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Covid-19 Data Visualization</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
      body {
        background-color: #ADD8E6; 
        font-family: 'Roboto', sans-serif;
        color: #333;
        text-align: center;
        margin: 0;
        padding: 0;
      }

      h1 {
        margin: 20px 0;
        font-size: 2em;
        color: #222;
      }

      button {
        padding: 10px 20px;
        margin: 5px;
        border: none;
        background-color: #007BFF;
        color: white;
        font-size: 1em;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 0.3s;
      }

      button:hover {
        background-color: #0056b3;
      }

      button.active-button {
        background-color: #4CAF50;
        color: white;
      }

      svg {
        width: 90%;
        height: auto;
        display: none;
        margin: auto;
      }

      .active {
        display: block;
      }

      #dropdown-container {
        margin-top: 10px;
        display: none;
      }

      select {
        padding: 5px;
        font-size: 1em;
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <h1>Covid-19 Data Visualization</h1>

    <div>
      <button onclick="showChart('piechart')">Show Pie Chart</button>
      <button onclick="showChart('barchart')">Show Bar Chart</button>
      <button onclick="showChart('heatmap')">Show Heatmap</button>
    </div>

    <div id="dropdown-container">
      <label for="chart-dropdown">Choose an attribute: </label>
      <select id="chart-dropdown" onchange="updateDropdownSelection()"></select>
    </div>

    <div id="piechart"></div>
    <div id="barchart"></div>
    <div id="heatmap"></div>

    <script>
      // Function to show and hide charts
      function showChart(chartId) {
        document.querySelectorAll("div[id^='chart']").forEach(chart => {
          chart.style.display = "none";
        });

        document.getElementById(chartId).style.display = "block";

        const dropdownContainer = document.getElementById("dropdown-container");
        if (chartId === "piechart" || chartId === "barchart") {
          dropdownContainer.style.display = "block";
          populateDropdown();
        } else {
          dropdownContainer.style.display = "none";
        }
      }

      // Populate dropdown options for pie chart and bar chart
      function populateDropdown() {
        const dropdown = document.getElementById("chart-dropdown");
        const attributes = ["sex", "age_group", "race_ethnicity_combined", "hosp_yn", "icu_yn", "death_yn", "medcond_yn"];
        dropdown.innerHTML = "";
        attributes.forEach(attr => {
          const option = document.createElement("option");
          option.value = attr;
          option.textContent = attr.charAt(0).toUpperCase() + attr.slice(1).replace(/_/g, " ");
          dropdown.appendChild(option);
        });
        dropdown.value = attributes[0];
      }

      // Function to handle dropdown selection
      function updateDropdownSelection() {
        const dropdown = document.getElementById("chart-dropdown");
        const selectedValue = dropdown.value;

        if (document.getElementById("piechart").style.display === "block") {
          updatePieChart(selectedValue);
        } else if (document.getElementById("barchart").style.display === "block") {
          updateBarChart(selectedValue);
        }
      }

      // Initial chart display
      showChart('piechart');

      // Pie Chart Update Function
      function updatePieChart(attribute) {
        d3.csv("covid.csv").then(function(data) {
          const dimensions = {
            width: 800,
            height: 800,
            radius: Math.min(800, 800) / 2 * 0.5
          };

          d3.select("#piechart").selectAll("*").remove();
          const svg = d3.select("#piechart")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .append("g")
            .attr("transform", translate(${dimensions.width / 2}, ${dimensions.height / 2}));
          
          const color = d3.scaleOrdinal(d3.schemeCategory10);
          const pie = d3.pie().value(d => d.count);
          const arc = d3.arc().innerRadius(0).outerRadius(dimensions.radius);

          const groupedData = d3.rollup(data, v => v.length, d => d[attribute]);
          const filteredData = Array.from(groupedData, ([key, value]) => ({ attribute: key, count: value }));

          const slices = svg.selectAll("path").data(pie(filteredData));

          slices.enter()
            .append("path")
            .merge(slices)
            .transition()
            .duration(1000)
            .attr("d", arc)
            .attr("fill", d => color(d.data.attribute))
            .attr("stroke", "white")
            .attr("stroke-width", 2);

          slices.exit().remove();

          const total = d3.sum(filteredData, d => d.count);
          const legend = svg.selectAll(".legend")
            .data(filteredData);

          const legendEnter = legend.enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => translate(-${dimensions.radius + 400}, ${-dimensions.radius + i * 30}));

          legendEnter.append("rect")
            .attr("x", dimensions.radius + 10)
            .attr("y", 0)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", d => color(d.attribute));

          legendEnter.append("text")
            .attr("x", dimensions.radius + 35)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .style("text-anchor", "start")
            .text(d => ${d.attribute}: ${d.count} (${((d.count / total) * 100).toFixed(1)}%));

          legend.select("rect")
            .attr("fill", d => color(d.attribute));

          legend.select("text")
            .text(d => ${d.attribute}: ${d.count} (${((d.count / total) * 100).toFixed(1)}%));

          legend.exit().remove();
        });
      }

      // Bar Chart Update Function
      function updateBarChart(attribute) {
        d3.csv("covid.csv").then(function(data) {
          const dimensions = {
            width: 1000,
            height: 600,
            margin: { top: 10, bottom: 50, right: 10, left: 50 }
          };

          const svg = d3.select("#barchart")
            .style("width", dimensions.width)
            .style("height", dimensions.height);
          svg.selectAll("*").remove();

          const attributeCounts = {};
          data.forEach(row => {
            const attributeValue = row[attribute];
            attributeCounts[attributeValue] = (attributeCounts[attributeValue] || 0) + 1;
          });

          const sortedData = Object.entries(attributeCounts)
            .sort((a, b) => b[1] - a[1]);

          const xScale = d3.scaleBand()
            .domain(sortedData.map(d => d[0]))
            .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
            .padding(0.1);

          const yScale = d3.scaleLinear()
            .domain([0, d3.max(sortedData, d => d[1])])
            .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

          svg.append("g")
            .attr("transform", translate(0, ${dimensions.height - dimensions.margin.bottom}))
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("x", dimensions.width / 2)
            .attr("y", 40)
            .attr("fill", "black")
            .text(attribute.charAt(0).toUpperCase() + attribute.slice(1).replace(/_/g, " "));

          svg.append("g")
            .attr("transform", translate(${dimensions.margin.left}, 0))
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("x", -dimensions.height / 2)
            .attr("y", -35)
            .attr("transform", "rotate(-90)")
            .attr("fill", "black")
            .text("Count");

          svg.selectAll(".bar")
            .data(sortedData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d[0]))
            .attr("y", d => yScale(d[1]))
            .attr("width", xScale.bandwidth())
            .attr("height", d => dimensions.height - dimensions.margin.bottom - yScale(d[1]))
            .attr("fill", "red");
        });
      }

      // Heatmap Update Function
      function updateHeatmap() {
        d3.csv("covid.csv").then(function(data) {
          const dimensions = {
            margin: { top: 50, bottom: 100, right: 50, left: 100 },
            cellSize: 50,
            width: 0,
            height: 0
          };

          const ageGroups = Array.from(new Set(data.map(d => d.age_group)));
          const raceEthnicities = Array.from(new Set(data.map(d => ${d.race} (${d.ethnicity}))));

          dimensions.width = raceEthnicities.length * dimensions.cellSize;
          dimensions.height = ageGroups.length * dimensions.cellSize;




          function updateHeatmap(){
              d3.select("#heatmap").classed("active", true);

              // Select the existing SVG or append one
              const svg = d3.select("#heatmap");
          
              // Append a rectangle
              svg.append("rect")
                  .attr("x", 50)
                  .attr("y", 50)
                  .attr("width", 200)
                  .attr("height", 100)
                  .attr("fill", "blue")
                  .attr("stroke", "red")
                  .attr("stroke-width", 2);
                    }
          updateHeatmap();

  /*
    // Heatmap Update Function
      function updateHeatmap() {
        d3.csv("covid.csv").then(function(data) {
          const dimensions = {
            margin: { top: 50, bottom: 100, right: 50, left: 100 },
            cellSize: 50,
            width: 0,
            height: 0
          };

          const ageGroups = Array.from(new Set(data.map(d => d.age_group)));
          const raceEthnicities = Array.from(new Set(data.map(d => `${d.race} (${d.ethnicity})`)));

          dimensions.width = raceEthnicities.length * dimensions.cellSize;
          dimensions.height = ageGroups.length * dimensions.cellSize;

          const svg = d3.select("#heatmap")
            .style("width", dimensions.width + "px")
            .style("height", dimensions.height + "px");

          svg.selectAll("*").remove();

          const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, d3.max(ageGroups, function(d) {
              return raceEthnicities.map(function(race) {
                return data.filter(function(row) {
                  return row.age_group === d && row.race === race;
                }).length;
              });
            })]);

          const grid = svg.append("g");

          grid.selectAll("rect")
            .data(ageGroups)
            .enter()
            .append("g")
            .attr("transform", function(d, i) {
              return `translate(0, ${i * dimensions.cellSize})`;
            })
            .selectAll("rect")
            .data(function(ageGroup) {
              return raceEthnicities.map(function(race) {
                return {
                  ageGroup: ageGroup,
                  race: race,
                  value: data.filter(function(row) {
                    return row.age_group === ageGroup && row.race === race;
                  }).length
                };
              });
            })
            .enter()
            .append("rect")
            .attr("x", function(d, i) { return i * dimensions.cellSize; })
            .attr("y", 0)
            .attr("width", dimensions.cellSize)
            .attr("height", dimensions.cellSize)
            .attr("fill", d => colorScale(d.value))
            .attr("stroke", "white");

          // Labels for the heatmap
          svg.selectAll(".xLabel")
            .data(raceEthnicities)
            .enter()
            .append("text")
            .attr("class", "xLabel")
            .attr("x", (d, i) => i * dimensions.cellSize + dimensions.cellSize / 2)
            .attr("y", dimensions.height - 10)
            .attr("text-anchor", "middle")
            .text(d => d);

          svg.selectAll(".yLabel")
            .data(ageGroups)
            .enter()
            .append("text")
            .attr("class", "yLabel")
            .attr("x", 0)
            .attr("y", (d, i) => i * dimensions.cellSize + dimensions.cellSize / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(d => d);
        });
      }
          */
    </script>
  </body>
</html>
