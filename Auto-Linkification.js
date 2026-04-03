function autoLinkification(text) {
  // Spliting the text
  const words = text.split(" ");

  // checking each word
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // then checking the external link
    if (word.startsWith("http://") || word.startsWith("https://")) {
      words[i] = `<a href="${word}" target="_blank">${word}</a>`;
      continue;
    }

    // then checking if its a WikiLink
    if (isWikiLink(word)) {
      words[i] = `<a href="/article/${word}">${word}</a>`;
    }
  }
  return words.join(" ");
}

function isWikiLink(word) {
  // empty words !== WikiLinks
  if (word.length === 0) {
    return false;
  }

  // WikiLinks MUST start with a capital letter from alphabet
  if (word[0] < "A" || word[0] > "Z") {
    return false;
  }

  // counting how many capital and lowercase letter we got
  let capitals = 0;
  let lowercase = 0;

  for (const character of word) {
    if (character >= "A" && character <= "Z") {
      capitals++;
    }
    if (character >= "a" && character <= "z") {
      lowercase++;
    }
  }

  return capitals >= 2 && lowercase >= 1;
}

module.exports = { autoLinkification };
