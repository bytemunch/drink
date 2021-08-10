# clean public folder
rm -rf ./public/*

# compile typescript
tsc

# add element CSS
rsync -a ./src/ts/elements/*.css ./public/styles/

# add other files
rsync -a ./src/root/* ./public/