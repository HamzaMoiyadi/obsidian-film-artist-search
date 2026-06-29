const FM_FENCE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function parseRawLines(yaml: string): Map<string, string> {
	const map = new Map<string, string>();
	for (const line of yaml.split('\n')) {
		const m = line.match(/^([\w-]+):\s*([\s\S]*)/);
		if (m && m[1] && m[2] !== undefined) map.set(m[1], m[2].trim());
	}
	return map;
}

/**
 * Merge a freshly-rendered note into an existing note:
 * - Frontmatter: existing non-empty values win; missing/empty fields get the
 *   new value.
 * - Body: existing body is kept when non-empty; otherwise the new body is used.
 *
 * If the existing content has no frontmatter the new content is returned
 * unchanged.
 */
export function mergeIntoExistingNote(
	existingContent: string,
	newContent: string,
): string {
	const newMatch = FM_FENCE.exec(newContent);
	if (!newMatch) return newContent;

	const newYaml = newMatch[1] ?? '';
	const newBody = (newMatch[2] ?? '').trim();

	const existingMatch = FM_FENCE.exec(existingContent);
	const existingLines = existingMatch
		? parseRawLines(existingMatch[1] ?? '')
		: new Map<string, string>();
	const existingBody = existingMatch
		? (existingMatch[2] ?? '').trim()
		: existingContent.trim();

	const mergedYaml = newYaml
		.split('\n')
		.map((line) => {
			const m = line.match(/^([\w-]+):/);
			if (!m || !m[1]) return line;
			const key = m[1];
			const existingRaw = existingLines.get(key);
			if (existingRaw !== undefined && existingRaw !== '' && existingRaw !== '""' && existingRaw !== "''") {
				return `${key}: ${existingRaw}`;
			}
			return line;
		})
		.join('\n');

	const body = existingBody || newBody;
	return `---\n${mergedYaml}\n---\n\n${body}`;
}
