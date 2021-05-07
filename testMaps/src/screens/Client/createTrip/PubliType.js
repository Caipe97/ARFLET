import React from 'react';
import {View, Text, TouchableOpacity, Keyboard, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button as PaperButton, TextInput as PaperInput} from 'react-native-paper';
import NumberTextInput from 'rn-weblineindia-number-input';
import Icon from 'react-native-vector-icons/FontAwesome'
import { styles } from '../../../../styles';


export default function PubliType(props){

    

    const[createPubliData, setCreatePubliData] = React.useState(props.route.params.createPubliData);
    const[price, setPrice] = React.useState(0);
    const[bid, setBid] = React.useState(0);
    const[selectedView, setSelectedView] = React.useState('none');
    const [submitAvailable, setSubmitAvailable] = React.useState(false);
    const[isButtonPressed, setIsButtonPressed] = React.useState(false);
    const[buttonText, setButtonText] = React.useState('Publicar Aviso');
    const[buttonWidth, setButtonWidth] = React.useState(new Animated.Value(250));
    const[buttonRadius, setButtonRadius] = React.useState(new Animated.Value(7));
    const[opacityPubliText, setOpacityPubliText] = React.useState(new Animated.Value(1.0));
    const[textDisplay, setTextDisplay] = React.useState('flex');
    const[checkboxDisplay, setCheckboxDisplay] = React.useState('none');


    const sendTripToServer = async () => {
        try {
            console.log("Sending trip...");
            let fetchRequest = 'http://10.0.2.2:3000/api/createTrip';
          let response = await fetch( fetchRequest, {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                bid: createPubliData.bid,
                isBid: createPubliData.isBid,
                dateCreated: createPubliData.dateCreated,
                dateExpected: createPubliData.dateExpected,
                description: createPubliData.description,
                endAddress: JSON.stringify(createPubliData.endAddress),
                startAddress: JSON.stringify(createPubliData.startAddress),
                idClient: createPubliData.idClient,
                title: createPubliData.title,
                transportType: createPubliData.transportType,
              })
          } );
          let json = await response.json()
          .then( json => console.log(json))
          .then(()=>props.navigation.navigate('clientHome'))
        } catch (error) {
          Alert.alert(
            'Error',
            'Cannot contact server',)
          console.error(error);
        }
      };

      React.useEffect(()=>{
          if(isButtonPressed){
            setButtonText('...');
            Animated.sequence([
                Animated.parallel([
                    
                      Animated.timing(buttonRadius, {
                        toValue: 80,
                        duration: 500,
                        useNativeDriver: false,
                      }),
                      Animated.timing(buttonWidth, {
                        toValue: 60,
                        duration: 500,
                        useNativeDriver: false,
                      }),
                      
                ]),
                Animated.timing(opacityPubliText, {
                    toValue: 0,
                    duration: 700,
                    useNativeDriver: false,
                  }),
                
    
            ]).start();
            setTimeout(() => { 
               setTextDisplay('none');
               setCheckboxDisplay('flex');
            }, 1500);
            setTimeout(() => {
                sendTripToServer();
                console.log("are we even here");
             }, 3000);

          }
        
      },[isButtonPressed])
    React.useEffect(() => {
        if(selectedView == 'none' || (bid == 0 && price == 0)){
            setSubmitAvailable(false);
        }
        else{
            if(selectedView == 'bid'){
                console.log(bid);
                setCreatePubliData(publiData => ({...publiData, isBid: 1, bid: bid}) )
            }
            if(selectedView == 'fixed'){
                setCreatePubliData(publiData => ({...publiData, isBid: 0, bid: price}) )
            }
            
            setSubmitAvailable(true);
        }
    }, [bid, price])

    React.useEffect(() => {
        Keyboard.dismiss();
        setPrice(0);
        setBid(0);
    },[selectedView])


    React.useEffect(() => {
        console.log(createPubliData);
    },[createPubliData])
    return(
        <LinearGradient colors={['rgba(122,217,211,1)', 'rgba(0,212,255,1)']} start={{ x: 0.5, y: 0.5}} style={{ width:"100%", height: "100%", paddingHorizontal: '5%', justifyContent:'space-between'}}>
            <View >
                <Text style={{fontWeight: '100', fontSize: 26, marginBottom: 20, marginTop: 30, fontFamily: 'sans-serif-light', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>Seleccione el tipo de publicación:</Text>

                <TouchableOpacity 
                    style={
                        selectedView == 'bid' ?
                        {backgroundColor: 'rgba(255,255,255,0.5)', width: '80%', height: 180, marginVertical: 10, alignSelf:'center', borderRadius: 20, alignItems:'center', justifyContent: 'center'} :
                        {backgroundColor: 'rgba(0,0,0,0.1)', width: '80%', height: 180, marginVertical: 10, alignSelf:'center', borderRadius: 20, alignItems:'center'}
                    }
                    onPress={() =>  setSelectedView('bid') }
                >
                    <Icon name="gavel" size={30} style={{marginVertical: 10}} />
                    <Text style={{fontSize: 26}}>Subasta</Text>
                    <View 
                        style={{width: 180, height: 60, alignItems:'center', flex: 1, flexDirection: 'row', justifyContent: 'center'}}
                        pointerEvents={ selectedView=='bid' ? 'auto' : 'none'}
                    > 
                        <Icon name="dollar" size={30}></Icon>
                        <NumberTextInput
                            type='decimal'
                            locale='en'
                            value={bid}
                            onUpdate={setBid}
                            returnKeyType={'done'}
                            style={{fontSize: 30, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 10}}
                        />
                    </View>
                    

                </TouchableOpacity>
                <TouchableOpacity
                    style={
                        selectedView == 'fixed' ?
                        {backgroundColor: 'rgba(255,255,255,0.5)', width: '80%', height: 180, marginVertical: 20, alignSelf:'center', borderRadius: 20, alignItems:'center'} :
                        {backgroundColor: 'rgba(0,0,0,0.1)', width: '80%', height: 180, marginVertical: 20, alignSelf:'center', borderRadius: 20, alignItems:'center'}
                    }
                    onPress={() => setSelectedView('fixed') }>
                    <Icon name="dollar" size={30} style={{marginVertical: 10}} />
                    <Text style={{fontSize: 26}}>Precio Fijo</Text>
                    <View 
                        style={{ width: 180, height: 60, alignItems:'center', flex: 1, flexDirection: 'row', justifyContent: 'center'}}
                        pointerEvents={ selectedView=='fixed' ? 'auto' : 'none'}
                    >
                        <Icon name="dollar" size={30}></Icon>
                        <NumberTextInput
                            type='decimal'
                            locale='en'
                            value={price}
                            onUpdate={setPrice}
                            returnKeyType={'done'}
                            style={{fontSize: 30, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 10}}
                        />
                    </View>
                </TouchableOpacity>
                
            </View>
            <Animated.View style={[styles.hireButton, {width: buttonWidth, borderRadius: buttonRadius, alignSelf:'center', alignContent:'center', alignItems:'center', marginBottom: 80}, (submitAvailable ? {backgroundColor: 'purple'} : {backgroundColor: 'grey'})]}>
                <TouchableOpacity onPress={()=>setIsButtonPressed(true)} disabled={!submitAvailable}>
                    <Animated.Text style={{fontFamily: 'sans-serif-medium', fontSize: 30, color: 'white', textAlign:'center', opacity: opacityPubliText, display: textDisplay}}>{buttonText}</Animated.Text>
                    <Icon name='check' type='material-community' size={40} color='white' style={{display: checkboxDisplay}}/>
                </TouchableOpacity>
            </Animated.View>
            
        </LinearGradient>
        
    )
}
/*
<Animated.View style={{margin: 20, height: 70, justifyContent: 'center', width: buttonWidth, bottom: 30, alignSelf:'center', borderRadius: buttonRadius}}>
            <PaperButton
                    mode="contained"
                    onPress = {()=> sendTripToServer() }
                    
                    disabled={!submitAvailable}>
                <Animated.Text style={{opacity: opacityPubliText, display: textDisplay}}>{buttonText}</Animated.Text>
                <Icon name='check' type='material-community' size={30} color='white' style={{display: 'none'}}/>
            </PaperButton>

            </Animated.View>
*/