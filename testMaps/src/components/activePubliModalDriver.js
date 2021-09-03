import React from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Animated, Alert, ScrollView, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styles } from '../../styles';
import { SEARCH_PLACEHOLDER } from '../images';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import {API_URL} from '../constants';
import { getRegionForCoordinates, capitalize } from '../atoms';
import  Emoji  from 'react-native-emoji';
import {Button as PaperButton} from 'react-native-paper';


const pasajerosAnotadosExample = {
    tripId: 23,
    maxPassengers: 4,
    passengerData: [
        {
            id: 1,
            name: 'Picukpo',
            profilePic: 'un profilePic'
        },
        {
            id: 2,
            name: 'manucrespo97',
            profilePic: 'un profilePic'
        },
        {
            id: 3,
            name: 'Camilo pluscuamperfecto',
            profilePic: 'un profilePic'
        }
    ]
}


export class ActiveTripProfile extends React.Component {

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
            colors={['rgb(50,118,119)', 'rgb(50,118,119)']}
            start={{ x: 0.5, y: 0.5}}
            style={stylesLocal.transportProfileWrapper} 
        >
        
            <View style={stylesLocal.closeBox}>
                <TouchableOpacity onPress={() => this.state.setTripModalVisible(false)}>
                    <Icon name='close' type='material-community' size={40}></Icon>
                </TouchableOpacity>
            </View>
            <View style={stylesLocal.mapViewContainer}>
                <MapView
                    liteMode={true}
                    style={stylesLocal.mapView}
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

            </View>
            <ScrollView contentContainerStyle={stylesLocal.SVProfileWrapper}>
            <Text>
                 Creado: {this.state.tripData.dateCreated}
            </Text>
            <View id='TextContainer' style={{backgroundColor: 'rgb(80,142,154)', borderRadius: 10, padding: 10, width: '95%', height: 180, justifyContent: 'space-around'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Emoji name="stopwatch" style={{fontSize: 22}} />
                    <Text style={stylesLocal.fromToText}>{this.state.tripData.dateExpected}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Emoji name="triangular_flag_on_post" style={{fontSize: 22}} />
                    <Text style={stylesLocal.fromToText}>{this.state.tripData.startAddress.address}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Emoji name="checkered_flag" style={{fontSize: 22}} />
                    <Text style={stylesLocal.fromToText}>{this.state.tripData.endAddress.address}</Text>
                </View>   
            </View>

            <Text style={{width: '100%', alignSelf:'flex-start', marginTop: 15}}>
                Descripción:
            </Text>
            <View style={stylesLocal.descriptionContainer}>
                <ScrollView>
                    <Text>{itemTrip.description}</Text>
                </ScrollView>
                
            </View>
            <Text style={{width: '100%', alignSelf:'flex-start', marginTop: 10}}>
                Pasajeros anotados:
            </Text>
            <BoardingPassengers data={pasajerosAnotadosExample} />

            
            {/*<Text style={stylesLocal.bidContainer}>
                {itemTrip.isBid? 'Precio base ': 'Precio'}: ${this.state.tripData.bid}
      </Text>*/}
            {/*De aca en adelante va el estado del envío! Hasta que se entrega...*/}

            { itemTrip.accepted ?  this.getTripStatus() : this.getOffersSV() }
            <PaperButton icon="trash-can" mode="contained" 
               onPress = {() => Alert.alert(
                'Atención',
                '¿Desea quitar la publicación? IMPLEMENTAR.',
                [
                    {
                        text: "Cancelar",
                    },
                    {
                        text: "Aceptar",
                        onPress: () => console.log('Implementar!')
                    }
                ]
                )} 
                style={{margin: 20, height: 40, justifyContent: 'center'}}>
                Eliminar publicación
              </PaperButton>
        </ScrollView>
        </LinearGradient>
      );
    }
  getOffers(){
      const itemTrip = this.state.tripData;
    return(
        <View>
            <Text>{itemTrip.isBid ? 'Ofertas: ' : 'Solicitudes de Pasajeros:'} </Text>
            <View style={{backgroundColor: 'rgba(255,255,255,0.7)', width: '10%', height: 200, borderRadius: 10, padding: 10}}>
                <FlatList 
                    style={{flex:1, width: '100%', height:'100%', borderRadius: 10}}
                    data= {itemTrip.offers}
                    keyExtractor={(item) => item.idTransport + '_' + item.bid}
                    ListEmptyComponent={
                        <View style={{flex:1, width: '100%', height:'100%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>
                                No hay ofertas para este viaje!
                            </Text>
                        </View>}
                    renderItem={({item}) =>
                    this.doOffersItem(item)}
                />
            </View>
        </View>
    )
  }

  getOffersSV(){
      const itemTrip = this.state.tripData;
      const offersData = [];

      itemTrip.offers.map((offer) =>{
          offersData.push(this.doOffersItem(offer))
      })
      return(
        <View>
            <Text>{itemTrip.isBid ? 'Ofertas: ' : 'Solicitudes de Pasajeros:'} </Text>
            <View style={{backgroundColor: 'rgba(255,255,255,0.7)', width: 350, height: 200, borderRadius: 10, padding: 10}}>
                <ScrollView nestedScrollEnabled={true}>
                    {offersData}
                </ScrollView>
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
                <View style={{flexDirection: 'column', width: '25%', height: '100%', justifyContent: 'space-evenly', paddingHorizontal: 5}}>
                    <TouchableOpacity 
                        style={{backgroundColor:'green',alignItems: 'center', width: '100%', height: '40%', marginRight: 7, borderRadius: 10, justifyContent: 'center'}} 
                        onPress = {() => Alert.alert(
                            'Atención',
                            '¿Acepta la solicitud? Se le avisará al transportista para que busque el pedido.',
                            [
                                {
                                    text: "Cancelar",
                                },
                                {
                                    text: "Aceptar",
                                    onPress: () => this.sendTripAccepted (this.state.tripData.idTrip, offerData.idTransport, offerData.bid )//Envio un offer o request!Tengo que CERRAR VENTANA y REFRESCAR LISTA DE ITEMS (recargar la pagina)
                                }
                            ]
                            )}
                    >
                        <Text style={styles.textPrice}> 
                            {offerData.bid != -1 ? ('$' + offerData.bid) : 'Tomar'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{backgroundColor:'red',alignItems: 'center', width: '100%', height: '40%', marginRight: 7, borderRadius: 10, justifyContent: 'center'}}
                        onPress = {() => Alert.alert(
                            'Atención',
                            '¿Desea quitar la solicitud de este usuario? IMPLEMENTAR.',
                            [
                                {
                                    text: "Cancelar",
                                },
                                {
                                    text: "Aceptar",
                                    onPress: () => console.log('Implementar!')
                                }
                            ]
                            )}
                        >
                        
                        <Text style={styles.textPrice}>Quitar</Text>
                    </TouchableOpacity>
                </View>
                
            </TouchableOpacity>
            
            
        </View>
      );
  }

  async sendTripAccepted(idTrip, idTransport, bid){
    try {
        let response = await fetch(
            API_URL + 'api/trips/assignToTransport/' + idTrip + '/' + idTransport + '/' + bid
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
        switch(props.authentication.user.data.carId){
            case true: //Si es un transport
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
                break;
            default: //Si es un Client
                replyText = '¡Se le avisó al transportista que recibiste el paquete!';
        }
        let response = await fetch(
            API_URL + 'api/trips/update/' + idTrip + '/' + update
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
        if(!itemTrip.dispatched){ //"El transportista está en camino a despachar tu paquete
        return(
            <View style={stylesLocal.statusTextContainer}>
                <Text style={stylesLocal.statusText}>
                    El transportista está en camino a despachar tu paquete! Esperá a que indique que lo haya despachado.
                </Text>
            </View>
        )
        }
        if(itemTrip.dispatched){
            if(!itemTrip.delivered){//El transportista está en camino al destino.
                return(
                    <View style={stylesLocal.statusTextContainer}>
                        <Text style={stylesLocal.statusText}>
                            El transportista está en camino al destino. Esperá a que indique que lo haya entregado.
                        </Text>
                    </View>
                )
            }
            if(itemTrip.delivered){
                if(!itemTrip.completed){//El transportista indicó que entregó el envío. Avisanos cuando corrobores la entrega!
                    return(
                        <View style={stylesLocal.statusTextContainer}>
                            <Text style={stylesLocal.statusText}>
                                El transportista indicó que el envío fue entregado. ¡Pulsá OK para corroborar la entrega!
                            </Text>
                            <TouchableOpacity 
                               style={{backgroundColor:'green',alignItems: 'center', width: 200, height: 50, borderRadius: 10, justifyContent: 'center', marginTop: 10, elevation: 10}}
                                onPress={() => Alert.alert(
                                    'Atención',
                                    'Pulsá Aceptar si recibiste el paquete.',
                                    [
                                        {
                                            text: "Cancelar",
                                        },
                                        {
                                            text: "Aceptar!",
                                            onPress: () => this.sendTripUpdate(this.state.tripData.idTrip, 'completed' )
                                        }
                                    ]
                                    )} >
                                <Text style={{fontWeight: 'bold', fontSize: 14, textAlign:'center', color: 'white'}}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
                if(itemTrip.completed) {
                    return(
                        <View style={stylesLocal.statusTextContainer}>
                            <Text>El paquete fue entregado correctamente!</Text>
                        </View>
                        )
                }
            }
        }
    }
    
  }
}

export class BoardingPassengers extends React.Component {



    constructor(props){
        super(props);
        this.state = {

            tripId: props.data.tripId,
            passengerData: props.data.passengerData,
            maxPassengers: props.data.maxPassengers
            
        }
    }
    
    render(){
        return(
            <Text>Hello!</Text>
        )
            
        
    }
}


const stylesLocal = StyleSheet.create({
    closeBox: {
        alignSelf: 'flex-end',
        right: 10,
        top: 10,
        position: 'absolute',
        zIndex: 10,
    },
    tripTitle: {
        fontFamily: 'sans-serif-medium',
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
        textShadowRadius: 20,
        textShadowOffset: {width: 0, height: 2},
        width: 305,
    },
    mapViewContainer: {
        width: '100%',
        height: 200,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    mapView: {
        width:'100%',
        height: '100%',
    },
    transportContainer: {
        alignContent: 'center',
        paddingLeft: 10,
    },
    fromToText: {
        fontFamily: 'sans-serif-medium',
        //paddingHorizontal: '5%',
        fontSize: 16,
        //alignSelf:'flex-start',
        color: 'white',
        maxWidth: '93%',
        textShadowRadius: 20,
        textShadowOffset: {width: 0, height: 2},
    },
    descriptionContainer: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        flex: 1,
        width: '100%',
        height: '80%',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
    },
    bidContainer: {
        fontSize: 30,
        color: 'white',
        textShadowRadius: 20,
        textShadowOffset: {width: 0, height: 2},
    
    },
    statusTextContainer: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        width: '100%',
        height: 200,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign:'center'
    },
    SVProfileWrapper: {
        
        alignSelf: 'center',
        borderRadius: 0,
        width: '100%',
        //backgroundColor: 'red',
        alignItems: 'center',
        
        paddingVertical: 10,
        

    },
    transportProfileWrapper: {
        flex: 1,
        alignSelf: 'center',
        borderRadius: 20,
        width: '95%',
        height: '95%',
        marginVertical: '5%',
        backgroundColor: 'red',
        padding: 0,
        alignItems: 'center',
        elevation: 10,

    },
  });