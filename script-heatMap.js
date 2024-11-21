
//import data!!!
d3.csv("covid.csv").then(
    function(data){
        var dimensions = {
            margin : {top: 50, right: 100, bottom: 50, left: 100},
            //ccellSize = XXX;
            width : 500, //data[0].length * cellSize;
            height : 450, //data.length * cellSize;
            cellSize : 100
        }


        //groups
        var ageGroups = Array.from(new Set(data.map(d => d.age_group)))
        var raceEthnicities = Array.from(new Set(data.map(d => `${d.race} (${d.ethnicity})`)))

        const svg = d3.select("#heatmap")
            .append("svg")
            .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
            .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
            .append("g")
            .attr("transform", `translate(${dimensions.margin.left},${dimensions.margin.top})`);

        //count occrrences
        var counts = d3.rollup(
            data,
            v => v.length,
            d => d.age_group,
            d => `${d.race} (${d.ethnicity})`
        )

 
        //get heatmao data
        var heatmapData = []
        ageGroups.forEach((ageGroup, rowIndex) =>{
            raceEthnicities.forEach((raceEthnicity, colIndex) =>{
                var count = counts.get(ageGroup)?.get(raceEthnicity) || 0
                heatmapData.push({ ageGroup, raceEthnicity, rowIndex, colIndex, count })
            })
        })


        //set color definition


        //color scale
        //const colorScale = d3.scaleSequential(d3.interpolateBlues)
            //.domain()//need to know range
            var maxCount = d3.max(heatmapData, d => d.count)
            var colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, maxCount])


        //create the grid cells
        svg.selectAll("rect")
            //2D data.flat
            .data(heatmapData)
            .enter()
            .append("rect")
            //x and y dimentions
            .attr("x", d => d.colIndex * dimensions.cellSize)
            .attr("y", d => d.rowIndex * dimensions.cellSize)
            .attr("width", dimensions.cellSize)
            .attr("height", dimensions.cellSize)
            .style("fill", d => colorScale(d.count))
            .style("stroke", "#ccc");




        //labels
        var xScale = d3.scaleBand().domain(raceEthnicities).range([0, raceEthnicities.length * dimensions.cellSize])
        var yScale = d3.scaleBand().domain(ageGroups).range([0, ageGroups.length * dimensions.cellSize])

        svg.append("g")
            .selectAll("text")
            .data(raceEthnicities)
            .enter()
            .append("text")
            .attr("x", (_, i) => i * dimensions.cellSize + dimensions.cellSize / 2)
            .attr("y", -5)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .text(d => d);

        svg.append("g")
            .selectAll("text")
            .data(ageGroups)
            .enter()
            .append("text")
            .attr("x", -5)
            .attr("y", (_, i) => i * dimensions.cellSize + dimensions.cellSize / 2)
            .attr("text-anchor", "end")
            .attr("font-size", "10px")
            .text(d => d);

        
            

    }

)
