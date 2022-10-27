import { Appbar, withTheme } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar'

function Header(props) {
    const { colors } = props.theme
    return (
        <>
            <StatusBar backgroundColor={colors.accent} />
            <Appbar.Header style={{ paddingTop: 8, marginBottom: 16 }}>
                {props.voltar && <Appbar.BackAction onPress={() => props.navigation.goBack()} />}
                <Appbar.Content title={props.titulo} subtitle={props.subtitulo} style={{ color: colors.primary }} />
            </Appbar.Header>
        </>
    )
}

export default withTheme(Header)