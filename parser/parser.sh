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

#PENGUINSTATS_PREFETCH=false
read -p "Prefetch PenguinStats? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
#    PENGUINSTATS_PREFETCH=true
    echo "tsc PenguinStats.ts --target esnext --module commonjs --moduleResolution node --esmoduleInterop true"
    tsc PenguinStats.ts --target esnext --module commonjs --moduleResolution node --esmoduleInterop true
    echo "node PenguinStats.js"
    node PenguinStats.js
fi

echo "tsc Parser --target esnext --module commonjs --moduleResolution node --esmoduleInterop true"
tsc Parser.ts --target esnext --module commonjs --moduleResolution node --esmoduleInterop true
echo "tsc Operator.list.parser.ts --target esnext --module commonjs --moduleResolution node --esmoduleInterop true"
tsc Operator.list.parser.ts --target esnext --module commonjs --moduleResolution node --esmoduleInterop true
echo "tsc ConcatAllObj(Operator) --target esnext --module commonjs --moduleResolution node --esmoduleInterop true"
tsc 'ConcatAllObj(Operator).ts' --target esnext --module commonjs --moduleResolution node --esmoduleInterop true
#if [[ $PENGUINSTATS_PREFETCH == true ]]; then
#
#fi
echo "node Parser"
node Parser.js
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
