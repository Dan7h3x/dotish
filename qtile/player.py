from libqtile import popup
from qtile_extras import widget
from qtile_extras.popup import PopupImage, PopupRelativeLayout, PopupWidget
from qtile_extras.popup.templates.mpris2 import COMPACT_LAYOUT


def player(qtile):
    controls = [
        PopupWidget(
            widget=widget.MPris2(popup_layout=COMPACT_LAYOUT).show_popup(),
            width=0.3,
            height=0.3,
            pos_x=0.7,
            pos_y=0.7,
        ),
    ]
    PopupRelativeLayout(
        qtile,
        width=1000,
        height=200,
        controls=controls,
        background="00000060",
        initial_focus=None,
        close_on_click=False,
    ).show(centered=True)
