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
      .style("height", dimensions.height + "px")
      .selectAll("*").remove();

    const xScale = d3.scaleBand()
      .domain(raceEthnicities)
      .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(ageGroups)
      .range([dimensions.margin.top, dimensions.height - dimensions.margin.bottom])
      .padding(0.05);

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(data, d => d.count)]);

    // Count occurrences of age group and race/ethnicity
    const heatmapData = {};
    data.forEach(d => {
      const key = `${d.age_group}-${d.race} (${d.ethnicity})`;
      heatmapData[key] = (heatmapData[key] || 0) + 1;
    });

    // Create the heatmap cells
    svg.selectAll(".cell")
      .data(Object.entries(heatmapData))
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", ([key, count]) => xScale(key.split('-')[1]))
      .attr("y", ([key, count]) => yScale(key.split('-')[0]))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", ([key, count]) => colorScale(count))
      .attr("stroke", "white")
      .attr("stroke-width", 1);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0, ${dimensions.height - dimensions.margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .attr("transform", `translate(${dimensions.margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

  });
}

// Initial chart display
showChart('piechart');
