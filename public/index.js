let map;
let ajaxRequest;
//represents assets 
const layers = {}; 

//custom asset icons
let suppliesIcon =  L.AwesomeMarkers.icon({
  icon: 'pencil',
  markerColor: 'gray',
  prefix: 'fa', 
  iconColor: 'black'
  })
let staffIcon =  L.AwesomeMarkers.icon({
  icon: 'users',
  markerColor: 'purple',
  prefix: 'fa', 
  iconColor: 'black'
  })
let foodIcon = L.AwesomeMarkers.icon({
  icon: 'cutlery',
  markerColor: 'green',
  prefix: 'fa', 
  iconColor: 'black'
  })

let waterIcon = L.AwesomeMarkers.icon({
  icon: 'tint',
  markerColor: 'blue',
  prefix: 'fa', 
  iconColor: 'black'
  })
let energyIcon = L.AwesomeMarkers.icon({
  icon: 'bolt',
  markerColor: 'orange',
  prefix: 'fa', 
  iconColor: 'black'
  })
let medicalIcon =  L.AwesomeMarkers.icon({
  icon: 'medkit',
  markerColor: 'red',
  prefix: 'fa', 
  iconColor: 'black'
  })
let openSpaceIcon =  L.AwesomeMarkers.icon({
  icon: 'tree',
  markerColor: 'green',
  prefix: 'fa', 
  iconColor: 'black'
  })
let shelterIcon = L.AwesomeMarkers.icon({
  icon: 'home',
  markerColor: 'blue',
  prefix: 'fa', 
  iconColor: 'black'
  })

function getIcon(layerName) {
  let icons = {
    "supplies": suppliesIcon,
    "staff": staffIcon,
    "food": foodIcon,
    "water": waterIcon,
    "energy or fuel": energyIcon,
    "medical": medicalIcon,
    "open space": openSpaceIcon,
    "shelter": shelterIcon,
    'default': suppliesIcon
  }
  return (icons[layerName] || icons["default"]);
}
 
function getMarkers() {
  $.get('/api/markers', function (markers) {
    initLayers(markers);
   // showMarkers(markers);
  })
}

//should only be called when initializating map
function initLayers(markers){
  markers.forEach(m => {
  addLayer(m);
  })
}

//Creates a group layer based on the marker's asset name and adds it to map
function addLayer(marker){
  //add extra check to avoid redeclaring a layer group
  if (!layers[marker.asset]){
    layers[marker.asset] = L.layerGroup().addTo(map);
    addLayerButton(marker.asset, getIcon(marker.asset).options.icon);
   }
   showMarker(marker);
}

//Should we rename this function to addMarker(marker)?
// add the marker to a layer group + put popup content on each marker
function showMarker(marker) {
   const customIcon = getIcon(marker.asset);
   const x = L.marker([marker.coordinates[1], marker.coordinates[0]], {icon:customIcon});
   layers[marker.asset].addLayer(x);
   x._id = marker._id;
   x.properties = marker;
   addPopup(x);
   console.log(layers);
}

//Create a button to toggle the layer
function addLayerButton(layerName, iconName){
  //create button
  let layerItem = document.createElement('div')
  layerItem.innerHTML = `${layerName} <span class="fa fa-${iconName}"></span>`
  layerItem.className = "layer-button"
  layerItem.classList.add("toggle-active"); //layers are initially active
  layerItem.setAttribute('ref', `${layerName}-toggle`) //will be used to toggle on mobile
  layerItem.addEventListener('click', (e) => toggleMapLayer(layerName))
  document.getElementById("layer-buttons").appendChild(layerItem);

  function toggleMapLayer(layerName){
    //Toggle active UI status
    layerItem.classList.toggle('toggle-active')

    const layer = layers[layerName];
    if (map.hasLayer(layer)) {
      map.removeLayer(layer)
    } else {
      map.addLayer(layer)
    }
  }
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
    let update_btn = `<button class = 'update btn'>Update</button>`
    let delete_btn = `<button class = 'delete btn'>Delete</button>`
    let saveUpdates_btn = `<button class ='save_updates btn' style='display: none'>Save Changes</button>`
    let markerHTML = `<div>Title: ${marker.properties.title} Description: ${marker.properties.description} Author: ${marker.properties.author} Asset: ${marker.properties.asset} </div> ${update_btn} ${delete_btn} ${saveUpdates_btn} `
    marker.bindPopup(markerHTML);
    marker.on("popupopen", onPopupOpen);
  }
}

function initmap() {
  // set up the map
  map = new L.Map('mapid');

  // create the tile layer with correct attribution
  let osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  let osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  let osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 20, attribution: osmAttrib });

  // start the map in Northern San Francisco
  map.setView(new L.LatLng(37.80, -122.42), 14);
  map.addLayer(osm);

  getMarkers();

  map.on('click', onMapClick);
}


let popup = L.popup();

let latLng;
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
  let currentMarker = {}
  currentMarker.title = document.getElementById('titleTbx').value;
  currentMarker.description = document.getElementById('descriptionTbx').value;
  currentMarker.author = document.getElementById('authorTbx').value;
  currentMarker.asset = document.getElementById('assetSelect').value;

  currentMarker.coordinates = [latLng.lng, latLng.lat]

  requestBody = currentMarker
  $.post('api/markers', requestBody, function (data) {
    addLayer(data);
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
  let marker = this;
  let marker_id = marker._id;
  // To remove marker on click of delete
  $(".delete").on("click", function () {
    //can update confirm default box with bootstrap modal
    let confirmDelete = confirm("Are you sure you want to delete this marker?");
    if (confirmDelete) {
      console.log(`/api/markers/${marker_id}`);
      $.ajax({
        url: `/api/markers/${marker_id}`,
        type: 'DELETE',
        success: function (response) {
          console.log("Succesfully delete marker");
          let leaflet_id = marker._leaflet_id
          let layer = layers[marker.properties.asset];
          //Have to do this extra step to delete the marker reference that is inside the layer group
          delete layer._layers[leaflet_id];
          //show in UI
          map.removeLayer(marker);
        }
      });
    }
  });
  // To update marker
  $(".update").on("click", function () {
    console.log("Update marker: " + marker)
    //var previous_content = marker._popup._content;
    let previous_content = marker._popup.getContent();
   // console.log(previous_content);
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
      let updatedProperties = {}
      updatedProperties = {
        title: document.getElementById('titleTbx').value,
        description: document.getElementById('descriptionTbx').value,
        author: document.getElementById('authorTbx').value,
        asset: document.getElementById('assetSelect').value
      };

      let url = `/api/markers/${marker_id}`;
      $.post(url, updatedProperties, function (data) {
        console.log(updatedProperties + " posted to api");
       // console.log("whats data: ", data)
        //show updated marker on map
        updateMarker(data, marker);
        console.log(data);
      })
      clearTextBoxAndClosePopup();
    });
  });
}

initmap();