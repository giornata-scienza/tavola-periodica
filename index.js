const express = require('express')

let { PythonShell } = require('python-shell')

const wiki = require('wikijs').default

let capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1)

let getElementData = string => {
  let data = 'Nessun informazione rilevante'

  const options = {
    mode: 'text',
    pythonPath: 'python',
    pythonOptions: ['-u'],
    args: ['-e', string]
  }
  
  PythonShell.run('wiki-parser.py', options, (err, results) => {
    if (err)
      wiki({ apiUrl: 'https://it.wikipedia.org/w/api.php' }).page(string)
        .then(page => { data = page.info() })
    else
      data = results
  })

  return data
}

const port = 1234

const publicElements = require('./public/elements.json'),
  publicStaff = require('./public/elementsStaff.json'),
  countries = require('./countries.json'),
  names = require('./names.json')

var app = express()
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.render('index', { elements: publicElements })
})

app.get('/android', (req, res) => {
  let newPubicElements = publicElements
  
  let index = newPubicElements.indexOf("Altro")
  if (index > -1) newPubicElements.splice(index, 1)

  res.render('indexAndroid', { elements: newPubicElements })
})

app.get('/:id', (req, res) => {
  let element

  publicElements.forEach(ele => {
    if (ele.name === capitalizeFirstLetter(req.params.id))
      element = ele
  })

  if (element)
    res.render('element', {
      element,
      countries,
      getCountry: countryCode => names[countryCode],
      wikipediaInfo: getElementData(capitalizeFirstLetter(req.params.id))
    })
  else
    res.redirect('/')
})

app.listen(port, () => {
    console.log(`Server running on localhost:${port}...`)
})
