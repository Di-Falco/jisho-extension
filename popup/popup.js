const jishoAPI = "";
const apiVersion = "";
const apiKey = ``;

class Jisho {
  static async search(word) {
    try {
      const response = await fetch(`https://cors-anywhere.herokuapp.com/https://jisho.org/api/v1/search/words?keyword=${word}`);
      if(!response.ok) {
        throw Error(response.statusText);
      }
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch(error) {
      return error.message;
    }
  }
}

async function makeApiCall(word) {
  const dictionary = await Jisho.search(word);
  return dictionary;
}

function displayEntry(entry) {
  clearFields();

  if (entry.length === 0) {
    $(".output").html(`<h5 id="error-text">Error: Invalid search term.</h5>`);
    return 0;
  }

  let entry1 = entry;
  for(let i=0; i<entry.length; i++){
    let words = Object.values(entry1[i]);

    if (Object.values(words[4][0]).length < 2) {
      words = Object.values(words[4][0]);

      $(".output").append(`<h4>Japanese: Reading: ${Object.values(words)}</h4>`);
      $(".output").append(`<ul>`);
    
    } else {
      words = Object.values(words[4]);
      words = Object.values(words);
      words = Object.values(words[0]);
      if (words[1][0] === 'Wikipedia definition') {
        return 0;
      }
      $(".output").append(`<br /><h4>Kanji: ${words[0]}<br />Reading: ${words[1]}</h4>`);
      $(".output").append(`<ul>`);
    }

    let entry2 = Object.values(entry1[i]);
    let length;
    (entry2[5].length < 5) ? length = entry2[5].length : length = 5;
    for (let j=0; j<length; j++) {
      let senses = Object.values(entry2[5]);

      $(".output").append(`<li>${senses[j].parts_of_speech.join(", ")} <br>Definition: ${senses[j].english_definitions.join(", ")}</li>`);
    }

    if (i === 2) {
      break;
    }
  }
  $(".output").append("</ul>");
}

function clearFields() {
  $(".output").html("");
}

$(document).ready(function() {
  $(".search").click(async function() {
    let word = $("#word").val();
    let dictionary = await makeApiCall(word);
    displayEntry(dictionary.data);
  })
});

chrome.contextMenus.create({
  title: "Search Jisho.org for \"%s\"",
  contexts: ["selection"],
  onclick: displayEntryFromClick
});

function displayEntryFromClick(info, tab) {
  displayEntry(info.selectionText);
}