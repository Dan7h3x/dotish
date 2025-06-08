import os
import subprocess

from libqtile import bar, hook, layout, qtile, widget
from libqtile.backend import base
from libqtile.config import (Click, Drag, DropDown, Group, Key, Match,
                             ScratchPad, Screen)
from libqtile.core.manager import Qtile
from libqtile.lazy import lazy
from qtile_bonsai import Bonsai, BonsaiBar
from qtile_extras import widget as exwidget
from qtile_extras.popup.templates.mpris2 import COMPACT_LAYOUT

from player import player
from power import show_power_menu

# from workspaces import (activate_context, activate_group_set,
# activate_standard_group, cycle_group_in_group_set)

mod = "mod4"
alt = "mod1"
home = os.path.expanduser("~")


# Performance hook to manage resources
@hook.subscribe.startup
def reduce_resources():
    """Optimize resource usage"""
    # Reduce memory usage by cleaning up some caches
    subprocess.run(["sync"], check=False)


@hook.subscribe.startup_once
def autostart():
    """My StartUp"""
    subprocess.Popen([os.path.expanduser("~/.config/qtile/startup.sh")])


@hook.subscribe.client_focus
def _(_):
    # Keep Static windows on top
    for window in qtile.windows_map.values():
        if isinstance(window, base.Static):
            window.bring_to_front()


def bring_front(qtile: Qtile):
    """Bring all floating windows to front"""
    for win in qtile.current_group.windows:
        if win.floating:
            win.bring_to_front()


def float_to_front(qtile: Qtile):
    """Bring the current floating window to front"""
    if qtile.current_window and qtile.current_window.floating:
        qtile.current_window.bring_to_front()


def move_floating_window(qtile: Qtile, direction: str, step=20):
    """Move floating window in direction by step pixels"""
    win = qtile.current_window
    if win and win.floating:
        x, y = win.x, win.y
        if direction == "left":
            x -= step
        elif direction == "right":
            x += step
        elif direction == "up":
            y -= step
        elif direction == "down":
            y += step

        # Ensure window stays within screen boundaries
        screen = qtile.current_screen
        x = max(0, min(x, screen.width - win.width))
        y = max(0, min(y, screen.height - win.height))

        win.set_position(x, y)


def resize_floating_window(qtile: Qtile, direction: str, step=20):
    """Resize floating window in direction by step pixels"""
    win = qtile.current_window
    if win and win.floating:
        width, height = win.width, win.height
        x, y = win.x, win.y

        if direction == "left":
            width -= step
            # Keep right edge in place
            x += step
        elif direction == "right":
            width += step
        elif direction == "up":
            height -= step
            # Keep bottom edge in place
            y += step
        elif direction == "down":
            height += step

        # Ensure minimum size
        width = max(100, width)
        height = max(100, height)

        # Ensure window stays within screen boundaries
        screen = qtile.current_screen
        if x + width > screen.width:
            width = screen.width - x
        if y + height > screen.height:
            height = screen.height - y

        win.set_position_floating(x, y)
        win.set_size_floating(width, height)


def focus_next_window(qtile: Qtile):
    """Simply focus next window in stack, including floating windows"""
    windows = qtile.current_group.windows
    if not windows:
        return

    current = qtile.current_window
    if not current:
        windows[0].focus()
        return

    idx = windows.index(current)
    next_idx = (idx + 1) % len(windows)
    windows[next_idx].focus()


# Function for quickly centering the current floating window
def center_floating_window(qtile: Qtile):
    """Center the current floating window on the screen"""
    win = qtile.current_window
    if win and win.floating:
        screen = qtile.current_screen
        x = (screen.width - win.width) // 2
        y = (screen.height - win.height) // 2
        win.set_position_floating(x, y)


colors = {
    "rosewater": "#f5e0dc",
    "flamingo": "#f2cdcd",
    "pink": "#f5c2e7",
    "mauve": "#cba6f7",
    "red": "#f38ba8",
    "maroon": "#eba0ac",
    "peach": "#fab387",
    "yellow": "#f9e2af",
    "green": "#a6e3a1",
    "teal": "#94e2d5",
    "sky": "#89dceb",
    "sapphire": "#74c7ec",
    "blue": "#89b4fa",
    "lavender": "#b4befe",
    "text": "#cdd6f4",
    "subtext1": "#bac2de",
    "subtext0": "#a6adc8",
    "overlay2": "#9399b2",
    "overlay1": "#7f849c",
    "overlay0": "#6c7086",
    "surface2": "#585b70",
    "surface1": "#45475a",
    "surface0": "#313244",
    "base": "#1e1e2e",
    "mantle": "#181825",
    "crust": "#11111b",
    "trans": "#00000000",
}

terminal = ""
menu = ""
menuKey = ""
powermenu = ""
shotcmd = ""
systray = []
wallpaper_cmd = ""


if qtile.core.name == "x11":
    terminal = "st"
    terminal_float = "st -c 'floating'"
    wallpaper_cmd = ["feh", "--bg-scale"]
    menu = "launcher"
    powermenu = "powermenu"
    menuKey = Key([alt], "F1", lazy.spawn(menu))
    systray = widget.Systray(background=colors["surface1"], icon_size=26, padding=7)
    shotcmd = "takeshot --area"
    wmname = "LG3D"
    telegram_class = "telegram-desktop"

    @hook.subscribe.client_new
    def _(window):
        if window.window.get_wm_type() == "desktop":
            window.static(qtile.current_screen.index)
            return

        hints = window.window.get_wm_normal_hints()
        if hints and 0 < hints["max_width"] < 1920:
            window.floating = True

        # X11 performance optimizations
elif qtile.core.name == "wayland":
    terminal = "foot"
    terminal_float = "foot -a 'floating'"
    wallpaper_cmd = ["swww", "img"]
    menu = "fuzzel"
    menuKey = Key([mod], "d", lazy.spawn(menu))
    powermenu = os.path.expanduser("~/.config/qtile/logout.sh")
    systray = widget.StatusNotifier(
        padding=7, background=colors["surface1"], icon_size=26
    )
    shotcmd = "grimblast copysave area"
    telegram_class = "org.telegram.desktop"
    # Performance optimization: Set up hardware acceleration if available
    os.environ.setdefault("QT_WAYLAND_DISABLE_WINDOWDECORATION", "1")
    os.environ.setdefault("GDK_BACKEND", "wayland")
    os.environ.setdefault("QT_QPA_PLATFORM", "wayland")
    os.environ.setdefault("XCURSOR_SIZE", "24")
    from libqtile.backend.wayland.inputs import InputConfig
    from libqtile.backend.wayland.xdgwindow import XdgWindow
    from libqtile.backend.wayland.xwindow import XWindow

    @hook.subscribe.client_new
    def _(win):
        # Auto-float some windows
        if isinstance(win, XdgWindow):
            max_width = win.surface.toplevel._ptr.current.max_width
            if 0 < max_width < 1920:
                win.floating = True
        elif isinstance(win, XWindow):
            if hints := win.surface.size_hints:
                max_width = hints.max_width
                if 0 < max_width < 1920:
                    win.floating = True

    @hook.subscribe.client_managed
    async def _(win):
        # Some other miscellaneous rules

        wm_class = win.get_wm_class() or []
        if win.name == "Navigator" and "libreoffice-startcenter" in wm_class:
            x = qtile.current_screen.x
            win.place(x, 240, 450, 600, win.borderwidth, win.bordercolor)
            return

        if "mpv" in wm_class:
            # Resizing mpv if it's sized itself too big to fit on screen
            sw = qtile.current_screen.width
            sh = qtile.current_screen.height
            x = y = w = h = None
            if win.height > sh:
                h = sh
                y = qtile.current_screen.y
            if win.width > sw:
                w = sw
                x = qtile.current_screen.x
            if w is not None or h is not None:
                if h is None:
                    h = win.height
                    y = win.y
                else:
                    w = win.width
                    x = win.x
                bw = win.borderwidth
                win.place(x - bw, y - bw, w + 2 * bw, h + 2 * bw, 0, None)
            return


keys = [
    # A list of available commands that can be bound to keys can be found
    # at https://docs.qtile.org/en/latest/manual/config/lazy.html
    # Switch between windows
    Key([mod], "Left", lazy.layout.left(), desc="Move focus to left"),
    Key([mod], "Right", lazy.layout.right(), desc="Move focus to right"),
    Key([mod], "Down", lazy.layout.down(), desc="Move focus down"),
    Key([mod], "Up", lazy.layout.up(), desc="Move focus up"),
    Key(
        [alt],
        "Left",
        lazy.function(move_floating_window, "left"),
        desc="Move floating window left",
    ),
    Key(
        [alt],
        "Right",
        lazy.function(move_floating_window, "right"),
        desc="Move floating window right",
    ),
    Key(
        [alt],
        "Up",
        lazy.function(move_floating_window, "up"),
        desc="Move floating window up",
    ),
    Key(
        [alt],
        "Down",
        lazy.function(move_floating_window, "down"),
        desc="Move floating window down",
    ),
    Key(
        [mod, "control"],
        "Left",
        lazy.function(resize_floating_window, "left"),
        desc="Resize floating window left",
    ),
    Key(
        [mod, "control"],
        "Right",
        lazy.function(resize_floating_window, "right"),
        desc="Resize floating window right",
    ),
    Key(
        [mod, "control"],
        "Up",
        lazy.function(resize_floating_window, "up"),
        desc="Resize floating window up",
    ),
    Key(
        [mod, "control"],
        "Down",
        lazy.function(resize_floating_window, "down"),
        desc="Resize floating window down",
    ),
    # Center floating window
    Key(
        [mod],
        "v",
        lazy.function(center_floating_window),
        desc="Center the current floating window",
    ),
    Key([mod, "control"], "n", lazy.layout.normalize(), desc="Reset all window sizes"),
    Key([mod], "Return", lazy.spawn(terminal), desc="Launch terminal"),
    Key(
        [mod, "shift"],
        "Return",
        lazy.spawn(terminal_float),
        desc="Launch terminal",
    ),
    Key([alt], "Return", lazy.layout.spawn_split(terminal, "y")),
    Key([mod], "t", lazy.layout.spawn_tab(f"{menu}")),
    Key(
        [mod],
        "r",
        lazy.layout.spawn_split(f"{menu}", "y"),
        desc="Spawn apps in split y",
    ),
    Key([mod], "w", lazy.layout.swap_tabs("next")),
    Key([alt], "w", lazy.layout.rename_tab()),
    Key([alt], "1", lazy.layout.focus_nth_tab(1, level=1)),
    Key([alt], "2", lazy.layout.focus_nth_tab(2, level=1)),
    Key([alt], "3", lazy.layout.focus_nth_tab(3, level=1)),
    Key([alt], "4", lazy.layout.focus_nth_tab(4, level=1)),
    Key([alt], "5", lazy.layout.focus_nth_tab(5, level=1)),
    Key([mod, "control"], "l", lazy.layout.resize("right", 85)),
    Key([mod, "control"], "h", lazy.layout.resize("left", 85)),
    Key([mod, "control"], "j", lazy.layout.resize("down", 85)),
    Key([mod, "control"], "k", lazy.layout.resize("up", 85)),
    Key([mod, "shift"], "left", lazy.layout.swap("left")),
    Key([mod, "shift"], "right", lazy.layout.swap("right")),
    Key([mod, "shift"], "down", lazy.layout.swap("down")),
    Key([mod, "shift"], "up", lazy.layout.swap("up")),
    menuKey,
    Key([mod], "x", lazy.spawn(powermenu), desc="Launch powermenu"),
    Key([mod], "e", lazy.spawn("pcmanfm"), desc="Launch files"),
    Key([mod], "w", lazy.spawn("qutebrowser"), desc="Launch web"),
    Key([mod], "Tab", lazy.next_layout(), desc="Toggle between layouts"),
    Key([mod], "c", lazy.window.kill(), desc="Kill focused window"),
    Key(
        [mod],
        "f",
        lazy.window.toggle_fullscreen(),
        desc="Toggle fullscreen on the focused window",
    ),
    Key(
        [mod],
        "space",
        lazy.window.toggle_floating(),
        desc="Toggle floating on the focused window",
    ),
    Key(
        [alt],
        "space",
        lazy.function(bring_front),
        desc="Bring all floating windows to front",
    ),
    Key(
        [alt],
        "Tab",
        lazy.function(focus_next_window),
        desc="Bring current floating window to front",
    ),
    Key([mod, "control"], "r", lazy.reload_config(), desc="Reload the config"),
    Key([mod, "control"], "q", lazy.shutdown(), desc="Shutdown Qtile"),
    # Audio controls
    Key(
        [],
        "XF86AudioLowerVolume",
        lazy.spawn("pactl set-sink-volume @DEFAULT_SINK@ -5%"),
    ),
    Key(
        [],
        "XF86AudioRaiseVolume",
        lazy.spawn("pactl set-sink-volume @DEFAULT_SINK@ +5%"),
    ),
    Key([], "XF86AudioMute", lazy.spawn("pactl set-sink-mute @DEFAULT_SINK@ toggle")),
    Key([], "XF86AudioPlay", lazy.spawn("playerctl play-pause")),
    Key([], "XF86AudioPrev", lazy.spawn("playerctl previous")),
    Key([], "XF86AudioNext", lazy.spawn("playerctl next")),
    Key([], "Print", lazy.spawn(shotcmd)),
    Key([alt], "q", lazy.function(show_power_menu)),
    Key([alt], "m", lazy.function(player)),
]

# Add key bindings to switch VTs in Wayland.
for vt in range(1, 8):
    keys.append(
        Key(
            ["control", "mod1"],
            f"f{vt}",
            lazy.core.change_vt(vt).when(func=lambda: qtile.core.name == "wayland"),
            desc=f"Switch to VT{vt}",
        )
    )

groups = []
group_names = ["1", "2", "3", "4", "5", "6", "7", "8"]

for i in range(len(group_names)):
    groups.append(
        Group(
            name=group_names[i],
        )
    )

# scratchpads
groups.append(
    ScratchPad(
        "9",
        [
            DropDown(
                "term",
                terminal,
                x=0.5,
                y=0.015,
                opacity=1.0,
                width=0.45,
                height=0.9,
                on_focus_lost_hide=False,
            ),
            DropDown(
                "brows",
                "qutebrowser",
                x=0.4,
                y=0.015,
                width=0.58,
                height=0.90,
                opacity=1.0,
                on_focus_lost_hide=False,
            ),
            DropDown(
                "music",
                f"{terminal} -e ncmpcpp",
                x=0.60,
                y=0.60,
                width=0.40,
                height=0.40,
                on_focus_lost_hide=False,
            ),
            # Notes management with Neovim
            DropDown(
                "notes",
                f"{terminal} -e zsh -c 'cd ~/Desktop/Notes && nvim' ",
                x=0.15,
                y=0.10,
                width=0.70,
                height=0.80,
                opacity=1.0,
                on_focus_lost_hide=False,
            ),
            # Quick file manager for productivity
            DropDown(
                "files",
                f"{terminal} -e yazi",
                x=0.58,
                y=0.10,
                width=0.40,
                height=0.70,
                opacity=1.0,
                on_focus_lost_hide=False,
            ),
            # Quick calculator
            DropDown(
                "calc",
                f"{terminal} -e kalker",
                x=0.70,
                y=0.10,
                width=0.25,
                height=0.30,
                opacity=1.0,
                on_focus_lost_hide=False,
            ),
            DropDown(
                "calc2",
                # "kitty --config ~/.config/qtile/kitty_tabless.conf -T 'calculator' -e euporie-notebook ~/Templates/testing.ipynb",
                f"{terminal} -T 'calculator' -e euporie-notebook ~/Templates/testing.ipynb",
                x=0.62,
                y=0.10,
                width=0.35,
                height=0.70,
                opacity=1.0,
                on_focus_lost_hide=False,
            ),
            # System monitor
            DropDown(
                "system",
                f"{terminal} -e btop",
                x=0.50,
                y=0.10,
                width=0.48,
                height=0.60,
                opacity=1.0,
                on_focus_lost_hide=False,
            ),
        ],
    )
)

for i in groups:
    keys.extend(
        [
            # mod + group number = switch to group
            Key(
                [mod],
                i.name,
                lazy.group[i.name].toscreen(),
                desc=f"Switch to group {i.name}",
            ),
            # mod + shift + group number = switch to & move focused window to group
            Key(
                [mod, "shift"],
                i.name,
                lazy.window.togroup(i.name, switch_group=True),
                desc=f"Switch to & move focused window to group {i.name}",
            ),
            Key(
                [mod],
                "grave",
                lazy.group["9"].dropdown_toggle("term"),
            ),
            Key(
                [mod],
                "q",
                lazy.group["9"].dropdown_toggle("brows"),
            ),
            Key([mod], "m", lazy.group["9"].dropdown_toggle("music")),
            Key(
                [alt],
                "n",
                lazy.group["9"].dropdown_toggle("notes"),
                desc="Toggle notes scratchpad",
            ),
            Key(
                [mod, alt],
                "f",
                lazy.group["9"].dropdown_toggle("fzf"),
                desc="Toggle FZF scratchpad",
            ),
            Key(
                [alt],
                "r",
                lazy.group["9"].dropdown_toggle("files"),
                desc="Toggle ranger file manager",
            ),
            Key(
                [alt],
                "c",
                lazy.group["9"].dropdown_toggle("calc2"),
                desc="Toggle calculator",
            ),
            Key(
                [mod, alt],
                "c",
                lazy.group["9"].dropdown_toggle("calc"),
                desc="Toggle calculator",
            ),
            Key(
                [mod, alt],
                "s",
                lazy.group["9"].dropdown_toggle("system"),
                desc="Toggle system monitor",
            ),
        ]
    )


layouts = [
    # Plasma(
    #     border_focus=colors["mauve"],
    #     border_width=2,
    # ),
    Bonsai(
        **{
            "window.single.margin": 1,
            "window.single.border_size": 1,
            "window.border_size": 1,
            "window.margin": 1,
            "window.border_color": colors["mantle"],
            "window.active.border_color": colors["mauve"],
            "window.default_add_mode": "split_x",
            "auto_cwd_for_terminals": False,
            "tab_bar.height": 10,
            "tab_bar.bg_color": colors["mauve"],
            "tab_bar.tab.padding": 0,
            "tab_bar.tab.bg_color": colors["flamingo"],
            "tab_bar.tab.fg_color": colors["blue"],
            "tab_bar.tab.font_family": "JetBrainsMono Nerd Font",
            "tab_bar.tab.font_size": 14,
            "tab_bar.tab.active.bg_color": colors["mantle"],
            "tab_bar.tab.active.fg_color": colors["lavender"],
        }
    ),
    # Added more performance-optimized layouts
]

widget_defaults = dict(
    font="JetBrainsMono Nerd Font",
    fontsize=14,
    padding=1,
    background=colors["base"],
    foreground=colors["text"],
)
extension_defaults = widget_defaults.copy()
space = widget.Spacer(
    background=colors["trans"],
    length=30,
)
sep = widget.Sep(
    foreground=colors["sapphire"],
    size_percent=95,
)

screens = [
    Screen(
        top=bar.Bar(
            [
                widget.Image(
                    filename="~/.config/qtile/Icons/linux.svg",
                    mouse_callbacks={"Button1": lazy.spawn(menu)},
                ),
                sep,
                BonsaiBar(
                    **{
                        "length": 180,
                        "bg_color": colors["trans"],
                        "font_family": "JetBrainsMono Nerd Font",
                        "font_size": 13,
                        "tab.width": 60,
                        "tab.active.bg_color": colors["teal"],
                        "tab.fg_color": colors["text"],
                    }
                ),
                sep,
                space,
                sep,
                widget.Image(
                    filename="~/.config/qtile/Icons/pc.svg",
                ),
                widget.GroupBox(
                    foreground=colors["mauve"],
                    fontsize=14,
                    margin_y=3,
                    margin_x=3,
                    padding_y=3,
                    padding_x=3,
                    borderwidth=3,
                    active=colors["mantle"],
                    inactive=colors["surface0"],
                    rounded=True,
                    hide_unused=True,
                    highlight_method="block",
                    highlight_color=colors["surface0"],
                    this_current_screen_border=colors["blue"],
                    this_screen_border=colors["blue"],
                    other_current_screen_border=colors["surface0"],
                    other_screen_border=colors["surface0"],
                    urgent_alert_method="block",
                    urgent_border=colors["red"],
                    disable_drag=True,
                ),
                sep,
                space,
                sep,
                widget.LaunchBar(
                    progs=[
                        ("chromium", "chromium"),
                        ("kitty", "kitty"),
                        ("neovide", "neovide"),
                    ],
                    padding=3,
                    icon_size=24,
                ),
                sep,
                space,
                widget.Prompt(
                    foreground=colors["peach"],
                    prompt="Run:",
                    padding=10,
                ),
                sep,
                space,
                sep,
                widget.Image(
                    filename="~/.config/qtile/Icons/television.svg",
                ),
                widget.WindowName(
                    foreground=colors["mauve"],
                    max_chars=40,
                ),
                sep,
                space,
                sep,
                widget.Image(
                    filename="~/.config/qtile/Icons/radio.svg",
                ),
                # widget.Mpris2(
                #     foreground=colors["mauve"],
                #     no_metadata_text="(*_*)",
                #     display_metadata=["xesam:title"],
                #     playing_text="{title}",
                #     poll_interval=2,
                #     name="None",
                #     max_chars=33,
                #     stopped_text="Off",
                #     separator=": ",
                # ),
                #
                exwidget.Mpris2(
                    popup_layout=COMPACT_LAYOUT,
                    display_metadata=["xesam:title"],
                    foreground=colors["mauve"],
                    max_chars=33,
                    mouse_callbacks={"Button3": lazy.widget["mpris2"].toggle_player()},
                ),
                sep,
                space,
                sep,
                widget.Image(
                    filename="~/.config/qtile/Icons/package.svg",
                ),
                widget.CheckUpdates(
                    distro="Arch_paru",
                    display_format="Ups:{updates}",
                    initial_text="Packages",
                    no_update_string="Up2Date",
                ),
                sep,
                space,
                sep,
                systray,
                space,
                widget.Image(
                    filename="~/.config/qtile/Icons/keyboard.svg",
                    background=colors["mantle"],
                ),
                widget.KeyboardLayout(
                    background=colors["mantle"],
                    foreground=colors["blue"],
                    configured_keyboards=["us", "ir"],
                ),
                widget.Image(
                    filename="~/.config/qtile/Icons/image.svg",
                    background=colors["mantle"],
                ),
                widget.Wallpaper(
                    background=colors["mantle"],
                    foreground=colors["mauve"],
                    directory="~/.config/Wallpaper/",
                    wallpaper_command=wallpaper_cmd,
                    label="Wall",
                ),
                sep,
                space,
                sep,
                widget.Image(
                    filename="~/.config/qtile/Icons/internet.svg",
                    background=colors["mantle"],
                ),
                widget.Net(
                    background=colors["mantle"],
                    foreground=colors["sapphire"],
                    interface="enp0s31f6",
                    format="{down:6.2f}{down_suffix:<2}↓↑",
                ),
                widget.Image(
                    filename="~/.config/qtile/Icons/ram.svg",
                ),
                widget.Memory(
                    foreground=colors["flamingo"],
                    format="{MemUsed:0.2f}G",
                    measure_mem="G",
                ),
                widget.Image(
                    filename="~/.config/qtile/Icons/temperature.svg",
                ),
                widget.ThermalZone(
                    fgcolor_high=colors["red"],
                    fgcolor_normal=colors["mauve"],
                    fgcolor_crit=colors["yellow"],
                    crit=65,
                ),
                widget.Image(
                    filename="~/.config/qtile/Icons/cpu.svg",
                ),
                widget.CPU(
                    foreground=colors["sapphire"],
                    format="{load_percent}%",
                ),
                widget.Image(
                    filename="~/.config/qtile/Icons/volume/audio-volume-high.svg",
                ),
                widget.Volume(
                    foreground=colors["mauve"],
                ),
                sep,
                space,
                sep,
                widget.Image(
                    filename="~/.config/qtile/Icons/clock.svg",
                ),
                widget.Clock(
                    foreground=colors["subtext1"],
                    format="%m-%d %a %I:%M:%S %p",
                ),
            ],
            26,
            background=colors["base"],
        ),
    ),
]

# Drag floating layouts.
mouse = [
    Drag(
        [mod],
        "Button1",
        lazy.window.set_position_floating(),
        start=lazy.window.get_position(),
    ),
    Drag(
        [mod], "Button3", lazy.window.set_size_floating(), start=lazy.window.get_size()
    ),
    Click([mod], "Button2", lazy.window.bring_to_front()),
]

dgroups_key_binder = None
dgroups_app_rules = []  # type: list
follow_mouse_focus = True
bring_front_click = True
floats_kept_above = True  # This ensures floating windows stay on top
cursor_warp = False

floating_layout = layout.Floating(
    float_rules=[
        # Run the utility of `xprop` to see the wm class and name of an X client.
        Match(wm_type="utility"),
        Match(wm_type="notification"),
        Match(wm_type="toolbar"),
        Match(wm_type="splash"),
        Match(wm_type="dialog"),
        Match(func=base.Window.has_fixed_size),
        Match(func=base.Window.has_fixed_ratio),
        Match(func=lambda c: bool(c.is_transient_for())),
        Match(wm_class="confirmreset"),  # gitk
        Match(wm_class="makebranch"),  # gitk
        Match(wm_class="maketag"),  # gitk
        Match(wm_class="ssh-askpass"),  # ssh-askpass
        Match(title="branchdialog"),  # gitk
        Match(title="pinentry"),  # GPG key password entry
        Match(title="Open File"),
        Match(wm_class="confirm"),
        Match(wm_class="dialog"),
        Match(wm_class="file_progress"),
        Match(wm_class="lxappearance"),
        Match(wm_class="matplotlib"),
        Match(wm_class="pavucontrol"),
        Match(title="Volume Control"),
        Match(wm_class="wlroots"),
        Match(wm_class=f"{telegram_class}"),
        Match(wm_class="viewnior"),
        Match(wm_class="goodvibes"),
        Match(wm_class="python3"),
        Match(wm_class="floating"),
    ],
    border_focus=colors["mauve"],
    border_normal=colors["surface0"],
    border_width=2,
    fullscreen_border_width=0,
)

auto_fullscreen = True
focus_on_window_activation = "focus"
reconfigure_screens = True
auto_minimize = True

# When using the Wayland backend, this can be used to configure input devices.
if qtile.core.name == "wayland":
    wl_input_rules = {
        "type:touchpad": InputConfig(
            tap=True,
            natural_scroll=True,
            left_handed=False,
        ),
        "type:keyboard": InputConfig(
            kb_options="grp:alt_shift_toggle",
            kb_layout="us,ir",
            kb_repeat_rate=50,
            kb_repeat_delay=250,
        ),
    }

# xcursor theme (string or None) and size (integer) for Wayland backend
wl_xcursor_theme = "Bibata-Modern-Classic"
wl_xcursor_size = 24
