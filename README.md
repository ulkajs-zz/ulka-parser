<p align="center">
    <img src="https://i.imgur.com/X1aElpL.png" alt="logo">
</p>
<p align="center">
<a href="https://www.npmjs.com/package/ulka-parser"><img alt="NPM" src="https://img.shields.io/npm/v/ulka-parser?&labelColor=black&color=darkred&logo=npm&label=npm" /></a>&nbsp;
<a href="https://github.com/ulkajs/ulka-parser"><img alt="MIT" src="https://img.shields.io/npm/l/ulka-parser?color=darkgreen&labelColor=black&&logo=github" /></a>&nbsp;
<a href="#"><img alt="CI" src="https://github.com/ulkajs/ulka-parser/workflows/Node.js%20CI/badge.svg"></a>
</p>

<p align="center">
   Ulka Praser is a templating engine made for ulkajs.
</p>

## 🚀 Usage

### ClI
```bash
npx ulka-parser --t /path/to/template/folder/or/file --o /path/to/output/folder

# OR

npm install -g ulka-parser
ulka-parser --t /path/to/template/folder/or/file --o /path/to/output/folder
```

### Javascript Api
```bash
npm i ulka-parser
```

```js
const { compile } = require('ulka-parser')

const template = `Hello, I am {% name %}`

compile(template, { name: "Roshan Acharya" }).then(console.log)
// Hello, I am Roshan Acharya
```


## Template Guide
You can write nodejs code inside `{%  %}` in ulka template.

index.ulka
```html
{% const name = "Roshan Acharya".toUpperCase() %}

<h1>Hello, I am {% name %}</h1>
```

index.html
```html
<h1>ROSHAN ACHARYA</h1>
```

### Variables

index.ulka
```js
{% const name = "I Love Javascript" %}

{% name %}
```
index.html
```html
I Love Javascript
```

### Loops

index.ulka
```html
{% 
    const languages = [
        { name: "javascript", short: "js" },
        { name: "typescript", short: "ts" },
    ];
%}

<div>
    {% 
        data.map(lang => {
            return `<h1>I Love ${lang.name} (${lang.short}).</h1>`
        })
    %}
</div>
```

index.html
```html
<div>
    <h1>I Love javascript (js)</h1>
    <h1>I Love typescript (ts)</h1>
</div>
```

### Conditionals

index.ulka
```js
{% const iAmWinner = true %}

{% iAmWinner ? "I am Winner": "I am loser" %}
```

index.html
```
I am Winner
```

### Import NPM modules

```js
{%  const dayjs = require('dayjs') %}

{% dayjs().format() %}
```

## Ulka parser with express

```js
const express = require('express');
const { engine } = require('ulka-parser')

const app = express();

app.engine('ulka', engine({ logError: true }));
app.set('views', './views'); 
app.set('view engine', 'ulka'); 

app.get('/', (req, res) => {
    res.render('index', { name: "Roshan Acharya" })
})

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```