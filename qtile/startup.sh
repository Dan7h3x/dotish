#!/usr/bin/env bash

if [ "$XDG_SESSION_TYPE" = "x11" ]; then
  setxkbmap us,ir -option "grp:alt_shift_toggle" &
  dunst &
  /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &
  picom &
  mpd &
  mpd-mpris &
  feh --bg-scale -z ~/.config/Wallpaper/ &
  ksuperkey -e 'Super_L=Alt_L|F1' &
fi

if [ "$XDG_SESSION_TYPE" = "wayland" ]; then
  swww-daemon &
  /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &
  mpd &
  mpd-mpris &
  systemctl --user import-environment DISPLAY WAYLAND_DISPLAY &
  dbus-update-activation-environment 2>/dev/null && dbus-update-activation-environment --systemd DISPLAY WAYLAND_DISPLAY &
  systemctl --user start xdg-desktop-portal &
  systemctl --user start xdg-desktop-portal-wlr &
  dbus-update-activation-environment WAYLAND_DISPLAY
  dbus-update-activation-environment XDG_CURRENT_DESKTOP=qtile
  dbus-update-activation-environment DISPLAY

  mako &
fi
