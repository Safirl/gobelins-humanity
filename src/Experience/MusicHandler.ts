import { EventEmitter } from "@plugins/base-experience";
//@ts-ignore
import Analyser from "../sounds/Analyzer.js";
//@ts-ignore
import AnalyzerDebug from "../sounds/AnalyzerDebug.js";

export default class MusicHandler {
  declare public audio: Analyser;
  constructor() {
    this.audio = new Analyser("live");
    new AnalyzerDebug(this.audio);
  }
}
