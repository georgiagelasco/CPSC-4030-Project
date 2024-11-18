
//import data!!!
d3.csv("covid.csv").then(
    function(data){
        var dimensions = {
            margin : {top: 20, right: 20, bottom: 20, left: 20},
            //ccellSize = XXX;
            width : 500, //data[0].length * cellSize;
            height : 450, //data.length * cellSize;
            cellSize : 50
        }


        //groups
        var ageGroups = Array.from(new Set(data.map(d => d.age_group)))
        var raceEthnicities = Array.from(new Set(data.map(d => `${d.race} (${d.ethnicity})`)))

        const svg = d3.select("#heatmap")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

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
            .attr("x", d => d.colIndex * cellSize)
            .attr("y", d => d.rowIndex * cellSize)
            .attr("width", cellSize)
            .attr("height", cellSize)
            .style("fill", d => colorScale(d.count))
            .style("stroke", "#ccc");




        //labels
        var xScale = d3.scaleBand().domain(raceEthnicities).range([0, raceEthnicities.length * cellSize])
        var yScale = d3.scaleBand().domain(ageGroups).range([0, ageGroups.length * cellSize])

        svg.append("g")
            .selectAll("text")
            .data(raceEthnicities)
            .enter()
            .append("text")
            .attr("x", (_, i) => i * cellSize + cellSize / 2)
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
            .attr("y", (_, i) => i * cellSize + cellSize / 2)
            .attr("text-anchor", "end")
            .attr("font-size", "10px")
            .text(d => d);

        
            

    }

)
