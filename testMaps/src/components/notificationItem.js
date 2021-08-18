import React from 'react';
import { Text, View, Modal, Alert} from 'react-native';
import { Card } from 'react-native-elements';
import {Button as PaperButton} from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {ActiveTripProfile} from '../components/activePubliModal';
import {API_URL} from '../constants';
import { convertStringsToAddressesOneItem } from '../atoms';

export default class NotificationListItem extends React.Component {
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
            API_URL + 'api/trips/fromidTrip/' + id
          );
          let json = await response.json()
          .then( json => this.setState(prevState => ({...prevState, associatedTrip: convertStringsToAddressesOneItem(json.data)}))) //{this.setState(prevState => ({...prevState, associatedTrip: json.data}))}
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
            API_URL + 'api/userParam/t/' + id
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
                    <ActiveTripProfile tripData={this.state.associatedTrip} fetchTrips={this.state.getNotifsFromApiAsync()} setTripModalVisible={this.setTripModalVisible} userId={this.state.associatedTrip.idClient}/>
                 </Modal> 
            </Card>
        )
    }
    setTripModalVisible = (value) => {
      console.log("isrunning");
      this.setState(prevState => ({...prevState, isTripModalVisible: value}))
    }


    render() {
      return (
       this.getNotificationContent(this.state.item)
      )
    }
  }