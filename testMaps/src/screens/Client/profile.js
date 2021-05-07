import React from 'react';
import { Text, View, Image, Alert} from 'react-native';
import { SEARCH_PLACEHOLDER, SEL_RECYCLE, SEL_GOODS, SEL_MOVING, SEL_CONSTMAT, SEL_APPLIANCES } from '../../images';
import { Button as PaperButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../../../styles';


function transportTypeIcon(transportType){
    switch (transportType){
        case 'mercaderia':
            return(
                <View style={{margin: 5, borderRadius: 100, backgroundColor: 'orange', width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={SEL_GOODS} style={{  width: 50, height: 50}}/>
                </View>
            );
        case 'residuos':
            return(
                <View style={{margin: 5, borderRadius: 100, backgroundColor: 'green', width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={SEL_RECYCLE} style={{ width: 50, height: 50}}/>
                </View>
            );
        case 'mudanzas':
            return(
                <View style={{margin: 5, borderRadius: 100, backgroundColor: '#35524A', width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={SEL_MOVING} style={{width: 50, height: 50}}/>
                </View>
            );

        case 'construccion':
            return(
            <View style={{margin: 5, borderRadius: 100, backgroundColor: 'brown', width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={SEL_CONSTMAT} style={{width: 50, height: 50}}/>
            </View>
            );

        case 'electrodomesticos':
            return(
            <View style={{margin: 5, borderRadius: 100, backgroundColor: '#35A7FF', width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={SEL_APPLIANCES} style={{width: 50, height: 50}}/>
            </View>
            );


    }
}


function getTransportTypes(transportTypes){ 
    var enabledTypes = [];
    var transportTypeKeys = Object.keys(transportTypes);
    transportTypeKeys.forEach( type =>{
        if(transportTypes[type] == true){
            enabledTypes.push(type);
        }
    })
    if( !(enabledTypes.length) ){
        return(<Text>No hay tipos de transporte habilitados!</Text>)
    }
    return (

        enabledTypes.map(type => (
            transportTypeIcon(type)
            )
        )
    )
}




export default function Profile(props){
    let profileData = props.authentication.user.data;
    const [pressedLogOut, setPressedLogOut] = React.useState(false);


    const getCarFromIdApiAsync = async () => {
        try {
          let response = await fetch(
            'http://10.0.2.2:3000/api/carsfromId/' + profileData.carId
          );
          let json = await response.json()
          .then( json => setCar(json.data));
          
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };
      
      React.useEffect(() => {
          console.log(props);
        if(pressedLogOut){
            props.logOutUser();
            console.log("Logging you out.");
            props.navigation.navigate('Sign In');
            
        }
    }, [pressedLogOut])

    
    return(
        <LinearGradient colors={['#3498db', '#2c3e50']} start={{ x: 0.5, y: 0.5}} style={styles.GenericLinearGradient} >

            <View style={{backgroundColor: 'white', width: '90%', height: 490, alignSelf: 'center', backgroundColor: 'rgb(200,200,200)', marginTop: 70}}>
                <Image source={SEARCH_PLACEHOLDER} style={{  width: 150, height: 150, alignSelf: 'center', top: -80}}/>
                <View id='container Items inside grey box' style={{width:'95%', height: 400, backgroundColor: 'rgb(200,200,200)', alignSelf: 'center', top: -80, alignItems: 'center'}}>
                    <Text style={{fontFamily: 'sans-serif-medium', textAlign: 'center', fontSize: 30, color: 'white', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>{profileData.name} {profileData.lastName}</Text>
                    <View id= 'emailContainer' style={{ elevation: 8, backgroundColor: 'white', width: '90%', height: 60, flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10, marginTop: 10}}>
                        <Icon name='at' size={40} color='grey'/>
                        <Text style={{alignSelf: 'center', width: 200}}>{profileData.email}</Text>
                    </View>
                    <View id= 'phoneContainer' style={{elevation: 8,backgroundColor: 'white', width: '90%', height: 60, flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10, marginTop: 10}}>
                        <Icon name='phone' size={40} color='grey'/>
                        <Text style={{alignSelf: 'center', width: 200}}>{profileData.phone}</Text>
                    </View>
                    <View id= 'addressContainer' style={{elevation: 8,backgroundColor: 'white', width: '90%', height: 60, flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10, marginTop: 10}}>
                        <Icon name='home' size={40} color='grey'/>
                        <Text style={{alignSelf: 'center', width: 200,}} numberOfLines={2}>{profileData.address.address}</Text>
                    </View>
                    <PaperButton mode='contained' style={{width: '90%', marginTop: 40}} onPress={()=>setPressedLogOut(true)}>CERRAR SESIÓN</PaperButton>

                </View>
            </View>

        </LinearGradient>
        

        
    )
}  