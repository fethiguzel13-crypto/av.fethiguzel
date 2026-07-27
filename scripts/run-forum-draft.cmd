@echo off
cd /d "C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal"
"C:\Program Files\nodejs\node.exe" "C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal\scripts\forum-draft.js" --count 5 >> "C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal\logs\maintenance\startup-maintenance.log" 2>&1
