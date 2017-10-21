var map;
var ajaxRequest;
var plotlist;
var plotlayers = [];

function getPushpins() {
    $.get('/api/pushpins', function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++){
            if(data[i].loc != undefined && data[i].metadata != undefined){
                var d = data[i]; 
                var id = d._id;
                var lat = parseFloat(d.loc.y);
                var lon = parseFloat(d.loc.x); 
                var marker = L.marker([lat, lon]).addTo(map); 
                var button = `<button class = 'pushpin' data-id=${id}>Delete</button>`
                var pushpin = `Asset: ${d.metadata.asset} Description: ${d.metadata.description} Author: ${d.metadata.author} ${button}`
                marker.bindPopup(pushpin)
            }
        }
    })

}

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

    getPushpins();

    var marker = L.marker([37.79, -122.394]).addTo(map);
    marker.bindPopup("<b>Hello!</b>")

    var formMarker = L.marker([37.79, -122.398]).addTo(map);

    map.on('click', onMapClick);
}



var popup = L.popup();

var latLng;
function onMapClick(e) {
    latLng = e.latlng
    popup
    .setLatLng(e.latlng)
    .setContent([
        '<h1>You clicked the map at</h1> ' + latLng.toString(),
        '<table>',
        '    <tr><td colspan="2"></td></tr>',
        '    <tr><td>Title</td><td><input id="titleTbx" type="text" /></td></tr>',
        '    <tr><td>Description</td><td><input id="descriptionTbx" type="text" /></td></tr>',
        '    <tr><td>Author</td><td><input id="authorTbx" type="text"/></td></tr>',
        '    <tr><td>Asset</td>',
        '        <td><select id="assetSelect">',
        '                <option value="supplies">Supplies</option>',
        '                <option value="staff">Staff</option>',
        '                <option value="food">Food</option>',
        '                <option value="water">Water</option>',
        '                <option value="energy or fuel">Energy/Fuel</option>',
        '                <option value="medical">Medical</option>',
        '                <option value="open space">Open Space</option>',
        '                <option value="shelter">Shelter</option>',
        '            </select></td>',
        '    </tr>',
        '        <td colspan="2"><input type="button" value="Save" onclick=saveData() style="float:right;"/></td>',
        '    </tr>',
        '</table>',
        ].join("\n"))
    .openOn(map)
}


function saveData() {
    var currentPushpin = {}
    currentPushpin.metadata = {
        title: document.getElementById('titleTbx').value,
        description: document.getElementById('descriptionTbx').value,
        author: document.getElementById('authorTbx').value,
        asset: document.getElementById('assetSelect').value
    };
    currentPushpin.geometry = {
        x: latLng.lng,
        y: latLng.lat
    };
    requestBody = { metadata: currentPushpin.metadata, loc: currentPushpin.geometry }
    $.post('api/pushpins/newpushpin', requestBody, function (data) {
        console.log(requestBody + " posted to api/pushpins")
        getPushpins();
    })

    document.getElementById('titleTbx').value = '';
    document.getElementById('descriptionTbx').value = '';
    document.getElementById('authorTbx').value = '';
    document.getElementById('assetSelect').value = '';
    map.closePopup();
}

$(document).on("click", ".pushpin", function(){
    var id = this.dataset.id
    $.ajax({
        url: `/api/pushpins/${id}/delete`,
        type: 'PUT',
        success: function(response) {
        }
    });
});

initmap();
