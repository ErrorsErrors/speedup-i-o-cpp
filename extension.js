// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Extension "speedup-i-o-cpp" is now active!');

	const disposable = vscode.commands.registerCommand('speedup-i-o-cpp.helloWorld', function () {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found.');
			return;
		}
  
		const document = editor.document;
		const text = document.getText();
  
		const mainRegex = /int\s+main\s*\(\s*\)\s*\{/g;
		const endlRegex = /std::endl|endl/g;
  
		const edits = [];
  
		let match;
		while ((match = mainRegex.exec(text)) !== null) {
			const insertPosition = document.positionAt(match.index + match[0].length);
			edits.push(vscode.TextEdit.insert(
				insertPosition,
				"\n    std::ios::sync_with_stdio(false);\n    std::cin.tie(nullptr);"
		  	));
		}
		
		let endlMatch;
		while ((endlMatch = endlRegex.exec(text)) !== null) {
			const start = document.positionAt(endlMatch.index);
			const end = document.positionAt(endlMatch.index + endlMatch[0].length);
			edits.push(vscode.TextEdit.replace(new vscode.Range(start, end), "'\\n'"));
		}

		const edit = new vscode.WorkspaceEdit();
		edit.set(document.uri, edits);
  
		vscode.workspace.applyEdit(edit).then(success => {
			if (success) {
				vscode.window.showInformationMessage('Edits applied successfully!');
			} else {
				vscode.window.showErrorMessage('Failed to apply edits.');
			}
		});
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
