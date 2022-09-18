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
  while(i <= length){
    if (entry[i].senses && !entry[i].senses[0].parts_of_speech.includes("Wikipedia definition")) {
      $(".output").append(
        `<ul id="${entry[i].japanese[0].word}" class="word"></ul>`);
      $(`#${entry[i].japanese[0].word}`).append(
        `<h4>
        Kanji: ${entry[i].japanese[0].word} — 
        Reading: ${entry[i].japanese[0].reading}</h4> <hr />`
      );
      displayDefinition(entry, i);
    } else if (length < entry.length - 1) { length++; }
    i++;
  }
}

displayDefinition = (entry, i) => {
  let wordId = entry[i].japanese[0].word;
  let length;
  (entry[i].senses.length < 3) ? length = entry[i].senses.length : length = 3;
  for (let j=0; j<length; j++) {
    $(`#${wordId}`).append(
      `<li class="definition"><em class="parts_of_speech">
      ${entry[i].senses[j].parts_of_speech.join(", ")}</em> <br />
      ${entry[i].senses[j].english_definitions.join(", ")}<hr /></li>`
    );
  }
}

validateEntry = (word, entry) => {
  if (!entry || entry.length === 0 || (entry.length === 1 && entry[0].senses[0].parts_of_speech.includes("Wikipedia definition"))) {
    $(".output").html(
      `<h5 id="error-text">No results for ${word}.</h5>`);
    return false;
  }
  return true;
}

displayEntry = (entry) => {
  clearFields();

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
    if (validateEntry(word, dictionary.data)) {
      displayEntry(dictionary.data);
    }
  });

  $(".output").on('click', '.word', function(event) {
    let kids = $(event.target).parent().children().toArray();
    kids.forEach(kid => 
      kid.classList.contains("visible") && kid.classList.contains("definition") ? 
      $(kid).removeClass("visible") : $(kid).addClass("visible"));
  });

  $("form#redirectToJisho").submit(function(event) {
    event.preventDefault();
    let word = $("#searchTerm").val();
    if (word === "") {
      window.open("https://jisho.org/", "_blank");
    } else {
      window.open(`https://jisho.org/search/${word}`, "_blank");
    }
  })
});
