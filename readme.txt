  backend/package.json 
  
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "npm run clean && tsc",
    "start": "node dist/app.js",
    "clean": "rimraf dist",
    "clean:frontend": "rimraf dist/frontend",
    "prestart": "npm run build"
  },

npm install --save-dev eslint @eslint/js typescript typescript-eslint
  