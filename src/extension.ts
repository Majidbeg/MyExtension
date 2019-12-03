import * as vscode from 'vscode';
import axios from "axios";
const branch = require("git-branch");
var repoName = require("git-repo-name");
var inActiveTime: Date;
var activeTime: Date;
var userName = require("git-user-name");
var url = "http://localhost:3600";
export function activate(context: vscode.ExtensionContext) {

	vscode.commands.executeCommand('extension.helloWorld');

	var swirlUser: String = userName();

	/**
	 * Finding the repository and branch name
	 */
	let folderPath = vscode.workspace.rootPath;

	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => { 

		vscode.workspace.onDidChangeTextDocument(item => {
			vscode.window.showInformationMessage("branch name");
			if (folderPath) {
				branch(`${folderPath}`)
				  .then((branchName: String) => {
					repoName(folderPath, function(err: String, repoName: String) {
					  vscode.window.setStatusBarMessage(
						"GitSwirl:=> "+" [Username]:=> "+  
						swirlUser +
						" [Repository]:=> " +
						repoName +
						" [Branch]:=> " +
						branchName
					  );
					  console.log(repoName, "reponame", branchName, "branchName");
					  axios
					  .post(url + "/vscode_extension", {
						branchName,
						repoName,
						swirlUser
					  })
					  .then(response => {
						console.log(response, "this is response");
					  });
	
					});
				  })
				  .catch(console.error);
			  } else {
				console.log("Add repo name...");
			  }	
		});

		if (folderPath) {
			branch(`${folderPath}`)
			  .then((branchName: String) => {
				repoName(folderPath, function(err: String, repoName: String) {
				  vscode.window.setStatusBarMessage(
					"GitSwirl:=> "+" [Username]:=> "+  
					swirlUser +
					" [Repository]:=> " +
					repoName +
					" [Branch]:=> " +
					branchName
				  );
				  console.log(repoName, "reponame", branchName, "branchName");
				  axios
				  .post(url + "/vscode_extension", {
					branchName,
					repoName,
					swirlUser
				  })
				  .then(response => {
					console.log(response, "this is response");
				  });

				});
			  })
			  .catch(console.error);
		  } else {
			console.log("Add repo name...");
		  }
	
	vscode.window.onDidChangeWindowState(item => {
		if (item.focused === true) {
		  let inFocus: Date = new Date();
		  activeTime = inFocus;
		  axios
			.post(url + "/vscode_extension", {
			  inActiveTime
			})
			.then(response => {
			  console.log(response);
			});
		} else if (item.focused === false) {
		  let outOfFocus: Date = new Date();
		  axios
			.post(url + "/vscode_extension", {
			  activeTime
			})
			.then(response => {
			  console.log(response);
			});
		  inActiveTime = outOfFocus;
		}
	});
});

	context.subscriptions.push(disposable); 
}

// this method is called when your extension is deactivated
export function deactivate() {}
