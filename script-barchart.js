d3.csv("covid.csv").then(function(dataset) {
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

    // Initialize an empty dictionary to store counts
    var ageGroupCounts = {};
    dataset.forEach(row => {
        var ageGroup = row.age_group; // Assuming 'age_group' is the column name
        if (ageGroupCounts[ageGroup]) {
            ageGroupCounts[ageGroup]++;
        } else {
            ageGroupCounts[ageGroup] = 1;
        }
    });

    // Set up xScale using scaleBand for categorical data
    var xScale = d3.scaleBand()
        .domain(Object.keys(ageGroupCounts)) // Use age group keys from the dictionary
        .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
        .padding(0.1); // Add padding between bars

    // Set up yScale based on the maximum count
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(ageGroupCounts))])
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
        .text("Age Bracket");

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
        .text("Number of COVID Cases");

    // Draw bars using ageGroupCounts
    svg.selectAll(".bar")
        .data(Object.entries(ageGroupCounts)) // Convert dictionary to array of [key, value] pairs
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d[0])) // d[0] is the age group
        .attr("y", d => yScale(d[1])) // d[1] is the count
        .attr("width", xScale.bandwidth()) // Set bar width based on scaleBand
        .attr("height", d => dimensions.height - dimensions.margin.bottom - yScale(d[1]))
        .attr("fill", "red");
});
