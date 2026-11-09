import { render } from "preact";
import { App, initialLanguage, loadChinese } from "./app";

const lang = initialLanguage();
// Chinese readers wait for the translation chunk so the first paint is already in Chinese.
const preloaded = lang === "zh" ? await loadChinese() : null;
render(<App lang={lang} preloaded={preloaded} />, document.getElementById("app")!);
