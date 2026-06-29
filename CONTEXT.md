# Domain Glossary

## Person
A performing individual (on-screen actor or voice actor) searchable via the TMDb `/person` endpoint. Internally the domain concept is **Person**, not "Actor", to leave room for directors and other crew members in future versions without a breaking rename. Users see "actor" in the UI.

## Person Note
A Markdown file created in the vault to represent a Person. Lives in the configured **Notes Folder**. Named `{Person.name}.md`. Populated from a user-supplied **Template File**.

## Template File
A Markdown file in the user's vault that contains **Template Variables**. The plugin reads this file and substitutes variables with TMDb data before writing the Person Note.

## Template Variable
A `{{placeholder}}` token inside the Template File that the plugin replaces with a Person field value at note-creation time. Defined variables: `{{name}}`, `{{birthday}}`, `{{deathday}}`, `{{placeOfBirth}}`, `{{gender}}`, `{{profileImageUrl}}`, `{{tmdbUrl}}`, `{{biography}}`, `{{date}}`, `{{industry}}` (blank — user fills manually), `{{localProfileImagePath}}` (vault-relative path to downloaded profile image, or empty string if download is disabled or unavailable).

## Notes Folder
The vault folder where Person Notes are saved. Configurable in plugin settings. Default: `People/`.

## TMDb
The Movie Database (themoviedb.org). The sole external data source for v1. Accessed via the official REST API using a user-supplied API key.

## Film Artist Search Modal
The Obsidian `SuggestModal` presented when any command is triggered. User types a name; results come from TMDb's `/search/person` endpoint.

## Create film artist note command
Plugin command (`create-film-artist-note`) that opens the Film Artist Search Modal, lets the user select a Person, then creates a Person Note in the Notes Folder from the Template File. Aborts with a Notice if the note already exists. Also triggers profile image download when enabled.

## Insert film artist metadata command
Plugin command (`insert-film-artist-metadata`) that opens the Film Artist Search Modal and renders the Template File into the currently active note, replacing its entire content. Requires an active Markdown view. Also triggers profile image download when enabled.

## Insert film artist link command
Plugin command (`insert-film-artist-link`) that opens the Film Artist Search Modal and inserts a `[[Person.name]]` wikilink at the cursor in the active editor. Does not render the template; does not trigger image download.

## Profile Image Download
An optional feature that downloads the Person's TMDb profile image to the vault at note-creation time. Controlled by a toggle in plugin settings. When enabled, fetches the `h632` size from TMDb and saves it as `{person.name}-{person.id}.jpg` in the **Image Folder**. If the file already exists, the download is skipped and a Notice is shown. If the Person has no profile image, `{{localProfileImagePath}}` emits an empty string and a Notice is shown. Applies to the Create film artist note and Insert film artist metadata commands only.

## Image Folder
The vault folder where downloaded profile images are saved. Configurable in plugin settings. When left empty, defaults to the attachment folder configured in Obsidian's own settings. Always a vault-relative path.
