// load modules
var git   = require('nodegit'),
    fs    = require('fs'),
    path  = require('path'),
    sort  = git.RevWalk.Sort;

function getBranches(git_path) {
    return fs.readdirSync(path.join(git_path, 'refs', 'heads'));
}

function getBranchHash(git_path, branch) {
    var contents = fs.readFileSync(path.join(git_path, 'refs', 'heads', branch), 'utf8');
    return contents.replace(/(\r\n|\n|\r)/gm, "");
}

function openRepo(repo_path, addBranchCallback, repoReadyCallback) {
    if (addBranchCallback) var branch_callback = addBranchCallback;
    if (repoReadyCallback) var repo_callback = repoReadyCallback;

    var git_path = path.join(repo_path, '.git');

    git.Repo.open(git_path, function(err, repo) {
        if (err) {
            console.log("FATAL ERROR: " + err); // TODO: Display this error in a notification
            return null;
        }

        var branches = getBranches(git_path);
        var branch_hashes = [];

        for (var i=0; i < branches.length; i++) {
            if (branch_callback) branch_callback(branches[i]);

            branch_hashes.push(getBranchHash(git_path, branches[i]));
        }

        var master_branch = "master";
        if (branches.indexOf(master_branch) == -1) {
            if (branches.length == 0) {
                console.log("FATAL ERROR: No branches found."); // TODO: Display this error in a notification
                return null;
            }

            // master doesn't exist, get first branch
            master_branch = branches[0];
        }

        repo.branches = branches;
        repo.branch_hashes = branch_hashes;
        repo.master_branch = master_branch;

        if (repoReadyCallback) repo_callback(repo);
    });
}

function openBranch(repo, addCommitCallback, branch) {
    if (addCommitCallback) var commit_callback = addCommitCallback;

    if (!branch) branch = repo.master_branch;
    repo.getBranch(branch, function(err, current_branch) {
        if (err) {
            console.log("FATAL ERROR: " + err); // TODO: Display this error in a notification
            return;
        }

        var history = current_branch.history(sort.Time);

        // go through history
        history.on('commit', function(commit) {
            var c = {};
            c.hash = commit.sha();
            c.date = commit.date();
            c.author = {};
            c.author.name = commit.author().name();
            c.author.email = commit.author().email();
            c.message = commit.message();

            if (commit_callback) commit_callback(c);
        });

        history.start();
    });
}