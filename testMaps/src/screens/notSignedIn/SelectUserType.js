import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { SimpleCircleButton } from '../../SimpleCircleButton';
import { SPLASHTRUCKLOGO, SPLASHUSERLOGO, MAINLOGO} from '../../images/index';
import { styles } from '../../../styles';
import LinearGradient from 'react-native-linear-gradient';

export default function PreSignInScreen(props)  {
  const [signUpData, setSignUpData] = React.useState({userType: '', name: '', lastName: '', email: '', address:{address: '', coords: {lat: 0, lng:0}}, phone: 0, carId:'', transportTypes: {mercaderia: false, residuos: false, mudanzas: false, construccion: false, electrodomesticos: false}});

  function goClient(){
    setUserType('c');
    props.navigation.navigate('RegisterData', {signUpData});
    
  }
  function goTransport(){
    setUserType('t');
    props.navigation.navigate('RegisterData', {signUpData});
  }
  function setUserType(value){
    var auxSignUpData = signUpData;
    auxSignUpData.userType= value;
    setSignUpData(auxSignUpData);
  }
    return (
      <LinearGradient colors={['#9BB1FF', '#BFD7FF']} start={{ x: 0.5, y: 0.5}} style={{flex: 1, width:"100%", height: "100%", justifyContent: 'space-evenly', alignContent: 'space-around', padding: 10}}>
      <Text style={{fontFamily: 'sans-serif', color: 'white', fontSize: 28, textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>Indique el tipo de usuario:</Text>
      <View style={styles.preSignInBox}>
          <SimpleCircleButton
            circleDiameter = {180}
            color = 'rgb(98,0,238)'
            onPress = {() => goClient()}
          >
            <Image 
              style={styles.preSignInLogo}
              source={ SPLASHUSERLOGO } 
            />
            <Text style={{color: 'white'}}>Cliente</Text>
          </SimpleCircleButton> 
          <SimpleCircleButton
            circleDiameter = {180}
            color = 'rgb(98,0,238)'
            onPress = {() => goTransport()}
          >
            <Image 
              style={styles.preSignInLogo}
              source={ SPLASHTRUCKLOGO } 
            />
            <Text style={{color: 'white'}}>Transportista</Text>
          </SimpleCircleButton>
          
      </View>
      </LinearGradient>
  ); 
  }