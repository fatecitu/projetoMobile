import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { Text, withTheme, List, FAB, ActivityIndicator, IconButton } from 'react-native-paper'
import Header from '../components/Header'
import ListaPrestador from './ListaPrestador'
import Api from '../resources/Api'

function ListaPrestadores({ navigation, theme }) {
    const { colors } = theme
    const [prestadores, setPrestadores] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        getPrestadores()
    }, [])

    const getPrestadores = async () => {

        setLoading(true)
        setPrestadores([])
        let res = await Api.getPrestadores()
        res.ok === 0 ? Alert.alert("‼️Atenção", `Não foi possível obter a lista de prestadores\nMotivo: ${res.codeName}`) : setPrestadores(res)
        setLoading(false)

    }

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true)
        try {
            await getPrestadores()
        } catch (error) {
            console.error(error)
        }
        setRefreshing(false)
    }, [refreshing])

    return (
        <View style={{ backgroundColor: colors.surface, paddingHorizontal: 0, paddingVertical: 16, flex: 1 }}>
            <Header titulo="Prestadores" subtitulo="Relação dos Prestadores de Serviço" voltar={true} navigation={navigation} />
            {loading && <ActivityIndicator animating={true} size="large" color={colors.primary} />}
            <>
                <List.Subheader>
                    <IconButton
                        icon="refresh"
                        size={20}
                        onPress={() => getPrestadores()}
                    />
                    Para atualizar os dados
                </List.Subheader>

                {prestadores.length === 0 && !loading
                    ? (
                        <View>
                            <Text style={{ fontSize: 20 }}>Ainda não há nenhum prestador cadastrado</Text>
                        </View>
                    )
                    : (
                        <FlatList
                            data={prestadores}
                            renderItem={({ item }) => (
                                <ListaPrestador data={item} navigation={navigation} />
                            )}
                            keyExtractor={item => item._id.toString()}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}
                            />}
                        />
                    )}
                <FAB
                    style={styles.fab}
                    icon='plus'
                    loading={loading}
                    label=''
                    onPress={() => navigation.navigate('Prestador')}
                />

            </>
        </View>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 4,
        bottom: 8
    }
})

export default withTheme(ListaPrestadores)