d3.csv("covid.csv").then(function (dataset) {
    var dimensions = {
        width: 1000,
        height: 600,
        margin: {
            top: 10,
            bottom: 50,
            right: 10,
            left: 50,
        },
    };

    // Create SVG container
    var svg = d3.select("#barchart")
        .style("width", dimensions.width)
        .style("height", dimensions.height);

    // Add dropdown for attribute selection
    var dropdown = d3.select("body")
        .insert("div", "#barchart")
        .style("text-align", "center")
        .append("select")
        .on("change", function () {
            var selectedAttribute = d3.select(this).property("value");
            updateChart(selectedAttribute);
        });

    // Available attributes for grouping
    var attributes = [
        "age_group",
        "sex",
        "race_ethnicity_combined",
        "hosp_yn",
        "icu_yn",
        "death_yn",
    ];

    // Populate dropdown
    dropdown
        .selectAll("option")
        .data(attributes)
        .enter()
        .append("option")
        .attr("value", (d) => d)
        .text((d) => d.charAt(0).toUpperCase() + d.slice(1).replace(/_/g, " "));

    // Initialize scales
    var xScale = d3.scaleBand().range([dimensions.margin.left, dimensions.width - dimensions.margin.right]).padding(0.1);
    var yScale = d3.scaleLinear().range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

    // Create axes
    var xAxisGroup = svg
        .append("g")
        .attr("transform", `translate(0, ${dimensions.height - dimensions.margin.bottom})`);

    var yAxisGroup = svg.append("g").attr("transform", `translate(${dimensions.margin.left}, 0)`);

    // Function to update the chart
    function updateChart(attribute) {
        // Group data by the selected attribute
        var groupedData = d3.rollup(
            dataset,
            (v) => v.length,
            (d) => d[attribute]
        );

        var data = Array.from(groupedData, ([key, value]) => ({
            key: key || "Unknown", // Handle missing data
            value: value,
        }));

        // Sort data alphabetically
        data.sort((a, b) => d3.ascending(a.key, b.key));

        // Update scales
        xScale.domain(data.map((d) => d.key));
        yScale.domain([0, d3.max(data, (d) => d.value)]);

        // Update axes
        xAxisGroup.call(d3.axisBottom(xScale));
        yAxisGroup.call(d3.axisLeft(yScale));

        // Bind data to bars
        var bars = svg.selectAll(".bar").data(data);

        // Enter new bars
        bars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => xScale(d.key))
            .attr("y", (d) => yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => dimensions.height - dimensions.margin.bottom - yScale(d.value))
            .attr("fill", "red")
            .merge(bars) // Update existing bars
            .transition()
            .duration(1000)
            .attr("x", (d) => xScale(d.key))
            .attr("y", (d) => yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => dimensions.height - dimensions.margin.bottom - yScale(d.value));

        // Remove unused bars
        bars.exit().remove();
    }

    // Initialize the chart with the first attribute
    updateChart("age_group");
});
