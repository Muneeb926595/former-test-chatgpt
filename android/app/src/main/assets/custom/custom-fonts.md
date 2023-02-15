# Instructions for adding new fonts:

* Find a font in `TTF` or `OTF` format that you like and put it in `./assets/fonts/`.
* Now run `npx react-native link`.
* If `npx react-native link` doesn't work then use `npx react-native-asset`.
* note ios and android refs font family differently. see below as example

```
const CUSTOM_FONT_TEXT: TextStyle = {
  fontFamily: Platform.select({
    ios: "Test", // The font family name
    android: "Test-font", // The file name
  })....
}
```
