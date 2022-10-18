import React, {useContext} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { AppContext } from '../themes/ThemeProvider'

const Stack = createStackNavigator()

import Inicio from '../screens/Inicio'
import Configuracoes from '../screens/Configuracoes'
import ListaPrestadores from '../screens/ListaPrestadores'
import AdicionaPrestador from '../screens/AdicionaPrestador'
import AlteraPrestador from '../screens/AlteraPrestador'


export default function Navigation(){
    const { tema } = useContext(AppContext)
    return(
        <NavigationContainer theme={tema}>
            <Stack.Navigator initialRouteName="Inicio" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Inicio" component={Inicio} />
                <Stack.Screen name="Configuracoes" component={Configuracoes} /> 
                <Stack.Screen name="ListaPrestadores" component={ListaPrestadores}  />
                <Stack.Screen name="AdicionaPrestador" component={AdicionaPrestador}  /> 
                <Stack.Screen name="AlteraPrestador" component={AlteraPrestador}  />      
            </Stack.Navigator>
        </NavigationContainer>
    )
}