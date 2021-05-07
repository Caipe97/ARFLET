import { Text, View, TextInput as NativeTextInput, KeyboardAvoidingView} from 'react-native';

import * as React from 'react';
import { styles } from '../../../../styles';
import LinearGradient from 'react-native-linear-gradient';
import {Button as PaperButton, TextInput as PaperInput} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

export default function TitleDateDescription(props){
    const [createPubliData, setcreatePubliData] = React.useState(props.route.params.createPubliData);

    const [titleInput, setTitleInput] = React.useState('');
    const [descriptionInput, setDescriptionInput] = React.useState('');
    const [myDate, setDate] = React.useState(new Date());

    const [submitAvailable, setSubmitAvailable] = React.useState(false);

    function handleSetDate(aDate){
        setDate(aDate);
    }


    function nextPage(){
        let today = new Date();
        setcreatePubliData( publiData => ({
            ...publiData, 
            title: titleInput, 
            description: descriptionInput, 
            dateCreated: (today.getDate() + "-"+ parseInt(today.getMonth()+1) +"-"+today.getFullYear()) , 
            dateExpected: ( myDate.getDate() + "-"+ parseInt(myDate.getMonth()+1) +"-"+myDate.getFullYear() ) }
            ));
            
    }

    React.useEffect(()=>{
        if(createPubliData.description != 'null' && createPubliData.title != 'null'){
            props.navigation.navigate('TripSelectAddress', {createPubliData});
        }
    }, [createPubliData])
    React.useEffect(()=>{
        if(titleInput!='' && descriptionInput!=''){
            let today = new Date();
            ;
            setSubmitAvailable(true);
        }
        else{
            setSubmitAvailable(false);
        }
    }, [titleInput, descriptionInput])
    return(
        <KeyboardAvoidingView style={{width:'100%', height: '100%'}}>

        
        <LinearGradient colors={['rgba(122,217,211,1)', 'rgba(0,212,255,1)']} start={{ x: 0.5, y: 0.5}} style={[styles.GenericLinearGradient, {alignItems: 'center', justifyContent: 'space-between'}]}>
            <View style={{height: 100, paddingVertical: 14,paddingHorizontal: '10%', alignSelf: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'sans-serif-light', fontSize: 22, color: 'black', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>Elija un título, Día de envío y descripción:</Text>
            </View>
            <View style={{justifyContent: 'space-between', alignItems: 'center', width: '90%', height: 400, paddingBottom: 100}}>
                <PaperInput
                    label="Título"
                    mode='flat'
                    maxLength={40}
                    value={titleInput}
                    onChangeText={setTitleInput}
                    style={{backgroundColor: 'transparent', width: '80%'}}
                />
                <DatePicker
                date={myDate}
                mode={'datetime'}
                minimumDate={new Date()}
                onDateChange={handleSetDate}
                style={{backgroundColor: 'white', height: 100, width: 250, borderRadius: 10}}
                />
                <PaperInput
                    multiline={true}
                    numberOfLines={3}
                    label="Descripción"
                    mode='outlined'
                    value={descriptionInput}
                    onChangeText={setDescriptionInput}
                    style={{width: '80%',}}
                    render={(innerProps) => (
                        <NativeTextInput
                            {...innerProps}
                            scrollEnabled={true}
                            style={[
                            innerProps.style,
                            props.multiline
                                ? {
                                    paddingTop: 8,
                                    paddingBottom: 8,
                                    height: 200,
                                    numberOfLines: 5
                                    
                                }
                                : null,
                            ]}
                        />
                        )}
                />
                
                
            </View>
            <PaperButton icon="note-outline"
                mode="contained"
                onPress = {()=>nextPage()}
                style={{margin: 20, height: 60, justifyContent: 'center', width: '40%', bottom: 30}}
                disabled={!submitAvailable}>
            SIGUIENTE
            </PaperButton>
            
        </LinearGradient>
        </KeyboardAvoidingView>
    )
}