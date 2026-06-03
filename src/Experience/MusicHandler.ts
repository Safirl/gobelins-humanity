import { EventEmitter } from "@plugins/base-experience";
import Analyser from "../sounds/Analyzer.js";
import AnalyzerDebug from "../sounds/AnalyzerDebug.js"

export default class MusicHandler extends EventEmitter {
  declare public audio: Analyser;
  declare private audioElem: HTMLAudioElement
  constructor() {
    super();
    this.audio = new Analyser();
    this.audio.onAudio
    new AnalyzerDebug( this.audio )
  }
}
