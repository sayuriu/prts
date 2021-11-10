if [[ ! -d 'json' ]]; then
	mkdir "json"
	echo "create \"json\""
	echo "mkdir json"
fi
echo "tsc AceshipJSONParser --target esnext --module commonjs --esmoduleInterop true"
tsc AceshipJSONParser --target esnext --module commonjs --esmoduleInterop true
echo "node AceshipJSONParser"
node AceshipJSONParser
echo "done"
exit 0