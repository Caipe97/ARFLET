import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ActivePublis from './activePublis';
import History from './history';
import Notifications from './takeTrip';
import Profile from './profile';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as reduxActionCreators from '../../actions/actions';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

const ActivePublisScreen = connect(mapStateToProps, mapDispatchToProps)(ActivePublis);
const ProfileScreen = connect(mapStateToProps, mapDispatchToProps)(Profile);
const HistoryScreen = connect(mapStateToProps, mapDispatchToProps)(History);
const NotificationsScreen = connect(mapStateToProps, mapDispatchToProps)(Notifications);


export default function HomeNavigator(props) {
    
    return (
      <Tab.Navigator >
        <Tab.Screen name="Tomar Viaje" component={NotificationsScreen} options={{ unmountOnBlur: true, tabBarIcon: ({ color }) => (
          <Icon name="truck-loading" size={24} color={color} />
        )}}/>
        <Tab.Screen name="Viajes Activos" component={ActivePublisScreen} options={{unmountOnBlur: true, tabBarIcon: ({ color }) => (
          <Icon name="truck" size={24} color={color} />
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