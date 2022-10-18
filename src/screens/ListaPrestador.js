import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { BACKEND } from '../constants'
import { formatCnpjCpf } from '../utils'

import { List, withTheme, Avatar } from 'react-native-paper';

function ListaPrestador({ data, navigation, theme }) {
  const { colors } = theme

  async function confirmaExclusaoRegistro() {
    try {
      Alert.alert('Atenção!', 'Deseja mesmo excluir este prestador?', [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            await excluirPrestador(data)
          },
        },
      ])
    } catch (response) {
      Alert.alert(response.data.error)
    }
  }

  async function excluirPrestador(data) {
    let url = `${BACKEND}/prestadores/${data._id}`
    await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => {
        Alert.alert('Aviso', data.message)
        navigation.goBack()
      })
      .catch(function (error) {
        console.error('Houve um problema ao excluir o prestador: ' + error.message);
      })
  }

  const alteraPrestador = async (data) => {
    navigation.navigate('AlteraPrestador',{ prestador: data })
  }

  function botaoLadoDireito() {
    return (
      <View>
        <TouchableOpacity
          style={styles.buttonDesativar}
          onPress={confirmaExclusaoRegistro}
        >
          <Avatar.Icon size={24} icon="delete"  style={{backgroundColor: colors.background}}/>
          <Text style={{color: colors.background}} >Excluir</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Swipeable renderRightActions={botaoLadoDireito}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => alteraPrestador(data)}
      >

        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background, borderRadius: 20 }}>
          <List.Item
            title={data.razao_social}
            description={`CNPJ: ${formatCnpjCpf(data.cnpj)}`}
            descriptionStyle={[styles.descricao]}
            left={props =>  <Avatar.Text label={data.razao_social.substring(0,2)} />}
          />
  
        </View>
      </TouchableOpacity>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    height: 80,
    borderRadius: 8,
    marginBottom: 2,
    marginHorizontal: 8,
  },
  buttonDesativar: {
    backgroundColor: '#d9534f',
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
  },
  descricao: {
    paddingBottom: 16
  }
})

export default withTheme(ListaPrestador)