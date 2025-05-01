# CPSC304: Astronomy database

# Setup

This project uses the same `.env` and scripts as used in the NodeJS sample project

The `.env` example should be present in the project root and look like the following
```shell
# TODO: Edit the values below this line according to the given placeholders
# Replace 'ora_YOUR-CWL-USERNAME' with "ora_" (no quotation marks) followed by your CWL username.
ORACLE_USER=ora_YOUR-CWL-USERNAME
# Replace 'YOUR-STUDENT-NUMBER' with your actual student number.
ORACLE_PASS=aYOUR-STUDENT-NUMBER


#Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)
PORT=65535

# -------------- The three lines below should be left unaltered --------------
ORACLE_HOST=dbhost.students.cs.ubc.ca
ORACLE_PORT=1522
ORACLE_DBNAME=stu
```

Starting the server on the remote server can be done with the following
```bash
# this is for Unix systems
$: sh ./remote-start.sh
```

And SSH tunneling on the local machine can be done with the following
```bash
# this is for Unix systems
$: sh scripts/mac/server-tunnel.sh
```
Note: If the user is running the code for the first time, it's best to run the .sql file first, and then reload the web application
