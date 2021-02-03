echo What should the version be?
read VERSION

ssh root@149.28.120.33 "
docker pull infecting/indiefilms:latest
docker tag infecting/indiefilms:latest dokku/indiefilm:$VERSION
dokku tags:deploy indiefilm $VERSION"
