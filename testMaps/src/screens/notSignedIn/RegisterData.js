import React from 'react';
import {View, Text, Alert} from 'react-native';
import {Button as PaperButton, TextInput as PaperInput} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function RegisterData(props) {

    const [inputEmail, setInputEmail] = React.useState("");
    const [inputName, setInputName] = React.useState("");
    const [inputLastName, setInputLastName] = React.useState("");
    const [inputPhone, setInputPhone] = React.useState("");
    const [inputPassword, setInputPassword] = React.useState("");
    const [fieldValidation, setFieldValidation] = React.useState({inputEmail: false, inputName: false, inputPhone: false, inputLastName: false, inputPassword: false});
    const [submitAvailable, setSubmitAvailable] = React.useState(false);
    const [signUpData,setSignUpData] = React.useState(props.route.params.signUpData);
    
    function userExistsWatcher(json){
      if(json.id == -1){
        
        if(signUpData.userType == 'c'){ //Si soy cliente, navegar a elegir domicilio
          props.navigation.navigate('t_SelectAddress', {signUpData});
        }
        else{ //Si soy transportista, navegar a ShipmentSelector
          props.navigation.navigate('t_ShipmentSelector', {signUpData});
        }
        
      }
      else{
        setSubmitAvailable(false);
        Alert.alert('Error', 'Email already registered to an account',)
      }
    }

    const checkUserExists = async () => {
      try {
          console.log("Checking if user exists...");
          let fetchRequest = 'http://10.0.2.2:3000/api/user/' + signUpData.userType + '/' + inputEmail ;
        let response = await fetch( fetchRequest );
        let json = await response.json()
        .then( json => userExistsWatcher(json));
      } catch (error) {
        Alert.alert(
          'Error',
          'Cannot contact server',)
        console.error(error);
      }
    };

    function validateAll(){
        if(fieldValidation.inputEmail && fieldValidation.inputName && fieldValidation.inputPhone && fieldValidation.inputLastName && fieldValidation.inputPassword){
            var auxSignUpData = signUpData;
            auxSignUpData.email = inputEmail;
            auxSignUpData.name = inputName;
            auxSignUpData.lastName = inputLastName;
            auxSignUpData.password = inputPassword;
            auxSignUpData.phone = inputPhone;
            console.log("setting phone to"+ auxSignUpData.phone)
            setSignUpData(auxSignUpData);
            setSubmitAvailable(true);
        }
        else{
            setSubmitAvailable(false);
        }
    }

    const validateMail = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return expression.test(String(email).toLowerCase())
    }
      const validateName = (name) => {
        const expression = /(.|\s)*\S(.|\s)*/
        return expression.test(String(name).toLowerCase())
    }
      const validatePhone = (number) => {
        const expression = /^\d+$/
        return expression.test(String(number).toLowerCase())
    }

    React.useEffect(() => {
      setFieldValidation( validation => ({...validation, inputName: validateName(inputName)}));
    }, [inputName])
    React.useEffect(() => {
      setFieldValidation( validation => ({...validation, inputLastName: validateName(inputLastName)}));
    }, [inputLastName])
    React.useEffect(() => {
      setFieldValidation( validation => ({...validation, inputEmail: validateMail(inputEmail)}));
    }, [inputEmail])
    React.useEffect(() => {
      setFieldValidation( validation => ({...validation, inputPassword: validateName(inputPassword)}));
    }, [inputPassword])
    React.useEffect(() => {
      setFieldValidation( validation => ({...validation, inputPhone: validatePhone(inputPhone)}));
    }, [inputPhone])
    React.useEffect(() => {
        validateAll();
    }, [fieldValidation])


    

 return(
    <LinearGradient colors={['rgba(122,217,211,1)', 'rgba(0,212,255,1)']} start={{ x: 0.5, y: 0.5}} style={{flex: 1, width:"100%", height: "100%", justifyContent: 'space-evenly', alignContent: 'space-around'}}>
            <View style={{width: '100%', height: 80, paddingLeft: 10, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'sans-serif-light', fontSize: 28, textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>Primero, rellene estos datos:</Text>
            </View>
            <View style={{alignItems: 'baseline', marginLeft: '10%'}}>
              <View style={{flexDirection: 'row', width: 350, alignItems: 'center'}}>
                <Icon name='user' size={30} color='rgb(50,50,50)' />
                <PaperInput
                  label='Nombre'
                  mode="flat"
                  value={inputName}
                  onChangeText={setInputName}
                  style={{height: 60, width: '50%', margin: 10, backgroundColor: 'rgba(0,0,0,0)'}}
                  />

              </View>
              <View style={{flexDirection: 'row', width: 350, alignItems: 'center'}}>
                <Icon name='user-o' size={26} color='rgb(50,50,50)' />
                <PaperInput
                label='Apellido'
                mode="flat"
                value={inputLastName}
                onChangeText={setInputLastName}
                style={{height: 60, width: '50%', margin: 10, backgroundColor: 'rgba(0,0,0,0)'}}
                />
              </View>
              <View style={{flexDirection: 'row', width: 350, alignItems: 'center'}}>
                <Icon name='at' size={28} color='rgb(50,50,50)' />
                <PaperInput
                label='Email'
                mode="flat"
                value={inputEmail}
                onChangeText={setInputEmail}
                style={{height: 60, width: '70%', margin: 10, backgroundColor: 'rgba(0,0,0,0)'}}
                />
              </View>
              <View style={{flexDirection: 'row', width: 350, alignItems: 'center'}}>
                <Icon name='asterisk' size={24} color='rgb(50,50,50)' />
                <PaperInput
                label='Password'
                secureTextEntry={true}
                mode="flat"
                value={inputPassword}
                onChangeText={setInputPassword}
                style={{height: 60, width: '70%', margin: 10, backgroundColor: 'rgba(0,0,0,0)'}}
                />
              </View>
              <View style={{flexDirection: 'row', width: 350, alignItems: 'center'}}>
                <Icon name='phone' size={30} color='rgb(50,50,50)' />
                <PaperInput
                label='Teléfono'
                mode="flat"
                value={inputPhone}
                onChangeText={setInputPhone}
                style={{height: 60, width: '50%', margin: 10, backgroundColor: 'rgba(0,0,0,0)'}}
                />
              </View>
            </View>
            <View style= {{width: '100%', alignItems:'center', }}>
                <PaperButton icon="note-outline"
                    mode="contained"
                    //onPress = {()=> props.navigation.navigate('t_ShipmentSelector', {signUpData})}
                    onPress = {()=> checkUserExists()}
                    style={{margin: 20, height: 60, justifyContent: 'center', width: '40%'}}
                    disabled={!submitAvailable}>
                SIGUIENTE
                </PaperButton>
            </View>
        
    </LinearGradient>
 )
}