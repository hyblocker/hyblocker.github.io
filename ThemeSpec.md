# Theme specification

This is a document which outlines the JSON format this theme builder expects.

## General structure

A theme is defined by the following properties:

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| manifest | yes | A list of properties regarding the theme. Used to generate the manifests for Powercord and Better Discord. |
| file | yes | The name of the file which will contain the generated CSS for Powercord themes. |
| splash | no | A raw link to the CSS of the splash file. Only used with Powercord. |
| requiredImports | no | `@import`s which are required for the theme to work properly. |
| requiredCSS | no | The CSS which is required for the theme to work. Generally this is either your theme or an `@import` which imports your entire theme. |