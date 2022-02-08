
const express = require('express'); //Import the express dependency
const Behance = require('behance-node');
const http = require('http');
const path = require('path'), fs = require('fs');

const app = express();              //Instantiate an express app, the main work horse of this server
const port = 3000;                  //Save the port number where your server will be listening

app.get('/', (req, res) => {        //get requests to the root ("/") will route here
  res.sendFile('index.html', { root: __dirname });      //server responds by sending the index.html file to the client's browser

  Behance.user('henriquefelixm', true)
    .then((result) => {
      const projects = result.profile.activeSection.work.projects;
      var dirname = path.dirname("projects");
      if (!fs.existsSync(dirname)) {
        mkdirp(dirname);
      }

      projects.map((project) => {
        Behance.project(`${project.id}/${project.name}`)
          .then((result) => {
            fs.writeFile(`projects/${project.slug}.json`, JSON.stringify(project), (err) => {
              if (err) {
                throw err;
              }
              console.log("JSON data is saved.");
            });
          })
          .catch(error => console.log(error));
      });
    })
    .catch(error => console.log(error));
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`);
});

http.get('http://fxdev.pt:3010', (resp) => {
  console.log("Dados atualizados com sucesso");
}).on("error", (err) => {
  console.log("Error: " + err.message);
});