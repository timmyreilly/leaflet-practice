let map;
let latLng;
//represents assets
let layers = {};



function getPolylinesStyle(layerName) {
  let styles = {
    "Seismic Hazard Zones": { "color": "red","opacity": 0.65 },
    'default': {color :'blue', "opacity": 0.5},
  }
  return (styles[layerName] || styles["default"]);
}

let loader = {
  show: function(){
    document.getElementById("loader").style.display = 'block';
  },
  hide: function(){
    document.getElementById("loader").style.display = 'none';
  }
}

function getMarkers() {
  $.get('/api/markers', (markers) => {
    initLayers(markers);
  })
}

//Functions to show and add hide info container
function showInfo(){
  if(this.properties){
    $(".infoTitle").text(`Title: ${this.properties.title}`)
    $(".infoAddress").text(`Description: ${this.properties.description}`)
    $(".infoAdditional").text(`Author: ${this.properties.author}`)
  } else if (this.feature.properties){
      $(".infoAdditional").text('')
      let featureProps = this.feature.properties
      switch(featureProps.layerName){
        case "Privately Owned Public Open Spaces":
          $(".infoTitle").text(`Name: ${featureProps.name}`);
          $(".infoAddress").text(`Location: ${featureProps.location}`);
          $(".infoAdditional").text(`Description: ${featureProps.descriptio}`);
          break;
        case "Park and Open Space":
          $(".infoTitle").text(`Name: ${featureProps.parkname}`);
          break;
        case "Schools":
          $(".infoTitle").text(`Campus Name: ${featureProps.campus_name}`)
          $(".infoAddress").text(`Address: ${featureProps.campus_address}`);
          break;
        case "Business Locations":
          $(".infoTitle").text(`Business Name: ${featureProps.dba_name}`);
          $(".infoAdditional").text(`Classification: ${featureProps.naic_code_description}`);
          break;
        case "City Facilities":
          $(".infoTitle").text(`Common Name: ${featureProps.common_name}`);
          $(".infoAddress").text(`Address: ${featureProps.address}`);
          $(".infoAdditional").text(`Dept Name: ${featureProps.department_name}`);
          break;
        case "Health Care Facilities":
          $(".infoTitle").text(`Name: ${featureProps.facility_name}`);
          $(".infoAddress").text(`Address: ${featureProps.location_address}`);
          break;
        case "Pit Stop Locations":
          $(".infoTitle").text(`Facility Type: ${featureProps.facilitytype}`);
          $(".infoAddress").text(`Location: ${featureProps.location}`);
          $(".infoAdditional").text(`Hours: ${featureProps.hoursofoperation}`);
          break;
        default:
          $(".infoBody").text('');
        }
      }
  $(".infoContainer").show();
};

function hideInfo(){
  $(".infoContainer").hide();
};

//retrieves a geoJSON feature of type FeatureCollection or Feature
function getExternalGeoJSON(endpoint) {
  console.log(`Called ${endpoint} API`);
  return $.get(`/api/${endpoint}`).then(function(geoJSONFeature) {
    return geoJSONFeature;
  });
}

function getPostmanCollection(){
  // Items are the basic unit for a Postman collection. You can think of them as corresponding to a single API endpoint.
  //Each Item has one request and may have multiple API responses associated with it.
  $.get('/api/postmancollection', (collection) => {
    const items = collection.item; //want collection.item which is an array of single API endpoints for each resource. Change "items" to "resource"?
    items.forEach(function(item){
      addExternalLayer(item);
    });
  });
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
    const isExternalLayer = false;
    layers[marker.asset] = L.layerGroup().addTo(map);
    addLayerButton(marker.asset, getIcon(marker.asset).options.icon), isExternalLayer;
  }
   addMarker(marker);
}

//Creates a geoJSON layer based on the item's(resource) shortName
function addExternalLayer(item){
  const shortName = item.shortName;
  if (!layers[shortName]){
    const isExternalLayer = true;
    //Don't want to add this layerGroup to the map yet until user requests data for this.
    layers[shortName] = L.geoJSON()
    layers[shortName].name = item.name; //Do we need to keep this information?
    layers[shortName].shortName = item.shortName;
    layers[shortName].endpoint = item.endpoint;
    addLayerButton(shortName, getIcon(item.shortName).options.icon, isExternalLayer);
  }
}

// add the marker to a layer group + put popup content on each marker
function addMarker(marker) {
   const customIcon = getIcon(marker.asset);
   const x = L.marker([marker.coordinates[1], marker.coordinates[0]], {icon:customIcon});
   layers[marker.asset].addLayer(x);
   x._id = marker._id;
   x.properties = marker;
   addPopup(x);
}

//Create a button to toggle the layer
function addLayerButton(layerName, iconName, isExternal){
  let layerButton = createLayerButton(layerName, iconName);
  layerButton.addEventListener('click', (e) => toggleMapLayer(layerButton, layerName,  isExternal));
  if(isExternal){
    document.getElementById("external-layer-buttons").appendChild(layerButton);
    //external layers are initially inactive
  }else{
    document.getElementById("layer-buttons").appendChild(layerButton);
    layerButton.classList.add("toggle-active");
  }
}

function createLayerButton(layerName, iconName){
  let layerDiv = document.createElement('div');
  layerDiv.innerHTML = `${layerName} <span class="fa fa-${iconName}"></span>`;
  layerDiv.className = "layer-button";
  layerDiv.setAttribute('ref', `${layerName}-toggle`); //will be used to toggle on mobile
  return layerDiv;
}

//Called on each GEOJSON feature before adding to Map
function onEachFeature(feature,layer){
  if (feature.properties){
    layer.bindPopup(`${feature.properties.descriptio}`);
    layer.on('mouseover', showInfo);
    layer.on("mouseout", hideInfo);
    let geometryType = feature.geometry.type;
    let layerName = feature.properties.layerName;
    let icon = getIcon(layerName);
    if (geometryType === "Point") layer.setIcon(icon);
    if (geometryType === "MultiPolygon") layer.setStyle(getPolylinesStyle(layerName)); // NOT CURRENTLY WORKING
  };
};



function toggleMapLayer(layerButton, layerName, isExternal){
  layer = layers[layerName];
  if (isExternal && $.isEmptyObject(layer._layers)){
    loader.show();
    getExternalGeoJSON(layer.endpoint).done(function(featureCollection){
      var geoJsonLayer = L.geoJSON(featureCollection, {
        //Using pointToLayer to add name of Layer on each feature so we can grab it later --NOT CURRENTLY WORKING WITH POLYGONS--
        pointToLayer: function(feature, latlng) {
          feature.properties.layerName = layerName;
        }
      })
    layers[layerName] = L.geoJSON(featureCollection ,{onEachFeature: onEachFeature}).addTo(map);

      loader.hide();
    });
    toggle(layer, layerButton);
  }
  else{
    toggle(layer, layerButton);
  }

 //Toggle active UI status and layer attached to the map
 function toggle(layer, layerButton){
  if (map.hasLayer(layer)){
      map.removeLayer(layer);
      layerButton.classList.remove('toggle-active');
  }else{
    map.addLayer(layer);
      layerButton.classList.add('toggle-active');
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

function addPopup(marker) {
  if (marker) {
    // Binds event listeners to markers that hide and show info window in bottom left on mouseover and mouseout
    marker.on('mouseover', showInfo);
    marker.on('mouseout', hideInfo);
    //Adds html content to our popup marker
    marker.bindPopup(popupContent(marker, 'add'));
    marker.on('popupopen', onPopupOpen);
  }
}

function popupContent (marker, mode) {
  if (marker) {
    var { title, description, author, asset } = marker.properties;
  } else {
    var title = '';
    var description = '';
    var author = '';
  }

  // default mode
  let isDisabled = true;
  let buttons = `<button class="edit btn">Edit</button><button class="delete btn">Delete</button>`;

  if (mode === 'update') {
    buttons = `<button class="update">Save Changes</button>`;
    isDisabled = false;
  } else if (mode == 'create') {
    buttons = `<input type="button" value="Add Location" onclick=saveData() />`;
    isDisabled = false;
  }

  const content = `
  <table>
  <tr><td colspan="2"></td></tr>
  <tr><td>Title</td><td><input id="titleTbx" type="text" value="${title}" ${isDisabled ? 'disabled' : ''} /></td></tr>
  <tr><td>Description</td><td><input id="descriptionTbx" type="text" value="${description}" ${isDisabled ? 'disabled' : ''} /></td></tr>
  <tr><td>Author</td><td><input id="authorTbx" type="text" value="${author}" ${isDisabled ? 'disabled' : ''} /></td></tr>
  <tr><td>Asset</td>
      <td>
            <select id="assetSelect" ${isDisabled ? 'disabled' : ''}>
              <option ${asset === 'supplies' ? 'selected' : ''} value="supplies">Supplies</option>
              <option ${asset === 'staff' ? 'selected' : ''} value="staff">Staff</option>
              <option ${asset === 'food' ? 'selected' : ''} value="food">Food</option>
              <option ${asset === 'water' ? 'selected' : ''} value="water">Water</option>
              <option ${asset === 'energy or fuel' ? 'selected' : ''} value="energy or fuel">Energy/Fuel</option>
              <option ${asset === 'medical' ? 'selected' : ''} value="medical">Medical</option>
              <option ${asset === 'open space' ? 'selected' : ''} value="open space">Open Space</option>
              <option ${asset === 'shelter' ? 'selected' : ''} value="shelter">Shelter</option>
              </select></td>
              </td>
          </tr>
        </table>
            <div>
      ${buttons}
    </div>
  `;
  return content;
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
  getPostmanCollection();

  map.on('click', onMapClick);
}

function onMapClick(e) {
  latLng = e.latlng;
  const popup = L.popup()
    .setLatLng(latLng)
    .setContent(popupContent(null, 'create'))
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
    addLayer(data);
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
    //can update confirm default box with bootstrap modal
    let confirmDelete = confirm("Are you sure you want to delete this marker?");
    if (confirmDelete) {
      $.ajax({
        url: `/api/markers/${marker_id}`,
        type: 'DELETE',
        success: (response) => {
          console.log("Succesfully delete marker");
          let leaflet_id = marker._leaflet_id;
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
  $(".edit").on("click", () => {
    const previous_content = marker._popup.getContent();
    marker._popup.setContent(popupContent(marker, 'update'));

    marker.on('popupclose', (e) => {
      console.log('close popup');
      // marker._popup.setContent(popupContent(marker, 'add'));
      marker._popup.setContent(previous_content);
    });

    $(".update").on("click", () => {
      console.log('save changes', marker);
      const updatedProperties = {
        title: document.getElementById('titleTbx').value,
        description: document.getElementById('descriptionTbx').value,
        author: document.getElementById('authorTbx').value,
        asset: document.getElementById('assetSelect').value,
      };

      $.post(`/api/markers/${marker_id}`, updatedProperties, (data) => {
        // show updated marker on map
        updateMarker(data, marker);
      });

      clearTextBoxAndClosePopup();
    });
  });
}

initmap();

$(document).ready(function(){
  $(".infoContainer").hide();
})
