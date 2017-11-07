var map;
var ajaxRequest;

function getMarkers() {
  $.get('/api/markers', function (markers) {
    console.log(markers);
    showMarkers(markers); 
  })
}

// put the marker on the map + put popup content on each marker 
function showMarkers(markers) {
  console.log(markers); 
  markers.forEach(m => {
    var x = L.marker([m.coordinates[1], m.coordinates[0]]).addTo(map); 
    x._id = m._id; 
    x.properties = m;
    addPopup(x); 
  }); 
}

function updateMarker(data, marker) {
  if (data) {
    marker.properties.asset = data.asset;
    marker.properties.title = data.title;
    marker.properties.author = data.author;
    marker.properties.description = data.description;
    addPopup(marker);
  }
}

/*
Adds html content to our popup marker 
*/
function addPopup(marker) {
  if (marker) {
    var update_btn = `<button class = 'update btn'>Update</button>`
    var delete_btn = `<button class = 'delete btn'>Delete</button>`
    var saveUpdates_btn = `<button class ='save_updates btn' style='display: none'>Save Changes</button>`
    var markerHTML = `<div>Title: ${marker.properties.title} Description: ${marker.properties.description} Author: ${marker.properties.author} Asset: ${marker.properties.asset} </div> ${update_btn} ${delete_btn} ${saveUpdates_btn} `
    marker.bindPopup(markerHTML);
    marker.on("popupopen", onPopupOpen);
    console.log(marker);
  }
  // return marker;
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

  getMarkers();

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
  var currentMarker = {}
  currentMarker.title = document.getElementById('titleTbx').value;
  currentMarker.description = document.getElementById('descriptionTbx').value;
  currentMarker.author = document.getElementById('authorTbx').value;
  currentMarker.asset = document.getElementById('assetSelect').value;

  currentMarker.coordinates = [latLng.lng, latLng.lat]

  requestBody = currentMarker
  $.post('api/markers', requestBody, function (data) {
    console.log(requestBody + " posted to api/markers");
    showMarkers(data);
  })

  clearTextBoxAndClosePopup();
}

function clearTextBoxAndClosePopup() {
  document.getElementById('titleTbx').value = '';
  document.getElementById('descriptionTbx').value = '';
  document.getElementById('authorTbx').value = '';
  document.getElementById('assetSelect').value = '';
  map.closePopup();
}

function onPopupOpen(e) {
  var marker = this;
  var marker_id = marker._id;
  console.log(marker_id);
  // To remove marker on click of delete
  $(".delete").on("click", function () {
    //can update confirm default box with bootstrap modal
    var confirmDelete = confirm("Are you sure you want to delete this marker?");
    if (confirmDelete) {
      map.removeLayer(marker);
      //var id = this.dataset.id
      console.log(`/api/markers/${marker_id}`);
      $.ajax({
        url: `/api/markers/${marker_id}`,
        type: 'DELETE',
        success: function (response) {
        }
      });
    }
  });
  // To update marker
  $(".update").on("click", function () {
    console.log("Update marker: " + marker)
    //var previous_content = marker._popup._content;
    var previous_content = marker._popup.getContent();
    console.log(previous_content);
    marker._popup.setContent(
      // TODO: Create logic around this form - especially around asset. This should be it's own function
      ['<table>',
        '    <tr><td colspan="2"></td></tr>',
        `    <tr><td>Title</td><td><input id="titleTbx" type="text" value="${marker.properties.title}" /> </td></tr>`,
        `    <tr><td>Description</td><td><input id="descriptionTbx" type="text" value= "${marker.properties.description}" /> </td></tr>`,
        `    <tr><td>Author</td><td><input id="authorTbx" type="text" value= "${marker.properties.author}" /></td></tr> `,
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

    marker.on('popupclose', function (e) {
      marker._popup.setContent(previous_content);
    });

    $(".save_updates").on("click", function () {
      var updatedProperties = {}
      updatedProperties = {
        title: document.getElementById('titleTbx').value,
        description: document.getElementById('descriptionTbx').value,
        author: document.getElementById('authorTbx').value,
        asset: document.getElementById('assetSelect').value
      };

      var url = `/api/markers/${marker_id}`;
      $.post(url, updatedProperties, function (data) {
        console.log(updatedProperties + " posted to api");
        console.log("whats data: ", data)
        //show updated marker on map
        updateMarker(data, marker);
        console.log(data);
      })
      clearTextBoxAndClosePopup();
    });
  });
}

initmap();