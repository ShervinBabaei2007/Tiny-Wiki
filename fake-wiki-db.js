let pages = {
  init: {
    code_name: "init",
    name: "init",
    versions: [
      {
        versionId: Math.random().toString().slice(2),
        contents: "This is a simple initial page to prove that pages work",
        timestamp: Date.now(),
      },
    ],
  },

  banana: {
    code_name: "banana",
    name: "banana",
    versions: [
      {
        versionId: Math.random().toString().slice(2),
        contents: "Bananas are yellow fruits, rich in vitimins",
        timestamp: Date.now(),
      },
    ],
  },

  kabob: {
    code_name: "kabob",
    name: "kabob",
    versions: [
      {
        versionId: Math.random().toString().slice(2),
        contents: "Kabob are delicous meat",
        timestamp: Date.now(),
      },
    ],
  },

  strawberry: {
    code_name: "strawberry",
    name: "strawberry",
    versions: [
      {
        versionId: Math.random().toString().slice(2),
        contents: "Strawberry are sweet and great.",
        timestamp: Date.now(),
      },
    ],
  },
};

// ? Me tring to understand this later on: --> possibly useful for 75% to 100% grade.
// ? useful if create/edit/delete/anything else don't work properly

function debug_db() {
  // This function might be useful to call from index.js for debugging
  console.log(JSON.stringify(pages, null, 2));
}

function article_getByEncodedName(code_name) {
  const article = pages[code_name] || pages[encodeURIComponent(code_name)];

  if (!article) {
    return null;
  }

  const latestVersion = article.versions[article.versions.length - 1];
  return {
    code_name: article.code_name,
    name: article.name,
    contents: latestVersion.contents,
  };
}

// ? Me trying to understand --> Creates new page and stores it here in this fake db and is used by POST method...

function article_create(name, contents) {
  if (pages[name]) {
    throw new Error("page already exists");
  }

  // ? Here it encodes the code_name so it can be used in the URI componet of name
  let code_name = encodeURIComponent(name);
  const versionId = Math.random().toString().slice(2);

  pages[code_name] = {
    code_name,
    name,
    versions: [
      {
        versionId: versionId,
        contents: contents,
        timestamp: Date.now(),
      },
    ],
  };
  return pages[code_name];
}

// ? Me trying to understand --> Deletes a page from fake db using its encoded name (code_name)
// ? Used by a POST method

function article_deleteByEncodedName(code_name) {
  if (pages[code_name]) {
    delete pages[code_name];
  } else {
    throw new Error("page does not exist");
  }
}

// ? Me trying to understand --> updates the contents of an exisitng page.
// ? Used By POST method

function article_editByEncodedName(code_name, contents) {
  if (pages[code_name]) {
    const versionId = Math.random().toString().slice(2);

    // Add new version to the versions array
    pages[code_name].versions.push({
      versionId: versionId,
      contents: contents,
      timestamp: Date.now(),
    });

    return pages[code_name];
  } else {
    throw new Error("page does not exist");
  }
}

// ? Me trying to understand --> searches page(s) by checking if ALL search terms appear in page contents and also search.
// ? Used by GET method

function article_searchByTerms(searchterms) {
  let results = Object.values(pages);
  for (let term of searchterms) {
    if (term.length > 0) {
      results = results.filter((article) => {
        // Search in the latest version's contents
        const latestVersion = article.versions[article.versions.length - 1];
        return latestVersion.contents.toLowerCase().includes(term.toLowerCase());
      });
    }
  }
  // Return results with the latest version contents for display
  return results.map((article) => {
    const latestVersion = article.versions[article.versions.length - 1];
    return {
      code_name: article.code_name,
      name: article.name,
      contents: latestVersion.contents,
    };
  });
}

function article_getRandoms(n) {
  let results_index_set = new Set();
  let pages_array = Object.values(pages);
  while (results_index_set.size < Math.min(n, pages_array.length)) {
    results_index_set.add(Math.floor(Math.random() * pages_array.length));
  }
  // Return with latest version contents
  return Array.from(results_index_set).map((i) => {
    const article = pages_array[i];
    const latestVersion = article.versions[article.versions.length - 1];
    return {
      code_name: article.code_name,
      name: article.name,
      contents: latestVersion.contents,
    };
  });
}

// New function added: getting all verison of article history
function article_getAllVersions(code_name) {
  const article = pages[code_name] || pages[encodeURIComponent(code_name)];

  if (!article) {
    return null;
  }

  return {
    name: article.name,
    versions: article.versions,
  };
}

// New function added: get specific version of the history
function article_getSpecificVersion(code_name, versionId) {
  const article = pages[code_name] || pages[encodeURIComponent(code_name)];

  if (!article) {
    return null;
  }

  const version = article.versions.find((v) => v.versionId === versionId);

  if (!version) {
    return null;
  }

  return {
    name: article.name,
    contents: version.contents,
    versionId: version.versionId,
    timestamp: version.timestamp,
  };
}

module.exports = {
  article_getByEncodedName,
  article_create,
  article_deleteByEncodedName,
  article_editByEncodedName,
  article_searchByTerms,
  article_getRandoms,
  article_getAllVersions,
  article_getSpecificVersion,
  debug_db,
};
