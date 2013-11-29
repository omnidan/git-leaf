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

function initRepo(repo) {
    loadRepo(repo);

    $('#repo-name').html(repo);

    var branch_list = getBranches();
    var branches_obj = $('#branches');

    for (var i=0; i < branch_list.length; i++) {
        addBranch(branch_list[i]);
        branches_obj.append(
            '<button type="button" class="btn btn-default" id="branch-' + branch_list[i] + '">' +
                branch_list[i] + '</button>'
        );
    }

    loadBranch("master");

    branches_obj.children('button').each(function () {
        $(this).click(function () {
            loadBranch(this.innerHTML);
        });
    });
}