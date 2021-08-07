import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ActivePublis from './activePublis';
import History from './history';
import Notifications from './notifications';
import Profile from './profile';
import Icon from 'react-native-vector-icons/FontAwesome5';
//Para crear un viaje
/*
import TransportTypeSelector from './createTrip/TransportTypeSelector';
import TitleDateDescription from './createTrip/TitleDateDescription';
import SelectAddress from './createTrip/SelectAddress';
import PubliType from './createTrip/PubliType';
*/


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as reduxActionCreators from '../../actions/actions';


const Tab = createBottomTabNavigator();
//const Stack = createStackNavigator();

const ActivePublisScreen = connect(mapStateToProps, mapDispatchToProps)(ActivePublis);
const ProfileScreen = connect(mapStateToProps, mapDispatchToProps)(Profile);
const HistoryScreen = connect(mapStateToProps, mapDispatchToProps)(History);
const NotificationsScreen = connect(mapStateToProps, mapDispatchToProps)(Notifications);


export default function HomeNavigator(props) {
    
    return (
      <Tab.Navigator >
        <Tab.Screen name="Notificaciones" component={NotificationsScreen} options={{unmountOnBlur: true, tabBarIcon: ({ color }) => (
          <Icon name="bell" size={24} color={color} />
        )}}/>
        <Tab.Screen name="Publicaciones" component={ActivePublisScreen} options={{unmountOnBlur: true, tabBarIcon: ({ color }) => (
          <Icon name="clipboard" size={24} color={color} />
        )}}/>
        <Tab.Screen name="Historial" component={HistoryScreen} options={{unmountOnBlur: true, tabBarIcon: ({ color }) => (
          <Icon name="history" size={24} color={color} />
        )}}/>
        <Tab.Screen name="Perfil" component={ProfileScreen} options={{unmountOnBlur: true, tabBarIcon: ({ color }) => (
          <Icon name="address-card" size={24} color={color} />
        )}}/>
      </Tab.Navigator>
    
    );
}




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