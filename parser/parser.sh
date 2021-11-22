function CleanJS() {
	for js in *.js; do
		if [[ $js == $1 ]]; then
			continue
		fi
		rm $js
		echo "del ${js}"
	done
}

if [[ ! -d 'json' ]]; then
	echo "mkdir json"
	mkdir "json"
fi
echo "tsc AceshipParser --target esnext --module commonjs --esmoduleInterop true"
tsc AceshipParser --target esnext --module commonjs --esmoduleInterop true
echo "tsc ConcatAllObj --target esnext --module commonjs --esmoduleInterop true"
tsc ConcatAllObj --target esnext --module commonjs --esmoduleInterop true
echo "node AceshipParser"
node AceshipParser
echo "node ConcatAllObj"
node ConcatAllObj
echo "cleanup"
echo "cleanup ."
dist="full_concat_obj.js"
CleanJS $dist
echo "cd struct"
cd struct
echo "cleanup ."
CleanJS null
cd ..
echo "product ./${dist}"
echo "done, exit code $?"
exit 0