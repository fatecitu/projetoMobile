import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native'
import { Text, withTheme, List, FAB, ActivityIndicator, IconButton, Avatar } from 'react-native-paper'
import Header from '../components/Header'
import ListaPrestador from './ListaPrestador'
import Api from '../resources/Api'

function ListaPrestadores({ navigation, theme }) {
    const [prestadores, setPrestadores] = useState([])
    const [carregando, setCarregando] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const { colors } = theme
    
    useEffect(()=> {
            getPrestadores()
    }, [])

    const getPrestadores = async() => {
        setCarregando(true)
        let retorno = await Api.getPrestadores()
        retorno.ok === 0 ? Alert.alert('Erro!', 'Não foi possível obter a lista!') :
            setPrestadores(retorno)
        setCarregando(false)
    }
    const onRefresh = React.useCallback(async() => {
        setRefreshing(true)
        try{
            await getPrestadores()
        } catch (error){
            console.error(error)
        }
        setRefreshing(false)
    }, [refreshing])

    return ( 
        <>
    <View style={{backgroundColor: colors.surface, flex: 1}}>
        <Header titulo="Prestadores" subtitulo="Relação de Prestadores" 
                voltar={true} navigation={navigation}
        />
        {carregando && 
        <ActivityIndicator animating={true} size="large" color={colors.primary} />}
        <List.Subheader>
            <Avatar.Icon size={24} icon="refresh" /> Para atualizar os dados
        </List.Subheader>
        {prestadores.length === 0 && !carregando
        ? (
            <View>
                <Text style={{fontSize: 20}}>
                Ainda não há nenhum prestador de serviço cadastrado.
                </Text>
            </View>    
        )
        : (
            <FlatList
             data={prestadores}
             keyExtractor={item => item._id.toString()}
             refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
             renderItem={({item}) => (
                 <ListaPrestador data={item} navigation={navigation} />
             )}
           />  
        )
        }
        <FAB
            style={styles.fab}
            icon='plus'
            label=''
            onPress={()=> navigation.navigate('Prestador')}
        />
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    /*fab - float action button  */
    fab: {
         position: 'absolute',
         margin: 16,
         right: 4, 
         bottom: 8
    }
})

export default withTheme(ListaPrestadores)