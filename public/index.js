var map;
var ajaxRequest;
var plotlist;
var plotlayers = [];

function initmap() {
    // set up the map
    map = new L.Map('mapid');

    // create the tile layer with correct attribution
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 20, attribution: osmAttrib });

    // start the map in South-East England
    map.setView(new L.LatLng(37.78, -122.44), 14);
    map.addLayer(osm);

    $.get('/api/pushpins', function (data) {
        console.log(data);
    })
    
}

initmap();

