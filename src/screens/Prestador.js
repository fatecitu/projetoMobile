import React, { useState } from 'react'
import { View, Text, StyleSheet, Platform, Alert } from 'react-native'
import { withTheme, Caption, TextInput, FAB, Snackbar } from 'react-native-paper'

import Header from '../components/Header'
import Api from '../resources/Api'

function AdicionaPrestador({ navigation, theme, route }) {
    const hoje = new Date().toISOString().split('T')[0]
    const registroInicial = route.params ? route.params.prestador :
        { cnpj: '', razao_social: '', nome_fantasia: '', cnae_fiscal: '', data_inicio_atividade: hoje, localizacao: { type: 'Point', coordinates: [0, 0] } }

    const [prestador, setPrestador] = useState(registroInicial)
    const [aviso, setAviso] = useState('')
    const [salvandoDados, setSalvandoDados] = useState(false)

    const { colors } = theme

    const salvarPrestador = async (dadosPrestador) => {
        //Verificamos se iremos incluir ou alterar (se tiver o _id, devemos alterar)
        let salvar = dadosPrestador.hasOwnProperty('_id') ? await Api.alteraPrestador(dadosPrestador) : await Api.incluiPrestador(dadosPrestador)
        setSalvandoDados(true)
        if (salvar.hasOwnProperty('errors')) {
            Platform.OS === 'web' ? alert(`‼️Erro: ${salvar.errors[0].msg}`) : Alert.alert("‼️Erro", salvar.errors[0].msg)
        } else if (salvar.hasOwnProperty('acknowledged')) {
            Platform.OS === 'web' ? alert(`✅Tudo OK: Registro salvo com sucesso `) : Alert.alert("✅Tudo OK", 'Registro salvo com sucesso')
            navigation.navigate('Inicio')
        }
        setSalvandoDados(false)
    }

    return (
        <View style={{ flex: 1, paddingVertical: 0, paddingHorizontal: 0 }}>
            <Header titulo="Cadastro de Prestadores"
                voltar={true} navigation={navigation} />
            <View style={{
                flex: 1, backgroundColor: colors.surface, paddingHorizontal: 16,
                paddingVertical: 4
            }}>
                <Caption style={styles.titulo}>Prestadores de Serviço</Caption>
                {/* CNPJ */}
                <TextInput
                    name="cnpj"
                    style={styles.input}
                    onChangeText={(text) => setPrestador({ ...prestador, cnpj: text })}
                    value={prestador.cnpj}
                    keyboardType="number-pad"
                    autoFocus
                    placeholder='CNPJ (somente números)'
                    maxLength={14}
                />
                {/* Razao Social */}
                <TextInput
                    name="razao_social"
                    style={styles.input}
                    onChangeText={(text) => setPrestador({ ...prestador, razao_social: text })}
                    value={prestador.razao_social}
                    keyboardType="default"
                    placeholder='Razão Social'
                    maxLength={100}
                />
                {/* Fantasia */}
                <TextInput
                    name="nome_fantasia"
                    style={styles.input}
                    onChangeText={(text) => setPrestador({ ...prestador, nome_fantasia: text })}
                    value={prestador.nome_fantasia}
                    keyboardType="default"
                    placeholder='Nome Fantasia (Opcional)'
                    maxLength={50}
                />
                {/* Cnae Fiscal */}
                <TextInput
                    name="cnae_fiscal"
                    style={styles.input}
                    onChangeText={(text) => setPrestador({ ...prestador, cnae_fiscal: text })}
                    value={prestador.cnae_fiscal}
                    keyboardType="number-pad"
                    placeholder='Código Nacional de Atividade Econômica (somente números)'
                    maxLength={7}
                />
                {/* Inicio das Atividades */}
                <TextInput
                    name="data_inicio_atividade"
                    style={styles.input}
                    onChangeText={(text) => setPrestador({ ...prestador, data_inicio_atividade: text })}
                    value={prestador.data_inicio_atividade}
                    keyboardType="number-pad"
                    placeholder='AAAA-MM-DD'
                    maxLength={10}
                />
            </View>
            <FAB style={styles.fab}
                icon='content-save'
                loading={salvandoDados}
                onPress={() => salvarPrestador(prestador)}
            />
            <Snackbar
                visible={aviso.length > 0}
                onDismiss={() => setAviso('')}
                action={{
                    label: 'Voltar',
                    onPress: () => navigation.goBack()
                }}>
                <Text>{aviso}</Text>
            </Snackbar>
        </View>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 4,
        bottom: 8
    },
    titulo: {
        fontSize: 20,
        marginBottom: 16,
        marginTop: 16
    },
    input: {
        margin: 8

    },
})

export default withTheme(AdicionaPrestador)