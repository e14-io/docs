##MYSQL

### Export database

`mysqldump -u remoteusername -p remotepassword -h your.site.com databasename > dump.sql`

### Import database

`mysql -u localusername -p localpassword databasename < dump.sql`