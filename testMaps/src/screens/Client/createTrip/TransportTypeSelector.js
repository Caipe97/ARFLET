import { Text, View, Image, Animated} from 'react-native';
import { SimpleCircleButton } from '../../../SimpleCircleButton';
import { SEL_APPLIANCES, SEL_CONSTMAT, SEL_GOODS, SEL_MOVING, SEL_RECYCLE } from '../../../images'
import * as React from 'react';
import { styles } from '../../../../styles';
import LinearGradient from 'react-native-linear-gradient';
import {Button as PaperButton} from 'react-native-paper';

export default function TransportTypeSelector(props) {
    const [createPubliData, setcreatePubliData] = React.useState(
        {
            idClient: props.authentication.user.data.id,
            idTransport: 'null',
            startAddress: {address: '', coords: {lat: 0, lng: 0}},
            endAddress: {address: '', coords: {lat: 0, lng: 0}},
            transportType: 'null',
            bid: 0,
            isBid: 0,
            title: 'null',
            description: 'null',
            accepted: 0,
            dispatched: 0,
            completed: 0,
            dateCreated: 'null',
            dateExpected: 'null',
            dateStarted: 'null',
            dateCompleted: 'null',
            rating: 0
            });
    
    const [submitAvailable, setSubmitAvailable] = React.useState(false);
    const [item1Position, setItem1Position] = React.useState(new Animated.Value(0));
    const [item2Position, setItem2Position] = React.useState(new Animated.Value(0));
    const [item3Position, setItem3Position] = React.useState(new Animated.Value(0));
    const [item4Position, setItem4Position] = React.useState(new Animated.Value(0));
    const [item5Position, setItem5Position] = React.useState(new Animated.Value(0));

    function handleTransportTypes(value){ //Tiene que ser solo 1

        setcreatePubliData(publiData => ({...publiData, transportType: value})  );
    }

    function isSelected(value) {
        if(value == createPubliData.transportType){
            return true;
        }
        return false;
    }

React.useEffect(()=>{
    Animated.parallel([
        Animated.timing(item1Position, {
            toValue: 100,
            duration: 1000,
            useNativeDriver: false
        }),
        Animated.timing(item2Position, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false
        }),
        Animated.timing(item3Position, {
            toValue: 120,
            duration: 1500,
            useNativeDriver: false
        }),
        Animated.timing(item4Position, {
            toValue: 120,
            duration: 1500,
            useNativeDriver: false
        }),
        Animated.timing(item5Position, {
            toValue: 120,
            duration: 1500,
            useNativeDriver: false
        }),
    ]).start()
},[])
React.useEffect(() =>{
    if(createPubliData.transportType == 'null'){
        setSubmitAvailable(false);
    }
    else{
        setSubmitAvailable(true);
    }
}, [createPubliData])

    return(
        <LinearGradient colors={['rgba(122,217,211,1)', 'rgba(0,212,255,1)']} start={{ x: 0.5, y: 0.5}} style={[styles.SelectorLinearGradient]}>
            <View style={{height: 300, paddingVertical: 14, alignSelf: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'sans-serif-light', fontSize: 22, color: 'black', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>¿Qué desea transportar?</Text>
            </View>
            <View style={[styles.ShipmentSelectorContainer]}>
                <Animated.View style={[isSelected('mercaderia') ? styles.SelectedTransportTypeContainer : (styles.NotSelectedTransportTypeContainer),
                {
                    position:'absolute', 
                    top: item1Position.interpolate({
                        inputRange:[0,100],
                        outputRange:[0, -200]
                    })
                }]}>
                    <SimpleCircleButton
                        circleDiameter = {120}
                        color = 'orange'
                        onPress = {() => handleTransportTypes('mercaderia')}
                    >
                        <Image 
                        style={styles.trip_transportTypeLogo}
                        source={ SEL_GOODS } 
                        resizeMode='stretch'
                        />

                        <Text style={{color: 'white'}}>Mercadería</Text>
                    </SimpleCircleButton>
                </Animated.View>
                <Animated.View style={[isSelected('mudanzas') ? styles.SelectedTransportTypeContainer :  styles.NotSelectedTransportTypeContainer,
            {
                position:'absolute', 
                top: item1Position.interpolate({
                    inputRange:[0,100],
                    outputRange:[0, -60]
                }),
                left: item1Position.interpolate({
                    inputRange:[0,100],
                    outputRange:[0, -130]
                })
            }]}>
                    <SimpleCircleButton
                        circleDiameter = {120}
                        color = '#35524A'
                        onPress = {() => handleTransportTypes('mudanzas')}
                    >
                        <Image 
                        style={styles.trip_transportTypeLogo}
                        source={ SEL_MOVING } 
                        />
                        <Text style={{color: 'white'}}>Mudanzas</Text>
                    </SimpleCircleButton>
                </Animated.View>
                <Animated.View style={[isSelected('construccion') ? styles.SelectedTransportTypeContainer :  styles.NotSelectedTransportTypeContainer,
            {
                position:'absolute', 
                top: item1Position.interpolate({
                    inputRange:[0,100],
                    outputRange:[0, -60]
                }),
                left: item1Position.interpolate({
                    inputRange:[0,100],
                    outputRange:[0, 130]
                })
            }]}>
                    <SimpleCircleButton
                        circleDiameter = {120}
                        color = 'brown'
                        onPress = {() => handleTransportTypes('construccion')}
                    >
                        <Image 
                        style={styles.trip_transportTypeLogo}
                        source={ SEL_CONSTMAT } 
                        />
                        <Text style={{color: 'white'}}>Construcción</Text>
                    </SimpleCircleButton>
                </Animated.View>
                <Animated.View style={[isSelected('residuos') ? styles.SelectedTransportTypeContainer :  styles.NotSelectedTransportTypeContainer,
            {
                position:'absolute', 
                top: item1Position.interpolate({
                    inputRange:[0,100],
                    outputRange:[0, 130]
                }),
                left: item1Position.interpolate({
                    inputRange:[0,100],
                    outputRange:[0, 80]
                })
            }]}>
                    <SimpleCircleButton
                        circleDiameter = {120}
                        color = 'green'
                        onPress = {() => handleTransportTypes('residuos')}
                    >
                        <Image 
                        style={styles.trip_transportTypeLogo}
                        source={ SEL_RECYCLE } 
                        />
                        <Text style={{color: 'white'}}>Residuos</Text>
                    </SimpleCircleButton> 
                </Animated.View>
                <Animated.View style={[isSelected('electrodomesticos') ? styles.SelectedTransportTypeContainer :  styles.NotSelectedTransportTypeContainer,
            {
                position:'absolute', 
                top: item1Position.interpolate({
                    inputRange:[0,100],
                    outputRange:[0, 130]
                }),
                left: item1Position.interpolate({
                    inputRange:[0,100],
                    outputRange:[0, -80]
                })
            }]}>
                    <SimpleCircleButton
                        circleDiameter = {120}
                        color = '#35A7FF'
                        onPress = {() => handleTransportTypes('electrodomesticos')}
                    >
                        <Image 
                        style={styles.trip_transportTypeLogo}
                        source={ SEL_APPLIANCES } 
                        />
                        <Text style={{color: 'white'}}>Electro</Text>
                    </SimpleCircleButton> 
                </Animated.View>
            </View>
            <View style= {{width: '100%', alignItems:'center', position:'absolute', bottom: 10}}>
                <PaperButton icon="note-outline"
                    mode="contained"
                    onPress = {()=> props.navigation.navigate('TitleDateDescription', {createPubliData})}
                    style={{margin: 20, height: 60, justifyContent: 'center', width: '40%'}}
                    disabled={!submitAvailable}>
                SIGUIENTE
                </PaperButton>
            </View>
            
        </LinearGradient>
    );
}