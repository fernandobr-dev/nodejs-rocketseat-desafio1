const express = require('express');

const server = express();
server.use(express.json());

const projects = [];

var contadorReq = 0;

// middleware global
server.use((req, res, next) => {
  contadorReq++;
  console.log(`O total de requisicoes ate o momento e = ${contadorReq}`);
  return next();
});

// middleware verifica ID do projeto
function checkIfProjectExists(req, res, next) {
  

  projects.forEach(project => {
    const { idParam } = req.params;
    if(project.id == idParam) {
        next();
    }  
  });
  
  res.status(400).json({error: "Project does not exists, set a valid ID"});
}


server.post('/projects', (req, res) => {
  const {id, title, tasks} = req.body;

  projects.push({ id, title, tasks});

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  
  return res.json(projects);
});


server.put('/projects/:id', checkIfProjectExists, (req, res) => {

  projects.forEach(project => {
    const {id} = req.params;
    if(project.id === id) {
      const { title } = req.body;
      project.title = title;
      return res.json(project);
    }  
  });

});

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {

  projects.forEach(function(project, index) {
    const {id} = req.params;
    if(project.id === id) {
      projects.splice(index, 1);  
      return res.json(projects);
    }  
  });
}); 

server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  projects.forEach(project => {
    const {id} = req.params;
    if(project.id === id) {
      const {title} = req.body;
      project.tasks.push(title);
      return res.json(project);
    }  
  });
});

// server.get('/', (req, res) => {
//   res.send('Hello My Challenge');
// });

server.listen(2999);


