/**
 * Created by yevheniia on 09.12.19.
 */
var parseDate = d3.timeParse("%Y-%m-%d");
var container = $("#my_dataviz")[0].getBoundingClientRect();

var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = container.width - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

var index = 0;
const pallette = ["#00ff00", "#ffff00", "#00ffff",  "#ff00ff", "#ff6d00", "#ff2c5f", "#6672ff" ];


//Read the data
d3.csv("data/ua_artists.csv", function(data) {

    var uniqueArtists = [];

    data.sort(function(a, b){
        return b.sumViews- a.sumViews;
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


    var color = pallette[index];
    // var color =  "rgb(" + (Math.round(Math.random() * 200 + 50)) + ", " + (Math.round(Math.random() * 200 + 50)) + ", " + (Math.round(Math.random() * 200 + 50)) + ")";

    if(index < pallette.length-1) {
        index = index + 1;
    } else  {
        index = 0;




    }



    var container = d3.select("#my_dataviz")
        .append("div")
        .attr("data",  artist)
        .attr("color",  color)
        .attr("class",  "artist-chart")

        ;

    container.append("p")
        // .style("display", "flex")
        // .append("span")
        .attr("class", "artist-name")
        .html(artist + " <span style='color:" + color + "'> 🇺🇦 " + (itemData[0].sumViews / 1000000).toFixed(1) + "M переглядів </span>" );


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
        .attr("width", width / 53)
        .attr("height", (width / 50) /2)
        .style("fill", color);




};




