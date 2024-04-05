import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* html {
    background:linear-gradient(
    180deg,
    rgb(251, 237, 206) 16.87%,
    rgb(250, 250, 249) 100%
  );
    
    color: #d6d6d6;
  } */

  html {
  --bg-dark-primary: #19473f;
  --bg-lite-primary: #206b5e;
  --bg-dark-gray: #2a3231;
  --bg-lite-gray: #374b49;
  --primary-dark: #325f57;
  --primary-darker: #22413b;
  --primary-lite: #468c80;
  --accent-dark: #fcd270;
  --accent-darker: #f4c24d;
  --accent-dark-rbg: 252, 210, 112;
  --accent-lite: #ffe5a4;
  --danger: #a95940;
  --danger-lite: #b36851;
  --danger-bright: #fc9575;
  --danger-rgb: 169, 89, 64;
  --white: #ffffff;
  --white-rgb: 255, 255, 255;
  --black: #000000;
  --black-rgb: 0, 0, 0;
  --gradient: linear-gradient(
    180deg,
    rgb(251, 237, 206) 16.87%,
    rgb(250, 250, 249) 100%
  );
  background:linear-gradient(180deg, rgb(251, 237, 206) 16.87%, rgb(250, 250, 249) 100%);
  /* color: var(--white); */
  font:
    16px PlexSans,
    system-ui,
    sans-serif;
  line-height: 1.5;
}




body {
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
}

.grid-center {
  grid-area: 1 / 1 / 2 / 2;
}

.app {
  display: grid;
}
.ellipse {
  background: linear-gradient(180deg,
      rgb(246.5, 193.87, 58.54) 0%,
      rgba(232, 110, 255, 0.5) 48.44%,
      rgba(255, 255, 255, 0.5) 100%);
  border-radius: 272px/292.54px;
  filter: blur(500px);
  height: 585px;
  left: 625px;
  /* position: absolute; */
  z-index: -1;
  opacity: 1;
  top: 268px;
  transform: rotate(27.74deg);
  width: 544px;
}

.form-container {
  width: 360px;
  background-color: white;
  margin: auto;
  z-index: 1;
  box-shadow:
    0 0 20px 0 rgba(0, 0, 0, 0.2),
    0 5px 5px 0 rgba(0, 0, 0, 0.24);
  padding: 10px;
  -webkit-border-radius: 15px; //for chrome support
  border-radius: 15px;
}

.register-form {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 10px;
}

.success-message {
  font-family: "Roboto", sans-serif;
  background-color: #3f89f8;
  padding: 15px;
  color: white;
  text-align: center;
}

.form-field {
  margin: 10px 0 10px 0;
  padding: 15px;
  font-size: 16px;
  border: 0;
  font-family: "Roboto", sans-serif;
  border-radius: 15px;
}

span {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: red;
  margin-bottom: 15px;
}

input {
  background: #f2f2f2;
}

.error {
  border-style: solid;
  border: 2px solid #ffa4a4;
}

button {
  background:#7d8ee599;
border-radius: 15px;
  color: white;
  cursor: pointer;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  box-shadow:
    0 0 2px 0 rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.24);
}

button:disabled {
  cursor: default;
}

.auth-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  color: #333c3b;
}

a,
a:visited {
  color: var(--accent-dark);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
  cursor: pointer;
}

/* IBM Plex Sans */
@font-face {
  font-family: "PlexSans";
  font-style: normal;
  font-weight: 200;
  src: url(/fonts/IBMPlexSans-ExtraLight.ttf) format("truetype")
    url(/fonts/IBMPlexSans-ExtraLight.woff) format("woff");
}
@font-face {
  font-family: "PlexSans";
  font-style: normal;
  font-weight: 300;
  src: url(/fonts/IBMPlexSans-Light.ttf) format("truetype")
    url(/fonts/IBMPlexSans-Light.woff) format("woff");
}
@font-face {
  font-family: "PlexSans";
  font-style: italic;
  font-weight: 300;
  src: url(/fonts/IBMPlexSans-LightItalic.ttf) format("truetype")
    url(/fonts/IBMPlexSans-LightItalic.woff) format("woff");
}
@font-face {
  font-family: "PlexSans";
  font-style: normal;
  font-weight: 400;
  src: url(/fonts/IBMPlexSans-Regular.ttf) format("truetype")
    url(/fonts/IBMPlexSans-Regular.woff) format("woff");
}
@font-face {
  font-family: "PlexSans";
  font-style: normal;
  font-weight: 500;
  src: url(/fonts/IBMPlexSans-Medium.ttf) format("truetype")
    url(/fonts/IBMPlexSans-Medium.woff) format("woff");
}
@font-face {
  font-family: "PlexSans";
  font-style: normal;
  font-weight: 600;
  src: url(/fonts/IBMPlexSans-SemiBold.ttf) format("truetype")
    url(/fonts/IBMPlexSans-SemiBold.woff) format("woff");
}
@font-face {
  font-family: "SuperFunky";
  src: url(/fonts/SuperFunky.ttf) format("truetype");
}
@font-face {
  font-family: "PressStart2P";
  src: url(/fonts/PressStart2P.ttf) format("truetype");
}

/*! minireset.css v0.0.6 | MIT License | github.com/jgthms/minireset.css */
html,
body,
p,
ol,
ul,
li,
dl,
dt,
dd,
blockquote,
figure,
fieldset,
legend,
textarea,
pre,
iframe,
hr,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 100%;
  font-weight: normal;
}
ul {
  list-style: none;
}
button,
input,
select {
  margin: 0;
}
html {
  box-sizing: border-box;
}
*,
*::before,
*::after {
  box-sizing: inherit;
}
img,
video {
  height: auto;
  max-width: 100%;
}
iframe {
  border: 0;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
td,
th {
  padding: 0;
}

form {
  margin: 0;
  padding: 0;
}

img {
  -webkit-touch-callout: none;
  user-select: none;
  user-drag: none;
}

/*
 * Source: https://loading.io/css/
 * Usage:
 * <div className="loaderWrapper">
 *  <div className="loader">
 *     <div></div>
 *     <div></div>
 *  </div>
 * <div/>
 */

.loaderWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.loader > div {
  position: absolute;
  border: 4px solid var(--accent-dark);
  opacity: 1;
  border-radius: 50%;
  animation: ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.loader > div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
`;
