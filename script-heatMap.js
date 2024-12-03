// Import data
d3.csv("covid.csv").then(function(data) {
    var dimensions = {
        margin: {
            top: 50,
            bottom: 100,
            right: 50,
            left: 100
        },
        cellSize: 50, // Adjust for better visualization
        width: 0,     // Will be calculated dynamically
        height: 0
    };

    // Extract unique age groups and race/ethnicities
    var ageGroups = Array.from(new Set(data.map(d => d.age_group)));
    var raceEthnicities = Array.from(new Set(data.map(d => `${d.race} (${d.ethnicity})`)));

    // Update width and height based on the data and cell size
    dimensions.width = raceEthnicities.length * dimensions.cellSize;
    dimensions.height = ageGroups.length * dimensions.cellSize;

    console.log(dimensions.height)
    console.log(dimensions.width)

    // Create SVG container
    const svg = d3.select("#heatmap")
        .append("svg")
        .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
        .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
        .append("g")
        .attr("transform", `translate(${dimensions.margin.left},${dimensions.margin.top})`);

    // Count occurrences of each age group and race/ethnicity combination
    var counts = d3.rollup(
        data,
        v => v.length,
        d => d.age_group,
        d => `${d.race} (${d.ethnicity})`
    );

    // Generate heatmap data
    var heatmapData = [];
    ageGroups.forEach((ageGroup, rowIndex) => {
        raceEthnicities.forEach((raceEthnicity, colIndex) => {
            var count = counts.get(ageGroup)?.get(raceEthnicity) || 0;
            heatmapData.push({ ageGroup, raceEthnicity, rowIndex, colIndex, count });
        });
    });

    // Define color scale
    var maxCount = d3.max(heatmapData, d => d.count);
    var colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, maxCount]);

    // Create grid cells
    svg.selectAll("rect")
        .data(heatmapData)
        .enter()
        .append("rect")
        .attr("x", d => d.colIndex * dimensions.cellSize)
        .attr("y", d => d.rowIndex * dimensions.cellSize)
        .attr("width", dimensions.cellSize)
        .attr("height", dimensions.cellSize)
        .style("fill", d => colorScale(d.count))
        .style("stroke", "#ccc");

    // Add labels for columns (race/ethnicities)
    svg.selectAll(".colLabel")
        .data(raceEthnicities)
        .enter()
        .append("text")
        .attr("class", "colLabel")
        .attr("x", (_, i) => i * dimensions.cellSize + dimensions.cellSize / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text(d => d);

    // Add labels for rows (age groups)
    svg.selectAll(".rowLabel")
        .data(ageGroups)
        .enter()
        .append("text")
        .attr("class", "rowLabel")
        .attr("x", -10)
        .attr("y", (_, i) => i * dimensions.cellSize + dimensions.cellSize / 2)
        .attr("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text(d => d);
});
