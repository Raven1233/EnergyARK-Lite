echo "Deploying files to server..."
scp -r build_php/* www-ioe@www-admin12.rz.rptu.de:/srv/www/www-ioe/data/http/

echo "Done"
