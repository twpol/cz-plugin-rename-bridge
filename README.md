# ChatZilla Plugin: Rename Bridge

This plugin for [ChatZilla](http://chatzilla.hacksrus.com/) transforms IRC-bridge users into their own unique users.

## Renaming pattern

To rename the user of a message, the message text must match the regular expression `^<(.*?)> ([^ ].*)$`. Group 1 is the user name and group 2 is their message. If matched, the message will appear entirely to be from the user name matched by this expression and not the bridge user.

## Preferences

* `bridges` _string, space-separated list of IRC URLs_ (default `""`)

  Specifies the list of bridge users, e.g. `"ircs://irc.example.com/db,isnick ircs://irc.example.com/slack_bot,isnick"` specifies two users (`db` and `slack_bot`) on the same server (`ircs://irc.example.com/`). The bridge users do not need to all be on one server.
