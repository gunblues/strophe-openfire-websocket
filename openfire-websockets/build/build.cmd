call ant war >build.txt

rd "C:\Program Files\Openfire\plugins\websockets" /q /s
del "C:\Program Files\Openfire\plugins\websockets.war"
copy "C:\Work\Projects\2010.04.21-iTrader\Workspace\openfire_3_10_0\target\openfire\plugins\websockets.war" "C:\Program Files\Openfire\plugins"

del "C:\Program Files\Openfire\logs\*.*"

pause