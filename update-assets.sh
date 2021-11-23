# PROBLEM: Incompatible with WSL file structure.
ROOT=$dirname
ACESHIP_ROOT="aceship/AN-EN-Tags"
PARSER_DIR="parser"
PARSER_SCRIPT="parser.sh"
# Check parser/Aceship*.ts for more info.

cd $ACESHIP_ROOT
echo "Syncing git..."
git pull
echo "Running parser..."
cd "../../$PARSER_DIR" && "./$PARSER_SCRIPT"