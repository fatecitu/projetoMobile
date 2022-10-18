import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { withTheme, Caption, TextInput, FAB, HelperText, Checkbox, Snackbar } from 'react-native-paper'
import Header from '../components/Header'
import { BACKEND } from '../constants'

function AlteraPrestador({ navigation, theme, route }) {
    //Obtendo os dados passados via parâmetro
    const prestadorAlterada = route.params.prestador
     //Atribuindo os valores nos campos a partir do valor passado
    const [id, setId] = useState(prestadorAlterada._id)
    const [nome, setNome] = useState(prestadorAlterada.nome)
    const [status, setStatus] = useState((prestadorAlterada.status === 'ativo') ? true : false)
    const [erros, setErros] = useState({})
    const [aviso, setAviso] = useState('')
    const [salvandoPrestador, setSalvandoPrestador] = useState(false)

    const { colors } = theme

   const validaErrosPrestador = () => {
       const novosErros = {}
       //Validação do nome
       if (!nome || nome ==='') novosErros.nome = 'O nome não pode ser vazio!'
       else if (nome.length > 30) novosErros.nome = 'O nome informado é muito longo!'
       else if (nome.length < 3) novosErros.nome = 'O nome informado é muito curto!'
       
       return novosErros
   }

   async function salvaPrestadorAlterada() {
       const novosErros = validaErrosPrestador()
       //Existe algum erro no objet?
       if (Object.keys(novosErros).length > 0) {
           //Sim, temos erros
           setErros(novosErros)
       } else {
           //Iremos salvar os dados alterados...
           setErros({})
           let statusPrestador = (status === true || status === 'ativo') ? 'ativo' : 'inativo'
           let prestador = {_id: id, nome: nome, status: statusPrestador}
           setSalvandoPrestador(true)
           let url = `${BACKEND}/prestadores`
           await fetch(url, {
               mode: 'cors',
               method: 'PUT',
               headers: {
                   Accept: 'application/json',
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(prestador)
           }).then(response => response.json())
           .then(data => {
               (data.message || data._id) ? setAviso('Prestador alterada com sucesso!') : setAviso('')
               setNome('')
               setStatus(true)
           })
           .catch(function (error) {
               setAviso('Não foi possível salvar a prestador alterada '+error.message)
           })
       }
       setSalvandoPrestador(false)
   }

    return (
        <View style={{flex:1, paddingVertical: 0}}>
        <Header titulo="Cadastro de Prestadores"
        voltar={true} navigation={navigation} />
        <View style={{ flex: 1, backgroundColor: colors.surface, paddingHorizontal: 16,
        paddingVertical: 4 }}>  
            <Caption style={styles.titulo}>Alteração dos Prestadores</Caption>
            <TextInput
                label="Nome da Prestador"
                mode="outlined"
                name="nome"
                value={nome}
                onChangeText={setNome}
                error={!!erros.nome}
            />
            <HelperText type="error" visible={!!erros.nome}>
                {erros.nome}
            </HelperText>
            <View style={styles.checkbox}>
                <Checkbox
                    status={status ? 'checked' : 'unchecked'}
                    onPress={() => setStatus(!status)}
                />
                <Text style={{ color: colors.text, marginTop: 8 }}>Ativa?</Text>
            </View>
        </View>
        <FAB style={styles.fab}
             icon='content-save'
             loading={salvandoPrestador}
             disabled={erros.length>0}
             onPress={() => salvaPrestadorAlterada()}
             />
        <Snackbar
            visible={aviso.length > 0}
            onDismiss={()=> setAviso('')}
            action={{
                label: 'Voltar',
                onPress: () => navigation.goBack()
            }}>
                <Text>{aviso}</Text>
            </Snackbar>
        </View>
    )
}

const styles  = StyleSheet.create({
    checkbox: {
        flexDirection: 'row'
    },
    fab:{
        position: 'absolute',
        margin: 16,
        right: 4,
        bottom: 8
    },
    titulo: {
        fontSize: 20,
        marginBottom: 16,
        marginTop: 16

    }
})

export default withTheme(AlteraPrestador)