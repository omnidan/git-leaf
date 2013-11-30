var fs = require('fs');
var path = require('path');

var repo, git_path;

var previous_commit = "";

var branches = [];
var branch_hashes = [];
function Branch (name, hash) {
    this.name = name;
    this.hash = hash;
    this.color = getBranchColor();
}

function getBranchColor() {
    switch (branches.length) {
        default:
            return "label-primary";
            break;
        case 1:
            return "label-success";
            break;
        case 2:
            return "label-info";
            break;
        case 3:
            return "label-warning";
            break;
        case 4:
            return "label-danger";
            break;
    }
}

var current_branch = "";

function getBranches() {
    return fs.readdirSync(path.join(git_path, 'refs', 'heads'));
}

function getBranchHash(branch) {
    var contents = fs.readFileSync(path.join(git_path, 'refs', 'heads', branch), 'utf8');
    return contents.replace(/(\r\n|\n|\r)/gm, "");
}

function loadBranch(branch) {
    selectBranch(branch);
    $('#tree').empty();
    $('#tree').append('<li class="vline">&nbsp;</li>');
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
    previous_commit = "";
    repo.loadAs("commit", hashish, onCommit);
}

function onCommit(err, commit, hash) {
    if (hash == previous_commit) {
        console.log("DUPLICATE COMMIT: " + hash);
        return;
    }
    if (err) {
        console.log("FATAL ERROR: " + err);
        return;
    }
    //console.log("COMMIT", hash, commit);

    var buffer = '<li class="commit">';
    var branch = branch_hashes.indexOf(hash);

    if (branch != -1) buffer += '<span class="label ' + branches[branch].color + '">' +
        branches[branch].name + '</span> ';

    buffer += commit.message +
        ' <small class="author"> - ' + commit.author.name + ' &lt;' + commit.author.email + '&gt;</small> ' +
        ' <small class="date">at ' + commit.author.date + '</small>';

    buffer += '</li>';

    $('#tree').append(buffer);

    if (commit.parents) {
        commit.parents.forEach(loadCommit);
    }

    previous_commit = hash;
}

function loadRepo(repo_path) {
    git_path = path.join(repo_path, '.git');

    var platform = require('git-node-platform');
    var jsGit = require('js-git');
    var fsDb = require('git-fs-db')(platform);
    var pfs = platform.fs;
    var db = fsDb(pfs(git_path));

    repo = jsGit(db);
}

function addBranch(name) {
    var current_hash = getBranchHash(name);

    branches.push(new Branch(name, current_hash));
    branch_hashes.push(current_hash);
}