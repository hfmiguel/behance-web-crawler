
const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const Behance = require('behance-node');
const http = require('http');
const path = require('path'), fs = require('fs');
const router = express.Router();

const port = 3000;                  //Save the port number where your server will be listening

router.get('/', (req, res) => {        //get requests to the root ("/") will route here
  res.sendFile(
    path.join(__dirname + '/src/pages/index.html')
  );
});

router.get('/behance', async (req, res) => {        //get requests to the root ("/") will route here

  if (!req.query.user) {
    res.send("No user name provided");
  }

  res.setHeader('Content-Type', 'application/json');

  const projects = await behanceCrawler(req.query.user);
  res.json(projects);
});

console.log('Running at Port 3000');

app.use('/', router);
app.use(express.static(__dirname + '/src/public'));  /* for css and js */

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`);
});


/**
 * @param {*} array
 * @return {*} 
 * @description extract the array content from the object array
 * @example {
 * [{}, {}],
 * [{}],
 * [{}, {}, {}],
 * } 
 */
function extractArrayFromObjectArray(array) {
  const obj = {}
  array.forEach((item, index) => item.forEach(({ indice, name }) => { obj[indice] = { indice: indice, value: name } }));
  return Object.values(obj)
}

/**
 * @param {*} array
 * @return {*} object array
 * @description Filter unique array itens on object array
 * @example {
 * [{}, {}],
 * [{}],
 * [{}, {}, {}],
 * } 
 */
const filterUniqueObjectsIndices = (array) => {
  const convertedArray = extractArrayFromObjectArray(array);
  return convertedArray.map(JSON.stringify).reverse() // convert to JSON string the array content, then reverse it (to check from end to begining)
    .filter(function (item, index, arr) { return arr.indexOf(item, index + 1) === -1; }) // check if there is any occurence of the item in whole array
    .reverse().map(JSON.parse)
}

const behanceCrawler = async (userName) => {

  const projects = await Behance.user(userName, true)
    .then((result) => {
      return result.profile.activeSection.work.projects;
    });

  const projectsCategories = projects.map((project, index) => {

    project.categories = project.fields.map((category) => {
      return {
        indice: category.slug,
        name: category.name
      }
    });

    return project.fields.map((category) => {
      return {
        indice: category.slug,
        name: category.name
      }
    });


  });

  return {
    projects: projects,
    categories: filterUniqueObjectsIndices(projectsCategories),
    originalCategories: projectsCategories
  };
}