echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r build/* www-ioe@www-admin12.rz.rptu.de:/srv/www/www-ioe/data/http/

echo "Done"
