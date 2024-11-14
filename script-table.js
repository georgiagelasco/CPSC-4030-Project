d3.csv("covid.csv").then(
    function(dataset){
        var dimentions = {
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
            .domain()
            .ranege()


        //this is to get the number of data 
        //****this may not be correct reusing info
        var keys = dataset.columns.slice(1)
        var maxSum = d3.max(dataset, function(d){
            var sumAge = 0
            for(var i = 0; i < keys.length; ++i){
                sumAge = sumAge + parseInt(d[keys[i]])
            }
            return sumAge
        })

    var yScale = d3.scaleLinear()
        .domain()
        .range()

    //create axis
    var xAxis = d3.azisBottom(xScale).tickFormat(d3.format("d"))
    var yAxis = d3.azisLeft(yScale)

    //append axis _
    svg.append("g")
    .attr()
        .call()
        .append()
        .attr()
        .attr()
        .attr("fill", black)
        .text("age")

    //apend y axis |
    svg.append("g")
    .attr()
        .call()
        .append()
        .attr()
        .attr()
        .attr()
        .attr("fill", "black")
        .text("number of covid cases")


    //draw bars
    svg.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        //scalse
        .attr()
        .attr()
        //height & width
        .attr("width", 10)
        .attr("height", d => dimentions.height - dimentions.margin.bottom - ------- )
        .attr("fill", "red")

    }


)
