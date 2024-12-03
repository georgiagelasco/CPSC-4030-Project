function updatePieChart(attribute) {
    d3.csv("covid.csv").then(function(data) {
      var dimensions = {
        width: 800,  // Increased width
        height: 800, // Increased height
        radius: Math.min(800, 800) / 2 * 0.5  // Adjust radius to fit within the larger container
      };
  
      d3.select("#piechart").selectAll("*").remove()
      // Create SVG container
      var svg = d3.select("#piechart")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .append("g")
        .attr("transform", `translate(${dimensions.width / 2}, ${dimensions.height / 2})`);
        
        svg.selectAll("*").remove(); // Clears all elements before rendering new ones
      // Initialize color scale
      var color = d3.scaleOrdinal(d3.schemeCategory10);
  
      // Initialize pie and arc generators
      var pie = d3.pie().value(d => d.count);
      var arc = d3.arc().innerRadius(0).outerRadius(dimensions.radius);
  
      // Group data by the selected attribute
      var groupedData = d3.rollup(
        data,
        v => v.length,
        d => d[attribute]
      );
  
      var filteredData = Array.from(groupedData, ([key, value]) => ({
        attribute: key,
        count: value
      }));
  
      // Bind data to the pie chart slices
      var slices = svg.selectAll("path").data(pie(filteredData));
  
      // Enter new slices
      slices.enter()
        .append("path")
        .merge(slices)
        .transition()
        .duration(1000)
        .attr("d", arc)
        .attr("fill", d => color(d.data.attribute))
        .attr("stroke", "white")
        .attr("stroke-width", 2);
  
      // Remove unused slices
      slices.exit().remove();
  
      // Create or update the legend
      var total = d3.sum(filteredData, d => d.count); // Calculate total for percentage calculation
      var legend = svg.selectAll(".legend")
        .data(filteredData);
  
      // Enter new legend items
      var legendEnter = legend.enter()
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
        .style("text-anchor", "start")
        .text(d => `${d.attribute}: ${d.count} (${((d.count / total) * 100).toFixed(1)}%)`);
  
      // Update existing legend items
      legend.select("rect")
        .attr("fill", d => color(d.attribute));
  
      legend.select("text")
        .text(d => `${d.attribute}: ${d.count} (${((d.count / total) * 100).toFixed(1)}%)`);
  
      // Remove unused legend items
      legend.exit().remove();
    });
  }
  