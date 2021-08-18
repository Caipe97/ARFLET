import React from 'react';
import { Text, View, Image, Alert, StyleSheet} from 'react-native';
import { SEARCH_PLACEHOLDER, SEL_RECYCLE, SEL_GOODS, SEL_MOVING, SEL_CONSTMAT, SEL_APPLIANCES } from '../../images';
import { Button as PaperButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../../../styles';
import { API_URL } from '../../constants';

export default function Profile(props){
    let profileData = props.authentication.user.data;
    const [pressedLogOut, setPressedLogOut] = React.useState(false);

    React.useEffect(() => {
        console.log(props);
      if(pressedLogOut){
          props.logOutUser();
          console.log("Logging you out.");
          props.navigation.navigate('Sign In');
          
      }
  }, [pressedLogOut])

    const getCarFromIdApiAsync = async () => {
        try {
          let response = await fetch(
            API_URL + 'api/carsfromId/' + profileData.carId
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
    
    return(
        <LinearGradient colors={['#3498db', '#2c3e50']} start={{ x: 0.5, y: 0.5}} style={styles.GenericLinearGradient} >
            <View style={stylesLocal.container}>
                <Image source={SEARCH_PLACEHOLDER} style={stylesLocal.profilePic}/>
                <View id='container Items inside grey box' style={stylesLocal.containerInsideGrey}>
                    <Text style={stylesLocal.profileName}>{profileData.name} {profileData.lastName}</Text>
                    <View id= 'emailContainer' style={stylesLocal.emailContainer}>
                        <Icon name='at' size={40} color='grey'/>
                        <Text style={stylesLocal.emailText}>{profileData.email}</Text>
                    </View>
                    <View id= 'phoneContainer' style={stylesLocal.emailContainer}>
                        <Icon name='phone' size={40} color='grey'/>
                        <Text style={stylesLocal.emailText}>{profileData.phone}</Text>
                    </View>
                    <View id= 'addressContainer' style={stylesLocal.emailContainer}>
                        <Icon name='home' size={40} color='grey'/>
                        <Text style={stylesLocal.emailText} numberOfLines={2}>{profileData.address.address}</Text>
                    </View>
                    <PaperButton mode='contained' style={stylesLocal.logoutButton} onPress={()=>setPressedLogOut(true)}>CERRAR SESIÓN</PaperButton>

                </View>
            </View>

        </LinearGradient> 
    )


}
const stylesLocal = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '90%',
        height: 490,
        alignSelf: 'center',
        backgroundColor: 'rgb(200,200,200)',
        marginTop: 70,
    },
    profilePic: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        top: -80,
    },
    containerInsideGrey: {
        width:'95%',
        height: 400,
        backgroundColor: 'rgb(200,200,200)',
        alignSelf: 'center',
        top: -80,
        alignItems: 'center',
    },
    profileName: {
        fontFamily: 'sans-serif-medium',
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
        textShadowRadius: 20,
        textShadowOffset: {width: 0, height: 2},
    },
    emailContainer: {
        elevation: 8,
        backgroundColor: 'white',
        width: '90%',
        height: 60,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 10,
    },
    emailText: {
        alignSelf: 'center',
        width: 200,
    },
    phoneContainer: {
        elevation: 8,
        backgroundColor: 'white',
        width: '90%',
        height: 60,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 10
    },
    logoutButton: {
        width: '90%',
        marginTop: 40,
    },
  });