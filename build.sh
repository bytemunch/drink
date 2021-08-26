echo "Cleaning public folder..."
rm -rf ./public/*

echo "Compiling TS..."
tsc

echo "Adding custom element HTML..."
rsync -a ./src/ts/elements/*.html ./public/templates/
echo "Adding page HTML..."
rsync -a ./src/ts/pages/*.html ./public/templates/

echo "Adding custom element CSS..."
rsync -a ./src/ts/elements/*.css ./public/styles/
echo "Adding page CSS..."
rsync -a ./src/ts/pages/*.css ./public/styles/

echo "Adding root files..."
rsync -a ./src/root/* ./public/

# add CSS preload links to index
# STYLES="./public/styles/*"
# for s in $STYLES
# do
#     echo "Adding preload for $s..."
#     HREF=$(echo "$s" | sed "s/public\///")
#     sed -i "/CSSPRELOAD/a <link rel='preload' href='$HREF' as='style'>" ./public/index.html
# done