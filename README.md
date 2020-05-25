# Lisk Rebuilder

Lisk Rebuilder is a script that makes sure your node is in sync with the network and (optionally) fully up-to-date with the latest version.

An array of reference nodes is used to determine a network height and version consensus. If your node deviates too much from it, the script will automatically execute the corresponding bash script (`rebuild.sh` or `upgrade.sh`). You can alter the reference array in the `config.json` and customize the rebuild/upgrade scripts, if desired.

#### Installation

```
git clone https://github.com/sidechain-solutions/lisk-rebuilder
cd lisk-rebuilder
npm i
```

#### Configuration

```sh
nano config.json
```

#### Customize

You can customize the rebuild and upgrade behaviour by editing `rebuild.sh` and `upgrade.sh`;

```sh
nano rebuild.sh
```

```sh
nano upgrade.sh
```

#### Scheduling

The script is meant to be run at a relatively slow interval (once or twice per day). You can do so by scheduling it as a cronjob.

For example (twice a day):

```
crontab -e
```

```
0 */12 * * * /usr/local/bin/node /home/lisk/lisk-rebuilder/index.js > /home/lisk/lisk-rebuilder/cron.log 2>&1
```

Make sure that the schedule does not overlap with your other nodes.
