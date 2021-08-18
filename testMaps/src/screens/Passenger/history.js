import React from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Modal, Animated, Alert, ScrollView, RefreshControl } from 'react-native';
import { Card } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import { styles } from '../../../styles';
import { SEL_RECYCLE, SEL_GOODS, SEL_MOVING, SEL_CONSTMAT, SEL_APPLIANCES, PLUS_SIGN } from '../../images';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import {API_URL} from '../../constants';
import { getRegionForCoordinates, capitalize} from '../../atoms';

function transportTypeIcon(transportType){
    switch (transportType){
        case 'mercaderia':
            return(
                <View style={{borderRadius: 100, backgroundColor: 'orange', width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={SEL_GOODS} style={{  width: 60, height: 60}}/>
                </View>
            );
        case 'residuos':
            return(
                <View style={{borderRadius: 100, backgroundColor: 'green', width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={SEL_RECYCLE} style={{ width: 60, height: 60}}/>
                </View>
            );
        case 'mudanzas':
            return(
                <View style={{borderRadius: 100, backgroundColor: '#35524A', width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={SEL_MOVING} style={{width: 60, height: 60}}/>
                </View>
            );

        case 'construccion':
            return(
            <View style={{borderRadius: 100, backgroundColor: 'brown', width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={SEL_CONSTMAT} style={{width: 60, height: 60}}/>
            </View>
            );

        case 'electrodomesticos':
            return(
            <View style={{borderRadius: 100, backgroundColor: '#355A7FF', width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={SEL_APPLIANCES} style={{width: 60, height: 60}}/>
            </View>);
    }
}



export default function History(props){

    const [isTripModalVisible, setTripModalVisible] = React.useState(false);
    const [tripModalContent, setTripModalContent] = React.useState('');

    const [tripHistoryList, setTripHistoryList] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const getTripsFromApiAsync = async ( id ) => {
        setRefreshing(true);
        try {
          let response = await fetch(
            API_URL + 'api/trips/fromid/t/' + id + '/true'
          );
          let json = await response.json()
          .then( json => {convertStringsToJSON(json.data)} )
          
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };


    React.useEffect(()=>{
    getTripsFromApiAsync(props.authentication.user.data.id)
    },[])
    
    function showTripModal(newval, content){
    setTripModalContent(content);
    setTripModalVisible(newval);
}
    function convertStringsToJSON(data){
        var converted = data;
        converted.forEach( result => {
            result.startAddress = JSON.parse(result.startAddress);
            result.endAddress = JSON.parse(result.endAddress);
            result.offers = JSON.parse(result.offers);
            console.log(result.offers);
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
        setRefreshing(false)
    }
    const testTripHistory = [{
        idTrip: '1', 
        idClient: '123', 
        idTransport: '123', 
        startAddress: {address: 'Av. Jorge Newbery 9041, Rosario, Santa Fe, Argentina', coords: {lat: -32.95391828391403, lng:-60.69664115103667}},
        endAddress: {address: 'Cerviño 3244, Buenos Aires, Argentina', coords: {lat: -34.581264548382585, lng: -58.40575923044212}},
        transportType: 'mercaderia',
        bid: '300',
        title: 'Enviar bolsas de perros',
        description: 'Ya la Luna baja en camisón A bañarse en un charquito con jabón Ya la Luna baja en tobogán Revoleando su sombrilla de azafrán',
        accepted: false,
        completed: false,
        dateCreated: '',
        dateExpected: '22/01/21',
        dateStarted: '22/01/21',
        dateCompleted: '23/01/21',
        rating: 4,
    },
]
    return(
        <View style={{width: '100%', height: '100%'}}>
            <View id='headerTop' style={{padding: 10,  position: 'absolute', zIndex: 10, backgroundColor: '#8CA4A6', width: '100%', elevation: 10}}>
                <Text style={{ fontFamily: 'sans-serif-light', fontSize: 26}}>Historial de Viajes</Text>
            </View>
            <FlatList 
                style={{flex:1, width: '100%', height:'100%', marginTop: 46, backgroundColor: '#F2F2F2'}}
                data= {tripHistoryList}
                keyExtractor={(item) => item.idTrip+''}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={()=>getTripsFromApiAsync(props.authentication.user.data.id)} />
                  }
                ListEmptyComponent={<View style={{flex:1, width: '100%', height:'100%', justifyContent: 'center', alignItems: 'center', paddingTop: 30}}><Text>No hay viajes!</Text></View>}
                renderItem={({item}) => 
                <Card>
                    <Card.Title style={{height: 20}}>Viaje #{item.idTrip} - {item.title}</Card.Title>
                   
                        <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
                            <MapView
                                liteMode={true}
                                style={{width:80, height: 80, marginRight: 10}}
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
                            <View id='containerRightOfMaps' style={{flex: 1, height: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <View>
                                    <Text> Creado: {item.dateCreated}</Text>
                                    <Text> Planeado: {item.dateExpected}</Text>
                                    <Text> Tipo: {capitalize(item.transportType)}</Text>
                                    <Text> Precio: ${item.bid}</Text>
                                </View>
                                <View style={{ backgroundColor:'black',alignItems: 'center', width: 80, height: 60, borderRadius: 10}}>
                                    <TouchableOpacity 
                                    
                                    style={{backgroundColor: '#606c88', alignItems: 'center', width: 80, height: 57, borderRadius: 10, justifyContent: 'space-around'}}
                                     onPress={() => showTripModal(true, item)}>
                                        <Text style={{fontSize: 16, color: 'white', textAlign: 'center'}}> Detalles </Text>
                                    </TouchableOpacity>
                                </View>
                        </View>
                    </View>
                    

                        
                </Card>
            }
        >
         </FlatList >
         <Modal id="TransportProfileContainer" visible={isTripModalVisible}  animationType="slide" transparent={true} style={{alignItems: 'center', width: '100%'}}>
                    <TripProfile tripData={tripModalContent} fetchTrips={getTripsFromApiAsync} setTripModalVisible={setTripModalVisible} userId={props.authentication.user.data.id}></TripProfile>
         </Modal> 

        </View>
        
    )
}  

export class TripProfile extends React.Component {

    width= new Animated.Value(200);
    borderRadius = new Animated.Value(7);
    opacityHireText = new Animated.Value(1.0);
    

    constructor(props){
        super(props);
        this.state = {
            tripData: props.tripData,
            hireButtonText: 'CONTRATAR',
            textDisplay: 'flex',
            checkBoxDisplay: 'none',
            setTripModalVisible: props.setTripModalVisible,
            fetchTrips: props.fetchTrips,
            userId: props.userId,
            transportName: 'Loading...',
            transportLastName: 'Loading...'
            
        }
    }
    componentDidMount() {
        this.getTransportUserFromApiAsync(this.state.tripData.idTransport);
      }
    render() {
        const itemTrip = this.state.tripData;
      return (

        <LinearGradient
            colors={itemTrip.accepted? (itemTrip.dispatched ? (itemTrip.delivered ? ['#add100', '#7b920a'] : ['#606c88','#3f4c6b'] ) :['#ffc500', '#ff9900']) :['rgba(122,217,211,1)', 'rgba(0,212,255,1)']}
            start={{ x: 0.5, y: 0.5}}
            style={styles.transportProfileWrapper} 
        >
            <View style={{alignSelf: 'flex-end', right: 10, top: 10, position: 'absolute', zIndex: 10}}>
                        <TouchableOpacity onPress={() => this.state.setTripModalVisible(false)}>
                            <Icon name='close' type='material-community' size={40}></Icon>
                        </TouchableOpacity>
                    </View>
            <Text numberOfLines={2} style={{fontFamily: 'sans-serif-medium', textAlign: 'center', fontSize: 30, color: 'white', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}, width: 305}}>{this.state.tripData.title}</Text>
            <Text>Solicitado para: {this.state.tripData.dateExpected}. Creado: {this.state.tripData.dateCreated}</Text>
            <View style={{flex: 1, width: '100%', alignItems: 'center',flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <MapView
                    liteMode={true}
                    style={{width:250, height: 150}}
                    region={getRegionForCoordinates([{latitude:itemTrip.startAddress.coords.lat,longitude:itemTrip.startAddress.coords.lng}, {latitude:itemTrip.endAddress.coords.lat,longitude:itemTrip.endAddress.coords.lng}])}
                >
                    <Marker
                        coordinate={{latitude:itemTrip.startAddress.coords.lat,longitude:itemTrip.startAddress.coords.lng}} 
                        identifier="mk1"
                        pinColor='orange'
                    ></Marker>
                    <Marker
                        coordinate={{latitude:itemTrip.endAddress.coords.lat,longitude:itemTrip.endAddress.coords.lng}} 
                        identifier="mk2"
                    ></Marker>
                </MapView>
                <View style={{alignContent: 'center', paddingLeft: 10}}>
                    {transportTypeIcon(itemTrip.transportType)}
                    <Text style={{textAlign: 'center'}}>{capitalize(itemTrip.transportType)}</Text>
                </View>

            </View>
            <Text style={{fontFamily: 'sans-serif-medium', fontSize: 16, color: 'white', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>Desde: {this.state.tripData.startAddress.address} {'\r\n'}Hasta: {this.state.tripData.endAddress.address}</Text>

            <Text style={{width: '100%'}}>Descripción:</Text>
            <View style={{backgroundColor: 'rgba(255,255,255,0.7)', width: '100%', height: 80, borderRadius: 10, padding: 10}}>
                <ScrollView>
                    <Text>{itemTrip.description}</Text>
                </ScrollView>
                
            </View>
            
            <Text style={{fontSize: 30, color: 'white', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>{itemTrip.isBid? 'Precio base ': 'Precio'}: ${this.state.tripData.bid}</Text>
            {/*De aca en adelante va el estado del envío! Hasta que se entrega...*/}

            <View style={{backgroundColor: 'rgba(255,255,255,0.7)', width: '100%', height: 200, borderRadius: 10, padding: 10, justifyContent: 'center'}}>
                <Text style={{fontSize: 24, textAlign: 'center'}}>Entregaste el paquete en tiempo y forma. Recibiste ${itemTrip.bid} por el traslado.</Text>
            </View>
            
        </LinearGradient>
      );
    }

    async getTransportUserFromApiAsync( id ){
        console.log("id is: "+id);
        try {
          let response = await fetch(
            API_URL + 'api/userParam/t/' + id
          );
          let json = await response.json()
          .then(json => this.setState(prevState => ({...prevState, transportName: json.data.name, transportLastName: json.data.lastName})) ) //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };
}
