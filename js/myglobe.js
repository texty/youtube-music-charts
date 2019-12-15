/**
 * Created by yevheniia on 11.12.19.
 */
var chart_data;
function retrieve_chart_data(cb) {
    if (chart_data) return cb(chart_data);

    return d3.csv("data/globeDate.csv", function(err, myData){
        if (err) throw err;

        myData.forEach(function (item) {
            item.lat = +item.lat;
            item.lng = +item.lng;
            item.views = +item.views / 10 ;
        });

        chart_data = myData;
        if (cb) return cb(myData);
        return;
    })
}


retrieve_chart_data(function(myData) {
    setTimeout(function(){
        const wrapper = document.getElementById('globeViz').getBoundingClientRect();
        const globeWidth = wrapper.width;
        const MAP_CENTER = { lat: 46, lng: 32, altitude: 3.0 };
    //  const weightColor = d3.scaleSequentialSqrt(d3.interpolateYlOrRd).domain([0, 1e7]);

        const world = Globe( {  })
        (document.getElementById('globeViz'))
            .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
            .bumpImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
            .hexBinPointWeight('views')
            .hexAltitude(function(d){ return  d.sumWeight * 6e-7 })
            .width(globeWidth)
            .height(wrapper.height)
            .hexBinResolution(4)
            //.hexTopColor(function(d){ return weightColor(d.sumWeight)})
            //.hexSideColor(function(d){ return weightColor(d.sumWeight)})
            .hexBinMerge(false)
            .hexTransitionDuration(500)
            .enablePointerInteraction(false)
            .pointOfView(MAP_CENTER);



        // Add auto-rotation
        world.controls().autoRotate = false;
        $("#my_dataviz").css("margin-top", "-100vh");
        //world.controls().autoRotateSpeed = 0.1;


        $(".artist-chart").on("click", function () {
            var artist = $(this).attr("data");
            var color = $(this).attr("color");

            // if(artist === "Asti" || artist === "Artik" || artist === "Andro"|| artist === "Dilemma" ||  artist === "Govor"){
            //     $("#no-data").css("display", "block").css("color", color)
            // } else {
            //     $("#no-data").css("display", "none")
            // }

           $(".artist-name").css("background-color", "transparent");

            var artistData = myData.filter(function(d){
                return d.artist === artist
            });

            world
                .hexTopColor(function(d){ return color })
                .hexSideColor(function(d){ return color })
                .hexBinPointsData(artistData)
        });

    }, 500)

});