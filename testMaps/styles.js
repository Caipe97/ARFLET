import {StyleSheet} from 'react-native'


const styles = StyleSheet.create({
        textStyle : {
            fontSize:300,
            backgroundColor: 'white'
        },
        viewStyle : {
            backgroundColor: 'blue',
            //flex:1,
        },
        mainAppLogo : {
            width: 200,
            height: 134,
            marginBottom: 10
        },
        loginInputBox : {
            width: '100%',
            height: 44,
            padding: 10,
            borderWidth: 1,
            borderColor: 'black',
            marginBottom: 10,
        },
        loginBox : {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',

        },
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          },
        preSignInCircle: {
            width: 180,
            height: 180,
            borderRadius: 100,

            backgroundColor: 'green',
            alignItems: 'center',
            justifyContent: 'center',
        },
        preSignInLogo: {
            width: 100,
            height: 100,
            zIndex: 2,
            resizeMode: 'contain',
        },
        trip_transportTypeLogo: {
            width: 60,
            height: 60,
            zIndex: 2,
        },

        preSignInBox: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
        },
        searchBarHome: {
            flex: 1,
            alignSelf: 'center',
            position: 'absolute',
            elevation: 3,
            width: '80%',
            height: 90,
            top: -40,
        },
        searchResultsHome: {
            backgroundColor: 'rgba(255,255,255,0.4)',
            position: 'absolute',
            flex: 1,
            //bottom: '2.5%',
            width: '95%',
            height: 200 ,
            alignSelf: 'center',
            borderRadius: 10,
            borderColor: 'grey',
            borderWidth: 2
        },
        searchResultsItem: {
            backgroundColor: 'rgb(220,220,220)',
            flex: 1,
            flexDirection: "row",
            //marginVertical: 5,
            borderRadius: 10,
            bottom: '2.5%',
            width: '95%',
            height: 80 ,
            alignItems: 'center',
            shadowColor: "#000",
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            elevation: 5,
        },
        searchBarContainer: {
            backgroundColor: 'rgba(200, 200, 200, 0.5)',
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent'
        },
        searchResultsImage: {
            height: '80%',
            margin: 5,
            marginHorizontal: 8,
        },
        textPrice: {
            fontSize: 24,
            fontWeight: 'bold',
            color:'white',
            paddingRight: 4,
        },
        transportProfile: {
            flex: 1,
            alignItems: 'center', 
            alignSelf: 'center',
            borderRadius: 20,
            width: '95%',
            marginVertical: '5%',
            justifyContent: 'space-evenly',
            backgroundColor: 'blue'

        },
        transportProfileWrapper: {
            flex: 1,
            alignSelf: 'center',
            borderRadius: 20,
            width: '95%',
            height: '95%',
            marginVertical: '5%',
            backgroundColor: 'red',
            padding: 10,
            alignItems: 'center',
            elevation: 10,

        },
        hireButton: {
            //backgroundColor: 'purple',
            //borderRadius: 7,
            paddingHorizontal: 10,
            paddingVertical: 10,

        },
        ShipmentSelectLogo: {
            width: 80,
            height: 80,
        },
        ShipmentSelectorContainer: {
            //flex: 1,
            width:125,
            height: 125,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center'
            //flexDirection: 'row',
            //flexWrap: 'wrap',
        },
        ShipmentSelectorContainerSignUp: {
            //flex: 1,
            width:'100%',
            height: '80%',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        SelectedTransportTypeContainer: {
            backgroundColor: 'purple',
            width: 125,
            height:125,
            padding: 2.5,
            borderRadius: 82.5,
            //margin: 10
        },
        NotSelectedTransportTypeContainer: {
            backgroundColor: 'transparent',
            width: 125,
            height:125,
            padding: 2.5,
            borderRadius: 82.5,
            //margin: 10
        },
        GenericLinearGradient: {
            flex: 1, width:"100%",
            height: "100%",
            justifyContent: 'space-evenly',
            alignContent:'space-around'
        },
       ProfileLinearGradient: {
            width:"100%",
            height: "100%",
            //justifyContent: 'space-evenly',
            //alignContent:'space-around'
        },

        SelectorLinearGradient: {
            width:"100%",
            height: "100%",
            //justifyContent: 'space-evenly',
            alignContent:'center',

        },
    }
        

);
export {styles};

    