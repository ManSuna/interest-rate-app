Get-ChildItem "*Copy*" | ForEach-Object {
$num = $_.Name -replace '.*\((\d+)\).*','$1'
Rename-Item $_ -NewName ("pacs008-tlog_" + $num + ".json")
}
