
app-version-mock
================

Mock API for testing the minimum app version

Prerequisites
----

* PHP 5.4+
* composer (to install PHP dependencies)
* bower (to install JS dependencies)

Installation
----
1. Clone the source tree `git clone git@github.com:matmar10/app-version-mock.git` and navigate to the project root directory
2. Install PHP dependencies: `composer update`
3. Install JS dependencies: `bower install`
4. Run the server (from the `web` directory): `php -S localhost:8000`
5. Point your browser to `localhost:8000`

*NOTE: PHP must be able to write to the directory `db/`* 

If PHP cannot write to the directory, you can fix it using the following:

```bash
$ APACHEUSER=`ps aux | grep -E '[a]pache|[h]ttpd' | grep -v root | head -1 | cut -d\  -f1`
$ sudo chmod +a "$APACHEUSER allow delete,write,append,file_inherit,directory_inherit" db
$ sudo chmod +a "`whoami` allow delete,write,append,file_inherit,directory_inherit" db
```

