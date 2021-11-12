if [[ ! -d 'json' ]]; then
	mkdir "json"
	echo "create \"json\""
	echo "mkdir json"
fi
echo "tsc AceshipJSONParser --target esnext --module commonjs --esmoduleInterop true"
tsc AceshipJSONParser --target esnext --module commonjs --esmoduleInterop true
echo "tsc ConcatAllObj --target esnext --module commonjs --esmoduleInterop true"
tsc ConcatAllObj --target esnext --module commonjs --esmoduleInterop true
echo "node AceshipJSONParser"
node AceshipJSONParser
echo "node ConcatAllObj"
node ConcatAllObj
echo "cleanup"
dist="full_concat_obj.js"
for js in *.js; do
	if [[ $js == $dist ]]; then
		continue
	fi
	rm $js
	echo "del ${js}"
done
echo "done"
echo "product ./${dist}"
exit 0