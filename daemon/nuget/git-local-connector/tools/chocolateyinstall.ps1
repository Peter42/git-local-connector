$ErrorActionPreference = 'Stop'; # stop on all errors
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
## - https://chocolatey.org/docs/helpers-get-chocolatey-unzip
Get-ChocolateyUnzip "$(Split-Path -Parent $MyInvocation.MyCommand.Definition)\\..\\gitlab-local-connector.tar" $toolsDir