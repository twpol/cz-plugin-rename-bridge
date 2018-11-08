/* global client, plugin */
/* global formatException */

// PLUGIN ENVIRONMENT //

plugin.id = 'rename-bridge';

plugin.init =
function _init(glob) {
    this.major = 1;
    this.minor = 0;
    this.version = this.major + '.' + this.minor + ' (08 Nov 2018)';
    this.description = 'Transforms IRC-bridge users into their own unique users. ' +
    "By James Ross <chatzilla-plugins@james-ross.co.uk>.";

    this.prefary.push(['bridges', '', '']);

    return 'OK';
}

plugin.enable =
function _enable() {
    client.eventPump.addHook([
        { set: 'server', type: 'notice' },
        { set: 'server', type: 'privmsg' }
    ],
        plugin.onMessage,
        plugin.id + '-server-privmsg+notice');
    plugin.onPrefChanged();
    return true;
}

plugin.disable =
function _disable() {
    client.eventPump.removeHookByName(plugin.id + '-server-privmsg+notice');
    return true;
}

plugin.onPrefChanged =
function _onprefchanged() {
    plugin.bridges = plugin.prefs['bridges'].split(' ')
        .filter(bridge => !!bridge)
        .map(parseIRCURL)
        .filter(url => url.isnick);
}

plugin.onMessage =
function _onmessage(e) {
    try {
        // client.display('RB source=' + e.server.parent.getURL() + ' user=' + e.user.unicodeName + ' params.length=' + e.params.length + ' params[1]=' + e.params[1] + ' params[2]=' + e.params[2] + '');
        const bridges = plugin.bridges;
        for (const bridge of bridges) {
            if ((bridge.host === e.server.parent.unicodeName || (bridge.host === e.server.hostname && bridge.port === e.server.port)) && e.user.unicodeName === bridge.target) {
                const bridgeMessage = e.params[2].match(/^<(.*?)> ([^ ].*)$/);
                if (bridgeMessage) {
                    e.bridgeUser = e.user;
                    e.user = new CIRCUser(e.server, null, removeColorCodes(bridgeMessage[1]));
                    e.params[2] = bridgeMessage[2];
                    client.display('RB ' + e.bridgeUser.unicodeName + ' --> ' + e.user.unicodeName);
                }
                break;
            }
        }
    } catch (ex) {
        client.display('Rename Bridge: ' + formatException(ex));
    }
}
