welcome to the peakest ever discord bot, AGNABOT
custom discord bot for agnab's amassing which can be found at
# https://discord.gg/2JgqEMNfyr

includes gambling and drugs WOW

you can import the following into your nixos configuration if you want to run it for yourself
i will add a .env example later

```nix
{ config, pkgs, ... }:

let
  agnabotDir = "/git/agnabot/path";
  agnabotDataDir = "/var/lib/agnabot";
in
{
  systemd.tmpfiles.rules = [
    "d ${agnabotDataDir} 0755 $USER users -"
  ];

  systemd.user.services.agnabot = {
    description = "agnabot discord bot";
    after = [ "network.target" ];

    serviceConfig = {
      Type = "simple";
      WorkingDirectory = agnabotDir;
      Environment = "AGNABOT_DATA_DIR=${agnabotDataDir}";
      ExecStart = "${pkgs.nix}/bin/nix run ${agnabotDir}#default";
      Restart = "always";
      RestartSec = 5;
    };
  };

  systemd.user.services.agnabot-update = {
    description = "update agnabot from git";
    serviceConfig = {
      Type = "oneshot";
      WorkingDirectory = agnabotDir;
      ExecStart = ''
        git fetch --all
        git reset --hard origin/main
        systemctl --user restart agnabot.service
      '';
      User = "youruser";
    };
  };

  systemd.user.timers.agnabot-update = {
    description = "run agnabot git update every 5 minutes";
    wantedBy = [ "timers.target" ];
    timerConfig = {
      OnBootSec = "1min";
      OnUnitActiveSec = "5min";
    };
  };
}



```