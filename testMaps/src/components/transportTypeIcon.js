import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

import { SEL_RECYCLE, SEL_GOODS, SEL_MOVING, SEL_CONSTMAT, SEL_APPLIANCES } from '../images';

export default function transportTypeIcon(transportType){
    switch (transportType){
        case 'mercaderia':
            return(
                <View style={[{backgroundColor: 'orange'}, stylesLocal.genericButton]}>
                    <Image source={SEL_GOODS} style={stylesLocal.iconStyle}/>
                </View>
            );
        case 'residuos':
            return(
                <View style={[{backgroundColor: 'green'}, stylesLocal.genericButton]}>
                    <Image source={SEL_RECYCLE} style={stylesLocal.iconStyle}/>
                </View>
            );
        case 'mudanzas':
            return(
                <View style={[{backgroundColor: '#35524A'}, stylesLocal.genericButton]}>
                    <Image source={SEL_MOVING} style={stylesLocal.iconStyle}/>
                </View>
            );

        case 'construccion':
            return(
            <View style={[{backgroundColor: 'brown'}, stylesLocal.genericButton]}>
                <Image source={SEL_CONSTMAT} style={stylesLocal.iconStyle}/>
            </View>
            );

        case 'electrodomesticos':
            return(
            <View style={[{backgroundColor: '#355A7FF'}, stylesLocal.genericButton]}>
                <Image source={SEL_APPLIANCES} style={stylesLocal.iconStyle}/>
            </View>);


    }
}
const stylesLocal = StyleSheet.create({
    genericButton: {
        borderRadius: 100,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconStyle: {
        width: 60,
        height: 60
    },
  });