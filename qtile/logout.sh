#!/usr/bin/env bash

#!/bin/bash

SELECTION="$(printf "1 - Suspend\n2 - Log out\n3 - Reboot\n4 - Reboot to UEFI\n5 - Hard reboot\n6 - Shutdown" | fuzzel --dmenu -l 7 -p "Power Menu: ")"

case $SELECTION in
*"Suspend")
  systemctl suspend
  ;;
*"Log out")
  killall qtile
  ;;
*"Reboot")
  systemctl reboot
  ;;
*"Reboot to UEFI")
  systemctl reboot --firmware-setup
  ;;
*"Hard reboot")
  pkexec "echo b > /proc/sysrq-trigger"
  ;;
*"Shutdown")
  systemctl poweroff
  ;;
esac
