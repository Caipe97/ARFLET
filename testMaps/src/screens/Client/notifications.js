import React from 'react';
import { Text, View, Image, FlatList, Modal, Alert, RefreshControl } from 'react-native';
import { Card } from 'react-native-elements';
import {Button as PaperButton} from 'react-native-paper';
import { SEL_RECYCLE, SEL_GOODS, SEL_MOVING, SEL_CONSTMAT, SEL_APPLIANCES } from '../../images';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TripProfile} from './activePublis'

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
                    <Image source={SEL_RECYCLE} style={{ width: 60, height: 60}}/>);
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
export default function Notifications(props){

    const [isTripModalVisible, setTripModalVisible] = React.useState(false);
    const [notificationList, setNotificationList] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);


const getNotifsFromApiAsync = async ( id, userType ) => {
  setRefreshing(true)
    try {
      let response = await fetch(
        'http://10.0.2.2:3000/api/users/getNotifs/' + userType + '/' + id
      );
      let json = await response.json()
      .then( json => {setNotificationList(json.data)} )
      .then( setRefreshing(false))
      
    } catch (error) {
      Alert.alert(
        'Error',
        'Cannot contact server',)
      console.error(error);
    }
  };
  React.useEffect(()=>{
    getNotifsFromApiAsync(props.authentication.user.data.id, 'c')
  },[])

   
    return(
        <View style={{width: '100%', height: '100%'}}>
            <View id='headerTop' style={{paddingVertical: 8, paddingHorizontal: 10,  position: 'absolute', zIndex: 10, backgroundColor: '#5465FF', width: '100%', elevation: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{ fontFamily: 'sans-serif', fontSize: 26, color: 'white'}}>Notificaciones</Text>
            </View> 
            <FlatList 
                style={{flex:1, width: '100%', height:'100%', marginTop: 46}}
                data= {notificationList}
                keyExtractor={(item) => item.idTrip+'_'+item.idTransport+'_'+item.type}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={()=>getNotifsFromApiAsync(props.authentication.user.data.id, 'c')} />
                }
                ListEmptyComponent={<View style={{flex:1, width: '100%', height:'100%', justifyContent: 'center', alignItems: 'center', paddingTop: 30}}><Text>No tienes notificaciones!</Text></View>}
                renderItem={({item}) =>
                <NotificationListItem notifItem={item} getNotifsFromApiAsync={() =>getNotifsFromApiAsync}/>
            }
        >
         </FlatList>

        </View>
        
    )
}  

class NotificationListItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            item: props.notifItem,
            notificationName: '...',
            notificationLastName: '...',
            associatedTrip: {idTrip: 0, idClient: '0', idTransport: '0', startAddress: {address: 'null', coords:{lat: 0, lng: 0}}, endAddress: {address: 'null', coords:{lat: 0, lng: 0}}, transportType: 'mercaderia', bid: 0, isBid: 0, title:'null', description: 'null', accepted: 0, dispatched: 0, completed: 0, dateCreated: '1/1/1969', dateExpected: '1/1/1969', rating: 1, offers: [] },
            isTripModalVisible: false,
            getNotifsFromApiAsync: props.getNotifsFromApiAsync,
        }
    }
  
    componentDidMount() {
      this.getTripsFromApiAsync(this.state.item.idTrip);
      this.getTransportUserFromApiAsync(this.state.item.idTransport);
    }

    async getTripsFromApiAsync( id ){
        try {
          let response = await fetch(
            'http://10.0.2.2:3000/api/trips/fromidTrip/' + id
          );
          let json = await response.json()
          .then( json => this.convertStringsToJSON(json.data)) //{this.setState(prevState => ({...prevState, associatedTrip: json.data}))}
          .then( console.log("associatedTrip: "))
          .then( console.log(this.state.associatedTrip));
          
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };
  
    async getTransportUserFromApiAsync( id ){
        console.log("id is: "+id);
        try {
          let response = await fetch(
            'http://10.0.2.2:3000/api/userParam/t/' + id
          );
          let json = await response.json()
          .then(json => this.setState(prevState => ({...prevState, notificationName: json.data.name, notificationLastName: json.data.lastName})) ) //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };


    getNotificationContent(item){
        let transportName = this.state.notificationName;
        let transportLastName = this.state.notificationLastName;
        let iconName = '';
        let textTitle = <Text>Title Placeholder</Text>
        let text = <Text>Placeholder</Text>;

        if(item.type == 'newOffer'){
            textTitle = <Card.Title>Viaje #{item.idTrip} - ¡Nueva Oferta de transportista!</Card.Title>;
            iconName = 'gavel';
            text = <Text style={{paddingHorizontal: 10, width: 320}}>{transportName} {transportLastName} ofreció ${item.offer} por tu viaje.</Text>;

        }
        if(item.type == 'newTripRequest'){
            textTitle =  <Card.Title>Viaje #{item.idTrip} - ¡Nueva Solicitud de transportista!</Card.Title>;
            iconName = 'hand-holding-usd';
            text = <Text style={{paddingHorizontal: 10, width: 320}}>{transportName} {transportLastName} se ofreció para realizar tu viaje.</Text>;

        }
        if(item.type == 'dispatched'){
            textTitle = <Card.Title>Viaje #{item.idTrip} - ¡Envío despachado!</Card.Title>;
            iconName = 'box';
            text = <Text style={{paddingHorizontal: 10, width: 320}}>Tu envío #{item.idTrip} fue despachado por {transportName} {transportLastName} y está en tránsito a destino.</Text>;

        }
        if(item.type == 'arrived'){
            textTitle = <Card.Title>Viaje #{item.idTrip} - ¡Envío entregado!</Card.Title>;
            iconName = 'box-open';
            text = <Text style={{paddingHorizontal: 10, width: 320}}>Tu envío #{item.idTrip} llegó a destino y fue entregado por {transportName} {transportLastName}.</Text>;
        }
        return(
            <Card>
                {textTitle}
                <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}}>
                    <Icon name={iconName} size={30}/>
                   {text}
                </View>
                <PaperButton onPress={() => this.setState(prevState => ({...prevState, isTripModalVisible: true}))} mode='contained'>Ver Publicación</PaperButton>
                <Modal id="TransportProfileContainer" visible={this.state.isTripModalVisible}  animationType="slide" transparent={true} style={{alignItems: 'center', width: '100%'}}>
                    <TripProfile tripData={this.state.associatedTrip} fetchTrips={this.state.getNotifsFromApiAsync()} setTripModalVisible={this.setTripModalVisible} userId={this.state.associatedTrip.idClient}/>
                 </Modal> 
            </Card>
        )
    }
    setTripModalVisible = (value) => {
      console.log("isrunning");
      this.setState(prevState => ({...prevState, isTripModalVisible: value}))
    }
    convertStringsToJSON(data){

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
        
        this.setState(prevState => ({...prevState, associatedTrip: data}))
    }


    render() {
      return (
       this.getNotificationContent(this.state.item)
      )
    }
  }

  