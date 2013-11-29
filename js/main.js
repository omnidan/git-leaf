"use strict";

var git_path = "/home/dan/test.git/.git/";

var fs = require('fs');

var platform = require('git-node-platform');
var jsGit = require('js-git');
var fsDb = require('git-fs-db')(platform);
var pfs = platform.fs;
var db = fsDb(pfs(git_path));

var repo = jsGit(db);

var current_branch = "";

// app
var branches = getBranches();
var branch_hashes = [];
var branches_obj = $('#branches');
for (var i=0; i < branches.length; i++) {
    branch_hashes.push(getBranchHash(branches[i]));
    branches_obj.append(
        '<button type="button" class="btn btn-default" id="branch-' + branches[i] + '">' + branches[i] + '</button>'
    );
}
branches_obj.children('button').each(function () {
    $(this).click(function () {
        loadBranch(this.innerHTML);
    });
});
loadBranch("master");
// /app

function getBranches() {
    return fs.readdirSync(git_path + 'refs/heads/');
}

function getBranchHash(branch) {
    var contents = fs.readFileSync(git_path + 'refs/heads/' + branch, 'utf8');
    return contents.replace(/(\r\n|\n|\r)/gm, "");
}

function loadBranch(branch) {
    selectBranch(branch);
    $('#tree').empty();
    loadCommit(branch);
}

function deselectBranch(branch) {
    var branch_obj = $('#branch-' + branch);
    branch_obj.removeClass('btn-primary');
    branch_obj.addClass('btn-default');
}

function selectBranch(branch) {
    if (current_branch != "") deselectBranch(current_branch);
    current_branch = branch;
    var branch_obj = $('#branch-' + branch);
    branch_obj.removeClass('btn-default');
    branch_obj.addClass('btn-primary');
}

function loadCommit(hashish) {
    repo.loadAs("commit", hashish, onCommit);
}

function onCommit(err, commit, hash) {
    if (err) throw err;
    console.log("COMMIT", hash, commit);

    var buffer = '<li class="commit">';
    var branch = branch_hashes.indexOf(hash);
    console.log(branch_hashes);

    if (branch != -1) buffer += '<span class="label label-primary">' + branches[branch] + '</span> ';

    buffer += commit.message +
        ' <small class="author"> - ' + commit.author.name + ' &lt;' + commit.author.email + '&gt;</small>';

    buffer += '</li>';

    $('#tree').append(buffer);

    //loadTree(commit.tree);
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