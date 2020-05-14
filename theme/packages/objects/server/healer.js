/**
 *
 * Reldens - Healer
 *
 * This is an example object class, it extends from the NpcObject class and then define the specific parameters for the
 * behavior and animations.
 *
 */

const { NpcObject } = require('reldens/packages/objects/server/npc-object');
const { GameConst } = require('reldens/packages/game/constants');
const { Logger } = require('@reldens/utils');

class Healer extends NpcObject
{

    constructor(props)
    {
        super(props);
        this.runOnAction = true;
        this.playerVisible = true;
        // assign extra params:
        this.clientParams.enabled = true;
        // @TODO: all the npc info will be coming from the storage.
        this.clientParams.ui = true;
        this.content = 'Hi there! I can restore your health, would you like me to do it?';
        this.options = {
            option1: {label: 'Heal HP', value: 1},
            option2: {label: 'Nothing...', value: 0}
        }
    }

    parseMessageAndRunActions(client, data, room, playerSchema)
    {
        super.parseMessageAndRunActions(client, data, room, playerSchema);
        if(data.act === GameConst.BUTTON_OPTION && data.id === this.id){
            if(Number(data.value) === 1){
                // update and save the player:
                playerSchema.stats.hp = playerSchema.initialStats.hp;
                room.savePlayerStats(playerSchema).then(() => {
                    // update ui box:
                    let activationData = {act: GameConst.UI, id: this.id, content: 'Your HP points has been restored!'};
                    // update the target:
                    room.send(client, {act: GameConst.PLAYER_STATS, stats: playerSchema.stats});
                    room.send(client, activationData);
                }).catch((err) => {
                    Logger.error(err);
                });
            } else {
                let responseMessage = 'Then I will give you an item for later, you never know...';
                let activationData = {act: GameConst.UI, id: this.id, content: responseMessage};
                room.send(client, activationData);
                let healPotion = playerSchema.inventory.createItemInstance('heal_potion_20');
                playerSchema.inventory.manager.addItem(healPotion).catch((err) => {
                    Logger.error(['Error while adding item "heal_potion_20":', err]);
                });

            }
        }
    }

}

module.exports.Healer = Healer;
