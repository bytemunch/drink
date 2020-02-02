rm -rf ./public/*

tsc
lessc ./src/less/main.less ./public/styles.css
rsync -a ./src/root/* ./public/