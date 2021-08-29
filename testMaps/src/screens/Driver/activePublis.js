import React from 'react';
import { Text, View, Image, FlatList, Modal, Animated, Alert, RefreshControl } from 'react-native';
//import {Button as PaperButton} from 'react-native-paper';
//import { RatingStars } from '../../addons';

import { PLUS_SIGN } from '../../images';
import {SimpleCircleButton} from '../../SimpleCircleButton';
import {API_URL} from '../../constants';
import CardItem from '../../components/cardItem';
import {ActiveTripProfile} from '../../components/activePubliModalDriver'


export default function ActivePublis(props){

    const [isTripModalVisible, setTripModalVisible] = React.useState(false);
    const [tripModalContent, setTripModalContent] = React.useState('');

    const [tripHistoryList, setTripHistoryList] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [newPubliPulseSize, setNewPubliPulseSize] = React.useState(new Animated.Value(80));
    const [newPubliPulseOpacity, setNewPubliPulseOpacity] = React.useState(new Animated.Value(1));

    React.useEffect(()=>{
        getTripsFromApiAsync(props.authentication.user.data.id)
        },[])
    
    const getTripsFromApiAsync = async ( id ) => {
        setRefreshing(true);
        try {
          let response = await fetch(
            API_URL + 'api/trips/fromid/c/' + id + '/false'
          );
          let json = await response.json()
          .then( json => {convertStringsToAddresses(json.data)} )
          
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };

    function convertStringsToAddresses(data){
        var converted = data;
        converted.forEach( result => {
            result.startAddress = JSON.parse(result.startAddress);
            result.endAddress = JSON.parse(result.endAddress);
            result.offers = JSON.parse(result.offers);
            //console.log(result.offers);
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
        setRefreshing(false);
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
            <View id='headerTop' style={{padding: 10,  position: 'absolute', zIndex: 10, backgroundColor: 'rgba(122,217,211,1)', width: '100%', elevation: 10}}>
                <Text style={{ fontFamily: 'sans-serif-light', fontSize: 26}}>Publicaciones Activas</Text>
            </View>
            <View style = {{position: 'absolute', zIndex: 10, bottom: 30, right: 30, elevation: 10, justifyContent: 'center'}}>
                <SimpleCircleButton
                    circleDiameter = {80}
                    color = 'rgb(0,200,0)'
                    style={{justifyContent: 'center', alignContent: 'center' }}
                    onPress={() => props.navigation.navigate('TransportTypeSelector')}
                >
                     <Image source={PLUS_SIGN} style={{width: 15, height: 15}}/>
                </SimpleCircleButton>
                <Animated.View style={{width: newPubliPulseSize, height: newPubliPulseSize, position: 'absolute', alignSelf: 'center' ,backgroundColor: 'grey', zIndex: -1, borderRadius: 80, opacity: newPubliPulseOpacity}}>

                </Animated.View>
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
                    CardItem(item, setTripModalContent, setTripModalVisible)
            }
        >
         </FlatList>
         <Modal id="TransportProfileContainer" visible={isTripModalVisible}  animationType="slide" transparent={true} style={{alignItems: 'center', width: '100%'}}>
                    <ActiveTripProfile tripData={tripModalContent} fetchTrips={getTripsFromApiAsync} setTripModalVisible={setTripModalVisible} userId={props.authentication.user.data.id}></ActiveTripProfile>
         </Modal> 

        </View>
        
    )
}  


