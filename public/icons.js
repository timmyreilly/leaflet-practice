//custom asset icons
const suppliesIcon =  L.AwesomeMarkers.icon({
  icon: 'pencil',
  markerColor: 'gray',
  prefix: 'fa',
  iconColor: 'black'
})
const staffIcon =  L.AwesomeMarkers.icon({
  icon: 'users',
  markerColor: 'purple',
  prefix: 'fa',
  iconColor: 'black'
})
const foodIcon = L.AwesomeMarkers.icon({
  icon: 'cutlery',
  markerColor: 'green',
  prefix: 'fa',
  iconColor: 'black'
})
const waterIcon = L.AwesomeMarkers.icon({
  icon: 'tint',
  markerColor: 'blue',
  prefix: 'fa',
  iconColor: 'black'
})
const energyIcon = L.AwesomeMarkers.icon({
  icon: 'bolt',
  markerColor: 'orange',
  prefix: 'fa',
  iconColor: 'black'
})
const medicalIcon =  L.AwesomeMarkers.icon({
  icon: 'medkit',
  markerColor: 'red',
  prefix: 'fa',
  iconColor: 'black'
})
const openSpaceIcon =  L.AwesomeMarkers.icon({
  icon: 'tree',
  markerColor: 'green',
  prefix: 'fa',
  iconColor: 'black'
})
const shelterIcon = L.AwesomeMarkers.icon({
  icon: 'home',
  markerColor: 'blue',
  prefix: 'fa',
  iconColor: 'black'
})
const shieldIcon = L.AwesomeMarkers.icon({
  icon: 'shield',
  markerColor: 'pink',
  prefix: 'fa',
  iconColor: 'black'
})
const warningIcon = L.AwesomeMarkers.icon({
  icon: 'warning',
  markerColor: 'red',
  prefix: 'fa',
  iconColor: 'white'
})
const schoolIcon = L.AwesomeMarkers.icon({
  icon: 'graduation-cap',
  markerColor: 'purple',
  prefix: 'fa',
  iconColor: 'black'
})
const businessIcon = L.AwesomeMarkers.icon({
  icon: 'building',
  markerColor: 'white',
  prefix: 'fa',
  iconColor: 'black'
})
const cityHallIcon = L.AwesomeMarkers.icon({
  icon: 'university',
  markerColor: 'orange',
  prefix: 'fa',
  iconColor: 'black'
})
const healthCareIcon = L.AwesomeMarkers.icon({
  icon: 'ambulance',
  markerColor: 'white',
  prefix: 'fa',
  iconColor: 'red'
})
const bathIcon = L.AwesomeMarkers.icon({
  icon: 'bath',
  markerColor: 'blue',
  prefix: 'fa',
  iconColor: 'black'
})
const mapSignsIcon = L.AwesomeMarkers.icon({
  icon: 'map-signs',
  markerColor: 'blue',
  prefix: 'fa',
  iconColor: 'black'
})
const superPowersIcon = L.AwesomeMarkers.icon({
  icon: 'superpowers',
  markerColor: 'pink',
  prefix: 'fa',
  iconColor: 'black'
})
const markerIcon = L.AwesomeMarkers.icon({
  icon: 'map-marker',
  markerColor: 'blue',
  prefix: 'fa',
  iconColor: 'black'
})


function getIcon(layerName) {
  const icons = {
    "supplies": suppliesIcon,
    "staff": staffIcon,
    "food": foodIcon,
    "water": waterIcon,
    "energy or fuel": energyIcon,
    "medical": medicalIcon,
    "open space": openSpaceIcon,
    "shelter": shelterIcon,
    "Privately Owned Public Open Spaces": shieldIcon,
    "Park and Open Space": openSpaceIcon,
    "Seismic Hazard Zones": warningIcon,
    "Schools": schoolIcon,
    "Business Locations": businessIcon,
    "City Facilities": cityHallIcon,
    "Health Care Facilities": healthCareIcon,
    "Community Resiliency Indicator System": superPowersIcon,
    "Pit Stop Locations": bathIcon,
    "SF Find Neighborhoods": mapSignsIcon,
    'default': markerIcon,
  }
  return (icons[layerName] || icons["default"]);
}
