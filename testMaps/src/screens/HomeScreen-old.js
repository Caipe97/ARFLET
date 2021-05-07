import React, { Component } from 'react';
import {
    View, 
    Text,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Button,
    Alert, 
    ListItem,   
} from 'react-native';


export default function HomeScreen(props){
console.log(props);
const {users, isFetching, error} = props.authentication;
var txtError = "";
if (error){
    txtError = "Error en la conexión";
}
if (isFetching) {
    return (
        <View style= {styles.container}>
            <ActivityIndicator size={'large'} color="#00ff00"/>
        </View>
    )
}
else{
    return(
        <View style={styles.container}>
            <Text>Hola {txtError}</Text>
            <Button title="Press" onPress={props.fetchUser}></Button>
            <View style={[styles.container, {width:'80%', borderWidth:2, borderStyle: 'solid'}]}>
                <FlatList
                data={users.data}
                width='100%'
                Item
                keyExtractor = {(item) => item.id}
                renderItem = {({item}) =>
                <View style={{flexDirection:'row', alignItems: 'center', justifyContent:'center'}}>
                    <View style={{flex:1}}>
                    <View style={{backgroundColor:'black', width: 20, height:10}}></View>
                    </View>                            
                    <View style={{flex:9,flexDirection: 'column'}}>
                    <Text>{item.name}</Text><Text>{item.email}</Text><Text>{item.password}</Text></View>                         
                </View> } 
                
                />
            </View>
        </View>
    )
}
}

/*
class HomeScreen extends Component {
    componentDidMount() {
        //this.props.fetchToDos();
    }

    render() {
        console.log("rerendered");
        const {users, isFetching, error} = this.props.authentication;
        var txtError = "";
        if(error) {
            txtError = "Hubo un error en la conexion";
        }
        if(isFetching) {            
            return (
                <View style={styles.container}>
                    <ActivityIndicator size={'large'} color="#00ff00"></ActivityIndicator>
                </View>
            )
        } else {            
            return (
                <View style={styles.container}>
                    <Button title="Press" onPress={this.props.fetchUser}></Button>
                    {console.log(users.data)}
                    <Text>Hola {txtError}</Text>
                    <View style={[styles.container, {width:'80%', borderWidth:2, borderStyle: 'solid'}]}>
                        <FlatList
                        data={users.data}
                        width='100%'
                        Item
                        keyExtractor = {(item) => item.id+"_"}
                        renderItem = {({item}) =>
                        <View style={{flexDirection:'row', alignItems: 'center', justifyContent:'center'}}>
                            <View style={{flex:1}}>
                            <View style={{backgroundColor:'black', width: 20, height:10}}></View>
                            </View> 
                            <View style={{flex:9,flexDirection: 'column'}}>
                            <Text>{item.id}</Text><Text>{item.name}</Text><Text>{item.email}</Text><Text>{item.password}</Text></View>                         
                        </View> } 
                        />
                    </View>
                </View>
            )
        }
        
    }


}
*/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
});


