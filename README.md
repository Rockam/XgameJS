# XgameJS
------
JavaScript framework similar to XNA to develop simple 2D games on HTML5

## Motivation
XNA is a framework with a managed runtime environment provided by Microsoft that facilitates video game development, but was discontinued in 2013.
This little project tries to adapt a part of XNA to JavaScript, using some classes similar to XNA and extending the framework with other classes that help on the 2D game development, like _Sprite_, _Camera_, _Circle_, etc.

## Execution flow
The main entry point is the **_Program_** class, which instances the **_Game_** class, in charge of running and maintaining the game loop.

![alt text](https://github.com/Rockam/XgameJS/blob/master/execution_flow.jpg "Execution flow")

## How to use it
You can simply pick the [src/JS/XNA_Classes/Game.js](https://github.com/Rockam/XgameJS/blob/master/src/JS/XNA_Classes/Game.js) class, copy it wherever you want, and modify it in order to develop your own game. Then create an HTML file with a canvas and reference all the classes you use in there.

The **simple way to know how to use it** is watching the demos already done (located at [_src/HTML_](https://github.com/Rockam/XgameJS/tree/master/src/HTML)) and inspecting them.
The main demo is a classic **_Rayman_** style level that I've made with XgameJS, hope you enjoy it :D

![alt text](https://github.com/Rockam/XgameJS/blob/master/Rayman_screenshot.png "Rayman demo")

##Disclaimer
I don't own the rights of any _Rayman_ images or sounds used in this project. 
You are free to use XgameJS on your own projects and extend the functionality.
