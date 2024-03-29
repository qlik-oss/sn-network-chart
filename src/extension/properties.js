/**
 * @type {object}
 * @extends {GenericObjectProperties}
 * @entry
 */
const properties = {
  /**
   * Current version of this generic object definition
   * @type {string}
   */
  version: process.env.PACKAGE_VERSION,
  /**
   * Extends `HyperCubeDef`, see Engine API: `HyperCubeDef`.
   * @extends {EngineAPI.HyperCubeDef}
   */
  qHyperCubeDef: {
    qDimensions: [],
    qMeasures: [],
    qInitialDataFetch: [
      {
        qWidth: 7,
        qHeight: 1400,
      },
    ],
  },
  /**
   * @type {boolean=}
   */
  showTitles: false,
  /**
   * @type {string=}
   */
  title: "",
  /**
   * @type {string=}
   */
  subtitle: "",
  /**
   * @type {string=}
   */
  footnote: "",
  /**
   * @type {('dynamic'|'continuous'|'discrete'|'diagonalCross'|'straightCross'|'horizontal'|'vertical'|'curvedCW'|'curvedCCW'|'cubicBezier')=}
   */
  edgeType: "dynamic",
  /**
   * @type {boolean=}
   */
  displayEdgeLabel: false,
  /**
   * @type {('top'|'middle'|'bottom'|'horizontal')=}
   */
  posEdgeLabel: "top",
  /**
   * @type {('dot'|'square'|'star'|'triangle'|'triangleDown'|'diamond')=}
   */
  nodeShape: "dot",
  /**
   * @type {boolean=}
   */
  shadowMode: false,
};

export default properties;
