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

displayReading = (entry) => {
  (entry.length < 2) ? length = entry.length : length = 2;
  let i = 0;
  console.log(entry);
  while(i <= length){
    
      $(".output").append(
        `<ul id="${entry[i].japanese[0].word}" class="word"></ul>`);
      $(`#${entry[i].japanese[0].word}`).append(
        `<h4>
        Kanji: ${entry[i].japanese[0].word}<br />
        Reading: ${entry[i].japanese[0].reading}</h4>`
      );

    displayDefinition(entry, i)
    i++;
  }
}

displayDefinition = (entry, i) => {
  let wordId = entry[i].japanese.word;
  let length;
  (entry[i].senses.length < 3) ? length = entry[i].senses.length : length = 3;
  for (let j=0; j<length; j++) {
    $(`#${wordId}`).append(
      `<li class="definition"><em>
      ${entry[i].senses[j].parts_of_speech.join(", ")}</em> <br>
      ${entry[i].senses[j].english_definitions.join(", ")}</li>`
    );
  }
}

displayEntry = (entry) => {
  clearFields();

  if (entry.length === 0) {
    $(".output").html(
      `<h5 id="error-text">Error: Invalid search term.</h5>`);
    return 0;
  }

  displayReading(entry);
}

clearFields = () => {
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