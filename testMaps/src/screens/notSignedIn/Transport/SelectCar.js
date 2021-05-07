import React from 'react';
import {View, Text, Alert} from 'react-native';
import {Button as PaperButton,} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';



export default function SelectCar(props){
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

    const[signUpData, setSignUpData] = React.useState(props.route.params.signUpData);

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
        }
      }, [selectedCarYear]);
      React.useEffect( () => {
        switch(selectedCarId.objectId) {
          case '-':
              //no model/year picker available
              setSubmitAvailable(false);
              break;
          default:
              //model picker available
              var auxSignUpData = signUpData;
              auxSignUpData.carId = selectedCarId.objectId;
              setSignUpData(auxSignUpData);
              setSubmitAvailable(true);
        }
      }, [selectedCarId]);

      let populateCarMakeList = carMakeList.map((item) => {return(<Picker.Item label={item.Make} value={item.Make} key={item.Make+'_'}/>)});
      let populateCarModelList = carModelList.map((item) => {return(<Picker.Item label={item.Model} value={item.Model} key={item.Model+'_'}/>)});
      let populateCarYearList = carYearList.map((item) => {return(<Picker.Item label={'' + item.Year} value={item.Year} key={item.Year+'_'}/>)});

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


    return(
        <LinearGradient colors={['rgba(122,217,211,1)', 'rgba(0,212,255,1)']} start={{ x: 0.5, y: 0.5}} style={{flex: 1, width:"100%", height: "100%", justifyContent: 'space-evenly', alignContent: 'space-around', paddingHorizontal: '10%'}}>
                <Text style={{fontWeight: '100', fontSize: 28}}>Indique los datos de su Vehiculo:</Text>
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
                <PaperButton icon="note-outline" mode="contained" onPress = {()=> props.navigation.navigate('t_SelectAddress', {signUpData})} style={{margin: 20, height: 60, justifyContent: 'center'}} disabled={!submitAvailable}>
                    SIGUIENTE
                </PaperButton>

        </LinearGradient>
    )

}