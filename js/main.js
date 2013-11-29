"use strict";

var git_path = "/home/dan/test.git/.git/";

var fs = require('fs');

var platform = require('git-node-platform');
var jsGit = require('js-git');
var fsDb = require('git-fs-db')(platform);
var pfs = platform.fs;
var db = fsDb(pfs(git_path));

var repo = jsGit(db);

listBranches();
loadCommit("test");

function listBranches() {
    fs.readdir(git_path + 'refs/heads/', function(err, files) {
        console.log(files);
    });
}

function loadCommit(hashish) {
    repo.loadAs("commit", hashish, onCommit);
}

function onCommit(err, commit, hash) {
    if (err) throw err;
    console.log("COMMIT", hash, commit);
    loadTree(commit.tree);
    if (commit.parents) {
        commit.parents.forEach(loadCommit);
    }
}

function loadTree(hash) {
    repo.loadAs("tree", hash, onTree);
}

function onTree(err, tree, hash) {
    if (err) throw err;
    console.log("TREE", hash, tree);
    tree.forEach(onEntry);
}

function onEntry(entry) {
    repo.loadAs("blob", entry.hash, function (err, blob) {
        if (err) throw err;
        console.log("BLOB", entry.hash, blob);
    });
}