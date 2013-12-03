"use strict";

var autoload = null; // autoload a repo, for debugging purposes
autoload = '/home/dan/dev/experiments/gittest';

var g_repo;
var current_repo;
var current_branch;
var previous_commit;
var first_commit;
var diff_done;
var diff_in_progress;
var i = 0;

var tree_obj = $('#tree');

var repo_select = $('#repo-select');

repo_select.change(function (obj) {
    var file = $(this).val();

    if (file != undefined && file != "") initRepo(file);
});

$(document).ready(function () {
    if (autoload != null) initRepo(autoload);
    else repo_select.trigger('click');
});

$('#repo-select-button').click(function () {
    repo_select.trigger('click');
});

$('#refresh-icon').click(function () {
    // TODO: if it doesn't equal, read all new commits and prepend them, then show them as NEW or something.
    if (current_repo) initRepo(current_repo);
    if (current_branch) loadBranch(g_repo, onCommit, current_branch);
});

window.setInterval(function () {
    diffRepo(current_branch, g_repo, current_branch);
}, 1000);

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
    if (!diff_in_progress) first_commit = undefined;

    if (!branch) branch = repo.master_branch;
    selectBranch(branch);

    if (!diff_in_progress) {
        tree_obj.empty();
        tree_obj.append('<li class="vline">&nbsp;</li>');
    }

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

function onCommit(commit) {
    if (!first_commit) first_commit = commit.hash;

    if (commit.hash == previous_commit) {
        // TODO: is this still needed?
        console.log("DUPLICATE COMMIT: " + commit.hash);
        return;
    }

    var buffer = '<li class="commit"><div id="commit-' + commit.hash + '"><span class="header">';
    var branch = g_repo.branch_hashes.indexOf(commit.hash);

    if (branch != -1) buffer += '<span class="label ' + getBranchColor(branch) + '">' +
        g_repo.branches[branch] + '</span> ';

    buffer += '<span class="message">' + commit.message + '</span></span>' +
        ' <small class="author"> - ' + commit.author.name + ' &lt;' + commit.author.email + '&gt;</small> ' +
        ' <small class="date">at ' + commit.date + '</small>';

    buffer += '</div></li>';

    if (diff_in_progress) {
        tree_obj.find('.vline').after(buffer);
    } else tree_obj.append(buffer);

    $('#commit-' + commit.hash).click(function () {
        var c_obj = $('#commit-' + commit.hash);
        if (c_obj.data('opened') != true) {
            c_obj.data('opened', true);
            c_obj.addClass('well');

            c_obj.find($('.header')).addClass('well-header');
            c_obj.find($('.author')).hide();
            c_obj.find($('.date')).hide();

            g_repo.getCommit(commit.hash, function(err, c) {
                if (err) {
                    console.log("FATAL ERROR: " + err); // TODO: Display this error in a notification
                    return;
                }

                console.log(c);


                var buffer2 = '<span class="body">';
                buffer2 += ' <small class="author"> - ' + commit.author.name + ' &lt;' + commit.author.email + '&gt;</small> ' +
                    ' <small class="date">at ' + commit.date + '</small>';
                buffer2 += '</span>';

                c_obj.append(buffer2);
            });
        } else {
            c_obj.data('opened', false);
            c_obj.removeClass('well');

            c_obj.find($('.header')).removeClass('well-header');
            c_obj.find($('.body')).remove();

            c_obj.find($('.author')).show();
            c_obj.find($('.date')).show();
        }
    });

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
        g_repo = repo;

        $('#repo-name').html(repo_path);

        var branches_obj = $('#branches');

        loadBranch(repo, onCommit);

        current_branch = repo.master_branch;

        branches_obj.children('button').each(function () {
            $(this).click(function () {
                loadBranch(repo, onCommit, this.innerHTML);
            });
        });
    });
}

function diffCommit(commit) {
    // FIXME: when two commits are made at once, it loads the second commit twice
    if (!diff_done) {
        if (commit.hash == first_commit) {
            diff_done = true;
            diff_in_progress = false;
            if (i > 0) first_commit = previous_commit;
        } else {
            onCommit(commit);
            console.log("UPDATED! New commit: " + commit.hash);
        }
    }
    i++;
}

function diffRepo(repo_path, repo, branch) {
    diff_in_progress = true;
    diff_done = false;
    i = 0;
    // TODO: diff branches too
    loadBranch(repo, diffCommit, branch);
}