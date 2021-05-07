import {Alert} from 'react-native';
import React from 'react';


//CAMBIAR PARA QUE SEA MAS GENERICO !!!!

//POR AHORA NO USADO POR NINGUN ARCHIVO
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

  const getModelsFromApiAsync = async (selectedCarMake, carModelList) => {
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
  const getYearsFromApiAsync = async (selectedCarMake, selectedCarModel, carYearList) => {
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
  const getCarIdFromApiAsync = async (selectedCarMake, selectedCarModel, selectedCarYear, ) => {
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