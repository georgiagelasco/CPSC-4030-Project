
//import data!!!
d3.csv("covid.csv").then(

//dimentions for heatMap
const margin = {top: , right: , bottom: , left: };
const cellSize = XXX;
const width = data[0].length * cellSize;
const height = data.length * cellSize;

const svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


//color scale
const colorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain()//need to know range


//create the grid cells
svg.selectAll("rect")
    //2D data.flat
    .data()
    .enter()
    .append("rect")
    //x and y dimentions
    .attr()
    .attr()
    .attr("width", cellSize)
    .attr("height", cellSize)
    .style("fill", d => colorScale(d))
    .style("stroke", "#ccc");


)
