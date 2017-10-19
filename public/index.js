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
    
    var marker = L.marker([37.79, -122.394]).addTo(map); 
    marker.bindPopup("<b>Hello!</b>")

    var formMarker = L.marker([37.79, -122.398]).addTo(map); 

    formMarker.bindPopup([
        '<div id="inputForm" style="display:none;">',
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
        '        <td colspan="2"><input type="button" value="Save" onclick="saveData()" style="float:right;" /></td>',
        '    </tr>',
        '</table>',
        '</div>', 
        ].join("\n"))


}

initmap();

// var popupForm = $([
// '<div id="inputForm" style="display:none;">',
// '<table>',
// '    <tr><td colspan="2"></td></tr>',
// '    <tr><td>Title</td><td><input id="titleTbx" type="text" /></td></tr>', 
// '    <tr><td>Description</td><td><input id="descriptionTbx" type="text" /></td></tr>',
// '    <tr><td>Author</td><td><input id="authorTbx" type="text"/></td></tr>', 
// '    <tr><td>Asset</td>',
// '        <td><select id="assetSelect">', 
// '                <option value="supplies">Supplies</option>',
// '                <option value="staff">Staff</option>',
// '                <option value="food">Food</option>',
// '                <option value="water">Water</option>',
// '                <option value="energy or fuel">Energy/Fuel</option>', 
// '                <option value="medical">Medical</option>', 
// '                <option value="open space">Open Space</option>',
// '                <option value="shelter">Shelter</option>',
// '            </select></td>',
// '    </tr>',
// '        <td colspan="2"><input type="button" value="Save" onclick="saveData()" style="float:right;" /></td>',
// '    </tr>',
// '</table>',
// '</div>', 
// ].join("\n")); 