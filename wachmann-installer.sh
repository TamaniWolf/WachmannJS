#!/bin/sh
echo ""
echo ""
echo "Installing WachmannJS dependencies"

root=$(pwd)
choice=1

while [ "$choice" -eq 1 ]; do
    echo ""
    npm i -g pnpm;
    pnpm setup;
    source /root/.bashrc;
    pnpm add -g better-sqlite3 discord.js dotenv glob luxon;
    pnpm update;
    choice=2
done

echo ""
echo ""
echo ""
echo ""
echo ""
echo "Configuring WachmannJS"
token=""
prefix=""
nodeenv=""
serverid=""
serverowner=""
botmaster=""
botmasterrole=""
wachmannid=""
botchannel=""
logchannel=""
logcommands=""
logbots=""
externalcommands=""
enablecommands=""
enablemodules=""

while [ "$choice" -eq 2 ]; do
    echo ""
    echo "dotenv File (.env)"
    choice=101
    if [ $choice -eq 101 ] ; then
        echo "Enter the Bot's Token:"
        read -r token
        if [ ! "$token" ] || [ "$token" = "" ]; then
            echo "Hey you need this!"
            echo ""
            choice=101
        else
            echo ""
            choice=102
        fi
    fi
    if [ $choice -eq 102 ] ; then
        echo "Enter a command prefix:"
        echo "(In case we need it.)"
        read -r prefix
        if [ ! "$prefix" ] || [ "$prefix" = "" ]; then
            prefix="!"
            echo "Set to the default = !"
            echo ""
            choice=103
        else
            echo ""
            choice=103
        fi
    fi
    if [ $choice -eq 103 ] ; then
        # echo "Enter the Node Envierement:"
        # echo "(dev, droduction, etc)"
        # read -r nodeenv
        # if [ ! "$nodeenv" ] || [ "$nodeenv" = "" ]; then
            # nodeenv="dev"
            # echo "Set to the default = dev"
            # echo ""
            # choice=104
        # else
            # echo ""
            choice=104
        # fi
    fi
    if [ $choice -eq 104 ] ; then
        echo "Enter the Server ID:"
        echo "(Optional)"
        read -r serverid
        if [ ! "$serverid" ] || [ "$serverid" = "" ]; then
            serverid=""
            echo ""
            choice=105
        else
            echo ""
            choice=105
        fi
    fi
    if [ $choice -eq 105 ] ; then
        echo "Enter the Server Owners ID:"
        echo "(Optional)"
        read -r serverowner
        if [ ! "$serverowner" ] || [ "$serverowner" = "" ]; then
            serverowner=""
            echo ""
            choice=106
        else
            echo ""
            choice=106
        fi
    fi
    if [ $choice -eq 106 ] ; then
        echo "Enter the Bot Masters:"
        read -r botmaster
        if [ ! "$botmaster" ] || [ "$botmaster" = "" ]; then
            echo "Hey you need this!"
            echo ""
            choice=106
        else
            echo ""
            choice=107
        fi
    fi
    if [ $choice -eq 107 ] ; then
        echo "Enter the Bot Master Role:"
        echo "(Optional.)"
        read -r botmasterrole
        if [ ! "$botmasterrole" ] || [ "$botmasterrole" = "" ]; then
            botmasterrole=""
            echo ""
            choice=108
        else
            echo ""
            choice=108
        fi
    fi
    if [ $choice -eq 108 ] ; then
        echo "Enter Wachmann's ID:"
        read -r wachmannid
        if [ ! "$wachmannid" ] || [ "$wachmannid" = "" ]; then
            echo "Hey you need this!"
            echo ""
            choice=108
        else
            echo ""
            choice=109
        fi
    fi
    if [ $choice -eq 109 ] ; then
        echo "Enter the Bot Channel:"
        read -r botchannel
        if [ ! "$botchannel" ] || [ "$botchannel" = "" ]; then
            echo "Hey you need this!"
            echo ""
            choice=109
        else
            echo ""
            choice=110
        fi
    fi
    if [ $choice -eq 110 ] ; then
        echo "Enter the loggin Channel:"
        read -r logchannel
        if [ ! "$logchannel" ] || [ "$logchannel" = "" ]; then
            echo "Hey you need this!"
            echo ""
            choice=110
        else
            echo ""
            choice=111
        fi
    fi
    if [ $choice -eq 111 ] ; then
        echo "Toggle Command loggin:"
        echo "(Optional. false = OFF | true = ON)"
        read -r logcommands
        if [ ! "$logcommands" ] || [ "$logcommands" = "" ]; then
            logcommands="false"
            echo "Set to the default = false"
            echo ""
            choice=112
        else
            echo ""
            choice=112
        fi
    fi
    if [ $choice -eq 112 ] ; then
        echo "Toggle Bot loggin:"
        echo "(Optional. false = OFF | true = ON)"
        read -r logbots
        if [ ! "$logbots" ] || [ "$logbots" = "" ]; then
            logbots="false"
            echo "Set to the default = false"
            echo ""
            choice=113
        else
            echo ""
            choice=113
        fi
    fi
    if [ $choice -eq 113 ] ; then
        echo "Enter what commands not to be logged:"
        echo "(Optional.)"
        echo "(Sepperated by a commata ',')"
        read -r externalcommands
        if [ ! "$externalcommands" ] || [ "$externalcommands" = "" ]; then
            externalcommands=""
            echo ""
            choice=114
        else
            echo ""
            choice=114
        fi
    fi
    if [ $choice -eq 114 ] ; then
        echo "Toggle What commands to be Enabled:"
        echo "(Optional.)"
        echo "(Sepperated by a commata ',')"
        read -r enablecommands
        if [ ! "$enablecommands" ] || [ "$enablecommands" = "" ]; then
            enablecommands="help,info,ping,sleep,clear"
            echo "Set to the default = help,info,ping,sleep,clear"
            echo ""
            choice=115
        else
            echo ""
            choice=115
        fi
    fi
    if [ $choice -eq 115 ] ; then
        echo "Toggle What modules to be Enabled:"
        echo "(Optional.)"
        echo "(Sepperated by a commata ',')"
        read -r enablemodules
        if [ ! "$enablemodules" ] || [ "$enablemodules" = "" ]; then
            enablemodules="logs"
            echo "Set to the default = logs"
            echo ""
            choice=116
        else
            echo ""
            choice=116
        fi
    fi
    if [ $choice -eq 116 ] ; then
        echo ".env file:"
        echo "''"
        envfile=".env"
        echo "//-- WachmannJS --//" >> $envfile
        echo "TOKEN = $token" >> $envfile
        echo "PREFIX = $prefix" >> $envfile
        # echo "NODE_ENV = $nodenv" >> $envfile
        echo "" >> $envfile
        echo "SERVER_ID = $serverid" >> $envfile
        echo "SERVER_OWNER = $serverowner" >> $envfile
        echo "" >> $envfile
        echo "BOT_MASTER = $botmaster" >> $envfile
        echo "BOT_MASTER_ROLE = $botmasterole" >> $envfile
        echo "" >> $envfile
        echo "WACHMANN_ID = $wachmannid" >> $envfile
        echo "BOT_CHANNEL = $botchannel" >> $envfile
        echo "LOG_CHANNEL = $logchannel" >> $envfile
        echo "LOG_COMMANDS = $logcommands" >> $envfile
        echo "LOG_BOTS = $logbots" >> $envfile
        echo "EXTERNAL_COMMANDS = $externalcommands" >> $envfile
        echo "" >> $envfile
        echo "ENABLE_COMMANDS = $enablecommands" >> $envfile
        echo "ENABLE_MODULES = $enablemodules" >> $envfile
        echo "" >> $envfile
    fi
    echo ""
    echo ""
    echo ""
    choice=3
    if [ $choice -eq 3 ] ; then
        echo "Please check if all information is correct before you procced!"
        echo ""
        echo "Are all Information you set correct?"
        read -p "[y/n]: " yn
        case $yn in
            [Yy]* ) choice=4;;
            [Nn]* ) choice=101; echo "";echo "dotenv File";;
            * ) echo "Couldn't get that please type [y] for Yes or [n] for No.";;
        esac
    fi
    if [ $choice -eq 4 ] ; then
        cat $envfile
        chmod ug+rwx .env;
        chmod o+rx .env;
        echo "''"
        choice=0
        echo ""
        echo ""
    fi

done
echo "Setup is completed."
echo ""
echo ""
cd "$root" || return;
echo "exit code 0"
echo ""
exit 0