import App from "./App.vue";
import './App.theme1.scss'
import './App.theme2.scss'
import './App.theme3.scss'
export const ReEnWordRecognitionPopup = {
  id: "ReEnWordRecognitionPopup",
  title: "",
  icon: "",
  component: App,
};

const plugin = {
  slides: "slides",
  popups: "popups",
};
export default plugin;
