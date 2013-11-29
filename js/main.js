"use strict";

loadRepo("/home/dan/test.git/");

var branch_list = getBranches();
var branches_obj = $('#branches');

for (var i=0; i < branch_list.length; i++) {
    addBranch(branch_list[i]);
    branches_obj.append(
        '<button type="button" class="btn btn-default" id="branch-' + branch_list[i] + '">' + branch_list[i] + '</button>'
    );
}

branches_obj.children('button').each(function () {
    $(this).click(function () {
        loadBranch(this.innerHTML);
    });
});

loadBranch("master");