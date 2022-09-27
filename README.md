# Jisho Chrome Extension

#### by Anthony DiFalco

### Using the extension

Text input sends a GET request to the unofficial jisho.org API.

Displays the top 3 results for the search term. Entry data includes kanji, reading in hiragana, parts of speech, definition, and includes which levels of the Japanese Language Proficiency Test the word appears in, if any.

If an invalid word is entered, or no results return from the API, a simple error message will appear in place of any definitions.

A link at the bottom of the extension redirects to the jisho.org page for the given word, or to the homepage if no word is entered.

_NOTE: the first search usually takes a moment owing to the current CORS workaround I have implemented. ごめんなさい。_

Some goals:
* _ONGOING:_ improve the formatting and entry info
* allow users to translate words directly on the page
* include a reading translated from hiragana / katakana to their hepburn counterparts

More information regarding Jisho and its sources can be found at https://jisho.org/about

### Release Notes

* 1.0 — First published version
* 1.1 — Add hover effects on dictionary entries
