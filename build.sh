# clean public folder
rm -rf ./public/*

# compile typescript
tsc

# add element CSS
rsync -a ./src/ts/elements/*.css ./public/styles/

# add element HTML
rsync -a ./src/ts/elements/*.html ./public/templates/

# and page css
rsync -a ./src/ts/pages/*.css ./public/styles/

# add other files
rsync -a ./src/root/* ./public/