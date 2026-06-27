# Domain Glossary

## Person
A performing individual (on-screen actor or voice actor) searchable via the TMDb `/person` endpoint. Internally the domain concept is **Person**, not "Actor", to leave room for directors and other crew members in future versions without a breaking rename. Users see "actor" in the UI.

## Person Note
A Markdown file created in the vault to represent a Person. Lives in the configured **Notes Folder**. Named `{Person.name}.md`. Populated from a user-supplied **Template File**.

## Template File
A Markdown file in the user's vault that contains **Template Variables**. The plugin reads this file and substitutes variables with TMDb data before writing the Person Note.

## Template Variable
A `{{placeholder}}` token inside the Template File that the plugin replaces with a Person field value at note-creation time. Defined variables for v1: `{{name}}`, `{{birthday}}`, `{{deathday}}`, `{{place_of_birth}}`, `{{gender}}`, `{{profile_image_url}}`, `{{industry}}` (blank — user fills manually).

## Notes Folder
The vault folder where Person Notes are saved. Configurable in plugin settings. Default: `People/`.

## TMDb
The Movie Database (themoviedb.org). The sole external data source for v1. Accessed via the official REST API using a user-supplied API key.

## Actor Search Modal
The Obsidian `SuggestModal` presented when either command is triggered. User types a name; results come from TMDb's `/search/person` endpoint. Planned to become a rich custom modal in v2.

## Create Person Note command
Plugin command that opens the Actor Search Modal, lets the user select a Person, then creates a Person Note in the Notes Folder. Aborts with a notice if the note already exists.

## Insert Actor Link command
Plugin command that opens the Actor Search Modal, lets the user select a Person, then inserts a wikilink `[[Person.name]]` at the cursor in the active editor.
