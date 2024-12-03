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

// Pie Chart Update Function
function updatePieChart(attribute) {
  d3.csv("covid.csv").then(function (data) {
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
      .attr("transform", `translate(${dimensions.width / 2}, ${dimensions.height / 2})`);

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
      .attr("transform", (d, i) => `translate(-${dimensions.radius + 400}, ${-dimensions.radius + i * 30})`);

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
      .attr("text-anchor", "start")
      .text(d => `${d.attribute}: ${d.count} (${((d.count / total) * 100).toFixed(1)}%)`);

    legend.select("rect")
      .attr("fill", d => color(d.attribute));

    legend.select("text")
      .text(d => `${d.attribute}: ${d.count} (${((d.count / total) * 100).toFixed(1)}%)`);

    legend.exit().remove();
  });
}

// Bar Chart Update Function
function updateBarChart(attribute) {
  d3.csv("covid.csv").then(function (data) {
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
      .attr("transform", `translate(0, ${dimensions.height - dimensions.margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", dimensions.width / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .text(attribute.charAt(0).toUpperCase() + attribute.slice(1).replace(/_/g, " "));

    svg.append("g")
      .attr("transform", `translate(${dimensions.margin.left}, 0)`)
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

// Initial chart display
showChart('piechart');
