/**
 * Created by yevheniia on 09.12.19.
 */
var parseDate = d3.timeParse("%Y-%m-%d");

var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;



//Read the data
d3.csv("data/ua_artists.csv", function(data) {

    var uniqueArtists = [];

    data.sort(function(a, b){
        return b.sum- a.sum;
    });

    data.forEach(function (item) {
        item.week = parseDate(item.week);
        item.Rank = +item.Rank;
        uniqueArtists.indexOf(item["Artist.Name"]) === -1 ? uniqueArtists.push(item["Artist.Name"]) : console.log("This item already exists");
        });





    uniqueArtists.forEach(function(d) {
        drawCharts(data, d)
    })

});


var drawCharts = function(data, artist) {
    
    var itemData = data.filter(function(item){
        return item["Artist.Name"] === artist        
    });

    var color =  "rgb(" + (Math.round(Math.random() * 200 + 50)) + ", " + (Math.round(Math.random() * 200 + 50)) + ", " + (Math.round(Math.random() * 200 + 50)) + ")";

    
    var container = d3.select("#my_dataviz")
        .append("div")
        .attr("id", artist)
        ;

    container.append("p")
        .attr("class", "artist-name")
        //.attr("id", artist)
        .text(artist);


    var svg = container
        .append("svg")

        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleTime()
        .domain([new Date(2019, 0, 1), new Date(2019, 11, 31)])
        .range([ 0, width])
        .nice();
    
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(fc.axisBottom(x).tickFormat(d3.timeFormat("%m")).tickSize(-height).tickCenterLabel(true))
        ;

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([ height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y).ticks(1));

    // Add dots
    svg.selectAll("dot")
        .data(itemData)
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.week) - 4; } )
        .attr("y", function (d) { return y(d.Rank) - 5; } )
        .attr("width", 10)
        .attr("height", 5)
        .style("fill", color);

};




