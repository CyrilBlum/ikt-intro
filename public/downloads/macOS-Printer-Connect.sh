#!/bin/zsh
read "ipp_queue?Name der Druckerwarteschlange (URL): "
# Check if the user entered a value
if [[ -z "$ipp_queue" ]]; then
    echo "Gebe einen korrekten Namen ein"
    exit 1
fi
scriptdir=$(dirname "$0")
driverpackage="HewlettPackardPrinterDrivers.pkg"
driver="HP Color MFP E877-40-50-60-70.gz"
driverpath="Library/Printers/PPDs/Contents/Resources"
read "printer_name?Name der Druckerwarteschlange (z.B. KTZH) [KTZH]: "
printer_name="${printer_name:-KTZH}"
printer_displayname="${printer_name} persönlich"
if ! [[ -f "/${driverpath}/${driver}" ]]; then
	sudo installer -pkg "${scriptdir}/${driverpackage}" -target /
else
	read -k 1 "refresh?Treiber ist bereits installiert. Refresh? [y/N]: "
	echo
	if [[ $refresh =~ ^[Yy]$ ]]; then
		sudo installer -pkg "${scriptdir}/${driverpackage}" -target /
	fi
fi
sudo lpadmin -p "$printer_name" -D "$printer_displayname" -E -m "${driverpath}/${driver}" -o media=iso_a4_210x297mm -o printer-is-shared=false -o PageSize=A4 -o HPOption_Tray4=HP520SheetInputTray -o HPOption_Tray5=HP520SheetInputTray -o HPOption_OutputBin=HP3BinMailbox -o HPOption_HPStaplerOptions=HP2StapleUnit -o HPOption_HPPunchingOptions=HP24HolesUnit -o HPOption_HPFoldingOptions=VFold -o HPOption_BookletMaker=True -v "$ipp_queue"
if [[ $? -lt 1 ]]; then
	echo "Der Drucker konnte verbunden werden."
	exit 0
else
	echo "Fehler: Der Drucker konnte nicht verbunden werden."
	exit 2
fi
