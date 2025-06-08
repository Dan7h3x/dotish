#!/usr/bin/env bash

# Fuzzel-based Wayland Launcher
# Features: App launcher, logout manager, note manager, and utilities

# Configuration
NOTES_DIR="$HOME/notes" # Change this to your notes directory
TERMINAL="foot"         # Change to your terminal (foot, kitty, alacritty, etc.)
EDITOR="nvim"           # Change to your preferred editor

# Fuzzel appearance options
FUZZEL_OPTIONS="--dmenu --lines 10 --width 20 "

show_main_menu() {
  local options=(
    "Applications"
    "System"
    "Notes"
    "Quick Actions"
    "Exit"
  )

  local choice
  choice=$(printf "%s\n" "${options[@]}" | fuzzel $FUZZEL_OPTIONS --dmenu)

  case "$choice" in
  "Applications") $(fuzzel) ;;
  "System") system_menu ;;
  "Notes") notes_menu ;;
  "Quick Actions") quick_actions ;;
  "Exit") exit 0 ;;
  *) exit 0 ;;
  esac
}

system_menu() {
  local options=(
    "Lock Screen"
    "Logout"
    "Reboot"
    "Shutdown"
    "Suspend"
    "Back"
  )

  local choice
  choice=$(printf "%s\n" "${options[@]}" | fuzzel $FUZZEL_OPTIONS --dmenu)

  case "$choice" in
  "Lock Screen") lock_screen ;;
  "Logout") logout ;;
  "Reboot") systemctl reboot ;;
  "Shutdown") systemctl poweroff ;;
  "Suspend") systemctl suspend ;;
  "Back") show_main_menu ;;
  *) show_main_menu ;;
  esac
}

notes_menu() {
  local options=(
    "Search Notes"
    "Create New Note"
    "List All Notes"
    "Back"
  )

  local choice
  choice=$(printf "%s\n" "${options[@]}" | fuzzel $FUZZEL_OPTIONS --dmenu)

  case "$choice" in
  "Search Notes") search_notes ;;
  "Create New Note") create_note ;;
  "List All Notes") list_notes ;;
  "Back") show_main_menu ;;
  *) show_main_menu ;;
  esac
}

search_notes() {
  mkdir -p "$NOTES_DIR"
  local note
  note=$(find "$NOTES_DIR" -type f -name "*.md" |
    sed "s|$NOTES_DIR/||; s|.md||" |
    fuzzel $FUZZEL_OPTIONS --dmenu --prompt "Search Notes: ")

  if [ -n "$note" ]; then
    $TERMINAL -e $EDITOR "$NOTES_DIR/${note}.md"
  fi
}

create_note() {
  mkdir -p "$NOTES_DIR"
  local note_name
  note_name=$(echo "" | fuzzel $FUZZEL_OPTIONS --dmenu --prompt "Note Name: ")

  if [ -n "$note_name" ]; then
    # Remove any potentially dangerous characters
    note_name=$(echo "$note_name" | tr -d '/\\')
    $TERMINAL -e $EDITOR "$NOTES_DIR/${note_name}.md"
  fi
}

list_notes() {
  mkdir -p "$NOTES_DIR"
  local note
  note=$(ls -1 "$NOTES_DIR" | grep ".md$" | sed 's/.md$//' |
    fuzzel $FUZZEL_OPTIONS --dmenu --prompt "Notes: ")

  if [ -n "$note" ]; then
    $TERMINAL -e $EDITOR "$NOTES_DIR/${note}.md"
  fi
}

quick_actions() {
  local options=(
    "Open Terminal"
    "Open File Manager"
    "Take Screenshot"
    "Color Picker"
    "Back"
  )

  local choice
  choice=$(printf "%s\n" "${options[@]}" | fuzzel $FUZZEL_OPTIONS --dmenu)

  case "$choice" in
  "Open Terminal") $TERMINAL ;;
  "Open File Manager") pcmanfm ;; # Change to your file manager
  "Take Screenshot") grim -g "$(slurp)" $(xdg-user-dir PICTURES)/$(date +'%s_shot.png') | wl-copy ;;
  "Color Picker") hyprpicker -a ;;
  "Back") show_main_menu ;;
  *) show_main_menu ;;
  esac
}

lock_screen() {
  # Change to your preferred locker (swaylock, gtklock, etc.)
  swaylock \
    --screenshots \
    --clock \
    --indicator \
    --indicator-radius 100 \
    --indicator-thickness 7 \
    --effect-blur 7x5 \
    --effect-vignette 0.5:0.5 \
    --ring-color bb00cc \
    --key-hl-color 880033 \
    --line-color 00000000 \
    --inside-color 00000088 \
    --separator-color 00000000 \
    --grace 2 \
    --fade-in 0.2
}

logout() {
  local options=(
    "Cancel"
    "Logout"
    "Reboot"
    "Shutdown"
  )

  local choice
  choice=$(printf "%s\n" "${options[@]}" | fuzzel $FUZZEL_OPTIONS --dmenu)

  case "$choice" in
  "Logout") killall qtile ;; # Change to your compositor's command
  "Reboot") systemctl reboot ;;
  "Shutdown") systemctl poweroff ;;
  *) return ;;
  esac
}

# Start the main menu
show_main_menu
