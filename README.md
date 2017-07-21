# How to configure this tool

- run yarn (or npm) install.
`yarn install`
- run yarn (or npm run) build with an API_ENDPOINT declared. 
`API_ENDPOINT=https://requestb.in/1i6nyah1 yarn build`
- open chrome extensiones and check the "developer mode"
- load the extension folder into chrome
- go to the target page where you want to extract content
- click the extract icon

## Development flow

- if you want to make changes, run `API_ENDPOINT=https://requestb.in/1i6nyah1 yarn watch-dev`
so changes done to code are watched and compiled immediatly. 
- you have to reload the extension by clicking the "reload" link in the extension
list (the place where you loaded the extension in the first place) and the refresh
the pages on which you want to run the extension.
