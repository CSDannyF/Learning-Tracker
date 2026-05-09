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

// Update Category
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
    res.status(404).send("Category id was not found");
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

// Get all Skills from a Category
app.get('/api/categories/:id/skills', async (req, res) => {
  let skills = await readJsonData(skillsPath);

  skills = skills.filter(skill => skill.categoryId == req.params.id);
  res.json(skills);
});

// Post new Skill
app.post('/api/categories/:id/skills', async (req, res) => {
  let newSkill = req.body;

  if (!newSkill.name || !newSkill.description) {
    res.status(400).send("Not all fields are here");
  } else {
    const categories = await readJsonData(categoriesPath);
    const skills = await readJsonData(skillsPath);

    const index = categories.findIndex(c => c.id == req.params.id);
    let highestId = Math.max(...skills.map(s => s.id));


    if (index == -1) {
      res.status(404).send("Category id was not found");
    } else {
      if (highestId == -Infinity) {
        newSkill.id = 1;
      } else {
        newSkill.id = highestId + 1;
      }

      newSkill.categoryId = parseInt(req.params.id);
      skills.push(newSkill);

      await writeJsonData(skillsPath, skills);
    }
    res.status(201).json(newSkill);
  }
});

// Update Skill
app.put('/api/skills/:id', async (req, res) => {
  const skills = await readJsonData(skillsPath);
  const updatedSkill = req.body;

  let index = skills.findIndex(skill => skill.id == req.params.id)

  if (index == -1) {
    res.status(404).send("Skill id was not found");
  } else {
    skills[index].name = updatedSkill.name;
    skills[index].description = updatedSkill.description;
    await writeJsonData(skillsPath, skills);
    res.status(200).json(skills[index]);
  }
});

// Delete Skill (Cascade)
app.delete('/api/skills/:id', async (req, res) => {
  let skills = await readJsonData(skillsPath);
  let topics = await readJsonData(topicsPath);
  let activities = await readJsonData(activitiesPatch);
  const skillId = parseInt(req.params.id);
  const index = skills.findIndex(skill => skill.id == skillId);

  if (index == -1) {
    res.status(404).send("Skill id not found");
  } else {
    // Bijhorende topics verwijderen
    topics = topics.filter(topic => topic.skillId != skillId);
    skills.splice(index, 1);

    // bijhorende activities verwijderen
    activities = activities.filter(activity => activity.skillId != skillId);

    await writeJsonData(skillsPath, skills);
    await writeJsonData(topicsPath, topics);
    await writeJsonData(activitiesPatch, activities);
    res.status(200).end();
  }
});

// Post add note to skill
app.post('/api/skills/:id/notes', async (req, res) => {
  let skills = await readJsonData(skillsPath);
  const skillId = parseInt(req.params.id);
  const index = skills.findIndex(skill => skill.id == skillId);
  let highestId;

  if (index == -1) {
    res.status(404).send("Skill id not found");
  } else {

    if (skills[index].notes) {
      highestId = Math.max(...skills[index].notes.map(n => n.id));
    }

    const newNote = req.body;

    if (highestId == -Infinity) {
      newNote.id = 1;
    } else {
      newNote.id = highestId + 1;
    }
    newNote.date = new Date();
    skills[index].notes.push(newNote);
    await writeJsonData(skillsPath, skills);
    res.status(201).send(newNote);
  }
});

// Delete note from skill
app.delete('/api/skills/:id/notes/:noteId', async (req, res) => {
  let skills = await readJsonData(skillsPath);
  const skillId = parseInt(req.params.id);
  const noteId = parseInt(req.params.noteId);
  const skillIndex = skills.findIndex(skill => skill.id == skillId);

  console.log(skillId)
  console.log(skillIndex)

  if (skillIndex == -1) {
    res.status(404).send("Skill id not found");
  } else {
    const noteIndex = skills[skillIndex].notes.findIndex(note => note.id === noteId);
    if (noteIndex == -1) {
      res.status(404).send("Note id not found");
    } else {
      skills[skillIndex].notes.splice(noteIndex, 1);
      await writeJsonData(skillsPath, skills);
      res.status(200).end();
    }
  }
});

// Get all topics
app.get('/api/skills/:id/topics', async (req, res) => {
  let topics = await readJsonData(topicsPath);
  const skillId = parseInt(req.params.id);

  topics = topics.filter(topic => topic.skillId === skillId);
  res.status(200).send(topics);
})

// Post new Topic
app.post('/api/skills/:id/topics', async (req, res) => {
  let newTopic = req.body;
  if (!newTopic.name) {
    res.status(400).send("Provide a name")
  } else {
    let skills = await readJsonData(skillsPath);
    const skillId = parseInt(req.params.id);
    const index = skills.findIndex(skill => skill.id == skillId);

    if (index == -1) {
      res.status(404).send("Skill id was not found")
    } else {
      let topics = await readJsonData(topicsPath);
      let highestId = Math.max(...topics.map(t => t.id));

      if (highestId == -Infinity) {
        newTopic.id = 1;
      } else {
        newTopic.id = highestId + 1;
      }
      newTopic.skillId = skillId;
      newTopic.status = 'not-started';
      newTopic.notes = [];
      topics.push(newTopic);
      await writeJsonData(topicsPath, topics);
      res.status(201).send(newTopic);
    }
  }
})

// Update Topic by id
app.put('/api/topics/:id', async (req, res) => {
  let topics = await readJsonData(topicsPath);
  const updatedTopic = req.body;
  const topicId = parseInt(req.params.id);
  const topicIndex = topics.findIndex(topic => topic.id === topicId);

  if (topicIndex == -1) {
    res.status(404).send("Topic id not found");
  } else {
    topics[topicIndex].name = updatedTopic.name;
    topics[topicIndex].status = updatedTopic.status;
    topics[topicIndex].startDate = updatedTopic.startDate;

    await writeJsonData(topicsPath, topics);
    res.status(200).json(updatedTopic);
  }
});

// Delete Topic By id
app.delete('/api/topics/:id', async (req, res) => {
  let topics = await readJsonData(topicsPath);
  let activities = await readJsonData(activitiesPatch);
  const topicId = parseInt(req.params.id);
  const topicIndex = topics.findIndex(topic => topic.id === topicId);

  if (topicIndex === -1) {
    res.status(404).send("Topic id was not found");
  } else {
    topics.splice(topicIndex, 1);

    // bijhorende activities verwijderen
    activities = activities.filter(activity => activity.topicId != topicId);

    await writeJsonData(topicsPath, topics);
    await writeJsonData(activitiesPatch, activities);
    res.status(200).end();
  }
});

// Post Note to topic
app.post('/api/topics/:id/notes', async (req, res) => {
  let topics = await readJsonData(topicsPath);
  const topicId = parseInt(req.params.id);
  const topicIndex = topics.findIndex(topic => topic.id === topicId);
  let highestId = 0;

  if (topicIndex == -1) {
    res.status(404).send("Topic id not found");
  } else {

    if (topics[topicIndex].notes) {
      highestId = Math.max(...topics[topicIndex].notes.map(t => t.id));
    }

    const newNote = req.body;

    if (highestId == -Infinity) {
      newNote.id = 1;
    } else {
      newNote.id = highestId + 1;
    }
    newNote.date = new Date();
    topics[topicIndex].notes.push(newNote);
    await writeJsonData(topicsPath, topics);
    res.status(201).send(newNote);
  }
});

// Delete Note in Topic by id
app.delete('/api/topics/:id/notes/:noteId', async (req, res) => {
  let topics = await readJsonData(topicsPath);
  const topicId = parseInt(req.params.id);
  const noteId = parseInt(req.params.noteId);
  const topicIndex = topics.findIndex(topic => topic.id === topicId);

  if (topicIndex == -1) {
    res.status(404).send("Topic id not found");
  } else {
    const noteIndex = topics[topicIndex].notes.findIndex(note => note.id === noteId);

    if (noteIndex == -1) {
      res.status(404).send("Note id not found");
    } else {
      topics[topicIndex].notes.splice(noteIndex, 1);

      await writeJsonData(topicsPath, topics);
      res.status(200).end();
    }
  }
});

// Get all Activities
app.get('/api/activities', async (req, res) => {
  const activities = await readJsonData(activitiesPatch);
  res.status(200).json(activities);
})

// Post new Activity
app.post('/api/activities', async (req, res) => {
  let newActivity = req.body;
  let activities = await readJsonData(activitiesPatch);
  let highestId = Math.max(...activities.map(a => a.id));

  if (highestId == -Infinity) {
    newActivity.id = 1;
  } else {
    newActivity.id = highestId + 1;
  }

  newActivity.date = new Date();

  activities.push(newActivity);
  await writeJsonData(activitiesPatch, activities);
  res.status(201).json(newActivity);
});

app.listen(port, () => {
  console.log(`Node-express server is listening on port ${port}`);
});