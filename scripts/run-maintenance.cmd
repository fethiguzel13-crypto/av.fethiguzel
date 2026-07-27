@echo off
cd /d "C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal"
set LINK_CHECK_BASE=https://avfethiguzel.com
"C:\Program Files\nodejs\node.exe" "C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal\scripts\startup-maintenance.js" >> "C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal\logs\maintenance\startup-maintenance.log" 2>&1
