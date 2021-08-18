import React from 'react';
import { Text, View, FlatList, Alert, RefreshControl } from 'react-native';
import {API_URL} from '../../constants';
import NotificationListItem from '../../components/notificationItem';

export default function Notifications(props){

  const [notificationList, setNotificationList] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(()=>{
    getNotifsFromApiAsync(props.authentication.user.data.id, 'c')
  },[])

  const getNotifsFromApiAsync = async ( id, userType ) => {
    setRefreshing(true)
      try {
        let response = await fetch(
          API_URL + 'api/users/getNotifs/' + userType + '/' + id
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

    return(
        <View style={{width: '100%', height: '100%'}}>
            <View id='headerTop' style={{padding: 10,  position: 'absolute', zIndex: 10, backgroundColor: '#61D095', width: '100%'}}>
                <Text style={{ fontFamily: 'sans-serif-light', fontSize: 26}}>Notificaciones</Text>
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


  