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
tsc AceshipParser.ts --target esnext --module commonjs --esmoduleInterop true
echo "tsc Operator.list.parser.ts --target esnext --module commonjs --esmoduleInterop true"
tsc Operator.list.parser.ts --target esnext --module commonjs --esmoduleInterop true
echo "tsc ConcatAllObj(Operator) --target esnext --module commonjs --esmoduleInterop true"
tsc 'ConcatAllObj(Operator).ts' --target esnext --module commonjs --esmoduleInterop true
echo "node AceshipParser"
node AceshipParser.js
echo "node ConcatAllObj(Operator)"
node 'ConcatAllObj(Operator).js'
echo "node Operator.list.parser.js"
node Operator.list.parser.js
echo "cleanup"
echo "find ./ -type d -empty -delete"
find ./ -type d -empty -delete
# dist="full_concat_obj.js"
CleanJS null
CleanFull "struct"
CleanFull "utils"
cd "struct"
CleanFull "Operator"
cd ".."
# cp -r "struct" "../src"
echo "done, exit code $?"
exit 0
