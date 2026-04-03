const express = require("express");
const app = express();
const port = 8000;
const db = require("./fake-wiki-db");
const { autoLinkification } = require("./Auto-Linkification");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Page
app.get("/", (req, res) => {
  const randomArticles = db.article_getRandoms(5);
  res.render("index", { articles: randomArticles });
});

// Searching...
app.get("/search", (req, res) => {
  const SearchTerm = req.query.SearchTerm;
  const results = db.article_searchByTerms([SearchTerm]);
  res.render("searchResults", { results: results, SearchTerm: SearchTerm });
});

// Article - View, Create, Edit, Delete, History

// View Article
app.get("/article/:articlename", (req, res) => {
  const code_name = req.params.articlename;
  const page = db.article_getByEncodedName(code_name);

  // doesn't exist -->  redirect --> new article.
  if (!page) {
    return res.redirect(`/newarticle?title=${code_name}`);
  }

  res.render("article", {
    title: page.name,
    content: autoLinkification(page.contents),
    encodedName: encodeURIComponent(page.name),
  });
});

// New Article - Form
app.get("/newarticle", (req, res) => {
  const prefillTitle = req.query.title ? decodeURIComponent(req.query.title) : "";
  res.render("newArticle", { prefillTitle: prefillTitle });
});

// New Article - Create
app.post("/newarticle", (req, res) => {
  const { title, content } = req.body;

  // checking for any empty titles
  if (!title || title.trim() === "") {
    return res.status(400).send("Article titlte cannot be empty!");
  }

  // Checking for any empty content
  if (!content || content.trim() === "") {
    return res.status(400).send("Article content cannot be empty!");
  }

  const existingArticle = db.article_getByEncodedName(title);
  if (existingArticle) {
    return res.status(400).send("An article already exists with that title!");
  }

  const horribleCharacters = ["/", "\\", "<", ">", ":", '"', "|", "?", "*", "%"];
  if (horribleCharacters.some((character) => title.includes(character))) {
    return res
      .status(400)
      .send(`Title may not contain these characters: ${horribleCharacters.join(" ")}`);
  }

  try {
    db.article_create(title, content);
    res.redirect(`/article/${encodeURIComponent(title)}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Edit Article - Form
app.get("/article/:articlename/edit", (req, res) => {
  const code_name = req.params.articlename;
  const page = db.article_getByEncodedName(code_name);

  if (!page) {
    return res.status(404).send("Article does not exist!");
  }

  res.render("editArticle", {
    title: page.name,
    content: page.contents,
    encodedName: encodeURIComponent(page.name),
  });
});

// Edit Article - Update
app.post("/article/:articlename/edit", (req, res) => {
  const code_name = req.params.articlename;
  const page = db.article_getByEncodedName(code_name);

  if (!page) {
    return res.status(404).send("Article does not exist!");
  }

  const newContent = req.body.content;

  // checking for any empty content
  if (!newContent || newContent.trim() === "") {
    return res.status(400).send("Article content cannot be empty!");
  }

  try {
    db.article_editByEncodedName(code_name, newContent);
    res.redirect(`/article/${encodeURIComponent(page.name)}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete Article - Confirmation
app.get("/article/:articlename/delete", (req, res) => {
  const code_name = req.params.articlename;
  const page = db.article_getByEncodedName(code_name);

  if (!page) {
    return res.status(404).send("Article not found!");
  }

  res.render("deleteArticle", {
    title: page.name,
    encodedName: encodeURIComponent(page.name),
  });
});

// Delete Article - Execute
app.post("/article/:articlename/delete", (req, res) => {
  const code_name = req.params.articlename;

  try {
    db.article_deleteByEncodedName(code_name);
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// History - Lists all the history
app.get("/article/:articlename/history", (req, res) => {
  const code_name = req.params.articlename;
  const articleData = db.article_getAllVersions(code_name);

  // No articleData --> return status 404.
  if (!articleData) {
    return res.status(404).send("Article Not Found!");
  }

  res.render("history", {
    title: articleData.name,
    versions: articleData.versions,
    encodedName: encodeURIComponent(articleData.name),
  });
});

// History - viewing specific version
app.get("/article/:articlename/history/:versionid", (req, res) => {
  const code_name = req.params.articlename;
  const versionId = req.params.versionid;

  const versionData = db.article_getSpecificVersion(code_name, versionId);

  // No VersionData --> return status 404.
  if (!versionData) {
    return res.status(404).send("Version not found");
  }

  res.render("articleVersion", {
    title: versionData.name,
    content: autoLinkification(versionData.contents),
    encodedName: encodeURIComponent(versionData.name),
    versionId: versionData.versionId,
    timestamp: versionData.timestamp,
  });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
