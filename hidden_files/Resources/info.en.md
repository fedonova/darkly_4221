# Hidden folder

There is one more braches in the file `http://IP/robots.txt`-  a hidden folder . If we go inside it, we can see many similar subfolders with messages from the Darkly creators. The idea was to check what is written in each of these files: maybe one of them has a flag, or even several flags.

To do this,I wrote a script. It walks through the folders recursively, and if the content has the word `flag`, it saves the path and the flag in an array:

In the end, the flag was found in this file:
`http://IP/.hidden/whtccjokayshttvxycsvykxcfm/igeemtxnvexvxezqwntmzjltkt/lmpanswobhwcozdqixbowvbrhw`

## The main idea
The robots.txt file can show what is stored in the project, and this is information leakage. Anyone can view this file, so sensitive parts should be protected with authentication, with checks on the client IP, or by not giving direct access to these resources at all and handling access on the frontend side, for example.