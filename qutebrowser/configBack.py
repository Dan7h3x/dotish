#!/usr/bin/env python3
# vim: ft=python

import getpass
import os

from qutebrowser.api import interceptor, message


def userscript(script_name):
	return os.path.join(os.path.join(config.configdir, "userscripts"), script_name)


def usersfile(filename):
	return os.path.join(config.configdir, filename)


# ====================
# General Configuration
# ====================
c = c  # pyright:ignore[reportUndefinedVariable]
config = config  # pyright:ignore[reportUndefinedVariable]
config.load_autoconfig(False)

# Core settings
c.auto_save.session = True
c.content.javascript.clipboard = "access-paste"
c.content.pdfjs = True
c.downloads.location.directory = "~/Downloads"
c.editor.command = [
	"st",
	"-c",
	"'floating'",
	"-e",
	"nvim",
	"-f",
	"{file}",
	"-c",
	"normal {line}G{column0}l",
]
home = os.path.expanduser("~/.config/qutebrowser/homepage.html")

c.scrolling.smooth = True
c.tabs.background = True
c.tabs.position = "top"
c.tabs.show = "multiple"
c.url.start_pages = [f"file://{home}"]
c.url.default_page = f"file://{home}"
c.url.searchengines = {
	"DEFAULT": "https://www.google.com/search?hl=en&q={}",
	"aw": "https://wiki.archlinux.org/?search={}",
	"gh": "https://github.com/search?q={}",
	"yt": "https://youtube.com/results?search_query={}",
	"in": "https://inv.nadeko.net/search?q={}",
	"re": "https://www.reddit.com/search/?q={}",
	"so": "https://stackoverflow.com/search?q={}",
	"s": "https://sourcegraph.com/search?q=context:global+{}&patternType=standard&sm=1",
	"w": "https://en.wikipedia.org/wiki/Special:Search/{}",
	"dd": "https://devdocs.io#q={}",
	"p": "https://phind.com/search?q={}",
	"t": "https://www.magnetdl.com/search/?m=1&q={}",
	"dp": "https://devdocs.io#q=python {}",
	"dl": "https://devdocs.io#q=lua {}",
	"dr": "https://devdocs.io#q=rust {}",
}

# Appearance
c.colors.webpage.darkmode.enabled = True
c.colors.webpage.darkmode.policy.page = "smart"
c.fonts.default_family = "JetBrainsMono Nerd Font"
c.fonts.default_size = "10pt"
c.fonts.web.family.fixed = "JetBrainsMono Nerd Font"
c.fonts.web.family.sans_serif = "JetBrainsMono Nerd Font"
c.fonts.web.family.serif = "JetBrainsMono Nerd Font"
c.fonts.web.size.default = 15
c.tabs.title.format = "{audio}{current_title}"
c.tabs.indicator.width = 0

# =============
# Key Bindings
# =============

# Normal mode bindings
# config.unbind("d")
# config.unbind("u")
config.unbind("h")
config.unbind("l")
config.unbind("j")
config.unbind("k")

# Movement
config.bind("h", "scroll left")
config.bind("j", "scroll down")
config.bind("k", "scroll up")
config.bind("l", "scroll right")
config.bind("H", "back")
config.bind("L", "forward")
config.bind("J", "tab-prev")
config.bind("K", "tab-next")
config.bind("G", "scroll-to-perc 100")
config.bind("gg", "scroll-to-perc 0")
config.bind("e", "scroll-to-perc 50")

# Tabs
config.bind("T", "cmd-set-text -s :open -t")
config.bind("t", "cmd-set-text -s :open")
config.bind("<Ctrl+tab>", "tab-next")
config.bind("<Ctrl+Shift+tab>", "tab-prev")
config.bind("r", "reload")
config.bind("R", "reload -f")

# Navigation
config.bind("f", "hint")
config.bind("F", "hint all tab")
config.bind(";i", "hint images")
config.bind(";y", "hint links yank")
config.bind("gu", "navigate up")
config.bind("gU", "navigate up -t")
config.bind("gs", "view-source")
config.bind("gi", "hint --first inputs")
config.bind("gr", "restart")

# Searching
config.bind("/", "cmd-set-text /")
config.bind("?", "cmd-set-text ?")
config.bind("n", "search-next")
config.bind("N", "search-prev")
config.bind("*", "cmd-set-text :open {primary}")
config.bind("#", "cmd-set-text :open -- {primary}")

# Yanking
config.bind("yy", "yank")
config.bind("Y", "yank -s")
config.bind("p", "open -- {clipboard}")
config.bind(";p", "open -- {primary}")
config.bind("P", "open -- {clipboard} -t")
config.bind("yl", "yank title")
config.bind("yu", "yank url")
config.bind("yd", "yank domain")
config.bind("yc", "hint code userscript " + userscript("code_select"))
# Commands
config.bind(":", "cmd-set-text :")
config.bind("!", "cmd-set-text :!")
config.bind("Q", "quit --save")
config.bind("ZZ", "quit --save")


# Zoom
config.bind("+", "zoom-in")
config.bind("-", "zoom-out")
config.bind("=", "zoom")

# Insert mode
config.bind("<Escape>", "mode-leave", mode="insert")


# marks

config.bind("m", "quickmark-save")
config.bind("M", "quickmark-load")

config.bind("b", "bookmark-add")
config.bind("B", "open -t qute://bookmarks/")
# Command mode
config.bind("<Ctrl+n>", "completion-item-focus --history next", mode="command")
config.bind("<Ctrl+p>", "completion-item-focus --history prev", mode="command")
config.bind("<Down>", "completion-item-focus --history next", mode="command")
config.bind("<Up>", "completion-item-focus --history prev", mode="command")
config.bind("<Ctrl+y>", "command-accept", mode="command")
config.bind("<Escape>", "mode-leave", mode="command")

# Caret mode
config.bind("<Escape>", "mode-leave", mode="caret")

# Passthrough mode
config.bind("<Ctrl+v>", "mode-enter passthrough")

# Hint mode
config.bind("<Escape>", "mode-leave", mode="hint")

# Media bindings
config.bind("<", "run-with-count 5 seek -5")
config.bind(">", "run-with-count 5 seek +5")

# =============
# Advanced Features
# =============

# Vim-like marks
config.bind("'", "enter-mode jump_mark")

# Quick macros

# Sessions
config.bind("SS", "session-save")
config.bind("SL", "session-load default")

# Toggle settings
config.bind("xs", "config-cycle statusbar.show never always")
config.bind("xt", "config-cycle tabs.show always never switching")
config.bind("xb", "config-cycle scrolling.bar always never")


# User scripts

# =============
# URL Handling
# =============


# =============
# Custom Commands
# =============


# =============
# Completion
# =============
c.completion.open_categories = [
	"quickmarks",
	"bookmarks",
	"history",
	"filesystem",
	"searchengines",
]
c.completion.shrink = True
c.completion.use_best_match = True
c.completion.web_history.max_items = 1000

# =============
# Status Bar
# =============
c.statusbar.padding = {"top": 2, "bottom": 2, "left": 5, "right": 5}
c.statusbar.widgets = ["keypress", "url", "scroll", "history", "tabs", "progress"]

# =============
# Downloads
# =============
c.downloads.position = "bottom"
c.downloads.remove_finished = 3000

# =============
# Privacy
# =============
c.content.cookies.accept = "all"
c.content.headers.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
c.content.headers.accept_language = "en-US,en;q=0.9"
c.content.geolocation = True
c.content.media.audio_video_capture = False
c.content.notifications.enabled = True
c.content.register_protocol_handler = False
c.content.webrtc_ip_handling_policy = "disable-non-proxied-udp"
c.content.local_content_can_access_remote_urls = True
c.content.canvas_reading = True

c.content.local_content_can_access_remote_urls = True
# =============
# Performance
# =============
c.content.autoplay = False
c.content.javascript.enabled = True
c.content.local_storage = True
c.content.webgl = True

c.content.cache.size = 52428800  # 50MB
c.qt.force_software_rendering = "none"
c.content.prefers_reduced_motion = False
c.qt.chromium.low_end_device_mode = "auto"
# =============
# Theme
# =============
white = "#F8F8F2"
darker_black = "#222430"
black = "#282A36"
black2 = "#2d303e"
one_bg = "#373844"
one_bg2 = "#44475a"
one_bg3 = "#565761"
grey = "#5e5f69"
grey_fg = "#666771"
grey_fg2 = "#6e6f79"
light_grey = "#73747e"
red = "#ff7070"
baby_pink = "#ff86d3"
pink = "#FF79C6"
line = "#3c3d49"
green = "#50fa7b"
vibrant_green = "#5dff88"
nord_blue = "#8b9bcd"
blue = "#a1b1e3"
yellow = "#F1FA8C"
sun = "#FFFFA5"
purple = "#BD93F9"
dark_purple = "#BD93F9"
teal = "#92a2d4"
orange = "#FFB86C"
cyan = "#8BE9FD"
statusline_bg = "#2d2f3b"
lightbg = "#41434f"
pmenu_bg = "#b389ef"
folder_bg = "#BD93F9"
# Apply colors
c.colors.completion.category.bg = darker_black
c.colors.completion.category.border.bottom = darker_black
c.colors.completion.category.border.top = darker_black
c.colors.completion.category.fg = yellow
c.colors.completion.even.bg = black
c.colors.completion.odd.bg = black
c.colors.completion.fg = white
c.colors.completion.item.selected.bg = one_bg2
c.colors.completion.item.selected.border.bottom = one_bg2
c.colors.completion.item.selected.border.top = one_bg2
c.colors.completion.item.selected.fg = white
c.colors.completion.match.fg = yellow
c.colors.completion.scrollbar.bg = black
c.colors.completion.scrollbar.fg = white

c.colors.downloads.bar.bg = darker_black
c.colors.downloads.error.bg = red
c.colors.downloads.error.fg = darker_black
c.colors.downloads.stop.bg = cyan
c.colors.downloads.stop.fg = darker_black

c.colors.hints.bg = yellow
c.colors.hints.fg = darker_black
c.colors.hints.match.fg = green

c.colors.keyhint.bg = darker_black
c.colors.keyhint.fg = white
c.colors.keyhint.suffix.fg = white

c.colors.messages.error.bg = red
c.colors.messages.error.border = red
c.colors.messages.error.fg = darker_black
c.colors.messages.info.bg = darker_black
c.colors.messages.info.border = darker_black
c.colors.messages.info.fg = white
c.colors.messages.warning.bg = purple
c.colors.messages.warning.border = purple
c.colors.messages.warning.fg = darker_black

c.colors.prompts.bg = darker_black
c.colors.prompts.border = darker_black
c.colors.prompts.fg = white
c.colors.prompts.selected.bg = one_bg2

c.colors.statusbar.caret.bg = purple
c.colors.statusbar.caret.fg = darker_black
c.colors.statusbar.caret.selection.bg = blue
c.colors.statusbar.caret.selection.fg = darker_black
c.colors.statusbar.command.bg = darker_black
c.colors.statusbar.command.fg = white
c.colors.statusbar.command.private.bg = darker_black
c.colors.statusbar.command.private.fg = white
c.colors.statusbar.insert.bg = green
c.colors.statusbar.insert.fg = darker_black
c.colors.statusbar.normal.bg = darker_black
c.colors.statusbar.normal.fg = white
c.colors.statusbar.passthrough.bg = blue
c.colors.statusbar.passthrough.fg = darker_black
c.colors.statusbar.private.bg = black
c.colors.statusbar.private.fg = white
c.colors.statusbar.progress.bg = blue
c.colors.statusbar.url.error.fg = red
c.colors.statusbar.url.fg = white
c.colors.statusbar.url.hover.fg = cyan
c.colors.statusbar.url.success.http.fg = green
c.colors.statusbar.url.success.https.fg = green
c.colors.statusbar.url.warn.fg = purple

c.colors.tabs.bar.bg = darker_black
c.colors.tabs.even.bg = darker_black
c.colors.tabs.even.fg = white
c.colors.tabs.indicator.error = red
c.colors.tabs.indicator.start = blue
c.colors.tabs.indicator.stop = cyan
c.colors.tabs.odd.bg = black
c.colors.tabs.odd.fg = white
c.colors.tabs.selected.even.bg = one_bg2
c.colors.tabs.selected.even.fg = white
c.colors.tabs.selected.odd.bg = one_bg2
c.colors.tabs.selected.odd.fg = white

# =============
# Final Touches
# =============
message.info("Wellcome Kratos")
