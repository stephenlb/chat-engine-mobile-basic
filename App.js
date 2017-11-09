import React from 'react';
import Chat  from './components/chat';

import { Component }  from 'react';
import { Text, View } from 'react-native';

export default class App extends Component {
    constructor() {
        super();
        this.userID   = 'stephenlb';
        this.userAuth = 'auth-key';
        this.userData = { name: 'StephenBlum' };
    }

    render() {
        return (
            <Chat
                userID={this.userID}
                userAuth={this.userAuth}
                userData={this.userData}
                theme='light'/>
        );
    }
}
