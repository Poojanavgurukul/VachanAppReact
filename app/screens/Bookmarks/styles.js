import {StyleSheet,Dimensions} from 'react-native'

export const bookStyle=(colorFile, sizeFile) =>{
    return StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorFile.backgroundColor,
    },
    bookmarksView:{
        flexDirection:'row',
        justifyContent: 'space-between',
        margin:16,
        fontSize:sizeFile.fontSize
    },
    bookmarksText:{
        fontSize:sizeFile.titleText,
        color:colorFile.iconColor
    },
    iconCustom:{
        color:colorFile.textColor,
        fontSize:sizeFile.iconSize
    },
    emptyMessageContainer:{
        flex:1,
        alignItems:'center',
        flexDirection:'column',
        justifyContent:'center'
    },
    messageEmpty:{
        fontSize:sizeFile.titleText,
        color:colorFile.textColor,
    },
    emptyMessageIcon:{
        fontSize:sizeFile.emptyIconSize,
        margin:16,
        color:colorFile.iconColor,
    },
    centerEmptySet: { 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%' 
    }


    })
}
