# Firewall access from mobile device

I allowed access to all devices on the dev machine's subnet, which included my mobile when running from the local wi-fi, to port 19000 on the dev machine (the port used by Expo).

```
sudo ufw allow from 192.168.88.0/24 to any port 19000
```
