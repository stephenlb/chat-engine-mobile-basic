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

        // Storage of Received Messages
        this.state          = {};
        this.state.messages = [];

        // ChatEngine Init
        this.chatEngine = ChatEngineCore.create({
            publishKey   : ChatConfig.publishKey
        ,   subscribeKey : ChatConfig.subscribeKey
        });

        // Connect yourself (triggers '$.ready' event)
        this.chatEngine.connect(
            this.props.userID   || 'stephenlb'
        ,   this.props.userData || { name: 'StephenBlum' } );

        // When the Connection is Live
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
        this.state.messages.push(event);
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
                //<FlatList
                //    data={[{key: 'a'}, {key: 'b'}]}
                //    dataSource={this.state.messages}
                //    renderItem={({item}) => <Text>{item.key}</Text>} />
        return (
            <View style={ChatStyle.view}>
                <TextInput
                    style={ChatStyle.messageInput}
                    placeholder="Chat here"
                    onSubmitEditing={ (event) => this.sendMessage(event) } />
            </View>
        );
    }
}
