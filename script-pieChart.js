d3.csv("covid.csv").then(function(data) {
    var dimensions = {
        width: 500,
        height: 500,
        radius: Math.min(500, 500) / 2
    };

    // Create SVG container
    var svg = d3.select("#piechart")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .append("g")
        .attr("transform", `translate(${dimensions.width / 2}, ${dimensions.height / 2})`);

    // Initialize color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Initialize pie and arc generators
    var pie = d3.pie().value(d => d.count);
    var arc = d3.arc().innerRadius(0).outerRadius(dimensions.radius);

    // Function to update the pie chart
    function updateChart(attribute) {
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

        // Update labels
        var labels = svg.selectAll("text").data(pie(filteredData));

        labels.enter()
            .append("text")
            .merge(labels)
            .transition()
            .duration(1000)
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "white")
            .text(d => `${d.data.attribute}: ${d.data.count}`);

        labels.exit().remove();
    }

    // Create a dropdown menu
    var dropdown = d3.select("body")
        .insert("div", "#piechart")
        .style("text-align", "center")
        .append("select")
        .on("change", function() {
            var selectedAttribute = d3.select(this).property("value");
            updateChart(selectedAttribute);
        });

    // Populate dropdown with attribute options
    var attributes = [
        "sex",
        "age_group",
        "race_ethnicity_combined",
        "hosp_yn",
        "icu_yn",
        "death_yn",
        "medcond_yn"
    ];

    dropdown.selectAll("option")
        .data(attributes)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d.charAt(0).toUpperCase() + d.slice(1).replace(/_/g, " "));

    // Initialize the chart with the first attribute
    updateChart("sex");
});
