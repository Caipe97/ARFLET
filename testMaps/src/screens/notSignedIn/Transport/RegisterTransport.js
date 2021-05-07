import React from 'react';
import {View, Text, Alert, ScrollView} from 'react-native';
import {Button as PaperButton, TextInput as PaperInput} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyD2CxkX_56WjIzdYruMWqifM4xMtgOGpME"); //API Google

export default function RegisterScreen(props)  {
    
    const [carMakeList, setCarMakeList] = React.useState([{Make: "-"}]);
    const [selectedCarMake, setSelectedCarMake] = React.useState("-");

    const [carModelListAvailable, setCarModelListAvailable] = React.useState(false);
    const [carModelList, setCarModelList] = React.useState([{Model: "-"}]);
    const [selectedCarModel, setSelectedCarModel] = React.useState("-");

    const [carYearListAvailable, setCarYearListAvailable] = React.useState(false);
    const [carYearList, setCarYearList] = React.useState([{Year: "-"}]);
    const [selectedCarYear, setSelectedCarYear] = React.useState("-");

    const [selectedCarId, setSelectedCarId] = React.useState({objectId: '-'});
    const [submitAvailable, setSubmitAvailable] = React.useState(false);

    const [inputEmail, setInputEmail] = React.useState("");
    const [inputName, setInputName] = React.useState("");
    const [inputLastName, setInputLastName] = React.useState("");
    const [inputPhone, setInputPhone] = React.useState("");
    const [inputTypeOfTransport, setInputTypeOfTransport] = React.useState([]);
    const [inputPassword, setInputPassword] = React.useState("");
    const [inputAddress, setInputAddress] = React.useState({address: "", coords: {lat: 0, lng: 0}});
    const [fieldValidation, setFieldValidation] = React.useState({carMake: false, carModel: false, carYear: false, inputEmail: false, inputName: false, inputPhone: false, inputLastName: false, inputTypeOfTransport: false, inputPassword: false, inputAddress: false});



    React.useEffect( () => {
      switch(selectedCarMake) {
        case '-':
            //no model/year picker available
            setCarModelListAvailable(false);
            setCarYearListAvailable(false);
            getMakesFromApiAsync();
            
            setSelectedCarModel('-');
            setSelectedCarYear('-');
            setSelectedCarId({objectId: '-'});
            break;
        default:
            //model picker available
            getModelsFromApiAsync();
            setSubmitAvailable(false);
            setCarModelListAvailable(true);
            setCarYearListAvailable(false);
            setSelectedCarModel('-');
            setSelectedCarYear('-');
            setSelectedCarId({objectId: '-'});
      }
    }, [selectedCarMake]);

    React.useEffect( () => {
      switch(selectedCarModel) {
        case '-':
            //no model/year picker available
            setCarYearListAvailable(false);
            setSelectedCarModel('-');
            setSelectedCarYear('-');
            setSelectedCarId({objectId: '-'});
            break;
        default:
            //model picker available
            getYearsFromApiAsync();
            setSubmitAvailable(false);
            setCarYearListAvailable(true);
            setSelectedCarYear('-');
            setSelectedCarId({objectId: '-'});
      }
    }, [selectedCarModel]);

    React.useEffect( () => {
      switch(selectedCarYear) {
        case '-':
            //no model/year picker available
            setSubmitAvailable(false);
            setSelectedCarYear('-');
            setSelectedCarId({objectId: '-'});
            break;
        default:
            //model picker available
            getCarIdFromApiAsync();
            setSubmitAvailable(true);
      }
    }, [selectedCarYear]);

    React.useEffect( () => {
      console.log("FieldValidation: ");
      console.log(fieldValidation);
    }, [fieldValidation]);

    //Validar
    const validateMail = (email) => {
      const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  
      return expression.test(String(email).toLowerCase())
  }
    const validateName = (name) => {
      const expression = /(.|\s)*\S(.|\s)*/
      return expression.test(String(name).toLowerCase())
  }
    const validatePhone = (number) => {
      const expression = /^[0-9]*$/
      return expression.test(String(number).toLowerCase())
  }
    const validateAddress = (address) => {
      const expression = /^[0-9]*$/;
      var addressNameCheck = expression.test(String(address.address).toLowerCase());
      var coordinatesCheck = (address.coords.lat != 0 && address.coords.lng != 0);
      return (addressNameCheck && coordinatesCheck);
  }

    let populateCarMakeList = carMakeList.map((item) => {return(<Picker.Item label={item.Make} value={item.Make} key={item.Make+'_'}/>)});
    let populateCarModelList = carModelList.map((item) => {return(<Picker.Item label={item.Model} value={item.Model} key={item.Model+'_'}/>)});
    let populateCarYearList = carYearList.map((item) => {return(<Picker.Item label={'' + item.Year} value={item.Year} key={item.Year+'_'}/>)});


    //Async calls
    const getMakesFromApiAsync = async () => {
        try {
          let response = await fetch(
            'http://10.0.2.2:3000/api/cars'
          );
          let json = await response.json()
          .then( json => setCarMakeList(json.data))
          .then( console.log(carMakeList));
          
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };

      const getModelsFromApiAsync = async () => {
        try {
            console.log("Fetching MODELS...");
          let response = await fetch(
            'http://10.0.2.2:3000/api/cars/' + selectedCarMake
          );
          let json = await response.json()
          .then( json => setCarModelList(json.data))
          .then( console.log(carModelList));
          
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };
      const getYearsFromApiAsync = async () => {
        try {
          console.log("Fetching YEARS...");
            let fetchRequest = 'http://10.0.2.2:3000/api/cars/' + selectedCarMake + '/' + selectedCarModel;
          let response = await fetch( fetchRequest );
          let json = await response.json()
          .then( json => setCarYearList(json.data))
          .then( console.log(carYearList));
          
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };
      const getCarIdFromApiAsync = async () => {
        try {
            console.log("Fetching CARID...");
            let fetchRequest = 'http://10.0.2.2:3000/api/cars/' + selectedCarMake + '/' + selectedCarModel + '/' + selectedCarYear;
          let response = await fetch( fetchRequest );
          let json = await response.json()
          .then( json => setSelectedCarId(json.data))
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };

      function handleInputNameChange (newValue) { //HECHO
        setInputName(newValue);
        console.log(fieldValidation);
        var auxFieldValidation = fieldValidation;
        auxFieldValidation.inputName = validateName(newValue);
        setFieldValidation(auxFieldValidation);
      }

      function handleInputLastNameChange (newValue) { //HECHO
        setInputLastName(newValue);
        var auxFieldValidation = fieldValidation;
        auxFieldValidation.inputLastName = validateName(newValue);
        setFieldValidation(auxFieldValidation);
      }

      function handleInputEmailChange(newValue) { //HECHO, podria hacer el async de que el usuario ya esta registrado...
        setInputEmail(newValue);
        var auxFieldValidation = fieldValidation;
        auxFieldValidation.inputEmail = validateMail(newValue);
        setFieldValidation(auxFieldValidation);
      }

      function handleInputPasswordChange(newValue) { //HECHO
        setInputPassword(newValue);
        var auxFieldValidation = fieldValidation;
        auxFieldValidation.inputPassword = validateName(newValue);
        setFieldValidation(auxFieldValidation);
      }

      function handleInputPhoneChange(newValue) { //HECHO
        setInputPhone(newValue);
        var auxFieldValidation = fieldValidation;
        auxFieldValidation.inputPhone = validatePhone(newValue);
        setFieldValidation(auxFieldValidation);
      }

      function handleAddressChange(newValue) {
        setInputAddress(newValue);
        var auxFieldValidation = fieldValidation;
        auxFieldValidation.inputAddress = validateAddress(newValue);
        setFieldValidation(auxFieldValidation);
      }


//Retorno
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'}>

      <View  style={{flex: 1, alignItems: 'center'}}>

        <View style= {{width: '80%'}}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>Domicilio</Text>
          <GooglePlacesAutocomplete
            placeholder='Search'
            fetchDetails = {true}
            onPress={(data, details = null) => {
              handleAddressChange({address: data.description, coords: details.geometry.location});
            }}
            query={{
              key: 'AIzaSyD2CxkX_56WjIzdYruMWqifM4xMtgOGpME',
              language: 'en',
            }}
          />
         

          <Text style={{fontWeight: 'bold', fontSize: 16}}>Datos de Vehiculo</Text>
          <Text style={{fontWeight: 'bold', fontSize: 16}}> Marca</Text>

          <View style={{ borderWidth: 1, borderColor: 'purple', borderRadius: 4 }}>
            <Picker
                selectedValue= {selectedCarMake}
                onValueChange={(value) => setSelectedCarMake(value)}
                style={{height:40}}
            >
              <Picker.Item label={"-"} value={"-"} key={'_'}/>
                {populateCarMakeList}
            </Picker>   
          </View>
          <Text style={{fontWeight: 'bold', fontSize: 16}}> Modelo</Text>
          <View style={{ borderWidth: 1, borderColor: 'purple', borderRadius: 4 }}>
            <Picker
                selectedValue= {selectedCarModel}
                onValueChange={(value) => setSelectedCarModel(value)}
                enabled={carModelListAvailable}
                style={{height:40}}
            >
              <Picker.Item label={"-"} value={"-"} key={'_'}/>
                {populateCarModelList}
            </Picker>
          </View>

          <Text style={{fontWeight: 'bold', fontSize: 16}}> Año</Text>
          <View style={{ borderWidth: 1, borderColor: 'purple', borderRadius: 4 }}>
            <Picker
                selectedValue= {selectedCarYear}
                onValueChange={(value) => setSelectedCarYear(value)}
                enabled={carYearListAvailable}
                style={{height:40}}
            >
              <Picker.Item label={"-"} value={"-"} key={'_'}/>
                {populateCarYearList}
            </Picker>
          </View>
        </View>
        
        <View style= {{width: '80%'}}>
          <PaperInput
            label='Nombre'
            mode="outlined"
            value={inputName}
            onChangeText={handleInputNameChange}
            style={{height: 50}}
          />
          <PaperInput
            label='Apellido'
            mode="outlined"
            value={inputLastName}
            onChangeText={handleInputLastNameChange}
            style={{height: 50}}
          />
          <PaperInput
            label='Email'
            mode="outlined"
            value={inputEmail}
            onChangeText={handleInputEmailChange}
            style={{height: 50}}
          />
          <PaperInput
            label='Password'
            secureTextEntry={true}
            mode="outlined"
            value={inputPassword}
            onChangeText={handleInputPasswordChange}
            style={{height: 50}}
          />
          <PaperInput
            label='Teléfono'
            mode="outlined"
            value={inputPhone}
            onChangeText={handleInputPhoneChange}
            style={{height: 50}}
          />
          <PaperInput
            label='Dirección'
            mode="outlined"
            value={inputPhone}
            onChangeText={handleAddressChange}
            style={{height: 50}}
          />
          <PaperButton icon="note-outline" mode="outlined" onPress = {()=> props.navigation.navigate('Sign In')} style={{margin: 20, height: 60, justifyContent: 'center'}} disabled={!submitAvailable}>
            CREAR CUENTA
          </PaperButton>
        </View>

      </View>
      </ScrollView>
  ); 
  }
  