git-leaf
========

_simple and beautiful git trees_

What is gif-leaf?
--------------

git-leaf is an application that allows you to view the history of a git repository in a simple and beautiful way.

![Screenshot: git-leaf 0.1](https://github.com/omnidan/git-leaf/raw/0.1/screenshot.png)

Running
-------

To run git-leaf, download the executable and run it.

Experimental
------------

git-leaf is still in active development. The *master* branch is the experimental branch. There is a strong focus on
responsive design and simplicity. I plan on converting all the JavaScript code to CoffeeScript later. To see what other
plans I have for git-leaf, see the [TODO file](https://github.com/omnidan/git-leaf/raw/master/TODO).

To test git-leaf, you need node-webkit. Install it globally (or run nw from the right path) and run:
```
nw /path/to/git-leaf/
```
In the experimental branch, doing this will start git-leaf with the node-webkit debug frame.