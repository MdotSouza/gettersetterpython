const vscode = require('vscode');

function activate(context) {
	console.log('Congratulations, your extension "gettersetterpython" is now active!');

	let disposable = vscode.commands.registerCommand('gettersetterpython.generate', function () {
		var editor = vscode.window.activeTextEditor;
		if (!editor){
			vscode.window.showErrorMessage('No open text editor.');
			return;
		}

		var selection = editor.selection;
		var text = editor.document.getText(selection);
		if (text.length < 1){
			vscode.window.showErrorMessage('No selected properties.');
			return;
		}

		try {
            var getterAndSetter = createGetterAndSetter(text);

            editor.edit(
                edit => editor.selections.forEach(
                  	selection => {
                    	edit.insert(selection.end, getterAndSetter);
						
                  }));

            vscode.commands.executeCommand('editor.action.formatSelection');
        } 
        catch (error){
            console.log(error);
            vscode.window.showErrorMessage('Something went wrong! Try that the properties are in this format: "self.name" or "self.__name"');
        }
    });

	context.subscriptions.push(disposable);
};

function createGetterAndSetter(textPorperties) {
	var properties = textPorperties.split(/\r?\n/).filter(x => x.length > 2).map(x => x.replace(';', ''));
	var generatedCode = "\n";
	
	for (let propertie of properties){
		propertie = propertie.trim().split(" ")[0];

		if ((propertie.startsWith("self.__"))){
			generatedCode += caseEncapsulated(propertie);
		} else {
			generatedCode += caseNotEncapsulated(propertie)
		}}
	
	return generatedCode;
	}

function caseEncapsulated(attribute){
	attribute = attribute.replace("self.__","").trim() 
	let code = 
`
    @property
    def ${attribute}(self):
        return self.__${attribute}

    @${attribute}.setter
    def ${attribute}(self, new_${attribute}):
        self._name = new_${attribute}
`
	return code;
} 

function caseNotEncapsulated(attribute){
	attribute = attribute.replace("self.","").trim() 
	let code = 
`
    def get_${attribute}(self):
        return self.${attribute}

    def set_${attribute}(self, new_${attribute}):
        self.name = new_${attribute}
`
	return code;
} 

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
