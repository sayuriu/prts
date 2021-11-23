function CleanJS() {
	for js in *.js; do
		if [[ $js == $1 ]]; then
			continue
		fi
		rm $js
		echo "del ${js}"
	done
}

function CleanFull() {
	echo "cd $1 && clean"
	cd $1
	CleanJS null
	echo "cd .."
	cd ..
}

if [[ ! -d 'json' ]]; then
	echo "mkdir json"
	mkdir "json"
fi
echo "tsc AceshipParser --target esnext --module commonjs --esmoduleInterop true"
tsc AceshipParser --target esnext --module commonjs --esmoduleInterop true
echo "tsc Operator.list.parser.ts --target esnext --module commonjs --esmoduleInterop true"
tsc Operator.list.parser.ts --target esnext --module commonjs --esmoduleInterop true
echo "tsc ConcatAllObj(Operator) --target esnext --module commonjs --esmoduleInterop true"
tsc 'ConcatAllObj(Operator)' --target esnext --module commonjs --esmoduleInterop true
echo "node AceshipParser"
node AceshipParser
echo "node ConcatAllObj(Operator)"
node 'ConcatAllObj(Operator)'
echo "node Operator.list.parser.js"
node Operator.list.parser.js
echo "cleanup"
# dist="full_concat_obj.js"
CleanJS null
CleanFull "struct"
CleanFull "utils"
echo "done, exit code $?"
exit 0