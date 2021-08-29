import React from 'react';
import { styles } from '../../../styles';
import { Text, View, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import {Button as PaperButton, TextInput as PaperInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {MAINLOGO} from '../../images';


export default function SignInScreen(props) {

    const data = [ {label: 'Cliente (DRIVER)', type: 'c'}, {label: 'Transp (PASSENGER)', type: 't'} ]; //usado por los RadioButtons
    const [inputEmail, setInputEmail] = React.useState("admin@example.com");
    const [inputPassword, setInputPassword] = React.useState("1234");
    const [inputUserType, setInputUserType] = React.useState("t");
    const isLoggedIn = props.authentication.isLoggedIn;
    console.log(props.authentication.error);
    const fetching = props.authentication.isFetching;
    const loginError = props.authentication.error;

    React.useEffect(() => {
        if(isLoggedIn==1){
          console.log(props.authentication.user.data);
            if(!props.authentication.user.data){
              Alert.alert("Hubo un problema al iniciar sesión.")
            }
            if(!props.authentication.user.data.transportTypes){ //Si tiene transportTypes es transportista
                props.navigation.navigate('clientHome');
            }
            else{
                props.navigation.navigate('transportHome');
            }
        }
        else{ //Hacer clear de los datos del usuario así queda todo clean!
          () => props.clearUser();

        }
    }, [isLoggedIn])

    React.useEffect(()=> {
      if(loginError){
        Alert.alert("Error al iniciar sesión", loginError.toString())
      }
    }, [loginError])

    function handleUserTypeChange(newValue){
        setInputUserType(newValue.type);
    }

    function renderSpinner(){
      switch (fetching){
        case true:
          return(<View style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            top: 0,
            bottom: 0,
            zIndex: 10,

          }}>
            <ActivityIndicator color="#0000ff" size="large" />
          </View>)
        default:
          return(<></>)
      }
    }

      return (
        <View style={styles.loginBox}>
          {renderSpinner()}
            
            <Image
                style={styles.mainAppLogo}
                source={MAINLOGO}
            />
            <View style={{ width: '50%'}}>
              <RadioButtonRN
                data={data}
                boxStyle={{height: 50,}}
                activeColor="#FFFFFF"
                boxActiveBgColor="#35E94D"
                selectedBtn={(e) => handleUserTypeChange(e)}
                icon={
                  <Icon
                    name="check-circle"
                    size={25}
                    color="#FFFFFF"
                  />
                }
              />
            </View>
            <View style={{width: '70%', height: 300, margin: 30}}>
              <PaperInput
                label='Email'
                mode="outlined"
                value={inputEmail}
                onChangeText={setInputEmail}
              />
              <PaperInput
                label='Password'
                secureTextEntry={true}
                mode="outlined"
                value={inputPassword}
                onChangeText={setInputPassword}
              />
              <PaperButton icon="login" mode="contained" onPress = {() => props.loginUser(inputUserType, inputEmail, inputPassword)} style={{margin: 20, height: 60, justifyContent: 'center'}}>
                LOGIN
              </PaperButton>
              <View>
                <Text>No tiene una cuenta todavía? </Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('SelectUserType')}>
                  <Text style={{fontWeight: 'bold'}}>Registrarse</Text>
                </TouchableOpacity>
                
              </View>
            </View>
        </View>
      );
  }