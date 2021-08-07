import React from 'react';
import {View, Text, Alert, Modal} from 'react-native';
import {Button as PaperButton} from 'react-native-paper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import LinearGradient from 'react-native-linear-gradient';
import MapView, {Marker} from 'react-native-maps';
import {API_URL} from '../../../constants';

Geocoder.init("AIzaSyD2CxkX_56WjIzdYruMWqifM4xMtgOGpME"); //API Google

export default function SelectAddressScreen(props)  {
    const[signUpData, setSignUpData] = React.useState(props.route.params.signUpData);
    const[selectedAddress, setSelectedAddress] = React.useState({address: '', coords: {lat: 0, lng: 0}});
    const[currentRegion, setRegion] = React.useState({latitude: -34.58, longitude: -58.42, latitudeDelta: 0.0922, longitudeDelta: 0.0421});
    const[markerTest, setMarkerTest] = React.useState();
    const[submitAvailable, setSubmitAvailable] = React.useState();

    const[wasSignUpSuccessful, setWasSignUpSuccessful] = React.useState(false);

    console.log(signUpData);
    console.log(signUpData.phone)


    const signUpUser = async () => {
        try {
            console.log("Checking if user exists...");
            let fetchRequest = API_URL + 'api/signUp';
          let response = await fetch( fetchRequest, {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  userType: signUpData.userType,
                  name: signUpData.name,
                  lastName: signUpData.lastName,
                  email: signUpData.email,
                  password: signUpData.password,
                  address: signUpData.address,
                  carId: signUpData.carId,
                  transportTypes: signUpData.transportTypes,
                  phone: signUpData.phone
              })
          } );
          let json = await response.json()
          .then( json => console.log(json))
          .then( props.navigation.navigate('Sign In'));
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };



    function signUpSuccessShowModal(){

    }


    function handleAddressChange(newValue) {
        setSelectedAddress(newValue);
      }

      const validateAddress = (address) => {
        const expression = /^[0-9]*$/;
        var addressNameCheck = expression.test(String(address.address).toLowerCase());
        var coordinatesCheck = (address.coords.lat != 0 && address.coords.lng != 0);
        console.log("address: " + address.address)
        if (addressNameCheck && coordinatesCheck){
            setSubmitAvailable(true);
        }
        else{
            setSubmitAvailable(false);
        };
      }

      function getMarkerFromSelectedAddress(){
        if(selectedAddress.address == ''){
        }
        else{
            setRegion( stateRegion => ({...stateRegion, latitude: selectedAddress.coords.lat, longitude: selectedAddress.coords.lng}));
            setMarkerTest(<Marker coordinate={{latitude: selectedAddress.coords.lat, longitude: selectedAddress.coords.lng}}/>);
        }
      }

      React.useEffect(()=>{
        setSignUpData(stateSignUpData => ({...stateSignUpData, address: selectedAddress}))
        getMarkerFromSelectedAddress();
        if (selectedAddress.address==''){
            setSubmitAvailable(false);
        }
        else{
            setSubmitAvailable(true);
        }
      },[selectedAddress])
    return(

        <LinearGradient colors={['rgba(122,217,211,1)', 'rgba(0,212,255,1)']} start={{ x: 0.5, y: 0.5}} style={{ width:"100%", height: "100%", paddingHorizontal: '5%'}}>
            <View  style={{ width: '100%', height: '80%'}}>
                <Text style={{fontWeight: '100', fontSize: 28, marginBottom: 70, fontFamily: 'sans-serif-light', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>Por último, seleccione su domicilio:</Text>
                <View style={{width: '100%', position:'absolute', zIndex: 10, top: 80}}>
                    <GooglePlacesAutocomplete
                    placeholder='Search'
                    fetchDetails = {true}
                    onPress={(data, details = null) => {
                        handleAddressChange({address: data.description, coords: details.geometry.location});
                    }}
                    query={{
                        key: 'AIzaSyD2CxkX_56WjIzdYruMWqifM4xMtgOGpME',
                        language: 'en',
                        components:'country:ar'
                    }}
                    />
                </View>
                <View style={{width: '100%', height: '80%'}}>
                <MapView
                        style={{width:'100%', height: '100%'}}
                        initialRegion={{latitude: -34.58, longitude: -58.42, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}
                        region= {currentRegion}
                    >
                        {markerTest}
                </MapView>
                    
                </View>
                <PaperButton 
                icon="note-outline" 
                mode="contained" 
                //onPress = {()=> props.navigation.navigate('Sign In')}
                onPress = {signUpUser}

                style={{margin: 20, height: 60, justifyContent: 'center'}} 
                disabled={!submitAvailable}>
                CREAR CUENTA
            </PaperButton>
            </View>
            <Modal id="modalSignUpSuccess" visible={false}  animationType="slide" transparent={true}>
                <View style={{ width: '95%', height: '95%', backgroundColor: 'white', alignSelf: 'center', borderRadius: 30, marginTop: 20}}>
                    <Text>Registro exitoso!</Text>
                    <PaperButton 
                        icon="note-outline" 
                        mode="contained" 
                        onPress = {()=> props.navigation.navigate('Sign In')}
                        style={{margin: 20, height: 60, justifyContent: 'center'}}>
                        VOLVER
                    </PaperButton>
                </View>
            </Modal> 
            
        </LinearGradient>
    )
}