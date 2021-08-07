import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';
import AzureAuth from 'react-native-azure-auth';
import Client from 'react-native-azure-auth/src/networking';

const CLIENT_ID = '96a5ef16-fc07-4e8f-b4ba-48e139939d70' // replace the string with YOUR client ID

const azureAuth = new AzureAuth({
    clientId: CLIENT_ID,
    authorityUrl: 'https://login.microsoftonline.com/49fed697-01ff-42d6-a5a3-6e65ba70d89e/oauth2/v2.0/'
  });

export default class Auth0Sample extends Component {
  constructor(props) {
    super(props);
    this.state = { accessToken: null, user: '' , mails: [], userId: ''};
  }

  _onLogin = async () => {
    try {
      let tokens = await azureAuth.webAuth.authorize({scope: 'openid profile User.Read', prompt: 'login' })
      console.log('CRED>>>', tokens)
      this.setState({ accessToken: tokens.accessToken });
      let info = await azureAuth.auth.msGraphRequest({token: tokens.accessToken, path: 'me'})
      console.log('info', info)
      this.setState({ user: info.displayName, userId: tokens.userId })
    } catch (error) {
      console.log('Error during Azure operation', error)
    }
  };

  _onGetMails = async () => {
    try {
      let tokens = await azureAuth.auth.acquireTokenSilent({scope: 'Mail.Read', userId: this.state.userId})
      console.log('Silent:', tokens)
      if (!tokens) {
        tokens = await azureAuth.webAuth.authorize({scope: 'Mail.Read'})
        console.log('NewWeb:', tokens)
      }
      console.log('TOK>>>', tokens.accessToken)
      let mails = await azureAuth.auth.msGraphRequest({token: tokens.accessToken, path: '/me/mailFolders/Inbox/messages'})
      let mailArr = []
      mails.value.forEach(element => {
        mailArr.push({subject: element.subject})
      });
      if (mailArr.length === 0) {
        mailArr.push({subject: 'No mails found'})
      }
      console.log('Mails: ' + mailArr.length)
      this.setState({mails: mailArr})
    } catch (error) {
      console.log(error)
    }
  }

  _onLogout = () => {

    azureAuth.auth.clearPersistenCache()
    .then(success =>{
      console.log('Logged out successfully!');
      this.setState({ accessToken: null, user: null });
    })
/* Esto es lo que deberia suceder, pero me inmuto a solo desloguearme de la app. Espero un fix del autor de react-native-azure-auth
    azureAuth.webAuth
      .clearSession()
      .then(success => {
        this.setState({ accessToken: null, user: null });
        console.log('Logged out successfully!');
      })
      .catch(error => console.log(error));
*/
  };

  render() {
    let loggedIn = this.state.accessToken  ? true : false;
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Azure Auth - Login</Text>
          <Text style={styles.text}>Hello {this.state.user}!</Text>
          <Text style={styles.text}>
            You are {loggedIn ? '' : 'not '}logged in.
          </Text>
        </View>  
        <View style={styles.buttons}>
          <Button
            style={styles.button}
            onPress={loggedIn ? this._onLogout : this._onLogin}
            title={loggedIn ? 'Log Out' : 'Log In'}
          />
          <Button
            style={styles.button}
            onPress={this._onGetMails}
            disabled={!loggedIn}
            title={'Get E-Mails'}
          />
        </View>
        <FlatList style={styles.list}
          data={this.state.mails}
          renderItem={({item}) => <Text style={{padding: 10}}>{item.subject}</Text>}
          keyExtractor={(item, index) => `key-${index}`}
        />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  text: {
    textAlign: 'center'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'baseline',
    padding: 20
  },
  button: {
    flex: 1,
    padding:20,
    margin:20
  },
  list: {
    flex: 5,
    margin:20
  }
});

AppRegistry.registerComponent('Auth0Sample', () => Auth0Sample);


