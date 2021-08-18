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
        <Card >
                <Card.Title style={[{height: 20}]}>Viaje #{item.idTrip} - {item.title}</Card.Title>
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
                                <Text> Creado: {item.dateCreated}</Text>
                                <Text> Planeado: {item.dateExpected}</Text>
                                <Text> Tipo: {capitalize(item.transportType)}</Text>
                                <Text> Precio: ${item.bid}</Text>
                            </View>
                            <View style={[(item.accepted ? (item.dispatched ? (item.delivered ? {backgroundColor: '#870909'} : {backgroundColor: '#394052'}): {backgroundColor: '#995c02'}) : {backgroundColor: '#0f4000'}), styles.statusButtonShade]}>
                                <TouchableOpacity 
                                
                                style={[(item.accepted ? (item.dispatched ? (item.delivered ? {backgroundColor: 'red'} : {backgroundColor: '#606c88'}): {backgroundColor: 'orange'}) : {backgroundColor: 'green'}), styles.statusButton]}
                                    onPress={() => showTripModal(true, item)}>
                                    <Text style={{fontSize: 16, color: 'white', textAlign: 'center'}}>{item.accepted ? (item.dispatched ? (item.delivered ? 'Entregado' : 'En viaje'): 'Por despachar') : 'Activa'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View> 
                </Card>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    minimap: {
        width:80,
        height: 80,
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