//Atoms son aquellas funciones básicas que son reusadas en varios componentes. No requieren de módulos importados para funcionar.

export function getRegionForCoordinates(points) {
    // points should be an array of { latitude: X, longitude: Y }
    let minX, maxX, minY, maxY;
  
    // init first point
    ((point) => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);
  
    // calculate rect
    points.map((point) => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });
  
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = (maxX - minX) + (maxX - minX)/2;
    const deltaY = (maxY - minY) + (maxY - minY)/2;
  
    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY
    };
  }

export function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function convertStringsToAddresses(data){
  var converted = data;
  converted.forEach( result => {
      result.startAddress = JSON.parse(result.startAddress);
      result.endAddress = JSON.parse(result.endAddress);
      result.offers = JSON.parse(result.offers);
      //console.log(result.offers);
      switch(result.accepted){
          case 1:
              result.accepted = true;
              break;
          default:
              result.accepted = false;
      }
      switch(result.completed){
          case 1:
              result.completed = true;
              break;
          default:
              result.completed = false;
      }
  } )
  return converted;
}

export function convertStringsToAddressesOneItem(data){

  data.startAddress = JSON.parse(data.startAddress);
  data.endAddress = JSON.parse(data.endAddress);
  data.offers = JSON.parse(data.offers);
  console.log(data.offers);
  switch(data.accepted){
      case 1:
          data.accepted = true;
          break;
      default:
          data.accepted = false;
  }
  switch(data.completed){
      case 1:
          data.completed = true;
          break;
      default:
          data.completed = false;
  }
return data;
}