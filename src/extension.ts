import * as vscode from 'vscode';
import axios from "axios";
const branch = require("git-branch");
var repoName = require("git-repo-name");
var inActiveTime: Date;
var activeTime: Date;
var userName = require("git-user-name");
var url = "http://localhost:3600";

var newBranchName:any;
var newRepoName:any;
var swirlUser: String = userName();
export function activate(context: vscode.ExtensionContext) {
 
	vscode.commands.executeCommand('extension.helloWorld');


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
						"GitSwirl:=> "+'$(person-filled) '+      
						swirlUser +
						' $(repo) ' +  
						repoName +
						' $(git-branch) ' +
						branchName  
					  );
					  console.log(repoName, "reponame", branchName, "branchName"); 
					  newBranchName = branchName;
					  newRepoName = repoName;
					  axios
					  .post(url + "/vscode_extension", {
						newBranchName,
						newRepoName,
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
		vscode.window.onDidChangeWindowState(item => {
		if (item.focused === true) {
		  let inFocus: Date = new Date();
		  activeTime = inFocus;
				axios
				  .post(url + "/vscode_extension", {
					inActiveTime,
					newBranchName,
					newRepoName,
					swirlUser
				  })
				  .then(response => {     
					console.log(response);
				  }).catch(console.error);

		 } else if (item.focused === false) { 
		  let outOfFocus: Date = new Date();	  
			  axios
				.post(url + "/vscode_extension", {
				  activeTime,
				  newBranchName,
				  newRepoName,
				  swirlUser
				})
				.then(response => {
				  console.log(response);
				}).catch(console.error);
			  inActiveTime = outOfFocus;
		}
		
	});
});                

	context.subscriptions.push(disposable); 
}

// this method is called when your extension is deactivated
export function deactivate() {}   