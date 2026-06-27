import { AbstractInputSuggest, App, TFile } from 'obsidian';

export class FileSuggest extends AbstractInputSuggest<TFile> {
	private onSelect: (value: string) => void;

	constructor(app: App, inputEl: HTMLInputElement, onSelect: (value: string) => void) {
		super(app, inputEl);
		this.onSelect = onSelect;
	}

	getSuggestions(query: string): TFile[] {
		const lower = query.toLowerCase();
		return this.app.vault
			.getAllLoadedFiles()
			.filter(
				(f): f is TFile =>
					f instanceof TFile &&
					f.extension === 'md' &&
					f.path.toLowerCase().includes(lower),
			);
	}

	renderSuggestion(file: TFile, el: HTMLElement): void {
		el.setText(file.path);
	}

	selectSuggestion(file: TFile): void {
		this.setValue(file.path);
		this.onSelect(file.path);
		this.close();
	}
}
