import { App, Notice, normalizePath, requestUrl } from 'obsidian';
import { PersonDetails } from '../types';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/h632';

export async function downloadProfileImage(
	app: App,
	person: PersonDetails,
	imageFolder: string,
): Promise<string> {
	if (!person.profile_path) {
		new Notice(`No profile image available for ${person.name}`);
		return '';
	}

	const folder = resolveImageFolder(app, imageFolder);
	const filename = `${person.name.replace(/\s+/g, '-')}-${person.id}.jpg`;
	const imagePath = normalizePath(folder ? `${folder}/${filename}` : filename);

	if (app.vault.getAbstractFileByPath(imagePath)) {
		new Notice('Profile image already exists, skipping download');
		return imagePath;
	}

	try {
		if (folder) {
			await app.vault.createFolder(folder).catch(() => {
				// Folder may already exist — ignore
			});
		}
		const response = await requestUrl({
			url: `${IMAGE_BASE}${person.profile_path}`,
		});
		await app.vault.adapter.writeBinary(imagePath, response.arrayBuffer);
		return imagePath;
	} catch {
		new Notice(`Could not download profile image for ${person.name}`);
		return '';
	}
}

function resolveImageFolder(app: App, imageFolder: string): string {
	const trimmed = imageFolder.trim();
	if (trimmed) return trimmed;
	const configured = (
		app.vault as unknown as { getConfig(key: string): string }
	).getConfig('attachmentFolderPath');
	// Relative paths (e.g. "./") mean "same folder as note" — treat as vault root
	return configured && !configured.startsWith('.') ? configured : '';
}
