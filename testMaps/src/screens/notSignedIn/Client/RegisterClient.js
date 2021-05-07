import React from 'react';
import {View, Text, Alert, ScrollView} from 'react-native';
import {Button as PaperButton, TextInput as PaperInput} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';


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


    let populateCarMakeList = carMakeList.map((item) => {return(<Picker.Item label={item.Make} value={item.Make} key={item.Make+'_'}/>)});
    let populateCarModelList = carModelList.map((item) => {return(<Picker.Item label={item.Model} value={item.Model} key={item.Model+'_'}/>)});
    let populateCarYearList = carYearList.map((item) => {return(<Picker.Item label={'' + item.Year} value={item.Year} key={item.Year+'_'}/>)});


    //Async calls
    const getMakesFromApiAsync = async () => {
        try {
            console.log("Fetching MAKES...");
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
function handleInputEmailChange(newValue) {
  setInputEmail(newValue);
}
function handleInputNameChange (newValue) {
  setInputName(newValue);
}
function handleInputLastNameChange(newValue) {
  setInputLastName(newValue);
}
function handleInputEmailChange(newValue) {
  setInputEmail(newValue);
}
function handleInputPasswordChange(newValue) {
  setInputPassword(newValue);
}
function handleInputPhoneChange(newValue) {
  setInputPhone(newValue);
}

//Retorno
    return (
      <ScrollView>

      
      <View  style={{flex: 1, alignItems: 'center'}}>

        <View style= {{width: '50%'}}>

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
          <PaperButton icon="note-outline" mode="outlined" onPress = {props.navigation.navigate('Sign In')} style={{margin: 20, height: 60, justifyContent: 'center'}} disabled={!submitAvailable}>
            CREAR CUENTA
          </PaperButton>
          <PaperButton icon="note-outline" mode="outlined" onPress = {props.navigation.navigate('TestCamera')} style={{margin: 20, height: 60, justifyContent: 'center'}} disabled={!submitAvailable}>
            TEST CAMERA
          </PaperButton>
        </View>

      </View>
      </ScrollView>
  ); 
  }
  
  