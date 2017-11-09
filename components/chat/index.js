import React                from 'react';
import ChatStyle            from './style';
import ChatConfig           from './config';
import ChatEngineCore       from 'chat-engine';

import { Component }        from 'react';
import { StyleSheet, Text } from 'react-native';
import { TextInput, View }  from 'react-native';

export default class Chat extends Component {
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Initialize ChatEngine
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    constructor(props) {
        super(props);

        this.chatEngine = ChatEngineCore.create({
            publishKey   : ChatConfig.publishKey
        ,   subscribeKey : ChatConfig.subscribeKey
        });

        this.chatEngine.connect(
            this.props.userID   || 'stephenlb'
        ,   this.props.userData || { name: 'StephenBlum' }
        ,   this.props.userAuth || 'auth-key-3' );

        this.chatEngine.on( '$.ready', (chat) => {
            console.log('Ready');
            this.me = chat.me;
            this.ready(chat.me);
        } );
    }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Message Send Handler
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    sendMessage(event) {
        console.log( 'Sending:', JSON.stringify(event.nativeEvent.text) );
        this.lobby.emit( 'message', { text : event.nativeEvent.text } );
    }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Message Received Handler
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    receiveMessage(event) {
        console.log( 'Receiving:', JSON.stringify(event.data.text) );
        // ... TODO
    }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // ChatEnigne Ready
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    ready(me) {
        this.lobby = me.chatEngine.Chat('lobby');

        this.lobby.on( '$.connected', () => {
            console.log('Connected');
            this.lobby.emit( 'message', { text: 'hello everybody!' } );
        } );

        this.lobby.on( 'message', (payload) => {
            this.receiveMessage(payload)
        } );
    }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Render Chat UI
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    render() {
        return (
            <View style={ChatStyle.view}>
                <TextInput
                    style={ChatStyle.messageInput}
                    placeholder="Chat here"
                    onSubmitEditing={ (event) => this.sendMessage(event) }
                />
            </View>
        );
    }
}
