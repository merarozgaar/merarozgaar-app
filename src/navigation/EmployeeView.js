// @flow
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import JobsContainer from '../modules/jobs';
import { RouteNames } from './Navigator';
import ProfileContainer from '../modules/profile';

const Tab = createMaterialBottomTabNavigator();

const EmployeeView = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      activeColor={theme.colors.primary}
      barStyle={{
        backgroundColor: theme.colors.surface,
        elevation: 8,
      }}
      labeled>
      <Tab.Screen
        name={RouteNames.jobs}
        component={JobsContainer}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              color={focused ? theme.colors.primary : theme.colors.placeholder}
              name="home-city-outline"
              size={24}
            />
          ),
          title: 'Home',
        }}
      />
      <Tab.Screen
        name={RouteNames.courses}
        component={ProfileContainer}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              color={focused ? theme.colors.primary : theme.colors.placeholder}
              name="briefcase-outline"
              size={24}
            />
          ),
          title: 'Applications',
        }}
      />
      <Tab.Screen
        name={RouteNames.profile}
        component={ProfileContainer}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              color={focused ? theme.colors.primary : theme.colors.placeholder}
              name="calendar-outline"
              size={24}
            />
          ),
          title: 'Interviews',
        }}
      />
      <Tab.Screen
        name={RouteNames.settings}
        component={ProfileContainer}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              color={focused ? theme.colors.primary : theme.colors.placeholder}
              name="account-circle-outline"
              size={24}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default EmployeeView;
