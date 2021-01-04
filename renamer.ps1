$s2madir = "./s2ma"
$tempdir = "./_temp_"
$mapdir = "./maps"
$mpqesitor = "./MPQEditor.exe"
$str = "// Name:   "


New-Item -ItemType Directory -Force -Path $s2madir | Out-Null
New-Item -ItemType Directory -Force -Path $tempdir | Out-Null
New-Item -ItemType Directory -Force -Path $mapdir | Out-Null

$mpqesitor = Resolve-Path $mpqesitor
$s2madir = Resolve-Path $s2madir
$tempdir = Resolve-Path $tempdir


function getMapName($filename) {
	$id = $filename.BaseName
	$filepath = Resolve-Path "$s2madir/$filename"
	$temppath = ((Resolve-Path "$tempdir").Path + "\" + "$id")

	Start-Process $mpqesitor -ArgumentList "extract","$filepath","mapscript.galaxy","$temppath" -NoNewWindow -PassThru | Wait-Process

	if (Test-Path "$temppath/mapscript.galaxy") {
		$mapName = Get-Content "$temppath\mapscript.galaxy" | Select-String "^$str" | Foreach-Object {$_.Line.Replace("$str", "")}
		$mapName = $mapName.Replace(":", " ") # Checkpoint: Hanamura File conflict with colon
		Copy-Item $filepath -Destination "$mapdir/$mapname.stormmap" -Force

	}	

	#return $id
}

Get-ChildItem $s2madir | ForEach-Object -Process {getMapName(($_))}

# Delete Dirs

Remove-Item -Recurse $tempdir