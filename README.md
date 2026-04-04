# 📖 Jiki (Tiny-Wiki)

**Jiki** is a lightweight, multi-page wiki application. I built this to explore how to manage inter-connected content and version tracking without a traditional database.

---

### 🚀 What it does

* **WikiWord Linkification:** Automatically detects "WikiWords" in the text and converts them into clickable internal links to other pages.
* **Version Tracking:** Keeps a history of changes so you can see how a page has evolved over time.
* **Flat-File Storage:** Uses a simple file-based data store, making the app fast and easy to deploy.
* **Dynamic Rendering:** Uses EJS to transform raw data into a clean, readable user interface.

---

### 🛠️ Tech Stack

* **Backend:** Node.js & Express.js
* **Frontend:** EJS & CSS
* **Language:** JavaScript

---

### 🧠 What I learned

The biggest challenge here was the **linkification logic**. I had to write custom code (using Regular Expressions) to scan the user's input and decide which words should become links without breaking the rest of the HTML. 

I also learned a lot about **data persistence**. Since I wasn't using a database, I had to build my own system for saving files and tracking versions, which taught me a lot about how information is actually stored and retrieved "under the hood".

---

## ⚖️ License

This project is for portfolio viewing purposes only. Copying, reusing, or submitting any part of this code is not permitted without explicit permission.
