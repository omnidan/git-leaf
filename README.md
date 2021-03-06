git-leaf
========

_simple and beautiful git trees_

What is gif-leaf?
--------------

git-leaf is an application that allows you to view the history of a git repository in a simple and beautiful way.

![Screenshot: git-leaf 0.1](https://github.com/omnidan/git-leaf/raw/0.1/screenshot.png)

Running
-------

Download *0.1*:
 * [git-leaf 0.1 for Windows](https://github.com/omnidan/git-leaf/releases/download/v0.1/git-leaf-win.zip)
 * [git-leaf 0.1 for Linux 64bit](https://github.com/omnidan/git-leaf/releases/download/v0.1/git-leaf-lnx64.tar.gz)
 * [git-leaf 0.1 for Linux 32bit](https://github.com/omnidan/git-leaf/releases/download/v0.1/git-leaf-lnx32.tar.gz)
 * [git-leaf 0.1 node-webkit app file](https://github.com/omnidan/git-leaf/releases/download/v0.1/git-leaf.nw)

On *Windows* and *Linux*: Unzip/Un-archive the downloaded file. Open the directory and start the executable. If you want, you
can create a desktop shortcut or move the directory wherever you want it.

Using the *node-webkit app file*: Start the .nw file with your node-webkit instance - `nw git-leaf.nw`

Experimenting
-------------

git-leaf is still in active development. The *master* branch is the experimental branch. There is a strong focus on
responsive design and simplicity.
To see what plans I have for git-leaf, check out the [TODO file](https://github.com/omnidan/git-leaf/raw/master/TODO).

To test git-leaf, you need node-webkit and npm. Install it globally (or run nw from the right path), then install the
dependencies:
```
npm install
```

Now you need to recompile libgit for node-webkit, you can do this by running:
```
cd node_modules/nodegit
nw-gyp rebuild --target=0.8.1
cd ../..
```
(You might need to update the target to the latest node-webkit version)

If you don't have nw-gyp installed, run:
```
npm install nw-gyp -g
```
(You might need to run this command as root by using `sudo` or `su`)

Now you can run git-leaf with node-webkit. In my case, I have nw globally installed, if you don't have that, replace
`nw` with the full path to the node-webkit executable:
```
nw /path/to/git-leaf
```
In the experimental branch, doing this will start git-leaf with the node-webkit debug frame.

License
-------

Copyright (c) Daniel Bugl <daniel.bugl@touchlay.com>

Licensed under BSD standard license. See the [LICENSE file](https://github.com/omnidan/git-leaf/raw/master/LICENSE) for
more information.
