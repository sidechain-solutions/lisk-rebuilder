#!/bin/bash

cd /home/lisk/
rm -f installLisk.sh
wget https://downloads.lisk.io/lisk/test/installLisk.sh
yes "" | bash installLisk.sh upgrade -r test