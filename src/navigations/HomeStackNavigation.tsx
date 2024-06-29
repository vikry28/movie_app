import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import MovieDetail from '../screens/MovieDetail'
import Favorite from '../screens/Favorite'
import CategorySearch from '../components/search/CategorySearch'
import KeywordSearch from '../components/search/KeywordSearch'

const Stack = createNativeStackNavigator()

const HomeStackNavigation = (): JSX.Element => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="MovieDetail" component={MovieDetail} />
      <Stack.Screen name="Favorite" component={Favorite} />
      <Stack.Screen name="KeywordSearch" component={KeywordSearch} />
      <Stack.Screen name="CategorySearch" component={CategorySearch} />
    </Stack.Navigator>
  )
}

export default HomeStackNavigation
