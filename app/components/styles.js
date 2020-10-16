import { StyleSheet, Dimensions } from 'react-native'
import Color from '../utils/colorConstants'

export const buttonstyle = (colorFile, sizeFile) => {
    return StyleSheet.create({
        reloadButton: {
            backgroundColor: Color.Blue_Color,
        },
        reloadText: {
            textAlign: 'center',
            fontSize: 18,
            color: Color.White
        },
        buttonContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },


    })
}