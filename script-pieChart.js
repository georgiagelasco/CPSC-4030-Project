d3.csv("covid.csv").then(
    function(data){

        var dimensions = {
            width: 500,
            height: 500,
            radius : Math.min(width, height) / 2
        }

        var sexCounts = d3.rollup(
            data,
            v => v.length,
            d => d.sex
        )
        
        var sexData = Array.from(sexCounts, ([key, value]) => ({ sex: key, count: value }))

       var svg = d3.select("#piechart")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`)

        //color
        var color = d3.scaleOrdinal()
            .domain(sexData.map(d => d.sex))
            .range(d3.schemeCategory10)

        //creating pie
        var pie = d3.pie()
            .value(d => d.count)

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

        //draw chart
        svg.selectAll("path")
            .data(pie(sexData))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.sex))
            .attr("stroke", "white")
            .attr("stroke-width", 2)

        //labels
        svg.selectAll("text")
            .data(pie(sexData))
            .enter()
            .append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "white")
            .text(d => `${d.data.sex}: ${d.data.count}`);


    }
)
