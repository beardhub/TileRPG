@echo off
setlocal EnableDelayedExpansion
set /a totalNumLines = 0
for %%F in (.\Frameworks\*.js *.js) do (
	set /a currentNumLines = 0
	for /f %%N in ('find /v /c "" ^<"%%F"') do (
		set /a currentNumLines+=%%N
		set /a totalNumLines+=%%N
	)
	echo %%~nxF !currentNumLines!
)

echo Total = %totalNumLines%
@pause