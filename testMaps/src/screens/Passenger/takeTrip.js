import React from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Modal, Animated, Alert, ScrollView} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { styles } from '../../../styles';
import {API_URL} from '../../constants';
import { SEL_RECYCLE, SEL_GOODS, SEL_MOVING, SEL_CONSTMAT, SEL_APPLIANCES } from '../../images';
import LinearGradient from 'react-native-linear-gradient';
import {IconButton} from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import NumberTextInput from 'rn-weblineindia-number-input';
import Draggable from '../../Draggable'

navigator.geolocation = require('@react-native-community/geolocation');
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


  function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
    }


function transportTypeIcon(transportType){ //Fijarse si podría incluirse otra característica en vez de transportTypes, suggestions son CANTIDAD DE PASAJEROS o TIPO DE VEHICULO
    return(
        <View style={{borderRadius: 100, backgroundColor: 'orange', width: 60, height: 60, justifyContent: 'center', alignItems: 'center', elevation: 3}}>
            <Image source={SEL_GOODS} style={{  width: 40, height: 40}}/>
        </View>
    );
}


export default function TomarViaje(props){

    const [isTripModalVisible, setTripModalVisible] = React.useState(false);
    const [tripModalContent, setTripModalContent] = React.useState('');
    const[currentRegion, setRegion] = React.useState({latitude: -34.58, longitude: -58.42, latitudeDelta: 0.0922, longitudeDelta: 0.0421});
    const[selectedStartAddress, setSelectedStartAddress] = React.useState({address: '', coords: {lat: 0, lng: 0}});
    const[selectedEndAddress, setSelectedEndAddress] = React.useState({address: '', coords: {lat: 0, lng: 0}});
    const [tripList, setTripList] = React.useState([]);
    const [searchResultsHeight, setSearchResultsHeight] = React.useState(new Animated.Value(-200));

    const [selectedMercaderia, setSelectedMercaderia] = React.useState(props.authentication.user.data.transportTypes.mercaderia);
    const [selectedResiduos, setSelectedResiduos] = React.useState(props.authentication.user.data.transportTypes.residuos);
    const [selectedConstruccion, setSelectedConstruccion] = React.useState(props.authentication.user.data.transportTypes.construccion);
    const [selectedMudanzas, setSelectedMudanzas] = React.useState(props.authentication.user.data.transportTypes.mudanzas);
    const [selectedElectro, setSelectedElectro] = React.useState(props.authentication.user.data.transportTypes.electrodomesticos);

    const [selectedStartRadio, setSelectedStartRadio] = React.useState(2);

    const refStart = React.useRef();
    const refEnd = React.useRef();


    React.useEffect(()=>{
        if(!tripList.length){ //vacío, escondo searchResults
            Animated.timing(searchResultsHeight, {
                toValue: -200,
                duration: 500,
                useNativeDriver: false,
            }).start();
        }
        else{ //Tiene por lo menos 1 item!
            Animated.timing(searchResultsHeight, {
                toValue: 5,
                duration: 500,
                useNativeDriver: false,
            }).start();
        }
    },[tripList]);

    React.useEffect(() =>{
        if(!selectedElectro && !selectedMercaderia && !selectedMudanzas && !selectedResiduos && !selectedConstruccion ){
            //No hay seleccionados
        }
        else{
            if(selectedStartAddress.address=='' && selectedEndAddress.address ==''){

            }
            else{
                fetchTrips();
            }
            
        }

    },[selectedElectro, selectedMercaderia, selectedMudanzas, selectedResiduos, selectedConstruccion])

    function flipMercaderia () {
        console.log('flippen');
        setSelectedMercaderia(!selectedMercaderia);
    }
    const flipResiduos = () =>{
        console.log('flippen');
        setSelectedResiduos(!selectedResiduos);
    }
    const flipConstruccion = () =>{
        setSelectedConstruccion(!selectedConstruccion);
    }
    const flipMudanzas = () =>{
        setSelectedMudanzas(!selectedMudanzas);
    }
    const flipElectro = () =>{
        setSelectedElectro(!selectedElectro);
    }

    /*function transportTypeIconMini(transportType){
        switch (transportType){
            case 'mercaderia':
                return(
                    <Draggable bgColor='orange' imageSource={SEL_GOODS} transportId='mercaderia' modifyFunction={()=>flipMercaderia()}/>
                );
            case 'residuos':
                return(
                    <Draggable bgColor='green' imageSource={SEL_RECYCLE} transportId='residuos' modifyFunction={()=>flipResiduos()}/>
                );
            case 'mudanzas':
                return(
                    <Draggable bgColor='#35524A' imageSource={SEL_MOVING} transportId='mudanzas' modifyFunction={flipMudanzas}/>
                );
    
            case 'construccion':
                return(
                    <Draggable bgColor='brown' imageSource={SEL_CONSTMAT} transportId='construccion' modifyFunction={flipConstruccion}/>
                );
    
            case 'electrodomesticos':
                return(
                    <Draggable bgColor='#35A7FF' imageSource={SEL_APPLIANCES} transportId='electrodomesticos' modifyFunction={flipElectro}/>);
    
    
        }
    }*/

    const getTransportTypes = (transportTypes) => { //Va a servir para generar los íconos de transportTypes a buscar. NO me sirve mas
        console.log("doing")
        var enabledTypes = [];
        var transportTypeKeys = Object.keys(transportTypes);
        transportTypeKeys.forEach( type =>{
            if(transportTypes[type] == true){
                enabledTypes.push(type);
            }
        })
        if( !(enabledTypes.length) ){
            return(<></>)
        }
        return (
            <></>
            //enabledTypes.map(type => (transportTypeIconMini(type))
            )
        
    }
    React.useEffect(()=>{
       getLocationUserForAddress('start');
    },[])

    React.useEffect(()=> {
        if(selectedStartAddress.address == '' && selectedEndAddress.address == ''){
        }
        else{
            if(selectedEndAddress.address == ''){
                setRegion(region => ({...region, latitude: selectedStartAddress.coords.lat, longitude: selectedStartAddress.coords.lng}))
            }else{
                if(selectedStartAddress.address == ''){
                    setRegion(region => ({...region, latitude: selectedEndAddress.coords.lat, longitude: selectedEndAddress.coords.lng}))
                }
                else{
                    setRegion( getRegionForCoordinates([{latitude: selectedEndAddress.coords.lat, longitude: selectedEndAddress.coords.lng}, {latitude: selectedStartAddress.coords.lat, longitude: selectedStartAddress.coords.lng}]) );
                }
            }
            fetchTrips();
        }
       
    }, [selectedStartAddress, selectedEndAddress, selectedStartRadio])
    
    const showTripModal =(newval, content) =>{
        setTripModalContent(content);
        setTripModalVisible(newval);
    }

    const getMarkersFromFetchedTrips =React.useMemo(() => {
        console.log("tripList:");
        console.log(tripList);
        
        if(tripList == []){return <></>}
        return (tripList.map(trip => (
            <>
            <Marker
            key = {trip.idTrip+'_start'}
            coordinate = {{latitude: trip.startAddress.coords.lat, longitude: trip.startAddress.coords.lng}}
            pinColor='yellow'
            />
            <Marker
            key = {trip.idTrip+'_end'}
            coordinate = {{latitude: trip.endAddress.coords.lat, longitude: trip.endAddress.coords.lng}}
            />
            </>
            )
        ))
    }, [tripList])

    const fetchTrips = async () => { //Se lo envio a la API para que me devuelva los viajes que cumplen cierto criterio
        let userData = props.authentication.user.data;
        console.log(selectedStartAddress)
        console.log(selectedEndAddress)
        try {
            console.log("Fetching trips...");
            let fetchRequest = API_URL + 'api/trips/fetchTrips';
          let response = await fetch( fetchRequest, {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                transportTypes: {
                    mercaderia: selectedMercaderia,
                    residuos: selectedResiduos,
                    mudanzas: selectedMudanzas,
                    electrodomesticos: selectedElectro,
                    construccion: selectedConstruccion,
                },
                startAddress: (selectedStartAddress.address == '' ? selectedEndAddress : selectedStartAddress), //Si startAddress está vacío, se lo cambia por selectedEndAddress (puede pasar!)
                endAddress: selectedEndAddress,
                areaRadio: selectedStartRadio*1000,

              })
          } );
          let json = await response.json()
          .then( json => {

              console.log(json)
              json.data.forEach(trip => {
                  trip.startAddress = JSON.parse(trip.startAddress);
                  trip.endAddress = JSON.parse(trip.endAddress);
                  trip.offers = JSON.parse(trip.offers);
              })
              setTripList(json.data);
          })
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };


    const getLocationUserForAddress = async (addressKind) => { //addressKind: 'start' o 'end'
        await Geolocation.getCurrentPosition(
          position => {
            Geocoder.from(position.coords.latitude, position.coords.longitude)
            .then(json => {
                console.log(json)
                if(addressKind =='start'){
                    setSelectedStartAddress({address: json.results[0].formatted_address, coords: {lat: position.coords.latitude, lng: position.coords.longitude}})
                    refStart.current?.setAddressText(json.results[0].formatted_address);
                }
                else{
                    //setRegion( getRegionForCoordinates([{latitude: position.coords.latitude, longitude: position.coords.longitude}, {latitude: selectedStartAddress.coords.lat, longitude: selectedStartAddress.coords.lng}]) );
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

    function convertStringsToJSON(data){
        var converted = data;
        converted.forEach( result => {
            result.startAddress = JSON.parse(result.startAddress);
            result.endAddress = JSON.parse(result.endAddress);
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
        
        setTripHistoryList(converted);
    }

    return(
        <View style={{flex:1}}>
            <LinearGradient colors={['#caf56e', '#addb4b']} start={{ x: 0.5, y: 0.1}} style={{ zIndex: 10, position: 'absolute', width: '100%', alignSelf:'center', paddingTop: 10, backgroundColor: 'rgba(122,217,211,1)', elevation: 20}}>
                <View style={{flexDirection: 'row', flex:1, width:'85%', alignSelf:'flex-end',alignItems:'center'}}>
                    <GooglePlacesAutocomplete
                    ref={refStart}
                    styles={{
                        textInputContainer: {
                          height:45,
                        },
                        listView: {
                            position:'absolute',
                            zIndex: 10,
                            marginTop:50,
                        },
                    }}
                    placeholder='Origen'
                    fetchDetails = {true}
                    onPress={(data, details = null) => {
                        setSelectedStartAddress({address: data.description, coords: details.geometry.location});
                    }}
                    query={{
                        key: 'AIzaSyD2CxkX_56WjIzdYruMWqifM4xMtgOGpME',
                        language: 'es',
                        components:'country:ar'
                    }}
                    />
                    <IconButton 
                        icon="compass" 
                        mode="contained" 
                        type="MaterialIcons"
                        //onPress = {()=> props.navigation.navigate('Sign In')}
                        onPress = {()=> getLocationUserForAddress('start')}

                        style={{width:35, height: 35, marginLeft:10}}>
                    </IconButton>
                </View>
                <View style={{flexDirection: 'row', flex:1, width:'85%', alignSelf:'flex-end', alignItems:'center'}}>
                    <GooglePlacesAutocomplete
                    ref={refEnd}
                    placeholder='Destino'
                    fetchDetails = {true}
                    styles={{
                        textInputContainer: {
                          height:45,
                        },
                        listView: {
                            position:'absolute',
                            zIndex: 10,
                            marginTop:50,
                        },
                    }}
                    onPress={(data, details = null) => {
                        setSelectedEndAddress({address: data.description, coords: details.geometry.location});
                    }}
                    query={{
                        key: 'AIzaSyD2CxkX_56WjIzdYruMWqifM4xMtgOGpME',
                        language: 'es',
                        components:'country:ar'
                    }}
                    />
                    <IconButton  
                        icon="compass" 
                        mode="contained" 
                        //onPress = {()=> props.navigation.navigate('Sign In')}
                        onPress = {()=> getLocationUserForAddress('end')}

                        style={{width:35, height: 35, marginLeft:10}}>
                    </IconButton>
                </View>
                <View style={{flexDirection: 'row', flex:1, justifyContent:'center', width:'100%'}}>
                    <View style={{flexDirection: 'row', flex:1, justifyContent:'center', width:'40%'}}>
                    </View>
                    <Text style={{ alignSelf:'center', fontSize: 18, paddingLeft: 3}}>Radio:  </Text>
                    <View style={{ borderWidth: 1, borderColor: 'purple', borderRadius: 10, height: 30, marginTop: 6, marginRight: 5, justifyContent: 'center' }}>
                    <Picker
                    selectedValue= {selectedStartRadio}
                    onValueChange={(value) => setSelectedStartRadio(value)}
                    style={{height:27, width: 110}}
                    >
                        <Picker.Item label={"2 KM"} value={2} key={'_'}/>
                        <Picker.Item label={"5 KM"} value={5} key={'_'}/>
                        <Picker.Item label={"10 KM"} value={10} key={'_'}/>
                        <Picker.Item label={"25 KM"} value={25} key={'_'}/>
                        <Picker.Item label={"50 KM"} value={50} key={'_'}/>
                    
                    </Picker> 
                </View>
                </View>
            </LinearGradient>
            <MapView 
                    style={{width: '100%', height: '100%'}}
                    region= {currentRegion}
                    //onTouchStart={() => setMapHighlight(1)}
                    showsUserLocation={true}

                >
                    <Circle center={{latitude: selectedStartAddress.coords.lat, longitude: selectedStartAddress.coords.lng}} radius={selectedStartRadio*1000} fillColor='rgba(0,0,255,0.1)' strokeColor='purple'/>
                    <Circle center={{latitude: selectedEndAddress.coords.lat, longitude: selectedEndAddress.coords.lng}}
                    radius={selectedEndAddress.address==''? 0 :selectedStartRadio*1000}
                    fillColor='rgba(0,0,255,0.1)'
                    strokeColor='purple'/>
                    {getMarkersFromFetchedTrips}

            </MapView>
            <Animated.View style={[styles.searchResultsHome, {bottom: searchResultsHeight}]}>
                <FlatList 
                    data= {tripList}
                    contentContainerStyle={{borderRadius: 6}}
                    keyExtractor={(item) => item.idTrip + '_'}
                    ListEmptyComponent={<View style={{alignSelf: 'center', width: '100%', height:'100%', justifyContent: 'center', alignItems: 'center', paddingTop:85}}><Text>No hay viajes en la zona seleccionada!</Text></View>}
                    renderItem={({item}) =>
                                    <View style={[styles.searchResultsItem, {alignSelf:'center', marginTop: 15}]}>
                                    <TouchableOpacity style={[styles.searchResultsItem, {paddingLeft: 10}]} delayPressIn={0.4}>
                                        {transportTypeIcon(item.transportType)}
                                        <View style={{flex: 1, height: '100%', justifyContent: 'space-evenly'}} >
                                            <View style={{flex:1, justifyContent: 'center',height: '60%', alignItems: 'center', paddingHorizontal: 10}}>
                                                <Text>{item.title}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity 
                                        style={{ alignItems: 'stretch',backgroundColor:'green',alignItems: 'center', width: '25%', height: '80%', marginRight: 7, borderRadius: 10, paddingTop: 5}} 
                                        onPress={() => showTripModal(true, item)}
                                        >
                                            <Icon name={item.isBid ? 'gavel' : 'dollar'} size={24} color='white'/>
                                            <Text style={styles.textPrice}>${item.bid}</Text>
                                        </TouchableOpacity>
                                    </TouchableOpacity>    
                                </View> 
                }
                />
            </Animated.View>
            
            <Modal id="TransportProfileContainer" visible={isTripModalVisible}  animationType="slide" transparent={true} style={{alignItems: 'center', width: '100%'}}>
                
                <TransportProfile tripData={tripModalContent} userData={props.authentication.user.data} fetchTrips={fetchTrips} setModalVisible={setTripModalVisible}></TransportProfile>

                </Modal> 
        </View>
        
        
    )
}  

class TransportProfile extends React.Component {

    width= new Animated.Value(200);
    borderRadius = new Animated.Value(7);
    opacityHireText = new Animated.Value(1.0);
    

    constructor(props){
        super(props);
        this.state = {
            fetchTrips: props.fetchTrips,
            tripData: props.tripData,
            hireButtonText: (props.tripData.isBid ? 'OFERTAR' : 'SOLICITAR DESPACHO'),
            textDisplay: 'flex',
            checkBoxDisplay: 'none',
            offerBid: 0,
            userData: props.userData,
            setModalVisible: props.setModalVisible,
            
        };
    }
    signUpForTrip(){
        return(
            <View style={{marginVertical: 10}}>
                <TouchableOpacity style={{backgroundColor: 'purple', alignItems: 'center', borderRadius: 10, height: 60, justifyContent: 'center'}}
                onPress = {() => Alert.alert(
                    'Atención',
                    '¿Está seguro de enviar solicitud para realizar este viaje? El cliente te avisará si te elige.',
                    [
                        {
                            text: "Cancelar",
                        },
                        {
                            text: "Ofertar",
                            onPress: () => this.sendOfferRequest( //Envio un offer o request!
                                {
                                    idTransport: this.state.userData.id,
                                    name: this.state.userData.name,
                                    lastName: this.state.userData.lastName,
                                    bid: -1,
                                    idTrip: this.state.tripData.idTrip
                                }
                                
                            )
                        }
                    ]
                    )}
                >
                    <Text style={{color: 'white', fontFamily: 'Roboto', fontWeight: 'bold', paddingHorizontal: 10}}>{this.state.hireButtonText}</Text>
                </TouchableOpacity>
        </View>
        )
    }

    async sendOfferRequest(offerData) {
        try {
            console.log("Sending Offer/Request...");
            let fetchRequest = API_URL + 'api/trips/postOffer';
          let response = await fetch( fetchRequest, {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  idTransport: offerData.idTransport,
                  name: offerData.name,
                  lastName: offerData.lastName,
                  bid: offerData.bid,
                  idTrip: offerData.idTrip
              })
          } );
          let json = await response.json()
          .then( json => console.log(json))
          .then(Alert.alert('Se le avisó al cliente de tu oferta.'))
          .then(() => this.state.setModalVisible(false))
          .then(()=> this.state.fetchTrips())
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };


    makeAnOffer(){
        return(
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name="dollar" size={30}></Icon>
                    <NumberTextInput
                        type='decimal'
                        locale='en'
                        value={this.state.offerBid}
                        onUpdate={(value)=> (this.setState(prevState => ({...prevState, offerBid: (value == null ? 0 : value)}))) }
                        returnKeyType={'done'}
                        style={{fontSize: 25, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 10, width: 150, margin: 5}}
                        allowNegative={false}
                    />
                
                
                </View>
                <TouchableOpacity
                onPress = {() => Alert.alert(
                    'Atención',
                    'Está seguro de querer ofertar $' + this.state.offerBid + '?',
                    [
                        {
                            text: "Cancelar",
                        },
                        {
                            text: "Ofertar",
                            onPress: () => this.sendOfferRequest( //Envio un offer o request!
                                {
                                    idTransport: this.state.userData.id,
                                    name: this.state.userData.name,
                                    lastName: this.state.userData.lastName,
                                    bid: this.state.offerBid,
                                    idTrip: this.state.tripData.idTrip
                                }
                            )
                        }
                    ]
                    )}
                style={[ {alignItems: 'center', borderRadius: 10, height: 60, justifyContent: 'center'}, (this.state.offerBid == null || this.state.offerBid < 1) ? {backgroundColor: 'grey'} : {backgroundColor:'purple'}]}
                disabled={this.state.offerBid == null || this.state.offerBid < 1}
                >
                    <Text style={{color: 'white', fontFamily: 'Roboto', fontWeight: 'bold'}}>{this.state.hireButtonText}</Text>
                </TouchableOpacity>
            </View>
            
        )
    }
        

    render() {
        const item = this.state.tripData;
      return (
        <LinearGradient colors={['#267871', '#136a8a']} start={{ x: 0.5, y: 0.5}} style={styles.transportProfileWrapper} >
            <View style={{alignSelf: 'flex-end', right: 10, top: 5, position: 'absolute', zIndex: 10}}>
                    <TouchableOpacity onPress={()=>this.state.setModalVisible(false)}>
                        <Icon name='close' type='material-community' size={40}></Icon>
                    </TouchableOpacity>
                </View>
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
            <Text style={{fontFamily: 'sans-serif-medium', textAlign: 'center', fontSize: 30, color: 'white', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>{this.state.tripData.title}</Text>
            <Text>Solicitado para: {this.state.tripData.dateExpected}. Creado: {this.state.tripData.dateCreated}</Text>
            <Text style={{marginVertical: 5, fontSize: 30, color: 'white', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>Costo: ${this.state.tripData.bid}</Text>
            <View style={{ width: '100%', alignItems: 'center',flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <MapView
                    liteMode={true}
                    style={{width:250, height: 150}}
                    region={getRegionForCoordinates([{latitude:item.startAddress.coords.lat,longitude:item.startAddress.coords.lng}, {latitude:item.endAddress.coords.lat,longitude:item.endAddress.coords.lng}])}
                >
                    <Marker
                        coordinate={{latitude:item.startAddress.coords.lat,longitude:item.startAddress.coords.lng}} 
                        identifier="mk1"
                        pinColor='orange'
                    ></Marker>
                    <Marker
                        coordinate={{latitude:item.endAddress.coords.lat,longitude:item.endAddress.coords.lng}} 
                        identifier="mk2"
                    ></Marker>
                </MapView>
                <View style={{alignContent: 'center',alignItems:'center'}}>
                    {transportTypeIcon(item.transportType)}
                    <Text style={{textAlign: 'center'}}>{capitalize(item.transportType)}</Text>
                </View>

            </View>
            <Text style={{marginVertical: 10,fontFamily: 'sans-serif-medium', fontSize: 16, color: 'white', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>Desde: {this.state.tripData.startAddress.address} {'\r\n'}Hasta: {this.state.tripData.endAddress.address}</Text>

            <Text style={{width: '100%', marginVertical: 10}}>Descripción:</Text>
            <View style={{backgroundColor: 'rgba(255,255,255,0.7)', width: '100%', height: 80, borderRadius: 10, padding: 10}}>
                <ScrollView>
                    <Text>{item.description}</Text>
                </ScrollView>
                
            </View>
                {checkHasAlreadyOffered(this.state.userData.id, this.state.tripData.offers) ? 
                <View style={{backgroundColor: 'rgba(155,155,155,0.4)', padding: 10, margin: 10}}>
                    <Text>Usted ya ofertó sobre esta publicación.</Text> 
                </View>
                
                : 
                (this.state.tripData.isBid ? this.makeAnOffer() : this.signUpForTrip())}
            </ScrollView>
        </LinearGradient>
        
      );
    }
  

}
function checkHasAlreadyOffered(idUser, offers){
    var did = false;

    offers.forEach(offer =>{
        if(offer.idTransport == idUser ){
            did = true;}
    })
    return did;
}