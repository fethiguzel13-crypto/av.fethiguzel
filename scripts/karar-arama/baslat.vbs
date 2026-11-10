' Karar Arama - masaustu kisayolunun calistirdigi baslatici.
' Yerel sunucuyu pencere acmadan baslatir ve tarayicida arama sayfasini acar.
' Sunucu zaten aciksa yalnizca tarayiciyi acar (sunucu.mjs --ac bunu kendisi denetler).
Option Explicit
Dim fso, sh, dizin, node
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
dizin = fso.GetParentFolderName(WScript.ScriptFullName)
node = sh.ExpandEnvironmentStrings("%ProgramFiles%") & "\nodejs\node.exe"
If Not fso.FileExists(node) Then node = "node"
sh.CurrentDirectory = dizin
sh.Run """" & node & """ """ & dizin & "\sunucu.mjs"" --ac", 0, False
