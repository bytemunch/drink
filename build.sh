# clean public folder
rm -rf ./public/*

# compile typescript
tsc

# add other files
rsync -a ./src/root/* ./public/