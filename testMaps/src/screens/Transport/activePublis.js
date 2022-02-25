import React from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Modal, Animated, Alert, ScrollView, RefreshControl } from 'react-native';
import { Card } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import { styles } from '../../../styles';
import { SEARCH_PLACEHOLDER, SEL_RECYCLE, SEL_GOODS, SEL_MOVING, SEL_CONSTMAT, SEL_APPLIANCES, PLUS_SIGN } from '../../images';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';

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
export default function ActivePublis(props){

    const [isTripModalVisible, setTripModalVisible] = React.useState(false);
    const [tripModalContent, setTripModalContent] = React.useState('');

    const [tripHistoryList, setTripHistoryList] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const getTripsFromApiAsync = async ( id ) => {
        setRefreshing(true);
        try {
          let response = await fetch(
            'http://10.0.2.2:3000/api/trips/fromid/t/' + id + '/false'
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

    function showTripModal(newval, content){
    setTripModalContent(content);
    setTripModalVisible(newval);
}
React.useEffect(()=>{
    getTripsFromApiAsync(props.authentication.user.data.id)
    },[])
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
        setRefreshing(false);
        setTripHistoryList(converted);
    }
    return(
        <View style={{width: '100%', height: '100%'}}>
            <View id='headerTop' style={{padding: 10,  position: 'absolute', zIndex: 10, backgroundColor: '#5465FF', width: '100%', elevation: 10}}>
                <Text style={{ fontFamily: 'sans-serif', fontSize: 26, color: 'white'}}>Publicaciones Activas</Text>
            </View>            
            <FlatList 
                style={{flex:1, width: '100%', height:'100%', marginTop: 46}}
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
                                <View style={{ backgroundColor:'#335822',alignItems: 'center', width: 80, height: 60, borderRadius: 10}}>
                                    <TouchableOpacity 
                                    
                                    style={[(item.accepted ? (item.dispatched ? (item.delivered ? {backgroundColor: 'red'} : {backgroundColor: '#606c88'}): {backgroundColor: 'orange'}) : {backgroundColor: 'green'}), {alignItems: 'center', width: 80, height: 57, borderRadius: 10, justifyContent: 'space-around'}]}
                                     onPress={() => showTripModal(true, item)}>
                                        <Text style={{fontSize: 16, color: 'white', textAlign: 'center'}}>{item.accepted ? (item.dispatched ? (item.delivered ? 'Entregado' : 'En viaje'): 'A despachar') : 'Activa'}</Text>
                                    </TouchableOpacity>
                                </View>
                        </View>
                    </View>
                </Card>
            }
        >
         </FlatList>
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
            userId: props.userId
        }
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

            { itemTrip.accepted ?  this.getTripStatus() : this.getOffers() }
            
        </LinearGradient>
      );
    }
  getOffers(){
      const itemTrip = this.state.tripData;
    return(
        <View>
            <Text>{itemTrip.isBid ? 'Ofertas: ' : 'Solicitudes:'} </Text>
            <View style={{backgroundColor: 'rgba(255,255,255,0.7)', width: 350, height: 200, borderRadius: 10, padding: 10}}>
                <FlatList 
                    style={{flex:1, width: '100%', height:'100%', borderRadius: 10}}
                    data= {itemTrip.offers}
                    keyExtractor={(item) => item.idTransport + '_' + item.bid}
                    ListEmptyComponent={<View style={{flex:1, width: '100%', height:'100%', justifyContent: 'center', alignItems: 'center'}}><Text>No hay ofertas para este viaje!</Text></View>}
                    renderItem={({item}) =>
                    this.doOffersItem(item)}
                />
            </View>
        </View>
    )
  }

  doOffersItem(offerData){
      return (
        <View style={[styles.searchResultsItem, {alignSelf:'center', marginTop: 15}]}>
            <TouchableOpacity style={styles.searchResultsItem} delayPressIn={0.4}>
                <Image style={styles.searchResultsImage} source={SEARCH_PLACEHOLDER}/>
                <View style={{flex: 1, height: '100%', justifyContent: 'space-evenly'}} >
                    <View style={{flex:1, justifyContent: 'center',height: '60%', alignItems: 'center'}}>
                        <Text>{offerData.name} {offerData.lastName}</Text>
                    </View>
                </View>
                <TouchableOpacity 
                style={{backgroundColor:'green',alignItems: 'center', width: '25%', height: '80%', marginRight: 7, borderRadius: 10, justifyContent: 'center'}} 
                onPress = {() => Alert.alert(
                    'Atención',
                    '¿Acepta la solicitud? Se le avisará al transportista para que busque el pedido.',
                    [
                        {
                            text: "Cancelar",
                        },
                        {
                            text: "Aceptar!",
                            onPress: () => this.sendTripAccepted (this.state.tripData.idTrip, offerData.idTransport, offerData.bid )//Envio un offer o request!Tengo que CERRAR VENTANA y REFRESCAR LISTA DE ITEMS (recargar la pagina)
                        }
                    ]
                    )}
                >
                    <Text style={styles.textPrice}> {offerData.bid != -1 ? ('$' + offerData.bid) : 'Tomar'}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
            
            
        </View>
      );
  }

  async sendTripAccepted(idTrip, idTransport, bid){
    try {
        let response = await fetch(
          'http://10.0.2.2:3000/api/trips/assignToTransport/' + idTrip + '/' + idTransport + '/' + bid
        );
        let json = await response.json()
        .then( Alert.alert('Se asignó al transportista para el viaje. ¡Esperá hasta que lo pase a buscar!') )
        .then(this.state.setTripModalVisible(false))
        .then(this.state.fetchTrips(this.state.userId))
        
      } catch (error) {
        Alert.alert(
          'Error',
          'Cannot contact server',)
        console.error(error);
      }
  }
  async sendTripUpdate(idTrip, update){
    try {
        var replyText;

        switch (update){
            case 'dispatched':
                replyText = 'Le avisamos al cliente que despachaste el envío.';
                break;
            case 'delivered':
                replyText = 'Le avisamos al cliente que entregaste el envío.'
                break;
            default:
                replyText ='Que estás queriendo hacer capo??'
        }
        let response = await fetch(
          'http://10.0.2.2:3000/api/trips/update/' + idTrip + '/' + update
          );
        let json = await response.json()
        .then( Alert.alert(
            replyText
            
            ) )
        .then(this.state.setTripModalVisible(false))
        .then(this.state.fetchTrips(this.state.userId))
        
      } catch (error) {
        Alert.alert(
          'Error',
          'Cannot contact server',)
        console.error(error);
      }
  }

  getTripStatus(){ //Para todo item, el botón debe CERRAR el Modal y refrescar los viajes...
    const itemTrip = this.state.tripData;
    if(itemTrip.accepted){
        if(!itemTrip.dispatched){ //"Vaya hasta la dirección indicada y confirmanos cuando hayas despachado 
        return(
            <View style={{backgroundColor: 'rgba(255,255,255,0.7)', width: '100%', height: 200, borderRadius: 10, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 20, textAlign:'center'}}>Avisanos cuando tengas el envío y estés en viaje. Tenés que recibirlo en {itemTrip.startAddress.address}.</Text>
                <TouchableOpacity 
                    style={{backgroundColor:'green',alignItems: 'center', width: 200, height: 50, borderRadius: 10, justifyContent: 'center', marginTop: 10, elevation: 10}}
                    onPress={() => Alert.alert(
                        'Atención',
                        'Se le avisará al cliente que despachaste el pedido.',
                        [
                            {
                                text: "Cancelar",
                            },
                            {
                                text: "Aceptar!",
                                onPress: () => this.sendTripUpdate(this.state.tripData.idTrip, 'dispatched' )
                            }
                        ]
                        )}
                    >
                    <Text style={{fontWeight: 'bold', fontSize: 14, textAlign:'center', color: 'white'}}>Lo despaché</Text>
                </TouchableOpacity>

            </View>
        )
        }
        if(itemTrip.dispatched){
            if(!itemTrip.delivered){//El transportista está en camino al destino.
                return(
                    <View style={{backgroundColor: 'rgba(255,255,255,0.7)', width: '100%', height: 200, borderRadius: 10, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20, textAlign:'center'}}>Avisanos cuando hayas entregado el paquete en destino. Tenés que entregarlo en {itemTrip.endAddress.address}.</Text>
                        <TouchableOpacity 
                            style={{backgroundColor:'green',alignItems: 'center', width: 200, height: 50, borderRadius: 10, justifyContent: 'center', marginTop: 10, elevation: 10}}
                            onPress={() => Alert.alert(
                                'Atención',
                                'Se le avisará al cliente que entregaste el pedido.',
                                [
                                    {
                                        text: "Cancelar",
                                    },
                                    {
                                        text: "Aceptar!",
                                        onPress: () => this.sendTripUpdate(this.state.tripData.idTrip, 'delivered' )
                                    }
                                ]
                                )} >
                            <Text style={{fontWeight: 'bold', fontSize: 14, textAlign:'center', color: 'white'}}>Lo entregué</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            if(itemTrip.delivered){
                if(!itemTrip.completed){//El transportista indicó que entregó el envío. Avisanos cuando corrobores la entrega!
                    return(
                        <View style={{backgroundColor: 'rgba(255,255,255,0.7)', width: '100%', height: 200, borderRadius: 10, paddingHorizontal: 10, justifyContent: 'center'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 20, textAlign:'center'}}>Esperá a que el cliente corrobore la entrega del pedido. Allí se te integrará el dinero del viaje.</Text>
                        </View>
                    )
                }
            }
        }
    }
    return(
        <View style={{backgroundColor: 'rgba(255,255,255,0.7)', width: '100%', height: 200, borderRadius: 10, padding: 10}}>
            <Text>El paquete no está aceptado, esto no se puede leer, LERO LERO!</Text>
        </View>
        )
  }
}
