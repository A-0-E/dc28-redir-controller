# dc28-redir-controller
DC28 Redirection Controller (RC)

## TBD DEbUg CoMmAnD

```
#if need sudo: -e NEED_SUDO=1
docker run -it --rm -p 3000:3000 -p 4000:4000 -v "$(pwd):/app" --cap-add CAP_NET_ADMIN --cap-add CAP_NET_RAW --network host node bash
apt update
apt install -y iptables vim-tiny
iptables -t nat -N fwdctrl_chain
iptables -t nat -I PREROUTING -j fwdctrl_chain
# For backend
cd /app/backend
yarn install
yarn start
```


## to fix

why ctrl+c cause `address already in use`?