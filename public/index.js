var map;
var ajaxRequest;
var plotlist;
var plotlayers = [];

function getPushpins() {
    $.get('/api/pushpins', function (data) {
       console.log(data);
        for (var i = 0; i < data.length; i++){
            console.log(data[i]);
                showPushpin(data[i]);
        }
    })
}

//testing geoJSON API endpoint
function getGeoJsonFeature() {
  //retrieves a geoJSON object of type FeaturesCollection
    $.get('/api/geojson', function (featureCollection) {
        showPushpins(featureCollection);
    })
}

var geojsonLayer;
//Takes both a Features or FeatureCollections geoJson types
function showPushpins(geojsonFeature){
  //Add geoJSON objects to a geoJSON layer and add it to the map.
  geojsonLayer = L.geoJSON(geojsonFeature, {
    onEachFeature: addPopup
  }).addTo(map);

  console.log(geojsonLayer);
}

function updatePushpin(geojsonFeature, layer){
  if (geojsonFeature. properties) {
      layer.feature.properties = geojsonFeature.properties;
      addPopup(geojsonFeature, layer);
  }
}

function addPopup(feature, layer){
  if (feature.properties) {
    var prop = feature.properties;
    var update_btn = `<button class = 'update btn'>Update</button>`
    var delete_btn = `<button class = 'delete btn'>Delete</button>`
    var saveUpdates_btn = `<button class ='save_updates btn' style='display: none'>Save Changes</button>`
    var pushpin = `<div>Title: ${prop.title} Description: ${prop.description} Author: ${prop.author} Asset: ${prop.asset} </div> ${update_btn} ${delete_btn} ${saveUpdates_btn} `
    layer.bindPopup(pushpin);
    layer.on("popupopen", onPopupOpen);
    console.log(layer);
  }
  return layer;
}


function initmap() {
    // set up the map
    map = new L.Map('mapid');

    // create the tile layer with correct attribution
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 20, attribution: osmAttrib });

    // start the map in Northern San Francisco
    map.setView(new L.LatLng(37.78, -122.44), 14);
    map.addLayer(osm);

   //getPushpins();
    getGeoJsonFeature();

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
    currentPushpin.properties = {
        title: document.getElementById('titleTbx').value,
        description: document.getElementById('descriptionTbx').value,
        author: document.getElementById('authorTbx').value,
        asset: document.getElementById('assetSelect').value
    };
    currentPushpin.geometry = {
        x: latLng.lng,
        y: latLng.lat
    };

    requestBody = { properties: currentPushpin.properties, loc: currentPushpin.geometry }
    $.post('api/pushpins/newpushpin', requestBody, function (data) {
        console.log(requestBody + " posted to api/pushpins");
        //Make pushpin into a geoJsonFeature object with data that was saved on DB 
        var geojsonFeature = new GeoJsonFeature(data);
        //show new pushpin on map
        showPushpins(geojsonFeature);
    })

    clearTextBoxAndClosePopup();
}

function clearTextBoxAndClosePopup(){
  document.getElementById('titleTbx').value = '';
  document.getElementById('descriptionTbx').value = '';
  document.getElementById('authorTbx').value = '';
  document.getElementById('assetSelect').value = '';
  map.closePopup();
}

function onPopupOpen(e){
    var marker = this;
    var pushpin_id =marker.feature.properties._id;
    console.log(pushpin_id);
    // To remove marker on click of delete
    $(".delete").on("click", function(){
     //can update confirm default box with bootstrap modal
     var confirmDelete = confirm("Are you sure you want to delete this pushpin?");
     if (confirmDelete){
      map.removeLayer(marker);
       //var id = this.dataset.id
       console.log(`/api/pushpins/${pushpin_id}/delete`);
       $.ajax({
         url: `/api/pushpins/${pushpin_id}/delete`,
         type: 'PUT',
         success: function(response) {
         }
       });
    }
  });  
  // To update marker
  $(".update").on("click", function(){
    var prop = marker.feature.properties;
    //var previous_content = marker._popup._content;
    var previous_content = marker._popup.getContent();
    console.log(previous_content);
    marker._popup.setContent(
     ['<table>',
      '    <tr><td colspan="2"></td></tr>',
      `    <tr><td>Title</td><td><input id="titleTbx" type="text" value=${prop.title} /> </td></tr>`,
      `    <tr><td>Description</td><td><input id="descriptionTbx" type="text" value= ${prop.description} /> </td></tr>`,
      `    <tr><td>Author</td><td><input id="authorTbx" type="text" value= ${prop.author} /></td></tr> `,
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
      '      <td colspan="2"><button class ="save_updates">Save Changes</button></td>',
      '    </tr>',
      '</table>',
    ].join("\n"));

    marker.on('popupclose', function(e) {
       //marker._popup.setContent(previous_content);
    });

    $(".save_updates").on("click", function(){
      var updatedProperties = {}
      updatedProperties = {
        title: document.getElementById('titleTbx').value,
        description: document.getElementById('descriptionTbx').value,
        author: document.getElementById('authorTbx').value,
        asset: document.getElementById('assetSelect').value
      };

      var url = `/api/pushpins/${pushpin_id}/update`;
      $.post(url, updatedProperties, function (data) {
        console.log(updatedProperties + " posted to api/:id/update");
        var geojsonFeature = new GeoJsonFeature(data);
        //show updated pushpin on map
        updatePushpin(geojsonFeature, marker);
        console.log(data);
      })
      clearTextBoxAndClosePopup();
    });
  });
}

function GeoJsonFeature(pushpin){
    var geojsonFeature = {
        type: "Feature",
        geometry: pushpin.geo,
        properties: {
          _id: pushpin._id,
          asset: pushpin.asset,
          author: pushpin.author,
          description: pushpin.description,
          title: pushpin.title,
        }    
    }
    return geojsonFeature;
}


initmap();