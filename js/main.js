"use strict";

var repo_select = $('#repo-select');

repo_select.change(function (obj) {
    var file = $(this).val();

    if (file != undefined && file != "") initRepo(file);
});

$(document).ready(function () {
    repo_select.trigger('click');
});

$('#repo-select-button').click(function () {
    repo_select.trigger('click');
});

var current_branch = "";
var previous_commit = "";
var repo;

function getBranchColor(branch_num) {
    switch (branch_num) {
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

function loadBranch(repo, commitCallback, branch) {
    if (!branch) branch = repo.master_branch;
    selectBranch(branch);
    var tree = $('#tree');
    tree.empty();
    tree.append('<li class="vline">&nbsp;</li>');
    openBranch(repo, commitCallback, branch);
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

var grepo;

function onCommit(commit) {
    if (commit.hash == previous_commit) {
        console.log("DUPLICATE COMMIT: " + commit.hash);
        return;
    }

    var buffer = '<li class="commit">';
    var branch = grepo.branch_hashes.indexOf(commit.hash);

    if (branch != -1) buffer += '<span class="label ' + getBranchColor(branch) + '">' +
        grepo.branches[branch] + '</span> ';

    buffer += commit.message +
        ' <small class="author"> - ' + commit.author.name + ' &lt;' + commit.author.email + '&gt;</small> ' +
        ' <small class="date">at ' + commit.date + '</small>';

    buffer += '</li>';

    $('#tree').append(buffer);

    previous_commit = commit.hash;
}

var branches_obj = $('#branches');

function addBranch(branch) {
    branches_obj.append(
        '<button type="button" class="btn btn-default" id="branch-' + branch + '">' +
            branch + '</button>'
    );
}

function initRepo(repo_path) {
    openRepo(repo_path, addBranch, function(repo) {
        grepo = repo;

        $('#repo-name').html(repo_path);

        var branches_obj = $('#branches');

        loadBranch(repo, onCommit);

        branches_obj.children('button').each(function () {
            $(this).click(function () {
                loadBranch(repo, onCommit, this.innerHTML);
            });
        });
    });
}