Get-CimInstance Win32_Process | Where-Object {
    $_.CommandLine -and ($_.CommandLine -match 'rewrite-serh|serh-watchdog')
} | ForEach-Object {
    'PID={0} PPID={1} {2}' -f $_.ProcessId, $_.ParentProcessId, $_.CommandLine
}
