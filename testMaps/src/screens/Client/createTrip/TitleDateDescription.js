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

        
        <LinearGradient colors={['#788bff', '#5465ff']} start={{ x: 0.5, y: 0.5}} style={[styles.GenericLinearGradient, {alignItems: 'center', justifyContent: 'space-between'}]}>
            <View style={{height: 100, paddingVertical: 14,paddingHorizontal: '10%', alignSelf: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'sans-serif', fontSize: 22, color: 'white', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>Complete estos datos:</Text>
            </View>
            <View style={{justifyContent: 'space-between', alignItems: 'center', width: '90%', height: 400, paddingBottom: 100}}>
                <PaperInput
                    label="Título"
                    mode='flat'
                    maxLength={40}
                    value={titleInput}
                    onChangeText={setTitleInput}
                    style={{backgroundColor: 'transparent', width: 300, color: 'white'}}
                    theme={{
                        colors: {
                                   placeholder: 'white', text: 'white', primary: '#0014cc',
                                   underlineColor: 'transparent', background: '#003489'
                           }
                     }}
                />
                <View style={{width: 300}}>
                    <Text style={{alignSelf: 'flex-start',fontFamily: 'sans-serif', fontSize: 18, color: 'white', textShadowRadius: 20, textShadowOffset: {width: 0, height: 2}}}>Fecha:</Text>
                    <DatePicker
                    date={myDate}
                    mode={'datetime'}
                    minimumDate={new Date()}
                    onDateChange={handleSetDate}
                    style={{backgroundColor: 'white', height: 100, width: 300, borderRadius: 10}}
                    />
                </View>
                
                <PaperInput
                    multiline={true}
                    numberOfLines={3}
                    label="Descripción"
                    mode='outlined'
                    value={descriptionInput}
                    onChangeText={setDescriptionInput}
                    style={{width: 300,}}
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