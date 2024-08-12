#
# Copyright (c) Samsung Electronics. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project root for full license information.
#

<#
.SYNOPSIS
Installs Tizen workload manifest.
.DESCRIPTION
Installs the WorkloadManifest.json and WorkloadManifest.targets files for Tizen to the dotnet sdk.
.PARAMETER Version
Use specific VERSION
.PARAMETER DotnetInstallDir
Dotnet SDK Location installed
#>

[cmdletbinding()]
param(
    [Alias('v')][string]$Version="<latest>",
    [Alias('d')][string]$DotnetInstallDir="<auto>",
    [Alias('t')][string]$DotnetTargetVersionBand="<auto>",
    [Alias('u')][switch]$UpdateAllWorkloads
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$ManifestBaseName = "Samsung.NET.Sdk.Tizen.Manifest"

$LatestVersionMap = @{
    "$ManifestBaseName-6.0.100" = "7.0.101";
    "$ManifestBaseName-6.0.200" = "7.0.100-preview.13.6";
    "$ManifestBaseName-6.0.300" = "8.0.133";
    "$ManifestBaseName-6.0.400" = "8.0.140";
    "$ManifestBaseName-7.0.100-preview.6" = "7.0.100-preview.6.14";
    "$ManifestBaseName-7.0.100-preview.7" = "7.0.100-preview.7.20";
    "$ManifestBaseName-7.0.100-rc.1" = "7.0.100-rc.1.22";
    "$ManifestBaseName-7.0.100-rc.2" = "7.0.100-rc.2.24";
    "$ManifestBaseName-7.0.100" = "7.0.103";
    "$ManifestBaseName-7.0.200" = "7.0.105";
    "$ManifestBaseName-7.0.300" = "7.0.120";
    "$ManifestBaseName-7.0.400" = "8.0.141";
    "$ManifestBaseName-8.0.100-alpha.1" = "7.0.104";
    "$ManifestBaseName-8.0.100-preview.2" = "7.0.106";
    "$ManifestBaseName-8.0.100-preview.3" = "7.0.107";
    "$ManifestBaseName-8.0.100-preview.4" = "7.0.108";
    "$ManifestBaseName-8.0.100-preview.5" = "7.0.110";
    "$ManifestBaseName-8.0.100-preview.6" = "7.0.121";
    "$ManifestBaseName-8.0.100-preview.7" = "7.0.122";
    "$ManifestBaseName-8.0.100-rc.1" = "7.0.124";
    "$ManifestBaseName-8.0.100-rc.2" = "7.0.125";
    "$ManifestBaseName-8.0.100-rtm" = "7.0.127";
    "$ManifestBaseName-8.0.100" = "8.0.144";
    "$ManifestBaseName-8.0.200" = "8.0.145";
    "$ManifestBaseName-8.0.300" = "8.0.149";
    "$ManifestBaseName-9.0.100-alpha.1" = "8.0.134";
    "$ManifestBaseName-9.0.100-preview.1" = "8.0.135";
    "$ManifestBaseName-9.0.100-preview.2" = "8.0.137";
}

function New-TemporaryDirectory {
    $parent = [System.IO.Path]::GetTempPath()
    $name = [System.IO.Path]::GetRandomFileName()
    New-Item -ItemType Directory -Path (Join-Path $parent $name)
}

function Ensure-Directory([string]$TestDir) {
    Try {
        New-Item -ItemType Directory -Path $TestDir -Force -ErrorAction stop | Out-Null
        [io.file]::OpenWrite($(Join-Path -Path $TestDir -ChildPath ".test-write-access")).Close()
        Remove-Item -Path $(Join-Path -Path $TestDir -ChildPath ".test-write-access") -Force
    }
    Catch [System.UnauthorizedAccessException] {
        Write-Error "No permission to install. Try run with administrator mode."
    }
}

function Get-LatestVersion([string]$Id) {
    $attempts=3
    $sleepInSeconds=3
    do
    {
        try
        {
            $Response = Invoke-WebRequest -Uri https://api.nuget.org/v3-flatcontainer/$Id/index.json -UseBasicParsing | ConvertFrom-Json
            return $Response.versions | Select-Object -Last 1
        }
        catch {
            Write-Host "Id: $Id"
            Write-Host "An exception was caught: $($_.Exception.Message)"
        }

        $attempts--
        if ($attempts -gt 0) { Start-Sleep $sleepInSeconds }
    } while ($attempts -gt 0)

    if ($LatestVersionMap.ContainsKey($Id))
    {
        Write-Host "Return cached latest version."
        return $LatestVersionMap.$Id
    } else {
        Write-Error "Wrong Id: $Id"
    }
}

function Get-Package([string]$Id, [string]$Version, [string]$Destination, [string]$FileExt = "nupkg") {
    $OutFileName = "$Id.$Version.$FileExt"
    $OutFilePath = Join-Path -Path $Destination -ChildPath $OutFileName

    if ($Id -match ".net[0-9]+$") {
        $Id = $Id -replace (".net[0-9]+", "")
    }

    Invoke-WebRequest -Uri "https://www.nuget.org/api/v2/package/$Id/$Version" -OutFile $OutFilePath

    return $OutFilePath
}

function Install-Pack([string]$Id, [string]$Version, [string]$Kind) {
    $TempZipFile = $(Get-Package -Id $Id -Version $Version -Destination $TempDir -FileExt "zip")
    $TempUnzipDir = Join-Path -Path $TempDir -ChildPath "unzipped\$Id"

    switch ($Kind) {
        "manifest" {
            Expand-Archive -Path $TempZipFile -DestinationPath $TempUnzipDir
            New-Item -Path $TizenManifestDir -ItemType "directory" -Force | Out-Null
            Copy-Item -Path "$TempUnzipDir\data\*" -Destination $TizenManifestDir -Force
        }
        {($_ -eq "sdk") -or ($_ -eq "framework")} {
            Expand-Archive -Path $TempZipFile -DestinationPath $TempUnzipDir
            if ( ($kind -eq "sdk") -and ($Id -match ".net[0-9]+$")) {
                $Id = $Id -replace (".net[0-9]+", "")
            }
            $TargetDirectory = $(Join-Path -Path $DotnetInstallDir -ChildPath "packs\$Id\$Version")
            New-Item -Path $TargetDirectory -ItemType "directory" -Force | Out-Null
            Copy-Item -Path "$TempUnzipDir/*" -Destination $TargetDirectory -Recurse -Force
        }
        "template" {
            $TargetFileName = "$Id.$Version.nupkg".ToLower()
            $TargetDirectory = $(Join-Path -Path $DotnetInstallDir -ChildPath "template-packs")
            New-Item -Path $TargetDirectory -ItemType "directory