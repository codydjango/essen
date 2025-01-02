import {App} from "./App.js";


const app = new App();

if (typeof window !== 'undefined') {
    window.app = app;
}

app.start();