/**
 *
 * Reldens - SettingsUi
 *
 */

class SettingsUi
{

    setup(settingsConfig, scenePreloader)
    {
        scenePreloader.elementsUi['settings'] = scenePreloader.add.dom(settingsConfig.uiX, settingsConfig.uiY)
            .createFromCache('settings');
        let settingsTemplate = scenePreloader.cache.html.get('settings-content');
        scenePreloader.gameManager.gameDom.appendToElement('.content', settingsTemplate);
        let uiSettingsBox = scenePreloader.gameManager.gameDom.getElement('#settings-ui');
        let closeButton = scenePreloader.gameManager.gameDom.getElement('#settings-close');
        let openButton = scenePreloader.elementsUi['settings'].getChildByProperty('id', 'settings-open');
        if(closeButton && openButton){
            closeButton.addEventListener('click', () => {
                uiSettingsBox.style.display = 'none';
                openButton.style.display = 'block';
            });
            openButton.addEventListener('click', () => {
                uiSettingsBox.style.display = 'block';
                openButton.style.display = 'none';
            });
        }
    }

}

module.exports.SettingsUi = SettingsUi;
