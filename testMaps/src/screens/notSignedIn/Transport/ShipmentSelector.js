import { Text, View, Image} from 'react-native';
import { SimpleCircleButton } from '../../../SimpleCircleButton';
import { SEL_APPLIANCES, SEL_CONSTMAT, SEL_GOODS, SEL_MOVING, SEL_RECYCLE } from '../../../images'
import * as React from 'react';
import { styles } from '../../../../styles';
import LinearGradient from 'react-native-linear-gradient';
import {Button as PaperButton} from 'react-native-paper';


export default function ShipmentSelector(props) {
    const [signUpData, setSignUpData] = React.useState(props.route.params.signUpData);
    const [mercaderia, setMercaderia] = React.useState(false);
    const [residuos, setResiduos] = React.useState(false);
    const [mudanzas, setMudanzas] = React.useState(false);
    const [construccion, setConstruccion] = React.useState(false);
    const [electrodomesticos, setElectrodomesticos] = React.useState(false);
    const [submitAvailable, setSubmitAvailable] = React.useState(false);

    
    React.useEffect( () => {
        if ( mercaderia || residuos || mudanzas || construccion || electrodomesticos){
            setSubmitAvailable(true);
            
        }
        else{
            setSubmitAvailable(false);
        }
        var auxSignUpData = signUpData;
        auxSignUpData.transportTypes = {mercaderia: mercaderia, residuos: residuos, mudanzas: mudanzas, construccion: construccion, electrodomesticos: electrodomesticos};
        setSignUpData(signUpData);
        
    }, [mercaderia, residuos, mudanzas, construccion, electrodomesticos])

        
 

    function handleTransportTypes(value){

        if(value == 'mercaderia'){
            setMercaderia(!mercaderia);
        }
        if(value == 'residuos'){
            setResiduos(!residuos);
        }
        if(value == 'mudanzas'){
            setMudanzas(!mudanzas);
        }
        if(value == 'construccion'){
            setConstruccion(!construccion);
        }
        if(value == 'electrodomesticos'){
            setElectrodomesticos(!electrodomesticos);
        }
    }

    return(
        <LinearGradient colors={['rgba(122,217,211,1)', 'rgba(0,212,255,1)']} start={{ x: 0.5, y: 0.5}} style={{flex: 1, width:"100%", height: "100%", justifyContent: 'space-evenly', alignContent: 'space-around'}}>
            <View style={{height: 40, paddingVertical: 14, alignSelf: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'sans-serif-light', fontSize: 22, color: 'black', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>Seleccione lo que desea transportar</Text>
                
            </View>
            <View style={styles.ShipmentSelectorContainerSignUp}>
                <View style={mercaderia ? {backgroundColor: 'purple', width: 165, height:165, padding: 2.5, borderRadius: 82.5} :  {backgroundColor: 'transparent', width: 165, height:165, padding: 2.5, borderRadius: 80}}>
                    <SimpleCircleButton
                        circleDiameter = {160}
                        color = 'orange'
                        onPress = {() => handleTransportTypes('mercaderia')}
                    >
                        <Image 
                        style={styles.preSignInLogo}
                        source={ SEL_GOODS } 
                        />

                        <Text style={{color: 'white'}}>Mercadería</Text>
                    </SimpleCircleButton>
                </View>
                <View style={mudanzas ? {backgroundColor: 'purple', width: 165, height:165, padding: 2.5, borderRadius: 82.5} :  {backgroundColor: 'transparent', width: 165, height:165, padding: 2.5, borderRadius: 80}}>
                    <SimpleCircleButton
                        circleDiameter = {160}
                        color = '#35524A'
                        onPress = {() => handleTransportTypes('mudanzas')}
                    >
                        <Image 
                        style={styles.preSignInLogo}
                        source={ SEL_MOVING } 
                        />
                        <Text style={{color: 'white'}}>Mudanzas</Text>
                    </SimpleCircleButton>
                </View>
                <View style={construccion ? {backgroundColor: 'purple', width: 165, height:165, padding: 2.5, borderRadius: 82.5} :  {backgroundColor: 'transparent', width: 165, height:165, padding: 2.5, borderRadius: 80}}>
                    <SimpleCircleButton
                        circleDiameter = {160}
                        color = 'brown'
                        onPress = {() => handleTransportTypes('construccion')}
                    >
                        <Image 
                        style={styles.preSignInLogo}
                        source={ SEL_CONSTMAT } 
                        />
                        <Text style={{color: 'white'}}>Construcción</Text>
                    </SimpleCircleButton>
                </View>
                <View style={residuos ? {backgroundColor: 'purple', width: 165, height:165, padding: 2.5, borderRadius: 82.5} :  {backgroundColor: 'transparent', width: 165, height:165, padding: 2.5, borderRadius: 80}}>
                    <SimpleCircleButton
                        circleDiameter = {160}
                        color = 'green'
                        onPress = {() => handleTransportTypes('residuos')}
                    >
                        <Image 
                        style={styles.preSignInLogo}
                        source={ SEL_RECYCLE } 
                        />
                        <Text style={{color: 'white'}}>Residuos</Text>
                    </SimpleCircleButton> 
                </View>
                <View style={electrodomesticos ? {backgroundColor: 'purple', width: 165, height:165, padding: 2.5, borderRadius: 82.5} :  {backgroundColor: 'transparent', width: 165, height:165, padding: 2.5, borderRadius: 80}}>
                    <SimpleCircleButton
                        circleDiameter = {160}
                        color = '#35A7FF'
                        onPress = {() => handleTransportTypes('electrodomesticos')}
                    >
                        <Image 
                        style={styles.preSignInLogo}
                        source={ SEL_APPLIANCES } 
                        />
                        <Text style={{color: 'white'}}>Electrodomésticos</Text>
                    </SimpleCircleButton> 
                </View>
            </View>
            <View style= {{width: '100%', alignItems:'center'}}>
                <PaperButton icon="note-outline"
                    mode="contained"
                    onPress = {()=> props.navigation.navigate('t_SelectCar', {signUpData})}
                    style={{margin: 20, height: 60, justifyContent: 'center', width: '40%'}}
                    disabled={!submitAvailable}>
                SIGUIENTE
                </PaperButton>
            </View>
            
        </LinearGradient>
    );
}