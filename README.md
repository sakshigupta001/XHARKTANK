# XHARKTANK

## Overview
One stop destination for all budding entrepreneur and investors.Entrepreneur can pitch their ideas and investor can make a counter offer if they like their pitch and idea.

## Product Flows
These are the mandatory product flows that are expected while building the backend for the XharkTank application

1. Entrepreneurs will post Pitch by providing these inputs
* Name of the entrepreneur posting the pitch
* Title of the pitch
* Business Idea for the Product they wish to develop
* Ask Expected Amount for investment
* Percentage of Equity to be diluted

2. Investors will view all the latest pitches posted to date
* If the entrepreneurs post a new pitch, that should also get listed. 

3. Investors will make a counteroffer to the pitch by providing these inputs
* Unique Id of the Pitch made by the entrepreneur
* Name of the investor making a counteroffer
* Amount ready to invest in the idea
* Ask Percentage of Equity for a company

## API Reference
#### Post a new pitch: /pitches(post request)
#### Post a counter offer for a particular pitch: /pitches/:id/makeoffer
#### Get all pitches: /pitches
#### Get a particular pitch: /pitches/:id

## Prerequisites
Node.js 14, npm, MongoDB 4.2

## Run locally
* Fork and Clone the project
```bash
    $ git clone <project-link>
```
* Go to the project directory
```bash
    cd <project directory>
```
* Install dependencies using
```bash
    npm install express
    npm install mongoose
    npm install cors
    npm install body-parser
```
* Run server
```bash
    npm start
```