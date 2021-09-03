import React from 'react';
import { Text, View, FlatList, Modal, Alert, RefreshControl } from 'react-native';

import {API_URL} from '../../constants';
import CardItem from '../../components/cardItem';
import { HistoryTripProfile } from '../../components/historyPubliModal';
import { convertStringsToAddresses } from '../../atoms';


export default function History(props){

    const [isTripModalVisible, setTripModalVisible] = React.useState(false);
    const [tripModalContent, setTripModalContent] = React.useState('');

    const [tripHistoryList, setTripHistoryList] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const getTripsFromApiAsync = async ( id ) => {
        setRefreshing(true);
        try {
          let response = await fetch(
            API_URL + 'api/trips/fromid/c/' + id + '/true'
          );
          let json = await response.json()
          .then( json => {
            setTripHistoryList(convertStringsToAddresses(json.data))
            setRefreshing(false)
                }
            )
          
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
            <View id='headerTop' style={{padding: 10,  position: 'absolute', zIndex: 10, backgroundColor: 'rgb(24,54,100)', width: '100%', elevation: 10}}>
                <Text style={{ fontFamily: 'sans-serif', fontSize: 26, color: 'white'}}>Historial de Viajes</Text>
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
                CardItem(item, setTripModalContent, setTripModalVisible)
            }
        >
         </FlatList >
         <Modal id="TransportProfileContainer" visible={isTripModalVisible}  animationType="slide" transparent={true} style={{alignItems: 'center', width: '100%'}}>
                    <HistoryTripProfile tripData={tripModalContent} fetchTrips={getTripsFromApiAsync} setTripModalVisible={setTripModalVisible} userId={props.authentication.user.data.id}></HistoryTripProfile>
         </Modal> 

        </View>
        
    )
}  
