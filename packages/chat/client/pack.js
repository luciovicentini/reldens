/**
 *
 * Reldens - Chat Client Package.
 *
 */

const { ChatUi } = require('./chat-ui');
const { MessagesListener } = require('./messages-listener');
const { PackInterface } = require('../../features/pack-interface');
const { ChatConst } = require('../constants');
const { Logger, sc } = require('@reldens/utils');

class ChatPack extends PackInterface
{

    setupPack(props)
    {
        this.events = sc.get(props, 'events', false);
        this.messagesQueu = [];
        this.uiManager = false;
        if(!this.events){
            Logger.error('EventsManager undefined in ChatPack.');
        }
        this.joinRooms = [ChatConst.CHAT_GLOBAL];
        // chat messages are global for all rooms, so we use the generic event for every joined room:
        // eslint-disable-next-line no-unused-vars
        this.events.on('reldens.joinedRoom', async (room, gameManager) => {
            await MessagesListener.listenMessages(room, this);
        });
        this.events.on('reldens.preloadUiScene', (preloadScene) => {
            preloadScene.load.html('chat', 'assets/features/chat/templates/ui-chat.html');
            preloadScene.load.html('chatMessage', 'assets/features/chat/templates/message.html');
        });
        this.events.on('reldens.createUiScene', (preloadScene) => {
            this.uiManager = new ChatUi(preloadScene);
            this.uiManager.createUi();
            this.uiManager.processMessagesQueue(this.messagesQueu);
        });
    }

}

module.exports.ChatPack = ChatPack;
