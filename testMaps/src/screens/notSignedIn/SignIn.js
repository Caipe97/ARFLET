import React from 'react';
import { styles } from '../../../styles';
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
//import RadioButtonRN from 'radio-buttons-react-native';
import {Button as PaperButton, TextInput as PaperInput, RadioButton} from 'react-native-paper';
//import Icon from 'react-native-vector-icons/FontAwesome';


export default function SignInScreen(props) {

    const data = [ {label: 'Cliente', type: 'c'}, {label: 'Transportista', type: 't'} ]; //usado por los RadioButtons
    const [inputEmail, setInputEmail] = React.useState("admin@example.com");
    const [inputPassword, setInputPassword] = React.useState("1234");
    const [inputUserType, setInputUserType] = React.useState("c");
    const isLoggedIn = props.authentication.isLoggedIn;

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

    function handleUserTypeChange(newValue){
        setInputUserType(newValue.type);
    }

      return (
        <View style={styles.loginBox}>
            
            <Image
                style={styles.mainAppLogo}
                source={require('../../images/logo.png')}
                
            />
            <View style={{ width: '50%'}}>
            <RadioButton.Group onValueChange={value => setInputUserType(value)} value={inputUserType}>
              <RadioButton.Item label="Cliente" value="c" labelStyle={{color: 'rgb(98,0,238)'}}/>
              <RadioButton.Item label="Transportista" value="t" labelStyle={{color: 'rgb(98,0,238)'}}/>
            </RadioButton.Group>
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
                Iniciar Sesión
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