class Jisho {
  static async search(word) {
    try {
      const response = await fetch(`https://jisho-cors.herokuapp.com/https://jisho.org/api/v1/search/words?keyword=${word}`);
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
    
    } else {
      words = Object.values(words[4]);
      words = Object.values(words);
      words = Object.values(words[0]);
      if (words[1][0] === 'Wikipedia definition') {
        break;
      }
      $(".output").append(`<ul id="${words[0]}" class="word"></ul>`);
      $(`#${words[0]}`).append(`<h4>Kanji: ${words[0]}<br />Reading: ${words[1]}</h4>`);
    }


    let entry2 = Object.values(entry1[i]);
    let wordId = words[0];
    let length;
    (entry2[5].length < 3) ? length = entry2[5].length : length = 3;
    for (let j=0; j<length; j++) {
      let senses = Object.values(entry2[5]);

      $(`#${wordId}`).append(`<li class="definition"><em>${senses[j].parts_of_speech.join(", ")}</em> <br> ${senses[j].english_definitions.join(", ")}</li>`);
    }

    if (i === 2) {
      break;
    }
  }
}

function clearFields() {
  $(".output").html("");
}

$(document).ready(function() {
  $("form#search").submit(async function(event) {
    event.preventDefault();
    let word = $("#searchTerm").val();
    let dictionary = await makeApiCall(word);
    displayEntry(dictionary.data);
  });

  $(".output").on('click', '.word', function(event) {
    let kids = $(event.target).parent().children().toArray();
    console.log(kids);
    kids.forEach(kid => 
      kid.classList.contains("visible") && kid.classList.contains("definition") ? 
      $(kid).removeClass("visible") : $(kid).addClass("visible"));
  });
});

// chrome.contextMenus.create({
//   title: "Search Jisho.org for \"%s\"",
//   contexts: ["selection"],
//   onclick: displayEntryFromClick
// });

function displayEntryFromClick(info, tab) {
  displayEntry(info.selectionText);
}