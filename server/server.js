import express from "express";
import fs from "fs/promises";
import cors from "cors";
import {
  join
} from "path";

import __dirname from './__dirname.js';

const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

const categoriesPath = "data/categories.json";
const skillsPath = "data/skills.json";
const topicsPath = "data/topics.json";
const activitiesPatch = "data/activities.json";

app.use(cors());
app.use(express.json());
app.use("/", express.static(join(__dirname, 'public', 'browser')));

// Json Data uitlezen en teruggeven
// https://nodejs.org/api/fs.html#promise-example
// https://www.w3schools.com/nodejs/nodejs_filesystem.asp
async function readJsonData(path) {
  let data;
  try {
    data = await fs.readFile(path, 'utf8');
    if (!data) return [];
  } catch (ex) {
    console.log("Error reading file: " + ex);
    return [];
  }
  return JSON.parse(data);
}

// Data in Json wegschrijven
async function writeJsonData(path, data) {
  try {
    const dataAsString = JSON.stringify(data);
    await fs.writeFile(path, dataAsString, 'utf8');
  } catch (ex) {
    console.log("Error appending to file: " + ex);
  }
};

// Get all Categories
app.get('/api/categories', async (req, res) => {
  res.json(await readJsonData(categoriesPath));
});

// Post new Category
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
app.post('/api/categories', async (req, res) => {
  const newCategory = req.body;
  let categories = await readJsonData(categoriesPath);
  let highestId = Math.max(...categories.map(c => c.id));

  // Math.max geeft -Infinity terug bij een lege array
  if (highestId == -Infinity) {
    newCategory.id = 1;
  } else {
    newCategory.id = highestId + 1;
  }

  categories.push(newCategory);
  await writeJsonData(categoriesPath, categories);
  res.status(201).json(newCategory);
});

// Put Category
app.put('/api/categories/:id', async (req, res) => {
  const updatedCategory = req.body;
  let categories = await readJsonData(categoriesPath);
  let index = categories.findIndex(c => c.id == req.params.id);

  if (index == -1) {
    res.status(404).send("id was not found");
  } else {
    categories[index].name = updatedCategory.name;
    categories[index].description = updatedCategory.description;

    await writeJsonData(categoriesPath, categories);
    res.status(200).json(categories[index]);
  }
});

// Delete Category on Cascade (alle skills, topics en notes verwijderen)
app.delete('/api/categories/:id', async (req, res) => {
  const categories = await readJsonData(categoriesPath);
  let skills = await readJsonData(skillsPath);
  let topics = await readJsonData(topicsPath);
  let activities = await readJsonData(activitiesPatch);

  const index = categories.findIndex(c => c.id == req.params.id);

  if (index == -1) {
    res.status(404).send("id was not found");
  } else {

    // skill id's ophalen voor de skills die verwijderd moeten worden
    const skillIds = skills
      .filter(skill => skill.categoryId == req.params.id)
      .map(skill => skill.id);

    // Skills die verwijderd moeten worden uitfilteren  
    skills = skills.filter(skill => skill.categoryId != req.params.id);

    // Als een topic niet een bepaalde skillId heeft, hou ik hem bij dus worden de te verwijderde topics niet teruggegeven
    topics = topics.filter(topic => !skillIds.includes(topic.skillId));

    // hetzelfde als bij de topics want elke activity heeft een skillId
    activities = activities.filter(activity => !skillIds.includes(activity.skillId));

    //juist maar even in comments
    categories.splice(index, 1);
    await writeJsonData(categoriesPath, categories);
    await writeJsonData(skillsPath, skills);
    await writeJsonData(topicsPath, topics);
    await writeJsonData(activitiesPatch, activities);
    res.status(200).end();
  }
});

app.listen(port, () => {
  console.log(`Node-express server is listening on port ${port}`);
});