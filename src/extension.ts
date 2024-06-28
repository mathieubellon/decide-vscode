import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {

	// register a command that is invoked when the status bar
	// item is selected
	const myCommandId = 'sample.showSelectionCount';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
		vscode.window.showInformationMessage(`Yeah, ${n} line(s) selected... Keep going!`);
	}));

	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	subscriptions.push(myStatusBarItem);

	// register some listener that make sure the status bar 
	// item always up-to-date
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));

	// update status bar item once at start
	updateStatusBarItem();


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('decide-vscode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from super decide-vscode!');
	});

	subscriptions.push(disposable);
}

function updateStatusBarItem(): void {
	const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
	if (n > 0) {
		myStatusBarItem.text = `Decide: ${n} secrets found!`;
		myStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
	} else {
		myStatusBarItem.text = `Decide: ready to find secrets!`;
		myStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.activeBackground');
	}
	myStatusBarItem.show();
}

function getNumberOfSelectedLines(editor: vscode.TextEditor | undefined): number {
	let lines = 0;
	if (editor) {
		lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
	}
	return lines;
}

export function deactivate() { }