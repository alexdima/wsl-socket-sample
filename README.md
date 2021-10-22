# wsl-socket-sample

* in wsl, run `npm install`
* in wsl, run `node server.js`
* open the printed URL in a browser in Windows
* open developer tools in the browser
* disable external network adapter
* (everything still works...)
* enable external network adapter
* the WebSocket closes
* also look closely at the `vEthernet (WSL)` adapter which flickers off/on

<img src="repro.gif" />
