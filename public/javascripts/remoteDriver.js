const remoteURLObject = {
    // ip: '172.25.106.169',
    ip: '10.0.2.15',
    port: '3000',
    // route: 'displays',
    // endpoint: '10'
}
// const remoteURL = `ws://${remoteURLObject.ip}:${remoteURLObject.port}/${remoteURLObject.route}/${remoteURLObject.endpoint}`
const remoteURL = `ws://${remoteURLObject.ip}:${remoteURLObject.port}`

export const getremoteURLObject = () => remoteURLObject;
export const getWebSocketRef = () => ws

var ws = new WebSocket(remoteURL);

ws.onopen = function () {
    console.log('Connection established!')
};

ws.onmessage = function (evt) {
    // let messageReceived = evt.data;
    // console.log('Msg received from Blade ::', messageReceived)
};

ws.onclose = function () {
    console.log("Connection with Remote Machine closed.");
};

console.log('Trying to connect to the Remote Machine...')