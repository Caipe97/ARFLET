import React from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Animated, Alert, ScrollView } from 'react-native';
import { SEARCH_PLACEHOLDER, SEL_RECYCLE, SEL_GOODS, SEL_MOVING, SEL_CONSTMAT, SEL_APPLIANCES } from '../images';
import MapView, { Marker } from 'react-native-maps';
import { styles } from '../../styles';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import {API_URL} from '../constants';
import { getRegionForCoordinates, capitalize } from '../atoms';

export class HistoryTripProfile extends React.Component {

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

            <View style={{backgroundColor: 'rgba(255,255,255,0.7)', width: '100%', height: 200, borderRadius: 10, padding: 10}}>
                <Text>El paquete fue entregado correctamente por {this.state.transportName} {this.state.transportLastName}.</Text>
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