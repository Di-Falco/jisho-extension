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

displayReading = (word, entry) => {
  clearFields();
  (entry.length < 2) ? length = entry.length : length = 2;
  let i = 0;
  while(i <= length){
    if(validateEntry(word, entry[i])) {
      let wordId = entry[i].japanese[0].word ? entry[i].japanese[0].word : entry[i].japanese[0].reading;
      if (!entry[i].senses[0].parts_of_speech.includes("Wikipedia definition")) {
        $(".output").append(
          `<ul id="${wordId}" class="word"></ul>`);
        $(`#${wordId}`).append(
          `<h4>
          Kanji: ${wordId} — 
          Reading: ${entry[i].japanese[0].reading}</h4> <hr />`
        );
        displayDefinition(entry[i]);
      } else if (length < entry.length - 1) { length++; }
    } else {

    }
    i++;
  }
}

displayDefinition = (entry) => {
  const wordId = entry.japanese[0].word ? entry.japanese[0].word: entry.japanese[0].reading;
  let length;
  (entry.senses.length < 3) ? length = entry.senses.length : length = 3;
  for (let j=0; j<length; j++) {
    if(!entry.senses[j].parts_of_speech.includes("Wikipedia definition"))
    $(`#${wordId}`).append(
      `<li class="definition"><span class="parts_of_speech">
      ${entry.senses[j].parts_of_speech.join(", ")} — ${entry.is_common ? "common" : "uncommon"}</span>
      <span class="jlpt">${formatJlpt(entry.jlpt)}</span><br />
      ${entry.senses[j].english_definitions.join(", ")}<hr /></li>`
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

clearFields = () => {
  $(".output").html("");
}

formatJlpt = (jlpt) => {
  let output = [];
  jlpt.forEach(level => {
    level = level.toString().split("-");
    output.push(level[1])
  });
  return output.join(", ");
}

$(document).ready(function() {
  $("form#search").submit(async function(event) {
    event.preventDefault();
    const word = $("#searchTerm").val();
    const dictionary = await makeApiCall(word);
    if (validateEntry(word, dictionary.data)) {
      displayReading(word, dictionary.data);
    }
  });

  $(".output").on('click', '.word', function(event) {
    $(event.target).parents("ul.word").children().toggleClass("visible");
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
