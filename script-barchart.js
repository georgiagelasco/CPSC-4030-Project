function updateBarChart(attribute) {
    d3.csv("covid.csv").then(function(data) {
      var dimensions = {
        width: 1000,
        height: 600,
        margin: {
          top: 10,
          bottom: 50,
          right: 10,
          left: 50
        }
      };
  
      var svg = d3.select("#barchart")
        .style("width", dimensions.width)
        .style("height", dimensions.height);
        svg.selectAll("*").remove(); // Clears all elements before rendering new ones

  
      // Clear previous bars before rendering new ones
      svg.selectAll(".bar").remove(); // Remove all previous bars
  
      // Initialize an empty dictionary to store counts
      var attributeCounts = {};
      data.forEach(row => {
        var attributeValue = row[attribute]; // Use selected attribute
        if (attributeCounts[attributeValue]) {
          attributeCounts[attributeValue]++;
        } else {
          attributeCounts[attributeValue] = 1;
        }
      });
  
      // Sort data by count
      var sortedData = Object.entries(attributeCounts)
        .sort((a, b) => b[1] - a[1]); // Sort by count in descending order
  
      // Set up xScale using scaleBand for categorical data
      var xScale = d3.scaleBand()
        .domain(sortedData.map(d => d[0])) // Use attribute values
        .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
        .padding(0.1);
  
      // Set up yScale based on the maximum count
      var yScale = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d[1])])
        .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);
  
      // Create x-axis
      var xAxis = d3.axisBottom(xScale);
      svg.append("g")
        .attr("transform", `translate(0, ${dimensions.height - dimensions.margin.bottom})`)
        .call(xAxis)
        .append("text")
        .attr("x", dimensions.width / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .text(attribute.charAt(0).toUpperCase() + attribute.slice(1).replace(/_/g, " "));
  
      // Create y-axis
      var yAxis = d3.axisLeft(yScale);
      svg.append("g")
        .attr("transform", `translate(${dimensions.margin.left}, 0)`)
        .call(yAxis)
        .append("text")
        .attr("x", -dimensions.height / 2)
        .attr("y", -35)
        .attr("transform", "rotate(-90)")
        .attr("fill", "black")
        .text("Count");
  
      // Draw bars using attributeCounts
      svg.selectAll(".bar")
        .data(sortedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d[0])) // d[0] is the attribute value
        .attr("y", d => yScale(d[1])) // d[1] is the count
        .attr("width", xScale.bandwidth()) // Set bar width based on scaleBand
        .attr("height", d => dimensions.height - dimensions.margin.bottom - yScale(d[1]))
        .attr("fill", "red");
    });
  }
  