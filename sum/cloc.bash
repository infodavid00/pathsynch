# one the command is executed
echo writing output to .cloc

# count lines of code and write results in .cloc
cloc --exclude-dir=node_modules,notes,test --exclude-ext=json,md,txt . --report-file=.cloc ../.

# after write succesful
echo wrote output to .cloc