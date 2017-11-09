var map;
var latLng;

function getMarkers() {
  $.get('/api/markers', (markers) => {
    showMarkers(markers);
  })
}

// put the marker on the map + put popup content on each marker
function showMarkers(markers) {
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
  }
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

function onMapClick(e) {
  latLng = e.latlng;
  const popup = L.popup()
    .setLatLng(latLng)
    .setContent([
      '<h1>Add location at </h1>',
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
    .openOn(map);
}


function saveData() {
  const currentMarker = {
    title: document.getElementById('titleTbx').value,
    description: document.getElementById('descriptionTbx').value,
    author: document.getElementById('authorTbx').value,
    asset: document.getElementById('assetSelect').value,
    coordinates: [latLng.lng, latLng.lat],
  }

  $.post('api/markers', currentMarker, (data) => {
    showMarkers([data]); // showMarkers() expects an array, temp fix?
  });

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
  const marker = this;
  const marker_id = marker._id;
  // To remove marker on click of delete
  $(".delete").on("click", () => {
    // can update confirm default box with bootstrap modal
    const confirmDelete = confirm("Are you sure you want to delete this marker?");
    if (confirmDelete) {
      map.removeLayer(marker);
      $.ajax({
        url: `/api/markers/${marker_id}`,
        type: 'DELETE',
        success: (response) => {}, // ?
      });
    }
  });

  // To update marker
  $(".update").on("click", () => {
    const previous_content = marker._popup.getContent();
    marker._popup.setContent(
      // TODO: Create logic around this form - especially around asset. This should be it's own function
      // quick fix added below for the asset dropdown
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

    $(`#assetSelect option[value="${marker.properties.asset}"]`).prop('selected', true); // quick fix

    marker.on('popupclose', (e) => {
      marker._popup.setContent(previous_content);
    });

    $(".save_updates").on("click", () => {
      const updatedProperties = {
        title: document.getElementById('titleTbx').value,
        description: document.getElementById('descriptionTbx').value,
        author: document.getElementById('authorTbx').value,
        asset: document.getElementById('assetSelect').value,
      };

      $.post(`/api/markers/${marker_id}`, updatedProperties, (data) => {
        // show updated marker on map
        updateMarker(data, marker);
      })
      
      clearTextBoxAndClosePopup();
    });
  });
}

initmap();
