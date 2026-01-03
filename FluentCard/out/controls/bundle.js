/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./CardComponent.tsx"
/*!***************************!*\
  !*** ./CardComponent.tsx ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FluentCardComponent: () => (/* binding */ FluentCardComponent)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fluentui/react-components */ \"@fluentui/react-components\");\n/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__);\n\n\nvar useStyles = (0,_fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.makeStyles)({\n  card: {\n    width: \"100%\",\n    height: \"100%\"\n  },\n  cardSmall: {\n    maxWidth: \"200px\"\n  },\n  cardMedium: {\n    maxWidth: \"300px\"\n  },\n  cardLarge: {\n    maxWidth: \"400px\"\n  },\n  horizontalCard: {\n    display: \"flex\",\n    flexDirection: \"row\"\n  },\n  preview: {\n    backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.tokens.colorNeutralBackground3\n  },\n  previewImage: {\n    width: \"100%\",\n    height: \"auto\",\n    objectFit: \"cover\"\n  },\n  horizontalPreview: {\n    width: \"120px\",\n    minWidth: \"120px\"\n  }\n});\nvar FluentCardComponent = props => {\n  var {\n    title,\n    subtitle,\n    imageUrl,\n    size,\n    orientation,\n    selectable,\n    selected,\n    onSelect,\n    onClick\n  } = props;\n  var styles = useStyles();\n  var handleClick = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {\n    onClick();\n    if (selectable) {\n      onSelect(!selected);\n    }\n  }, [onClick, selectable, selected, onSelect]);\n  // Determine size class\n  var sizeClass = size === \"small\" ? styles.cardSmall : size === \"large\" ? styles.cardLarge : styles.cardMedium;\n  var cardClassName = \"\".concat(styles.card, \" \").concat(sizeClass, \" \").concat(orientation === \"horizontal\" ? styles.horizontalCard : \"\");\n  var previewClassName = \"\".concat(styles.preview, \" \").concat(orientation === \"horizontal\" ? styles.horizontalPreview : \"\");\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.FluentProvider, {\n    theme: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.webLightTheme,\n    style: {\n      background: \"transparent\",\n      width: \"100%\",\n      height: \"100%\"\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.Card, {\n    className: cardClassName,\n    selected: selectable ? selected : undefined,\n    onSelectionChange: selectable ? (_, data) => onSelect(data.selected) : undefined,\n    onClick: handleClick\n  }, imageUrl && (/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.CardPreview, {\n    className: previewClassName\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"img\", {\n    src: imageUrl,\n    alt: title,\n    className: styles.previewImage\n  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.CardHeader, {\n    header: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.Text, {\n      weight: \"semibold\"\n    }, title),\n    description: subtitle ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.Text, {\n      size: 200\n    }, subtitle) : undefined\n  })));\n};\n\n//# sourceURL=webpack://pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad/./CardComponent.tsx?\n}");

/***/ },

/***/ "./index.ts"
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FluentCard: () => (/* binding */ FluentCard)\n/* harmony export */ });\n/* harmony import */ var _CardComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CardComponent */ \"./CardComponent.tsx\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nclass FluentCard {\n  constructor() {\n    this.selected = false;\n    this.clicked = false;\n    this.handleSelect = newSelected => {\n      this.selected = newSelected;\n      this.notifyOutputChanged();\n    };\n    this.handleClick = () => {\n      this.clicked = !this.clicked;\n      this.notifyOutputChanged();\n    };\n    // Empty\n  }\n  init(context, notifyOutputChanged, state) {\n    this.notifyOutputChanged = notifyOutputChanged;\n  }\n  parseSize(sizeStr) {\n    var size = sizeStr === null || sizeStr === void 0 ? void 0 : sizeStr.toLowerCase();\n    if (size === \"small\" || size === \"large\") {\n      return size;\n    }\n    return \"medium\";\n  }\n  parseOrientation(orientationStr) {\n    var orientation = orientationStr === null || orientationStr === void 0 ? void 0 : orientationStr.toLowerCase();\n    if (orientation === \"horizontal\") {\n      return orientation;\n    }\n    return \"vertical\";\n  }\n  updateView(context) {\n    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;\n    var title = (_b = (_a = context.parameters.Title) === null || _a === void 0 ? void 0 : _a.raw) !== null && _b !== void 0 ? _b : \"Card Title\";\n    var subtitle = (_d = (_c = context.parameters.Subtitle) === null || _c === void 0 ? void 0 : _c.raw) !== null && _d !== void 0 ? _d : undefined;\n    var imageUrl = (_f = (_e = context.parameters.ImageUrl) === null || _e === void 0 ? void 0 : _e.raw) !== null && _f !== void 0 ? _f : undefined;\n    var size = this.parseSize((_g = context.parameters.Size) === null || _g === void 0 ? void 0 : _g.raw);\n    var orientation = this.parseOrientation((_h = context.parameters.Orientation) === null || _h === void 0 ? void 0 : _h.raw);\n    var selectable = (_k = (_j = context.parameters.Selectable) === null || _j === void 0 ? void 0 : _j.raw) !== null && _k !== void 0 ? _k : false;\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_CardComponent__WEBPACK_IMPORTED_MODULE_0__.FluentCardComponent, {\n      title: title,\n      subtitle: subtitle,\n      imageUrl: imageUrl,\n      size: size,\n      orientation: orientation,\n      selectable: selectable,\n      selected: this.selected,\n      onSelect: this.handleSelect,\n      onClick: this.handleClick\n    });\n  }\n  getOutputs() {\n    return {\n      Selected: this.selected,\n      Clicked: this.clicked\n    };\n  }\n  destroy() {\n    // Cleanup\n  }\n}\n\n//# sourceURL=webpack://pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad/./index.ts?\n}");

/***/ },

/***/ "@fluentui/react-components"
/*!************************************!*\
  !*** external "FluentUIReactv940" ***!
  \************************************/
(module) {

module.exports = FluentUIReactv940;

/***/ },

/***/ "react"
/*!***************************!*\
  !*** external "Reactv16" ***!
  \***************************/
(module) {

module.exports = Reactv16;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.ts");
/******/ 	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = __webpack_exports__;
/******/ 	
/******/ })()
;
if (window.ComponentFramework && window.ComponentFramework.registerControl) {
	ComponentFramework.registerControl('FluentCard.FluentCard', pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.FluentCard);
} else {
	var FluentCard = FluentCard || {};
	FluentCard.FluentCard = pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.FluentCard;
	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = undefined;
}