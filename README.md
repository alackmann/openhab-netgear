# openhab-netgear

An [OpenHab](https://www.openhab.org) add-on that that acts as a wrapper for the [Netgear](https://github.com/gruijter/netgear.js) node module to allow managing of wifi access points from OpenHab Sitemaps and Rules.

The provided examples allow you to create an interface to easily turn on/off the guest wifi network from your OpenHAB interface and rules to do this for a set period of time (eg. 1hr) - perfect for giving the kids a limited time window for internet usage.

## Requirements
* OpenHAB 2.x (tested on 2.3.0)
* The OpenHAB [Exec Binding](https://www.openhab.org/addons/bindings/exec/)
* NodeJS 8+
* Yarn or NPM

## Installation
1. Ensure you have the requirements installed on the same server as OpenHAB
1. Go to your OpenHAB scripts directory (on Linux this is `/etc/openhab2/scripts`)
1. Install this package using yarn/npm: `yarn add openhab-netgear`
1. You should now have a folder in your scripts dir for `openhab-netgear`
1. Depending on your setup, you probably need to change the file ownership of the new folder `chown -R openhab: node_modules/`

## Setup
### Things
You need to setup two *Things* in OpenHAB to connect the node script to OpenHAB. 

| Thing           | Command                                                                          | Transform   | Interval | Timeout | Autorun |
| ----------------|----------------------------------------------------------------------------------|-------------|----------|---------|---------|
| wifiGuestSwitch | /usr/bin/node /etc/openhab2/scripts/node_modules/openhab-netgear/manageWifi.js switch-2g %2$s | REGEX((.*)) | 0        | 15      | OFF     |
| wifiStatus      | /usr/bin/node /etc/openhab2/scripts/node_modules/openhab-netgear/manageWifi.js guest-status   | REGEX((.*)) | 60       | 15      | OFF     |

You can do this via the web interface OR in the file system - however you normally do this should be fine.

### Items
Add the following Items to an existing or new file in `/etc/openhab2/items` folder
```
// Netgear Wifi Switching
Switch WifiGuestSwitch  "Guest Wifi" <network> // proxy triggers rule
Number WifiGuestTimer  "Guest Wifi" <network> // timer active ON/OFF
Switch WifiGuestSwitchExec {channel="exec:command:wifiGuestSwitch:run"}  // Exec binding to run execute JS 
String WifiGuestSwitchArgs {channel="exec:command:wifiGuestSwitch:input"} // Argument to pass (ON/OFF) to JS
String WifiGuestStatus {channel="exec:command:wifiStatus:output"} // Second Exec binding to check actual router status
Switch WifiGuestSwitchRunning // Switched to ON for 30 seconds whenever a wifi change is run
DateTime WifiGuestEnabledUntil "Guest Wifi Until: [%1$tH:%1$tM]" // the deadline for wifi access to be automatically disabled
Switch WifiGuestTimerRunning "Wifi timer running" // indicates if a wifi deadline is currently in action
```

### Sitemap
Example Sitemap entries to allow guest wifi to be controlled and managed. Add this to your existing Sitemap as you see fit.
```
    Frame label="Kids Wifi" icon="network" {
        Switch item=WifiGuestSwitch label="Wifi Status"
        Switch item=WifiGuestTimer label="Enable for" icon="clock" mappings=[30="30m", 60="1h", 90="1.5h", 120="2h"] visibility=[WifiGuestTimerRunning==OFF]
        Switch item=WifiGuestTimerRunning visibility=[WifiGuestTimerRunning==ON]
        Text item=WifiGuestEnabledUntil icon="clock" visibility=[WifiGuestTimerRunning==ON]
    }
```

### Rules
Copy the `wifi.rules` file from `/etc/openhab2/scripts/node_modules/openhab-netgear/wifi.rules` into your rules folder (`/etc/openhab2/rules/`). Edit as you see fit.

## Troubleshooting
To confirm the script is installed with all the pre-requisites, from the command line of your OpenHAB server, run the following:
```
node manageWifi.js info
```
You should get some output from your router similar to the below. If not, check your steps again and make sure your login and router address details are correct
```
{ ModelName: 'R8000',
  Description: 'Netgear Smart Wizard 3.0, specification 0.7 version',
  SerialNumber: '3WN34A7000167',
  Firmwareversion: 'V1.0.4.18',
  SmartAgentversion: '3.0',
  FirewallVersion: 'ACOS NAT-Netfilter v3.0.0.5 (Linux Cone NAT Hot Patch 06/11/2010)',
  VPNVersion: 'N/A',
  OthersoftwareVersion: '10.1.49',
  Hardwareversion: 'R8000',
  Otherhardwareversion: 'N/A',
  FirstUseDate: 'Friday, 01 Sep 2006 00:00:00',
  DeviceName: 'R8000',
  FirmwareDLmethod: '',
  FirmwareLastUpdate: '',
  FirmwareLastChecked: '',
  DeviceMode: '1' }
```