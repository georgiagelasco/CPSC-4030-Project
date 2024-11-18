d3.csv("covid.csv").then(
    function(dataset){
        var dimensions = {
            width: 1000,
            height: 1000,
            margin:{
                top: 10,
                bottom: 50,
                right: 10,
                left: 50
            }
        }

        var svg = d3.select("#barchart")
            .style("width", dimensions.width)
            .style("height", dimensions.height)

        var xScale = d3.scaleLinear()
            .domain(dataset.map(d => d.age_group))
            .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])


        //this is to get the number of data 
        //****this may not be correct reusing info
        var keys = Object.keys(dataset[0]).slice(1)
        var maxSum = d3.max(dataset, function(d){
            var sumAge = 0
            for(var i = 0; i < keys.length; ++i){
                sumAge = sumAge + parseInt(d[keys[i]])
            }
            return sumAge
        })

    var yScale = d3.scaleLinear()
        .domain([0, maxSum])
        .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])

    //create axis
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))
    var yAxis = d3.axisLeft(yScale)

    //append axis _
    svg.append("g")
    .attr("transform", `translate(0, ${dimensions.height - dimensions.margin.bottom})`)
        .call(xAxis)
        .append("text")
        .attr("x", dimensions.width /2)
        .attr("y", 40)
        .attr("fill", "black")
        .text("age")

    //apend y axis |
    svg.append("g")
    .attr("transform", `translate(${dimensions.margin.left}, 0)`)
        .call(yAxis)
        .append("text")
        .attr("x", -dimensions.width /2)
        .attr("y", -35)
        .attr("transform", "rotate(-90)")
        .attr("fill", "black")
        .text("Number of COVID Cases")


    //draw bars
    svg.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        //scalse
        .attr("x", d => xScale(d.age_group))
        .attr("y", d => yScale(keys.reduce((sum, key) => sum + +d[key], 0)))
        //height & width
        .attr("width", 10)
        .attr("height", d => dimensions.height - dimensions.margin.bottom - yScale(keys.reduce((sum, key) => sum + +d[key], 0)))
        .attr("fill", "red")

    }


)
