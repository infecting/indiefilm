echo What should the version be?
read VERSION
echo "Commit message?"
read COMMIT

git add .
git commit -am "$COMMIT"
git push origin master

sleep 420 

ssh root@149.28.120.33 "
docker pull infecting/indiefilms:latest
docker tag infecting/indiefilms:latest dokku/indiefilm:$VERSION
dokku tags:deploy indiefilm $VERSION"
