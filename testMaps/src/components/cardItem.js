import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { Card } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import { getRegionForCoordinates, capitalize } from '../atoms';

export default function CardItem( item, setTripModalContent, setTripModalVisible ){

    function showTripModal(newval, content){
        setTripModalContent(content);
        setTripModalVisible(newval);
    }

    return(
        <TouchableOpacity onPress={() => showTripModal(true, item)}>
            <Card containerStyle={{padding: 0}}>
                <View style={styles.container}>
                    <MapView
                        liteMode={true}
                        style={styles.minimap}
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
                    <View id='containerRightOfMaps' style={styles.containerRightOfMaps}>
                        <View>
                            <Text style={{height: 20, alignSelf: 'center'}}>Viaje #{item.idTrip} - {item.accepted ? (item.dispatched ? (item.delivered ? 'Entregado' : 'En viaje'): 'Por despachar') : 'Activa'}</Text>
                            <Text> T: {item.dateExpected}</Text>
                            <Text numberOfLines={1}> I: {capitalize(item.startAddress.address)}</Text>
                            <Text numberOfLines={1}> F: {capitalize(item.endAddress.address)}</Text>
                        </View>
                    </View>
                </View> 
            </Card>
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    minimap: {
        width: 100,
        height: '100%',
        marginRight: 10,
    },
    containerRightOfMaps: {
        flex: 1,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusButtonShade: {
        alignItems: 'center',
        width: 80,
        height: 60,
        borderRadius: 10,
        elevation: 3,
    },
    statusButton: {
        alignItems: 'center',
        width: 80,
        height: 57,
        borderRadius: 10,
        justifyContent: 'space-around',
    },
  });