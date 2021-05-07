import React from 'react';
import {View, Text} from 'react-native';
import {Button as PaperButton, IconButton} from 'react-native-paper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import LinearGradient from 'react-native-linear-gradient';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome'
import Geolocation from '@react-native-community/geolocation';

Geocoder.init("AIzaSyD2CxkX_56WjIzdYruMWqifM4xMtgOGpME"); //API Google





function getRegionForCoordinates(points) {
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

export default function SelectAddressScreen(props)  {
    const[createPubliData, setCreatePubliData] = React.useState(props.route.params.createPubliData);
    const[selectedStartAddress, setSelectedStartAddress] = React.useState({address: '', coords: {lat: 0, lng: 0}});
    const[selectedEndAddress, setSelectedEndAddress] = React.useState({address: '', coords: {lat: 0, lng: 0}});
    const[currentRegion, setRegion] = React.useState({latitude: -34.58, longitude: -58.42, latitudeDelta: 0.0922, longitudeDelta: 0.0421});
    const[markerStartAddress, setMarkerStartAddress] = React.useState();
    const[markerEndAddress, setMarkerEndAddress] = React.useState();

    const[submitAvailable, setSubmitAvailable] = React.useState();

    /*const[selectedLocations, setSelectedLocations] = React.useState([]);*/

    const refStart = React.useRef();
    const refEnd = React.useRef();

    const getLocationUser = async (addressKind) => { //addressKind: 'start' o 'end'
        await Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            Geocoder.from(position.coords.latitude, position.coords.longitude)
            .then(json => {
                if(addressKind =='start'){
                    setSelectedStartAddress({address: json.results[0].formatted_address, coords: {lat: position.coords.latitude, lng: position.coords.longitude}})
                    refStart.current?.setAddressText(json.results[0].formatted_address);
                }
                else{
                    setSelectedEndAddress({address: json.results[0].formatted_address, coords: {lat: position.coords.latitude, lng: position.coords.longitude}})
                    refEnd.current?.setAddressText(json.results[0].formatted_address);
                }
            })
          },
          error => {
             console.log(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      };


    function getMarkerFromSelectedAddress(value){
        if(selectedStartAddress.address == '' && selectedEndAddress.address == ''){}
        else{
            if(value == 'start'){
                setMarkerStartAddress(<Marker pinColor='orange' coordinate={{latitude: selectedStartAddress.coords.lat, longitude: selectedStartAddress.coords.lng}}/>);
                if(selectedEndAddress.address == ''){
                    setRegion( stateRegion => ({...stateRegion, latitude: selectedStartAddress.coords.lat, longitude: selectedStartAddress.coords.lng}));
                }
                else{
                    setRegion(getRegionForCoordinates([{latitude: selectedStartAddress.coords.lat, longitude: selectedStartAddress.coords.lng}, {latitude: selectedEndAddress.coords.lat, longitude: selectedEndAddress.coords.lng}])
                    );
                }
            }
            if( value == 'end' ){
                console.log('does it work')
                setMarkerEndAddress(<Marker coordinate={{latitude: selectedEndAddress.coords.lat, longitude: selectedEndAddress.coords.lng}}/>)
                if(selectedStartAddress.address == ''){
                    setRegion( stateRegion => ({...stateRegion, latitude: selectedEndAddress.coords.lat, longitude: selectedEndAddress.coords.lng}));
                }
                else{
                    setRegion(getRegionForCoordinates([{latitude: selectedStartAddress.coords.lat, longitude: selectedStartAddress.coords.lng}, {latitude: selectedEndAddress.coords.lat, longitude: selectedEndAddress.coords.lng}]));
                }
            }
        }
    }



      React.useEffect(()=>{
        setCreatePubliData(statecreatePubliData => ({...statecreatePubliData, startAddress: selectedStartAddress}))
        getMarkerFromSelectedAddress('start');
      },[selectedStartAddress])

    /*  React.useEffect(()=>{ USAR A FUTURO PARA RENDERIZAR VARIAS INSTANCIAS DE MARKERS DINAMICAMENTE
       console.log(selectedLocations);
      },[selectedLocations])

    */
      React.useEffect(()=>{
        setCreatePubliData(statecreatePubliData => ({...statecreatePubliData, endAddress: selectedEndAddress}))
        getMarkerFromSelectedAddress('end');
      },[selectedEndAddress])

      React.useEffect(() => {
        if (createPubliData.startAddress.address == '' || createPubliData.endAddress.address == '' ){
            setSubmitAvailable(false);
        }
        else{
            setSubmitAvailable(true);
        }
      },[createPubliData])
    return(

        <LinearGradient colors={['rgba(122,217,211,1)', 'rgba(0,212,255,1)']} start={{ x: 0.5, y: 0.5}} style={{ width:"100%", height: "100%", paddingHorizontal: '5%'}}>
            <View  style={{ width: '100%', height: '80%'}}>
                <Text style={{fontWeight: '100', fontSize: 26, marginBottom: 110, fontFamily: 'sans-serif-light', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>Seleccione trayecto:</Text>
                <View style={{width: '100%', position:'absolute', zIndex: 10, top: 40, flex: 1, flexDirection: 'row'}}>
                    <GooglePlacesAutocomplete
                    ref={refStart}
                    placeholder='Origen'
                    fetchDetails = {true}
                    onPress={(data, details = null) => {
                        setSelectedStartAddress({address: data.description, coords: details.geometry.location});
                    }}
                    query={{
                        key: 'AIzaSyD2CxkX_56WjIzdYruMWqifM4xMtgOGpME',
                        language: 'en',
                        components:'country:ar'
                    }}
                    />
                    <IconButton 
                        icon="compass" 
                        mode="contained" 
                        type="MaterialIcons"
                        //onPress = {()=> props.navigation.navigate('Sign In')}
                        onPress = {()=> getLocationUser('start')}

                        style={{width:40, height: 40, justifyContent: 'center', top:-4, paddingLeft:10}}>
                    </IconButton>
                </View>
                <View style={{width: '100%', position:'absolute', zIndex: 10, top: 90, flexDirection: 'row'}}>
                    <GooglePlacesAutocomplete
                    ref={refEnd}
                    placeholder='Destino'
                    fetchDetails = {true}
                    onPress={(data, details = null) => {
                        setSelectedEndAddress({address: data.description, coords: details.geometry.location});
                    }}
                    query={{
                        key: 'AIzaSyD2CxkX_56WjIzdYruMWqifM4xMtgOGpME',
                        language: 'en',
                        components:'country:ar'
                    }}
                    />
                     <IconButton  
                        icon="compass" 
                        mode="contained" 
                        //onPress = {()=> props.navigation.navigate('Sign In')}
                        onPress = {()=> getLocationUser('end')}

                        style={{width:40, height: 40, justifyContent: 'center', top:-4, paddingLeft:10}}>
                    </IconButton>
                </View>
                <View style={{width: '100%', height: '80%'}}>
                <MapView
                        style={{width:'100%', height: '100%'}}
                        region= {currentRegion}
                    >
                        {markerStartAddress}
                        {markerEndAddress}
                </MapView>
                    
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <PaperButton 
                    icon="note-outline" 
                    mode="contained" 
                    onPress = {()=> props.navigation.navigate('PubliType', {createPubliData})}
                    //onPress = {signUpUser}

                    style={{margin: 20, height: 60,width: 160, justifyContent: 'center'}} 
                    disabled={!submitAvailable}>
                    SIGUIENTE
                    </PaperButton>
                </View>
               
            </View>
            
        </LinearGradient>
    )
}