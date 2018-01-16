Tools required:

- **Google Chrome**
- **MetaMask** google chrome extention
- **Node.js** >= 7.0
- **testrpc** npm package installed globally

Installation:

Install **testrpc** package globally:
```
npm i -g testrpc
```

Install project dependencies:
```
cd todo-list

npm install
```

To run local privat network run command in your terminal:
```
testrpc
```

To spin up local server and open up the app run:
```
npm run server
```

You can also open app by just opening index.html in your browser. 
This way MetaMask chrome extention isn't gonna be able to access your application.
So the app is going to use **testrpc** network running locally on your machine by default.
