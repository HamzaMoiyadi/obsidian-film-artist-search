# Film Artist Search

An [Obsidian](https://obsidian.md) plugin that lets you search for actors and performers on [TMDb](https://www.themoviedb.org) and bring their data directly into your vault — either as a full note or as a quick wikilink.

---

## Features

### Create actor note

Opens a search palette, searches TMDb as you type, and creates a structured Markdown note for the person you select. The note is placed in your configured folder and opened immediately. If a note with that name already exists, the plugin skips creation and notifies you.

### Insert actor link

Opens the same search palette but inserts a `[[Name]]` wikilink at the cursor position in the active editor. Useful for quickly linking to a person while writing without leaving your current document.

> **Note:** This command only appears in the command palette when the active note is in edit mode (not reading/preview mode).

### Insert film artist metadata

Opens the search palette pre-populated with the active note's title. On selection, fetches full person details from TMDb, renders your configured template, and replaces the entire note content with the result.

> **Note:** This command only appears in the command palette when the active note is in edit mode (not reading/preview mode).

> **Warning:** This command replaces the entire content of the current note. If no template file is configured, the built-in default template is used. Make sure you have the right note open before running it.

---

## Requirements

- Obsidian 1.4.10 or later
- A free TMDb API key (v3) — get one at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

---

## Installation

### Community plugins (recommended)

1. Open **Settings → Community plugins** and disable Safe mode if prompted.
2. Select **Browse** and search for **Film Artist Search**.
3. Select **Install**, then **Enable**.

### Manual install

1. Download `main.js`, `manifest.json`, and `styles.css` (if present) from the [latest release](https://github.com/hamzamoiyadi/obsidian-film-artist-search/releases/latest).
2. Copy them to `<Vault>/.obsidian/plugins/obsidian-film-artist-search/`.
3. Reload Obsidian and enable the plugin under **Settings → Community plugins**.

---

## Setup

1. Go to **Settings → Secret storage** and add a new secret containing your TMDb v3 API key.
2. Go to **Settings → Film Artist Search**.
3. Under **TMDb API key**, select the secret you just added from the dropdown.
4. Optionally set a **notes folder** and a **template file** (see [Customization](#customization) below).

---

## Usage

### Create a note

Open the command palette (`Ctrl/Cmd + P`) and run **Film Artist Search: Create film artist note**.

1. Type a name in the search box — results appear as you type.
2. Select a person from the list.
3. The plugin fetches their full details from TMDb and creates a note at `<notes folder>/<Name>.md`.

### Insert a wikilink

Place your cursor where you want the link, then run **Film Artist Search: Insert film artist link**.

1. Search and select a person the same way.
2. `[[Name]]` is inserted at the cursor.

### Insert film artist metadata into the current note

Open a note in edit mode, then run **Film Artist Search: Insert film artist metadata**.

1. The search box opens pre-filled with the note's title — results load immediately.
2. Select a person to confirm.
3. The plugin fetches their full details from TMDb and replaces the entire note content with your rendered template.

> **Tip:** If the command is missing from the palette, switch the note from reading mode to edit mode first.

---

## Customization

All settings are in **Settings → Film Artist Search**.

| Setting | Default | Description |
|---|---|---|
| **TMDb API key** | _(empty)_ | Required. Select the secret that holds your TMDb v3 API key (added via **Settings → Secret storage**). Never sent anywhere except TMDb. |
| **New file location** | `People/` | Vault folder where new actor notes are created. Supports autocomplete. |
| **Template file** | _(empty)_ | Vault-relative path to a Markdown template. If empty, a built-in default template with YAML frontmatter is used. Supports autocomplete. |

### Template variables

When a template file is set, the plugin renders it by replacing `{{variable}}` placeholders with data fetched from TMDb.

| Variable | Example value | Description |
|---|---|---|
| `{{name}}` | `Cate Blanchett` | Full name |
| `{{birthday}}` | `1969-05-14` | Date of birth (ISO format), or blank |
| `{{deathday}}` | _(blank)_ | Date of death (ISO format), or blank |
| `{{placeOfBirth}}` | `Melbourne, Australia` | Birthplace, or blank |
| `{{gender}}` | `1` | `0` = not set, `1` = female, `2` = male, `3` = non-binary |
| `{{profileImageUrl}}` | `https://image.tmdb.org/t/p/w185/…` | Direct URL to the TMDb profile photo (185 px wide), or blank |
| `{{tmdbUrl}}` | `https://www.themoviedb.org/person/112` | Link to the person's TMDb page |
| `{{biography}}` | `Born in…` | TMDb biography text, or blank |
| `{{date}}` | `2026-06-28` | Today's date in ISO format, set at note creation time |
| `{{industry}}` | _(blank)_ | Reserved for future use; always blank in v1 |

**Example template** (`Templates/Actor.md`):

```markdown
---
name: "{{name}}"
born: "{{birthday}}"
birthplace: "{{placeOfBirth}}"
tmdb: "{{tmdbUrl}}"
---

![{{name}}]({{profileImageUrl}})

## {{name}}

- Born: {{birthday}} in {{placeOfBirth}}
- TMDb: {{tmdbUrl}}
```

Any `{{variable}}` that has no value is replaced with an empty string.

---

## Privacy & network usage

- All network requests go directly to `api.themoviedb.org` using Obsidian's built-in `requestUrl` (works on mobile too).
- No data is collected or transmitted to any other service.
- Your API key is stored in Obsidian's built-in Secret storage, not in the plugin's own data files.

---

## Contributing

Issues and pull requests are welcome. Run `npm install` then `npm run dev` to start the watch build.

---

## License

[MIT](LICENSE)
