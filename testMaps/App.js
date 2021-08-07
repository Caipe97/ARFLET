
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './src/configureStore';
import ClientHome from './src/screens/Driver/clientHomeScreen';
import TransportHome from './src/screens/Passenger/transportHomeScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as reduxActionCreators from './src/actions/actions';

//Para crear una cuenta
import SelectUserType from './src/screens/notSignedIn/SelectUserType';
import SelectCar from './src/screens/notSignedIn/Passenger/SelectCar';
import SelectAddress from './src/screens/notSignedIn/Passenger/SelectAddress';
import RegisterData from './src/screens/notSignedIn/RegisterData';
import TestCamera from './src/screens/notSignedIn/Passenger/testCamera';
import ShipmentSelector from './src/screens/notSignedIn/Passenger/ShipmentSelector';
import SignIn from './src/screens/notSignedIn/SignIn';

//Para crear un viaje
import TransportTypeSelector from './src/screens/Driver/createTrip/TransportTypeSelector';
import TitleDateDescription from './src/screens/Driver/createTrip/TitleDateDescription';
import TripSelectAddress from './src/screens/Driver/createTrip/SelectAddress';
import PubliType from './src/screens/Driver/createTrip/PubliType';

const store = configureStore();
const Stack = createStackNavigator();

//Configurar screens para navigators y su conexión con los props de Redux
const SignInScreen = connect(mapStateToProps, mapDispatchToProps)(SignIn);
const ClientHomeScreen = connect(mapStateToProps, mapDispatchToProps)(ClientHome);
const TransportHomeScreen = connect(mapStateToProps, mapDispatchToProps)(TransportHome);
const SelectUserTypeScreen = connect(mapStateToProps, mapDispatchToProps)(SelectUserType);
//const RegisterTransportScreen = connect(mapStateToProps, mapDispatchToProps)(RegisterTransport);
//const RegisterClientScreen = connect(mapStateToProps, mapDispatchToProps)(RegisterClient);
//const TestCameraScreen = connect(mapStateToProps, mapDispatchToProps)(TestCamera);
const ShipmentSelectorScreen = connect(mapStateToProps, mapDispatchToProps)(ShipmentSelector);
const RegisterDataScreen = connect(mapStateToProps, mapDispatchToProps)(RegisterData);
const SelectCarScreen = connect(mapStateToProps, mapDispatchToProps)(SelectCar);
const SelectAddressScreen = connect(mapStateToProps, mapDispatchToProps)(SelectAddress);

//Screens para crear un viaje
const TransportTypeSelectorScreen = connect(mapStateToProps, mapDispatchToProps)(TransportTypeSelector);
const TitleDateDescriptionScreen = connect(mapStateToProps, mapDispatchToProps)(TitleDateDescription);
const TripSelectAddressScreen = connect(mapStateToProps, mapDispatchToProps)(TripSelectAddress);
const PubliTypeScreen = connect(mapStateToProps, mapDispatchToProps)(PubliType);

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator mode="modal">
                    <Stack.Screen name= "Sign In" component={SignInScreen} options={{headerShown: false}} />
                    <Stack.Screen name="clientHome" component={ClientHomeScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="transportHome" component={TransportHomeScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="SelectUserType" component={SelectUserTypeScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="RegisterData" component={RegisterDataScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="t_ShipmentSelector" component={ShipmentSelectorScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="t_SelectCar" component={SelectCarScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="t_SelectAddress" component={SelectAddressScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="TransportTypeSelector" component={TransportTypeSelectorScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="TitleDateDescription" component={TitleDateDescriptionScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="TripSelectAddress" component={TripSelectAddressScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="PubliType" component={PubliTypeScreen} options={{headerShown: false}}/>
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
};

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(reduxActionCreators, dispatch)
    }
}
