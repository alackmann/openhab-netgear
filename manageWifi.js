const NetgearRouter = require('netgear');

// update login details for your router
// for best results, use the local ip address for your router for [host]
const router = new NetgearRouter('your-password','admin','192.168.1.1','5000'); // [password], [user], [host], [port]

async function setGuestStatus2G(status) {
    try{
        await router.login();
        // 2.4Ghz
        // await router.setGuestAccessEnabled(status);
        await router.setGuestWifi(status);
        // 5Ghz
        // await router.set5GGuestAccessEnabled2(status);
        await router.set5GGuestWifi(status);
    } catch(error) {
        console.log(error);
    }
}

async function setGuestStatus5G(status) {
    try{
        await router.login();
        // 5Ghz
        // await router.set5GGuestAccessEnabled2(status);
        await router.set5GGuestWifi(status);
    } catch(error) {
        console.log(error);
    }
}

async function getInfo() {
    try {
        await router.login();
        var info = await router.getInfo();
        console.log(info);
    } catch(error) {
        console.log(error);
    }
}

async function getGuestStatus() {
    try {
        await router.login();
        var status2G = await router.getGuestWifiEnabled();
        var status5G = await router.get5GGuestWifiEnabled();

        console.log({'2g': status2G, '5g': status5G});
    } catch (error) {
        console.log(error);
    }
}

if(process.argv[2] == "switch-2g") {
    var status = (process.argv[3] == "ON" ? true : false);
    setGuestStatus2G(status);
} else if(process.argv[2] == "switch-5g") {
    var status = (process.argv[3] == "ON" ? true : false);
    setGuestStatus5G(status);
} else if (process.argv[2] == "info") {
    getInfo();
} else if(process.argv[2] == "guest-status") {
    getGuestStatus();
}