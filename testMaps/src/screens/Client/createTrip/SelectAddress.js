import React from 'react';
import {View, Text, Modal, Pressable, TouchableOpacity, TextInput} from 'react-native';
import {Button as PaperButton, IconButton} from 'react-native-paper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { styles} from '../../../../styles'
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
    const [isStartAddressModalVisible, setStartAddressModalVisible] = React.useState(false);
    const [isEndAddressModalVisible, setEndAddressModalVisible] = React.useState(false);

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

        <LinearGradient colors={['#5465FF', '#5465FF']} start={{ x: 0.5, y: 0.5}} style={{ width:"100%", height: "100%", paddingHorizontal: '5%'}}>
            <View  style={{ width: '100%', height: '80%'}}>
                <Text style={{ fontFamily: 'sans-serif', fontSize: 26, color: 'white', alignSelf: 'center', paddingTop: 10}}>Seleccione origen y destino:</Text>
                <View style={{ zIndex: 10, width: '100%', alignSelf:'center', paddingVertical: 10}}>
                    <View style={{flexDirection: 'row', width:'85%', alignSelf:'center',alignItems:'center'}}>
                        <Pressable 
                            onPress={() => setStartAddressModalVisible(true)}
                            style={{
                                backgroundColor: 'white',
                                width: "95%",
                                height: "90%",
                                borderRadius: 5    
                            }}
                            >
                            <View pointerEvents="none">
                            <TextInput 
                                value = {selectedStartAddress.address}
                                selection= {{start: 0}}
                                
                            />
                            </View>
                        </Pressable>
                        <IconButton 
                            icon="compass" 
                            mode="contained" 
                            type="MaterialIcons"
                            onPress = {()=> getLocationUser('start')}
                            color= 'white'
                            style={{width:35, height: 35}}>
                        </IconButton>
                    </View>
                    <View style={{flexDirection: 'row', width:'85%', alignSelf:'center',alignItems:'center'}}>
                        <Pressable 
                            onPress={() => setEndAddressModalVisible(true)}
                            style={{
                                backgroundColor: 'white',
                                width: "95%",
                                height: "90%",
                                borderRadius: 5    
                            }}
                            >
                            <View pointerEvents="none">
                                <TextInput 
                                    value = {selectedEndAddress.address}
                                    selection= {{start: 0}}
                                />
                            </View>
                        </Pressable>
                        <IconButton 
                            icon="compass" 
                            mode="contained" 
                            type="MaterialIcons"
                            color= 'white'
                            onPress = {()=> getLocationUser('end')}

                            style={{width:35, height: 35}}>
                        </IconButton>
                    </View>
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
                <Modal id="autocomplete_modal" visible={isStartAddressModalVisible}  animationType='fade' transparent={false} style={{alignItems: 'center', width: '100%'}}>
                <View style={{backgroundColor: '#EBF2FF', flex: 1}}>
                    <IconButton 
                        icon="arrow-left-box" 
                        mode="contained" 
                        type="MaterialIcons"

                        style={{width:50, height: 50}}
                        onPress= { () => {
                            setStartAddressModalVisible(false)
                        }}
                    />
                    <GooglePlacesAutocomplete
                        ref={refStart}
                        styles={{
                            textInputContainer: {
                            height:45,
                            marginHorizontal: 10,
                            },
                            listView: {
                                position:'absolute',
                                zIndex: 10,
                                marginTop:50,
                                height: '100%'
                            },
                            row: {
                                height: 50
                            }
                        }}
                        renderRightButton={() => (
                            ( refStart.current?.getAddressText() 
                                ? 
                                <TouchableOpacity 
                                    style={styles.clearButton}
                                onPress={() => { refStart.current?.setAddressText('')}} >
                                        <IconButton 
                                                icon="close-circle" 
                                                mode="contained" 
                                                type="Ionicons"
                                                style={{width:30, height: 32}}
                                            />
                                </TouchableOpacity> 
                            :
                                null )	)}
                        placeholder='Origen'
                        fetchDetails = {true}
                        onPress={(data, details = null) => {
                            setSelectedStartAddress({address: data.description, coords: details.geometry.location});
                            setStartAddressModalVisible(false);
                        }}
                        query={{
                            key: 'AIzaSyD2CxkX_56WjIzdYruMWqifM4xMtgOGpME',
                            language: 'es',
                            components:'country:ar'
                        }}
                        />
                </View>
            </Modal>
            <Modal id="autocomplete_modal" visible={isEndAddressModalVisible}  animationType='fade' transparent={false} style={{alignItems: 'center', width: '100%'}}>
                <View style={{backgroundColor: '#EBF2FF', flex: 1}}>
                    <IconButton 
                        icon="arrow-left-box" 
                        mode="contained" 
                        type="MaterialIcons"

                        style={{width:50, height: 50}}
                        onPress= { () => {
                            setEndAddressModalVisible(false)
                        }}
                    />
                    <GooglePlacesAutocomplete
                        ref={refEnd}
                        styles={{
                            textInputContainer: {
                            height:45,
                            marginHorizontal: 10,
                            },
                            listView: {
                                position:'absolute',
                                zIndex: 10,
                                marginTop:50,
                                height: '100%'
                            },
                            row: {
                                height: 50
                            }
                        }}
                        renderRightButton={() => (
                            ( refEnd.current?.getAddressText() 
                                ? 
                                <TouchableOpacity 
                                    style={styles.clearButton}
                                onPress={() => { refEnd.current?.setAddressText('')}} >
                                        <IconButton 
                                                icon="close-circle" 
                                                mode="contained" 
                                                type="Ionicons"
                                                style={{width:30, height: 32}}
                                            />
                                </TouchableOpacity> 
                            :
                                null )	)}
                        placeholder='Destino'
                        fetchDetails = {true}
                        onPress={(data, details = null) => {
                            setSelectedEndAddress({address: data.description, coords: details.geometry.location});
                            setEndAddressModalVisible(false);
                        }}
                        query={{
                            key: 'AIzaSyD2CxkX_56WjIzdYruMWqifM4xMtgOGpME',
                            language: 'es',
                            components:'country:ar'
                        }}
                        />
                </View>
            </Modal>
            </View>
            
        </LinearGradient>
    )
}