# DC28 RC

DC28 Redirection Controller (RC)

Thanks for our coders @spacemeowx2, @davendu and our UI/UE designer @dadongqian for making this tool available within a day.

## Wuat is it?

In DC28, each service could have two ports: 

* Normal port (X): get all points but traffic captured for victim
* Stealth port (10000+X): traffic hidden while points half for that round

So we wrote this tool to manage which port is targeted, prevent our exploiters spending time to fix their port number.

Changes would be updated real time, to make different team members sharing their state.

## How it works?

Prepare your IPTables:

```bash
iptables -t nat -N fwdctrl_chain
iptables -t nat -I PREROUTING -j fwdctrl_chain
```

Then just `docker-compose up -d`

## Seriously, I mean how it works?

Our DEVOPS team make all traffic related with this CTF going through a single gateway, and then distributed to internal network or OOO's team infra. Thus some simple IPTables would be enough.

## Q/A

* Is "RC" specially crafted to mix with "Release Candidate"?
    * Yes!
* Does it work?
    * Maybe?
* Is it safe?
    * No.
* Why not golang/iptables/rust/.....?
    * Lazzzy.
