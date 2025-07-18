import os

c = c  # pyright:ignore[reportUndefinedVariable]
config = config  # pyright:ignore[reportUndefinedVariable]
config.load_autoconfig(False)
rosewater = "#f5e0dc"
flamingo = "#f2cdcd"
pink = "#f5c2e7"
mauve = "#cba6f7"
red = "#f38ba8"
maroon = "#eba0ac"
peach = "#fab387"
yellow = "#f9e2af"
green = "#a6e3a1"
teal = "#94e2d5"
sky = "#89dceb"
sapphire = "#74c7ec"
blue = "#89b4fa"
lavender = "#b4befe"
text = "#cdd6f4"
subtext1 = "#bac2de"
subtext0 = "#a6adc8"
overlay2 = "#9399b2"
overlay1 = "#7f849c"
overlay0 = "#6c7086"
surface2 = "#585b70"
surface1 = "#45475a"
surface0 = "#313244"
base = "#1e1e2e"
mantle = "#181825"
crust = "#11111b"
c.auto_save.interval = 15000
c.auto_save.session = True
c.backend = "webengine"
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
css = os.path.expanduser("~/.config/qutebrowser/solarized.css")
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
c.colors.completion.category.bg = (
	f"qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0 {base}, stop:1 {surface0})"
)
c.colors.completion.category.border.bottom = base
c.colors.completion.category.border.top = sky
c.colors.completion.category.fg = mauve
c.colors.completion.even.bg = base
c.colors.completion.fg = [text, sky, mauve]
c.colors.completion.item.selected.bg = text
c.colors.completion.item.selected.border.bottom = blue
c.colors.completion.item.selected.border.top = blue
c.colors.completion.item.selected.fg = crust
c.colors.completion.item.selected.match.fg = surface1
c.colors.completion.match.fg = peach
c.colors.completion.odd.bg = base
c.colors.completion.scrollbar.bg = base
c.colors.completion.scrollbar.fg = mauve
c.colors.contextmenu.disabled.bg = base
c.colors.contextmenu.disabled.fg = text
c.colors.contextmenu.menu.bg = base
c.colors.contextmenu.menu.fg = mauve
c.colors.contextmenu.selected.bg = surface0
c.colors.contextmenu.selected.fg = blue
c.colors.downloads.bar.bg = base
c.colors.downloads.error.bg = base
c.colors.downloads.error.fg = red
c.colors.downloads.start.bg = base
c.colors.downloads.start.fg = blue
c.colors.downloads.stop.bg = base
c.colors.downloads.stop.fg = green
c.colors.hints.bg = base
c.colors.hints.fg = mauve
c.colors.hints.match.fg = green
c.colors.keyhint.bg = surface0
c.colors.keyhint.fg = mauve
c.colors.keyhint.suffix.fg = green
c.colors.messages.error.bg = red
c.colors.messages.error.border = yellow
c.colors.messages.error.fg = base
c.colors.messages.info.bg = green
c.colors.messages.info.border = yellow
c.colors.messages.info.fg = base
c.colors.messages.warning.bg = peach
c.colors.messages.warning.border = yellow
c.colors.messages.warning.fg = base
c.colors.prompts.bg = mantle
c.colors.prompts.border = surface0
c.colors.prompts.fg = blue
c.colors.prompts.selected.bg = surface0
c.colors.prompts.selected.fg = sapphire
c.colors.statusbar.caret.bg = surface0
c.colors.statusbar.caret.fg = sapphire
c.colors.statusbar.caret.selection.bg = mauve
c.colors.statusbar.caret.selection.fg = text
c.colors.statusbar.command.bg = mantle
c.colors.statusbar.command.fg = mauve
c.colors.statusbar.normal.bg = mantle
c.colors.statusbar.normal.fg = blue
c.colors.statusbar.progress.bg = green
c.colors.statusbar.url.fg = rosewater
c.colors.statusbar.url.hover.fg = sapphire
c.colors.statusbar.url.success.http.fg = sky
c.colors.statusbar.url.success.https.fg = mauve
c.colors.statusbar.url.warn.fg = yellow
c.colors.tabs.bar.bg = mauve
c.colors.tabs.odd.bg = subtext0
c.colors.tabs.even.bg = subtext0
c.colors.tabs.odd.fg = base
c.colors.tabs.even.fg = base
c.colors.tabs.selected.even.bg = mantle
c.colors.tabs.selected.even.fg = mauve
c.colors.tabs.selected.odd.bg = c.colors.tabs.selected.even.bg
c.colors.tabs.selected.odd.fg = c.colors.tabs.selected.even.fg
c.colors.tooltip.bg = surface0
c.colors.tooltip.fg = sapphire
c.colors.webpage.bg = mantle
c.colors.webpage.darkmode.enabled = False
c.colors.webpage.darkmode.policy.images = "never"
c.colors.webpage.preferred_color_scheme = "light"
c.completion.open_categories = [
	"searchengines",
	"quickmarks",
	"bookmarks",
	"history",
	"filesystem",
]
c.content.javascript.clipboard = "access-paste"
c.content.notifications.presenter = "auto"
c.content.pdfjs = True
c.downloads.position = "bottom"
c.downloads.remove_finished = 10000
c.editor.command = [
	os.environ["TERMINAL"],
	"-e",
	"nvim",
	"-f",
	"{file}",
	"-c",
	"normal {line}G{column0}l",
]
c.fileselect.folder.command = ["st", "-e", "ranger", "--choosedir={}"]
c.fileselect.multiple_files.command = ["st", "-e", "ranger", "--choosefiles={}"]
c.fileselect.single_file.command = ["st", "-e", "ranger", "--choosefile={}"]
c.fonts.default_family = ["JetBrainsMono Nerd Font"]
c.fonts.default_size = "11pt"
c.fonts.web.family.fantasy = "JetBrainsMono Nerd Font"
c.hints.selectors = {
	"all": [
		"a",
		"area",
		"textarea",
		"select",
		'input:not([type="hidden"])',
		"button",
		"frame",
		"iframe",
		"img",
		"link",
		"summary",
		'[contenteditable]:not([contenteditable="false"])',
		"[onclick]",
		"[onmousedown]",
		'[role="link"]',
		'[role="option"]',
		'[role="button"]',
		'[role="tab"]',
		'[role="checkbox"]',
		'[role="switch"]',
		'[role="menuitem"]',
		'[role="menuitemcheckbox"]',
		'[role="menuitemradio"]',
		'[role="treeitem"]',
		"[aria-haspopup]",
		"[ng-click]",
		"[ngClick]",
		"[data-ng-click]",
		"[x-ng-click]",
		'[tabindex]:not([tabindex="-1"])',
	],
	"links": ["a[href]", "area[href]", "link[href]", '[role="link"][href]'],
	"images": ["img"],
	"media": ["audio", "img", "video"],
	"url": ["[src]", "[href]"],
	"inputs": [
		'input[type="text"]',
		'input[type="date"]',
		'input[type="datetime-local"]',
		'input[type="email"]',
		'input[type="month"]',
		'input[type="number"]',
		'input[type="password"]',
		'input[type="search"]',
		'input[type="tel"]',
		'input[type="time"]',
		'input[type="url"]',
		'input[type="week"]',
		"input:not([type])",
		'[contenteditable]:not([contenteditable="false"])',
		"textarea",
	],
}
c.keyhint.delay = 300
c.keyhint.radius = 12
c.prompt.radius = 15
c.scrolling.smooth = True
c.spellcheck.languages = ["en-US"]
c.statusbar.widgets = [
	"keypress",
	"search_match",
	"url",
	"scroll",
	"history",
	"tabs",
	"progress",
	"clock",
]
c.tabs.indicator.width = 18
c.tabs.position = "top"
c.tabs.show = "multiple"
c.tabs.title.alignment = "center"
c.tabs.title.elide = "middle"
c.window.hide_decoration = True
c.window.title_format = "{perc}{current_title}"
c.window.transparent = True
config.bind(",m", f'config-cycle content.user_stylesheets {css} ""')
config.bind("'", "mode-enter jump_mark")
config.bind("+", "zoom-in")
config.bind("-", "zoom-out")
config.bind(".", "cmd-repeat-last")
config.bind("/", "cmd-set-text /")
config.bind(":", "cmd-set-text :")
config.bind(";I", "hint images tab")
config.bind(";O", "hint links fill :open -t -r {hint-url}")
config.bind(";R", "hint --rapid links window")
config.bind(";Y", "hint links yank-primary")
config.bind(";b", "hint all tab-bg")
config.bind(";d", "hint links download")
config.bind(";f", "hint all tab-fg")
config.bind(";h", "hint all hover")
config.bind(";i", "hint images")
config.bind(";o", "hint links fill :open {hint-url}")
config.bind(";r", "hint --rapid links tab-bg")
config.bind(";t", "hint inputs")
config.bind(";y", "hint links yank")
config.bind("<Ctrl-1>", "tab-focus 1")
config.bind("<Ctrl-2>", "tab-focus 2")
config.bind("<Ctrl-3>", "tab-focus 3")
config.bind("<Ctrl-4>", "tab-focus 4")
config.bind("<Ctrl-5>", "tab-focus 5")
config.bind("<Ctrl-6>", "tab-focus 6")
config.bind("<Ctrl-7>", "tab-focus 7")
config.bind("<Ctrl-8>", "tab-focus 8")
config.bind("<Ctrl-9>", "tab-focus -1")
config.bind("<Ctrl-m>", "tab-mute")
config.bind("<Ctrl-A>", "navigate increment")
config.bind("<Ctrl-Alt-p>", "print")
config.bind("<Ctrl-B>", "scroll-page 0 -1")
config.bind("<Ctrl-D>", "scroll-page 0 0.5")
config.bind("<Ctrl-F5>", "reload -f")
config.bind("<Ctrl-F>", "scroll-page 0 1")
config.bind("<Ctrl-N>", "open -w")
config.bind("<Ctrl-PgDown>", "tab-next")
config.bind("<Ctrl-PgUp>", "tab-prev")
config.bind("<Ctrl-Q>", "quit")
config.bind("<Ctrl-Return>", "selection-follow -t")
config.bind("<Ctrl-Shift-N>", "open -p")
config.bind("<Ctrl-Shift-T>", "undo")
config.bind("<Ctrl-Shift-Tab>", "nop")
config.bind("<Ctrl-Shift-W>", "close")
config.bind("<Ctrl-T>", "open -t")
config.bind("<Ctrl-Tab>", "tab-focus last")
config.bind("<Ctrl-U>", "scroll-page 0 -0.5")
config.bind("<Ctrl-V>", "mode-enter passthrough")
config.bind("<Ctrl-W>", "tab-close")
config.bind("<Ctrl-X>", "navigate decrement")
config.bind("<Ctrl-^>", "tab-focus last")
config.bind("<Ctrl-h>", "home")
config.bind("<Ctrl-p>", "tab-pin")
config.bind("<Ctrl-s>", "stop")
config.bind("<Escape>", "clear-keychain ;; search ;; fullscreen --leave")
config.bind("<F11>", "fullscreen")
config.bind("<F5>", "reload")
config.bind("<Return>", "selection-follow")
config.bind("<back>", "back")
config.bind("<forward>", "forward")
config.bind("=", "zoom")
config.bind("?", "cmd-set-text ?")
config.bind("@", "macro-run")
config.bind("B", "cmd-set-text -s :quickmark-load -t")
config.bind("D", "tab-close -o")
config.bind("F", "hint all tab")
config.bind("G", "scroll-to-perc")
config.bind("H", "back")
config.bind("J", "tab-next")
config.bind("K", "tab-prev")
config.bind("L", "forward")
config.bind("M", "bookmark-add")
config.bind("N", "search-prev")
config.bind("O", "cmd-set-text -s :open -t")
config.bind("PP", "open -t -- {primary}")
config.bind("Pp", "open -t -- {clipboard}")
config.bind("R", "reload -f")
config.bind("Sb", "bookmark-list --jump")
config.bind("Sh", "history")
config.bind("Sq", "bookmark-list")
config.bind("Ss", "set")
config.bind("T", "cmd-set-text -sr :tab-focus")
config.bind("U", "undo -w")
config.bind("V", "mode-enter caret ;; selection-toggle --line")
config.bind("ZQ", "quit")
config.bind("ZZ", "quit --save")
config.bind("[[", "navigate prev")
config.bind("]]", "navigate next")
config.bind("`", "mode-enter set_mark")
config.bind("ad", "download-cancel")
config.bind("b", "cmd-set-text -s :quickmark-load")
config.bind("cd", "download-clear")
config.bind("co", "tab-only")
config.bind("d", "tab-close")
config.bind("f", "hint")
config.bind("g$", "tab-focus -1")
config.bind("g0", "tab-focus 1")
config.bind("gB", "cmd-set-text -s :bookmark-load -t")
config.bind("gC", "tab-clone")
config.bind("gD", "tab-give")
config.bind("gJ", "tab-move +")
config.bind("gK", "tab-move -")
config.bind("gO", "cmd-set-text :open -t -r {url:pretty}")
config.bind("gU", "navigate up -t")
config.bind("g^", "tab-focus 1")
config.bind("ga", "open -t")
config.bind("gb", "cmd-set-text -s :bookmark-load")
config.bind("gd", "download")
config.bind("gf", "view-source")
config.bind("gg", "scroll-to-perc 0")
config.bind("gi", "hint inputs --first")
config.bind("gm", "tab-move")
config.bind("go", "cmd-set-text :open {url:pretty}")
config.bind("gt", "cmd-set-text -s :tab-select")
config.bind("gu", "navigate up")
config.bind("h", "scroll left")
config.bind("i", "mode-enter insert")
config.bind("j", "scroll down")
config.bind("k", "scroll up")
config.bind("l", "scroll right")
config.bind("m", "quickmark-save")
config.bind("n", "search-next")
config.bind("o", "cmd-set-text -s :open")
config.bind("pP", "open -- {primary}")
config.bind("pp", "open -- {clipboard}")
config.bind("q", "macro-record")
config.bind("r", "reload")
config.bind("sf", "save")
config.bind("sk", "cmd-set-text -s :bind")
config.bind("sl", "cmd-set-text -s :set -t")
config.bind("ss", "cmd-set-text -s :set")
config.bind(
	"tCH",
	"config-cycle -p -u *://*.{url:host}/* content.cookies.accept all no-3rdparty never ;; reload",
)
config.bind(
	"tCh",
	"config-cycle -p -u *://{url:host}/* content.cookies.accept all no-3rdparty never ;; reload",
)
config.bind(
	"tCu",
	"config-cycle -p -u {url} content.cookies.accept all no-3rdparty never ;; reload",
)
config.bind("tIH", "config-cycle -p -u *://*.{url:host}/* content.images ;; reload")
config.bind("tIh", "config-cycle -p -u *://{url:host}/* content.images ;; reload")
config.bind("tIu", "config-cycle -p -u {url} content.images ;; reload")
config.bind("tPH", "config-cycle -p -u *://*.{url:host}/* content.plugins ;; reload")
config.bind("tPh", "config-cycle -p -u *://{url:host}/* content.plugins ;; reload")
config.bind("tPu", "config-cycle -p -u {url} content.plugins ;; reload")
config.bind(
	"tSH", "config-cycle -p -u *://*.{url:host}/* content.javascript.enabled ;; reload"
)
config.bind(
	"tSh", "config-cycle -p -u *://{url:host}/* content.javascript.enabled ;; reload"
)
config.bind("tSu", "config-cycle -p -u {url} content.javascript.enabled ;; reload")
config.bind(
	"tcH",
	"config-cycle -p -t -u *://*.{url:host}/* content.cookies.accept all no-3rdparty never ;; reload",
)
config.bind(
	"tch",
	"config-cycle -p -t -u *://{url:host}/* content.cookies.accept all no-3rdparty never ;; reload",
)
config.bind(
	"tcu",
	"config-cycle -p -t -u {url} content.cookies.accept all no-3rdparty never ;; reload",
)
config.bind("th", "back -t")
config.bind("tiH", "config-cycle -p -t -u *://*.{url:host}/* content.images ;; reload")
config.bind("tih", "config-cycle -p -t -u *://{url:host}/* content.images ;; reload")
config.bind("tiu", "config-cycle -p -t -u {url} content.images ;; reload")
config.bind("tl", "forward -t")
config.bind("tpH", "config-cycle -p -t -u *://*.{url:host}/* content.plugins ;; reload")
config.bind("tph", "config-cycle -p -t -u *://{url:host}/* content.plugins ;; reload")
config.bind("tpu", "config-cycle -p -t -u {url} content.plugins ;; reload")
config.bind(
	"tsH",
	"config-cycle -p -t -u *://*.{url:host}/* content.javascript.enabled ;; reload",
)
config.bind(
	"tsh", "config-cycle -p -t -u *://{url:host}/* content.javascript.enabled ;; reload"
)
config.bind("tsu", "config-cycle -p -t -u {url} content.javascript.enabled ;; reload")
config.bind("u", "undo")
config.bind("v", "mode-enter caret")
config.bind("wB", "cmd-set-text -s :bookmark-load -w")
config.bind("wIf", "devtools-focus")
config.bind("wIh", "devtools left")
config.bind("wIj", "devtools bottom")
config.bind("wIk", "devtools top")
config.bind("wIl", "devtools right")
config.bind("wIw", "devtools window")
config.bind("wO", "cmd-set-text :open -w {url:pretty}")
config.bind("wP", "open -w -- {primary}")
config.bind("wb", "cmd-set-text -s :quickmark-load -w")
config.bind("wf", "hint all window")
config.bind("wh", "back -w")
config.bind("wi", "devtools")
config.bind("wl", "forward -w")
config.bind("wo", "cmd-set-text -s :open -w")
config.bind("wp", "open -w -- {clipboard}")
config.bind("xO", "cmd-set-text :open -b -r {url:pretty}")
config.bind("xo", "cmd-set-text -s :open -b")
config.bind("yD", "yank domain -s")
config.bind("yM", "yank inline [{title}]({url:yank}) -s")
config.bind("yP", "yank pretty-url -s")
config.bind("yT", "yank title -s")
config.bind("yY", "yank -s")
config.bind("yd", "yank domain")
config.bind("ym", "yank inline [{title}]({url:yank})")
config.bind("yp", "yank pretty-url")
config.bind("yt", "yank title")
config.bind("yy", "yank")
config.bind("{{", "navigate prev -t")
config.bind("}}", "navigate next -t")
config.bind("$", "move-to-end-of-line", mode="caret")
config.bind("0", "move-to-start-of-line", mode="caret")
config.bind("<Ctrl-Space>", "selection-drop", mode="caret")
config.bind("<Escape>", "mode-leave", mode="caret")
config.bind("<Return>", "yank selection", mode="caret")
config.bind("<Space>", "selection-toggle", mode="caret")
config.bind("G", "move-to-end-of-document", mode="caret")
config.bind("H", "scroll left", mode="caret")
config.bind("J", "scroll down", mode="caret")
config.bind("K", "scroll up", mode="caret")
config.bind("L", "scroll right", mode="caret")
config.bind("V", "selection-toggle --line", mode="caret")
config.bind("Y", "yank selection -s", mode="caret")
config.bind("[", "move-to-start-of-prev-block", mode="caret")
config.bind("]", "move-to-start-of-next-block", mode="caret")
config.bind("b", "move-to-prev-word", mode="caret")
config.bind("c", "mode-enter normal", mode="caret")
config.bind("e", "move-to-end-of-word", mode="caret")
config.bind("gg", "move-to-start-of-document", mode="caret")
config.bind("h", "move-to-prev-char", mode="caret")
config.bind("j", "move-to-next-line", mode="caret")
config.bind("k", "move-to-prev-line", mode="caret")
config.bind("l", "move-to-next-char", mode="caret")
config.bind("o", "selection-reverse", mode="caret")
config.bind("v", "selection-toggle", mode="caret")
config.bind("w", "move-to-next-word", mode="caret")
config.bind("y", "yank selection", mode="caret")
config.bind("{", "move-to-end-of-prev-block", mode="caret")
config.bind("}", "move-to-end-of-next-block", mode="caret")
config.bind("<Alt-B>", "rl-backward-word", mode="command")
config.bind("<Alt-Backspace>", "rl-backward-kill-word", mode="command")
config.bind("<Alt-D>", "rl-kill-word", mode="command")
config.bind("<Alt-F>", "rl-forward-word", mode="command")
config.bind("<Ctrl-?>", "rl-delete-char", mode="command")
config.bind("<Ctrl-A>", "rl-beginning-of-line", mode="command")
config.bind("<Ctrl-B>", "rl-backward-char", mode="command")
config.bind("<Ctrl-C>", "completion-item-yank", mode="command")
config.bind("<Ctrl-D>", "completion-item-del", mode="command")
config.bind("<Ctrl-E>", "rl-end-of-line", mode="command")
config.bind("<Ctrl-F>", "rl-forward-char", mode="command")
config.bind("<Ctrl-H>", "rl-backward-delete-char", mode="command")
config.bind("<Ctrl-K>", "rl-kill-line", mode="command")
config.bind("<Ctrl-N>", "command-history-next", mode="command")
config.bind("<Ctrl-P>", "command-history-prev", mode="command")
config.bind("<Ctrl-Return>", "command-accept --rapid", mode="command")
config.bind("<Ctrl-Shift-C>", "completion-item-yank --sel", mode="command")
config.bind("<Ctrl-Shift-Tab>", "completion-item-focus prev-category", mode="command")
config.bind("<Ctrl-Shift-W>", "rl-filename-rubout", mode="command")
config.bind("<Ctrl-Tab>", "completion-item-focus next-category", mode="command")
config.bind("<Ctrl-U>", "rl-unix-line-discard", mode="command")
config.bind("<Ctrl-W>", 'rl-rubout " "', mode="command")
config.bind("<Ctrl-Y>", "rl-yank", mode="command")
config.bind("<Down>", "completion-item-focus --history next", mode="command")
config.bind("<Escape>", "mode-leave", mode="command")
config.bind("<PgDown>", "completion-item-focus next-page", mode="command")
config.bind("<PgUp>", "completion-item-focus prev-page", mode="command")
config.bind("<Return>", "command-accept", mode="command")
config.bind("<Shift-Delete>", "completion-item-del", mode="command")
config.bind("<Shift-Tab>", "completion-item-focus prev", mode="command")
config.bind("<Tab>", "completion-item-focus next", mode="command")
config.bind("<Up>", "completion-item-focus --history prev", mode="command")
config.bind("<Ctrl-B>", "hint all tab-bg", mode="hint")
config.bind("<Ctrl-F>", "hint links", mode="hint")
config.bind("<Ctrl-R>", "hint --rapid links tab-bg", mode="hint")
config.bind("<Escape>", "mode-leave", mode="hint")
config.bind("<Return>", "hint-follow", mode="hint")
config.bind("<Ctrl-E>", "edit-text", mode="insert")
config.bind("<Escape>", "mode-leave", mode="insert")
config.bind("<Shift-Escape>", "fake-key <Escape>", mode="insert")
config.bind("<Shift-Ins>", "insert-text -- {primary}", mode="insert")
config.bind("<Shift-Escape>", "mode-leave", mode="passthrough")
config.bind("<Alt-B>", "rl-backward-word", mode="prompt")
config.bind("<Alt-Backspace>", "rl-backward-kill-word", mode="prompt")
config.bind("<Alt-D>", "rl-kill-word", mode="prompt")
config.bind("<Alt-E>", "prompt-fileselect-external", mode="prompt")
config.bind("<Alt-F>", "rl-forward-word", mode="prompt")
config.bind("<Alt-Shift-Y>", "prompt-yank --sel", mode="prompt")
config.bind("<Alt-Y>", "prompt-yank", mode="prompt")
config.bind("<Ctrl-?>", "rl-delete-char", mode="prompt")
config.bind("<Ctrl-A>", "rl-beginning-of-line", mode="prompt")
config.bind("<Ctrl-B>", "rl-backward-char", mode="prompt")
config.bind("<Ctrl-E>", "rl-end-of-line", mode="prompt")
config.bind("<Ctrl-F>", "rl-forward-char", mode="prompt")
config.bind("<Ctrl-H>", "rl-backward-delete-char", mode="prompt")
config.bind("<Ctrl-K>", "rl-kill-line", mode="prompt")
config.bind("<Ctrl-P>", "prompt-open-download --pdfjs", mode="prompt")
config.bind("<Ctrl-Shift-W>", "rl-filename-rubout", mode="prompt")
config.bind("<Ctrl-U>", "rl-unix-line-discard", mode="prompt")
config.bind("<Ctrl-W>", 'rl-rubout " "', mode="prompt")
config.bind("<Ctrl-X>", "prompt-open-download", mode="prompt")
config.bind("<Ctrl-Y>", "rl-yank", mode="prompt")
config.bind("<Down>", "prompt-item-focus next", mode="prompt")
config.bind("<Escape>", "mode-leave", mode="prompt")
config.bind("<Return>", "prompt-accept", mode="prompt")
config.bind("<Shift-Tab>", "prompt-item-focus prev", mode="prompt")
config.bind("<Tab>", "prompt-item-focus next", mode="prompt")
config.bind("<Up>", "prompt-item-focus prev", mode="prompt")
config.bind("<Escape>", "mode-leave", mode="register")
config.bind("<Alt-Shift-Y>", "prompt-yank --sel", mode="yesno")
config.bind("<Alt-Y>", "prompt-yank", mode="yesno")
config.bind("<Escape>", "mode-leave", mode="yesno")
config.bind("<Return>", "prompt-accept", mode="yesno")
config.bind("N", "prompt-accept --save no", mode="yesno")
config.bind("Y", "prompt-accept --save yes", mode="yesno")
config.bind("n", "prompt-accept no", mode="yesno")
config.bind("y", "prompt-accept yes", mode="yesno")
