/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "d349e44eed43fbafdb0c";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks)
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/start.js","modules","vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/plugin/emoji/summernote-ext-emoji-ajax.css":
/*!**********************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/plugin/emoji/summernote-ext-emoji-ajax.css ***!
  \**********************************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ".note-ext-emoji-list {\r\n\t/* width: 185px; */\r\n\theight: 200px;\r\n\toverflow: auto;\r\n\tpadding-left: 5px;\r\n}\r\n\r\n.note-ext-emoji-list button {\r\n    margin-top: 5px;\r\n    margin-right: 5px;\r\n    padding: 0px;\r\n}\r\n\r\n.note-ext-emoji-list .note-emoji-btn img {\r\n    width: 20px;\r\n}\r\n\r\nimg.emoji-img-inline {\r\n    display: inline-block;\r\n    margin-top:-0.3em;\r\n    height: 1.2em;\r\n    width: auto;\r\n}\r\n\r\n.note-ext-emoji-search {\r\n\tmargin-right: 5px;\r\n    margin-left: 5px;\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.note-emoji-tabs-btn img,\r\n.note-emoji-tabs-btn div {\r\n    cursor: pointer;\r\n    opacity: 0.7;\r\n    width: 20px;\r\n    font-style: italic;\r\n}\r\n\r\n.note-emoji-tabs-btn img:hover,\r\n.note-emoji-tabs-btn div:hover {\r\n    opacity: 1;\r\n}\r\n\r\n.selected-emoji-type img,\r\n.selected-emoji-type div {\r\n    color: #337ab7;\r\n    opacity: 1;\r\n}\r\n\r\n.note-emoji-tabs-btn {\r\n    padding: 4px;\r\n}\r\n", ""]);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/plugin/formatting/summernote-list-styles.css":
/*!************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/plugin/formatting/summernote-list-styles.css ***!
  \************************************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ".note-toolbar .note-para .dropdown-toggle.list-styles {\r\n\twidth: 20px;\r\n\tpadding-left: 5px;\r\n}\r\n.note-toolbar .dropdown-list-styles {\r\n\t/* padding: .5rem 0 !important; */\r\n\tmin-width: 12em !important;\r\n}\r\n.dropdown-list-styles > li {\r\n\tmargin-top: 0px;\r\n\tmargin-bottom: 0px;\r\n}\r\n.dropdown-list-styles > li > div > ol {\r\n\tmargin-top: 0px;\r\n\tmargin-bottom: 0px;\r\n}\r\n.dropdown-list-styles > li:hover {\r\n\tcursor:pointer;\r\n\tbackground-color:#cccccc;\r\n}\r\n.dropdown-list-styles > li > div i {\r\n\tdisplay:none;\r\n}\r\n.dropdown-list-styles > li > div.checked i {\r\n\tdisplay:inline;\r\n\tcolor: #17aa1c;\r\n}", ""]);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/plugin/misc/summernote-ext-table.css":
/*!****************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/plugin/misc/summernote-ext-table.css ***!
  \****************************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Imports
var getUrl = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
var ___CSS_LOADER_URL___0___ = getUrl(__webpack_require__(/*! ./font/summernote-ext-table.eot */ "./src/plugin/misc/font/summernote-ext-table.eot"));
var ___CSS_LOADER_URL___1___ = getUrl(__webpack_require__(/*! ./font/summernote-ext-table.eot */ "./src/plugin/misc/font/summernote-ext-table.eot") + "?#iefix");
var ___CSS_LOADER_URL___2___ = getUrl(__webpack_require__(/*! ./font/summernote-ext-table.woff2 */ "./src/plugin/misc/font/summernote-ext-table.woff2"));
var ___CSS_LOADER_URL___3___ = getUrl(__webpack_require__(/*! ./font/summernote-ext-table.woff */ "./src/plugin/misc/font/summernote-ext-table.woff"));
var ___CSS_LOADER_URL___4___ = getUrl(__webpack_require__(/*! ./font/summernote-ext-table.ttf */ "./src/plugin/misc/font/summernote-ext-table.ttf"));
// Module
exports.push([module.i, "@font-face {\r\n    font-family: \"summernoteexttable\";\r\n    font-style: normal;\r\n    font-weight: 400;\r\n    font-display: auto;\r\n    src: url(" + ___CSS_LOADER_URL___0___ + ");\r\n    src: url(" + ___CSS_LOADER_URL___1___ + ") format(\"embedded-opentype\"), url(" + ___CSS_LOADER_URL___2___ + ") format(\"woff2\"), url(" + ___CSS_LOADER_URL___3___ + ") format(\"woff\"), url(" + ___CSS_LOADER_URL___4___ + ") format(\"truetype\")\r\n}\r\n\r\n.note-icon-table-merge:before {\r\n    font-family: summernoteexttable;\r\n    content: \"\\ea91\"\r\n}\r\n\r\n.note-icon-table-cell-split:before {\r\n    font-family: summernoteexttable;\r\n    content: \"\\ea94\"\r\n}\r\n\r\n.note-icon-table-margin:before {\r\n    font-family: summernoteexttable;\r\n    content: \"\\ea95\"\r\n}\r\n\r\n.note-icon-table-width-height-reset:before {\r\n    content: \"\\ea28\"\r\n}\r\n\r\n.jtable-cell-split-dropdown-toggle {\r\n    /* width: 20px; */\r\n    padding-left: 5px;\r\n}\r\n\r\n.jtable-cell-split-dropdown {\r\n    /* width: 36px; */\r\n    min-width: auto !important;\r\n}\r\n\r\n.jtable-cell-split-button-group {\r\n    margin: 0px !important;\r\n}\r\n\r\n.jtable-add-del-row-col-dropdown {\r\n    width: 145px;\r\n    min-width: auto !important;\r\n}\r\n\r\n.jtable-add-row-col-button-group {\r\n    margin: 0px !important;\r\n}\r\n\r\n.jtable-del-row-col-button-group {\r\n    margin: 3px 0px 0px 0px !important;\r\n}\r\n\r\n.jtable-align-dropdown {\r\n    width: 142px;\r\n    min-width: auto !important;\r\n}\r\n\r\n.jtable-horizontal-align-button-group {\r\n    margin: 0px !important;\r\n}\r\n\r\n.jtable-vertical-align-button-group {\r\n    margin: 3px 0px 0px 0px !important;\r\n}\r\n\r\n.jtable-vertical-align-btn-top {\r\n    padding-top: 1px !important;\r\n    padding-bottom: 9px !important;\r\n}\r\n\r\n.jtable-vertical-align-btn-middle {\r\n}\r\n\r\n.jtable-vertical-align-btn-bottom {\r\n    padding-top: 9px !important;\r\n    padding-bottom: 1px !important;\r\n}\r\n.jtable-vertical-align-btn-baseline {\r\n    padding-top: 1px !important;\r\n    padding-bottom: 9px !important;\r\n}\r\n\r\n.jtable-merge-label {\r\n    float: left;\r\n    padding-left: 0px;\r\n    width: 60px;\r\n}\r\n\r\n.jtable-merge-input {\r\n    width: 100px;\r\n    display: inline-block;\r\n}\r\n\r\n.jtable-merge-hint-span {\r\n    font-size: 13px;\r\n    padding-left: 5px;\r\n}\r\n\r\n.jtable-merge-row-info-div {\r\n    padding-top: 10px;\r\n}\r\n\r\n.jtable-merge-btn {\r\n    /*background: #5a5a5a;*/\r\n}\r\n\r\n.vl {\r\n    display: none;\r\n    position: absolute;\r\n    border-left: 3px dashed #bcbcbc;\r\n    cursor: col-resize;\r\n    z-index: 1;\r\n}\r\n\r\n.hl {\r\n    display: none;\r\n    position: absolute;\r\n    border-top: 3px dashed #bcbcbc;\r\n    cursor: row-resize;\r\n    z-index: 1;\r\n}\r\n\r\n.jtable-block {\r\n    display: none;\r\n    position: absolute;\r\n    border: 1px dashed #bcbcbc;\r\n    box-sizing: border-box;\r\n    background-color: rgba(167, 163, 255, 0.5);\r\n    z-index: 1;\r\n    pointer-events: none;\r\n}\r\n\r\n\r\n\r\n.form-group-jtable-table-info-margin {\r\n    border: 1px dashed #888;\r\n    padding: 15px 0px;\r\n}\r\n\r\n.jtable-table-info-margin-top-bottom {\r\n    text-align: center;\r\n}\r\n\r\n.jtable-table-info-margin-input {\r\n    width: 40px;\r\n    margin-right: 3px;\r\n}\r\n\r\n.jtable-table-info-margin-middle {\r\n    display: flex;\r\n    text-align: center;\r\n    height: 109px;\r\n    margin: 15px 0 15px 0;\r\n}\r\n\r\n.jtable-table-info-margin-left {\r\n    width: 20%;\r\n    padding-top: 45px;\r\n}\r\n\r\n.jtable-table-info-margin-center {\r\n    width: 60%;\r\n    text-align: center;\r\n    padding-top: 30px;\r\n    border: 2px solid #000000;\r\n}\r\n\r\n.jtable-table-info-margin-right {\r\n    width: 20%;\r\n    padding-top: 45px;\r\n}\r\n\r\n.unselectable {\r\n    -moz-user-select: -moz-none;\r\n    -khtml-user-select: none;\r\n    -webkit-user-select: none;\r\n \r\n    /*\r\n      Introduced in IE 10.\r\n      See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/\r\n    */\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n}\r\n\r\n.jtable {\r\n    width: auto;\r\n    margin-bottom: 1rem;\r\n    color: #212529;\r\n    border: 1px solid #dee2e6;\r\n}\r\n\r\n.jtable td, .jtable th {\r\n    border: 1px solid #dee2e6;\r\n}", ""]);


/***/ }),

/***/ "./src/components/App.jsx":
/*!********************************!*\
  !*** ./src/components/App.jsx ***!
  \********************************/
/*! exports provided: default */
/*! ModuleConcatenation bailout: Module uses injected variables ($) */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _SummerNote__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SummerNote */ "./src/components/SummerNote.jsx");
/* harmony import */ var _lib_trf2html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/trf2html */ "./src/lib/trf2html.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




 // import required codes
// console.log(SummerNote)

_SummerNote__WEBPACK_IMPORTED_MODULE_1__["default"].ImportCode();
var htmldata = '<p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);"><a href="https://ai.facebook.com/blog/open-sourcing-pyrobot-to-accelerate-ai-robotics-research" style="vertical-align: top; color: rgb(0, 0, 0); text-decoration-line: none; border-bottom: 1px dotted rgb(187, 187, 187); padding-bottom: 5px;">臉書與卡內基美隆大學合作，共同開發了機器人控制框架PyRobot</a>，希望讓研究人員能夠在幾小時內，在不需要具備硬體或是裝置驅動程式等相關細節知識，就能啟動並且使機器人開始運作。臉書提到，他們希望提供一個像深度學習開發框架PyTorch這樣的機器人框架，提供一定程度的抽象，以簡化系統建置工作，也讓共享函式庫和工具更為簡單。</p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">機器人研究領域有一個笑話，把機器人當作博士研究碖文，論文中的每一個機器人，都會為論文發表時間往後增加一年，臉書提到，要讓機器人揮動手臂，就可能要花上數天甚至一周的時間，來調整機器人軟體，而PyRobot的出現，就是要來解決這樣的研究困境。</p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">PyRobot是機器人作業系統ROS上的輕量級高階介面，提供了一組無關硬體的中介API，供開發人員控制各種的機器人，PyRobot抽象了低階控制器與程序之間溝通的細節，因此對於人工智慧研究人員來說，可以不再需要理解機器人的低階操作，能夠專注地建置高階人工智慧機器人應用程式。</p><p class="rtecenter" style="vertical-align: top; margin: 0px 0px 1.5em; text-align: center; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);"><img alt="" src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/65208991_366432120743262_8971157212042887168_n.gif?_nc_cat=108&amp;_nc_eui2=AeGyV1lVHG2s1TboCa6qoybvi_exikgXF83atf7IgQtcg2ht2rzMSP5Z6vmBlM8ZJcnnfaZ_f_391EouH25dKf_Cm_hcjqrbTPgif4LGSlHNdg&amp;_nc_oc=AQktp8ytYjE29QHmTShUNGjHn7tNgP5lfP-V6p7ApWDkpidjto4pd_Ld9zTFk3vwjsc&amp;_nc_ht=scontent-tpe1-1.xx&amp;oh=649852a5e43ef82748a309c259957b33&amp;oe=5DBB8202" style="vertical-align: middle; max-width: 100%; height: auto; border: 0px; width: 600px;"></p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">研究人員可以使用PyRobot中，適用於各種機器人的通用功能，控制機器人關節的位置、速度或是力矩，還能使用複雜的功能，包括笛卡爾路徑規畫或是視覺SLAM等。PyRobot目前雖然僅支援LoCoBot和Sawyer機器人，但還會繼續增加支援各種不同的機器人。PyRobot雖然提供抽象的高階控制，但研究人員依然可以使用不同層級的元件，像是能夠繞過規畫器，直接設定關節速度和力矩等。</p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">臉書已經將PyRobot用在各種的機器人應用上，像是點到點的導航，或是推與抓的任務，也用在遠端操作以收集訓練機器人的資料。PyRobot中包含了一些現成的演算法實作，並提供可將自行開發的演算法，簡單地部署到機器人上的方法，臉書也提到，研究人員可以使用PyTorch訓練深度學習模型，並使用PyRobot在機器人上執行演算法。</p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">PyRobot可以讓研究社群更容易地使用機器人資料集、演算法實作以及模型，同時也能幫助他們訂定基準，得以互相比較成果，或是基於其他人的成果往前發展，臉書表示，像是在使用LoCoBot這類低成本的機器人平臺，PyRobot有助於降低進入門檻，並使研究成果能夠與其他人分享。臉書也順勢在PyRobot釋出的同時，公開了一項徵求提案活動，任何研究團隊都可以提交PyRobot搭配LoCoBot的研究提案，獲勝者可以贏得一份研究用LoCoBot工具包。</p>'; //import IconButton from './ToolBar/IconButton'

var App =
/*#__PURE__*/
function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "onImageUpload1", function (file, cb, e) {
      //console.log("--------- onImageUpload --------", file, cb, e);
      var image = file[0];
      console.log(_this.editor1);

      _this.editor1.current.insertImage("https://i.imgur.com/JOOEENx.png", function ($image) {
        $image.css("width", Math.floor($image.width() / 2));
        $image.attr("title", image.name);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onImageUpload2", function (file, cb, e) {
      //console.log("--------- onImageUpload --------", file, cb, e);
      var image = file[0];
      console.log(_this.editor2);

      _this.editor2.current.insertImage("https://i.imgur.com/JOOEENx.png", function ($image) {
        $image.css("width", Math.floor($image.width() / 2));
        $image.attr("title", image.name);
      });
    });

    _this.editor1 = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    _this.editor2 = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef(); // console.log( 'constructor this.editor1 ',this.editor1 )
    // console.log( 'constructor this.editor2 ',this.editor2 )

    return _this;
  } // componentDidMount(){
  // }


  _createClass(App, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "demo"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "rb",
        style: {
          textAlign: 'right',
          height: '60px'
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "https://github.com/iq-service-inc/react-summernote"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        loading: "lazy",
        width: "149",
        height: "149",
        src: "https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149",
        "class": "attachment-full size-full",
        alt: "Fork me on GitHub",
        "data-recalc-dims": "1"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, "React SummerNote App"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SummerNote__WEBPACK_IMPORTED_MODULE_1__["default"], {
        id: "editor1",
        destroy: false,
        value: htmldata,
        options: {
          lang: "zh-TW",
          height: 350,
          dialogsInBody: true,
          toolbar: [["style", ["style"]], ["font", ["bold", "underline", "clear"]], ["fontname", ["fontname"]], ["para", ["ul", "ol", "paragraph"]], ["table", ["table"]], ["insert", ["link", "picture", "video"]], ["view", ["fullscreen", "codeview"]], ["anchor", ["anchor", "toc", "markAnchor", "editAnchor"]]]
        },
        onChange: onChange,
        onImageUpload: this.onImageUpload1,
        onImagePasteFromWord: onImagePasteFromWord //onPaste={onPaste}
        ,
        onInit: function onInit(e) {
          return console.log("--------- onInit --------", e);
        },
        ref: this.editor1
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SummerNote__WEBPACK_IMPORTED_MODULE_1__["default"], {
        id: "editor2",
        onImageUpload: this.onImageUpload2,
        ref: this.editor2,
        options: {
          toolbar: [["style", ["style"]], ["font", ["bold", "underline", "clear"]], ["fontname", ["fontname"]], ['color', ['color']], ["para", ["ul", "ol", "paragraph"]], ["table", ["jTable", "jMerge", "jBackcolor", "jBorderColor", "jAlign", "jTableInfo", "jWidthHeightReset"]], ["insert", ["link", "picture", "video"]], ["view", ["fullscreen", "codeview"]]],
          tableClassName: 'jtable table-bordered'
        }
      }));
    }
  }]);

  return App;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

function onImagePasteFromWord($imgs) {
  console.log("onImagePasteFromWord", $imgs);
}

function onChange(e) {
  //$('span[style*="mso-ignore"]').remove()
  //let img = $('img[src*="file://"]').attr('loading',true);
  console.log("change");
}

function onPaste(e) {
  //console.log('--------- onPaste --------', e)
  var items = e.originalEvent.clipboardData.items;
  var files = e.originalEvent.clipboardData.files;

  for (var i = 0; i < files.length; i++) {
    return e.preventDefault();
  } //console.log('---------- items -------------', items)
  //console.log('---------- files -------------', files)


  for (var _i = 0; _i < items.length; _i++) {
    //console.log('---------- item -------------', items[i])
    if (items[_i].type.indexOf("rtf") > -1) {
      items[_i].getAsString(function (rtf) {
        var doc = Object(_lib_trf2html__WEBPACK_IMPORTED_MODULE_2__["default"])(rtf); //const meta = doc.metadata();
        //console.log(doc)

        doc.render().then(function (htmlElements) {
          var imgs = []; //console.log('meta', meta);
          //console.log('htmlElements', htmlElements);

          htmlElements.forEach(function ($html) {
            $html.find('img[src*="data:image"]').each(function (i, el) {
              imgs.push(el);
            }); //$('#test').append($html)
          }); //console.log(imgs)

          setTimeout(function () {
            //console.log(imgs)
            $("img[loading]").each(function (i, el) {
              if (imgs[i]) el.src = imgs[i].src;
            });
          }, 0);
        })["catch"](function (error) {
          return console.error(error);
        });
      });
    }
  } //for (let i = 0; i < files.length; i++) {
  //    console.log('---------- file -------------', files[i])
  //}
  // retrieveImageFromClipboardAsBlob(e.originalEvent, blob => {
  //     console.log('---------- blob -------------', blob)
  // })
  //catchPaste(e, this, data => console.log('---------- clipData -------------', data))

}

/* harmony default export */ __webpack_exports__["default"] = (App);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./src/components/ImportCode.js":
/*!**************************************!*\
  !*** ./src/components/ImportCode.js ***!
  \**************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function () {
  __webpack_require__(/*! bootstrap/dist/css/bootstrap.min.css */ "./node_modules/bootstrap/dist/css/bootstrap.min.css");

  __webpack_require__(/*! bootstrap/js/dist/modal */ "./node_modules/bootstrap/js/dist/modal.js");

  __webpack_require__(/*! bootstrap/js/dist/dropdown */ "./node_modules/bootstrap/js/dist/dropdown.js");

  __webpack_require__(/*! bootstrap/js/dist/tooltip */ "./node_modules/bootstrap/js/dist/tooltip.js");

  __webpack_require__(/*! summernote/dist/summernote-bs4.css */ "./node_modules/summernote/dist/summernote-bs4.css");

  __webpack_require__(/*! summernote/dist/summernote-bs4.min.js */ "./node_modules/summernote/dist/summernote-bs4.min.js");

  __webpack_require__(/*! summernote/dist/lang/summernote-zh-TW */ "./node_modules/summernote/dist/lang/summernote-zh-TW.js");

  __webpack_require__(/*! ../plugin/custom/summernote-custom */ "./src/plugin/custom/summernote-custom.js");

  __webpack_require__(/*! ../plugin/custom/summernote-toc */ "./src/plugin/custom/summernote-toc.js");

  __webpack_require__(/*! ../plugin/emoji/summernote-ext-emoji-ajax */ "./src/plugin/emoji/summernote-ext-emoji-ajax.js");

  __webpack_require__(/*! ../plugin/emoji/summernote-ext-emoji-ajax.css */ "./src/plugin/emoji/summernote-ext-emoji-ajax.css");

  __webpack_require__(/*! ../plugin/formatting/summernote-addclass */ "./src/plugin/formatting/summernote-addclass.js");

  __webpack_require__(/*! ../plugin/formatting/summernote-case-converter */ "./src/plugin/formatting/summernote-case-converter.js");

  __webpack_require__(/*! ../plugin/formatting/summernote-image-captionit */ "./src/plugin/formatting/summernote-image-captionit.js");

  __webpack_require__(/*! ../plugin/formatting/summernote-image-shapes */ "./src/plugin/formatting/summernote-image-shapes.js");

  __webpack_require__(/*! ../plugin/formatting/summernote-list-styles */ "./src/plugin/formatting/summernote-list-styles.js");

  __webpack_require__(/*! ../plugin/formatting/summernote-list-styles.css */ "./src/plugin/formatting/summernote-list-styles.css");

  __webpack_require__(/*! ../plugin/formatting/summernote-pagebreak */ "./src/plugin/formatting/summernote-pagebreak.js");

  __webpack_require__(/*! ../plugin/formatting/summernote-video-attributes */ "./src/plugin/formatting/summernote-video-attributes.js");

  __webpack_require__(/*! ../plugin/insert/summernote-at-mention */ "./src/plugin/insert/summernote-at-mention.js");

  __webpack_require__(/*! ../plugin/insert/summernote-file */ "./src/plugin/insert/summernote-file.js");

  __webpack_require__(/*! ../plugin/insert/summernote-element-template */ "./src/plugin/insert/summernote-element-template.js");

  __webpack_require__(/*! ../plugin/misc/summernoteDrafts */ "./src/plugin/misc/summernoteDrafts.js");

  __webpack_require__(/*! ../plugin/misc/summernote-ext-print */ "./src/plugin/misc/summernote-ext-print.js");

  __webpack_require__(/*! ../plugin/misc/summernote-text-findnreplace */ "./src/plugin/misc/summernote-text-findnreplace.js");

  __webpack_require__(/*! ../plugin/misc/summernote-ext-table */ "./src/plugin/misc/summernote-ext-table.js");

  __webpack_require__(/*! ../plugin/misc/summernote-ext-table.css */ "./src/plugin/misc/summernote-ext-table.css");

  __webpack_require__(/*! ../plugin/special_characters/summernote-ext-specialchars */ "./src/plugin/special_characters/summernote-ext-specialchars.js"); //require('react-summernote/plugin/syntax/summernote-ext-highlight')
  //require('react-summernote/plugin/syntax/run_prettify')

};

/***/ }),

/***/ "./src/components/SummerNote.jsx":
/*!***************************************!*\
  !*** ./src/components/SummerNote.jsx ***!
  \***************************************/
/*! exports provided: default */
/*! ModuleConcatenation bailout: Module uses injected variables ($) */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_trf2html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/trf2html */ "./src/lib/trf2html.js");
/* harmony import */ var _lib_ExcelTable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/ExcelTable */ "./src/lib/ExcelTable.js");
/* harmony import */ var _ImportCode__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ImportCode */ "./src/components/ImportCode.js");
/* harmony import */ var _ImportCode__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_ImportCode__WEBPACK_IMPORTED_MODULE_4__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var InnerReactSummernote =
/*#__PURE__*/
function (_React$Component) {
  _inherits(InnerReactSummernote, _React$Component);

  function InnerReactSummernote(props) {
    var _this;

    _classCallCheck(this, InnerReactSummernote);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InnerReactSummernote).call(this, props)); //console.log('forwardedRef', props.forwardedRef)

    _defineProperty(_assertThisInitialized(_this), "handleEditorRef", function (node) {
      if (!node) return;
      var options = _this.props.options || {};
      var _this$props = _this.props,
          codeview = _this$props.codeview,
          destroy = _this$props.destroy,
          value = _this$props.value,
          innerRef = _this$props.innerRef;
      options.callbacks = _objectSpread({}, _this.props.options.callbacks, {}, _this.callbacks); // load lang pack
      //if (options.lang && options.lang != 'en') this.loadModule(`summernote/dist/lang/summernote-${options.lang}.js`)
      //if (options.lang) require(`summernote/lang/summernote-${options.lang}.js`)

      _this.editor = $(node); // default popover

      var initPopover = {
        image: [['resize', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']], ['float', ['floatLeft', 'floatRight', 'floatNone']], ['remove', ['removeMedia']]],
        link: [['link', ['linkDialogShow', 'unlink']]],
        table: [['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']], ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]],
        air: [['color', ['color']], ['font', ['bold', 'underline', 'clear']], ['para', ['ul', 'paragraph']], ['table', ['table']], ['insert', ['link', 'picture']], ['view', ['fullscreen', 'codeview']]]
      };
      options.popover = _objectSpread({}, initPopover, {}, options.popover);

      _this.editor.summernote(options);

      if (value) {
        _this.replace(value);

        _this.setState({
          value: value
        });
      }

      if (codeview) {
        _this.editor.summernote("codeview.activate");
      }

      if (destroy) {
        _this.editor.summernote("destroy");
      }

      if (typeof innerRef === 'function') innerRef(_assertThisInitialized(_this));else if (_typeof(innerRef) === 'object') innerRef.current = _assertThisInitialized(_this);
    });

    _this.editorbox = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    _this.counter = 0; // counter for identitify for paste word content

    _this.pasteResource = []; //this.uid = `react-summernote-${randomUid()}`;

    _this.editor = {};
    _this.noteEditable = null;
    _this.notePlaceholder = null;
    _this.onInit = _this.onInit.bind(_assertThisInitialized(_this));
    _this.onImageUpload = _this.onImageUpload.bind(_assertThisInitialized(_this));
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    _this.isEmpty = _this.isEmpty.bind(_assertThisInitialized(_this));
    _this.reset = _this.reset.bind(_assertThisInitialized(_this));
    _this.replace = _this.replace.bind(_assertThisInitialized(_this));
    _this.disable = _this.disable.bind(_assertThisInitialized(_this));
    _this.enable = _this.enable.bind(_assertThisInitialized(_this));
    _this.toggleState = _this.toggleState.bind(_assertThisInitialized(_this));
    _this.insertImage = _this.insertImage.bind(_assertThisInitialized(_this));
    _this.insertNode = _this.insertNode.bind(_assertThisInitialized(_this));
    _this.insertText = _this.insertText.bind(_assertThisInitialized(_this));
    _this.pasteHTML = _this.pasteHTML.bind(_assertThisInitialized(_this));
    _this.createRange = _this.createRange.bind(_assertThisInitialized(_this));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handlePaste = _this.handlePaste.bind(_assertThisInitialized(_this));
    InnerReactSummernote.focus = _this.focus.bind(_assertThisInitialized(_this));
    InnerReactSummernote.isEmpty = _this.isEmpty.bind(_assertThisInitialized(_this));
    InnerReactSummernote.reset = _this.reset.bind(_assertThisInitialized(_this));
    InnerReactSummernote.replace = _this.replace.bind(_assertThisInitialized(_this));
    InnerReactSummernote.disable = _this.disable.bind(_assertThisInitialized(_this));
    InnerReactSummernote.enable = _this.enable.bind(_assertThisInitialized(_this));
    InnerReactSummernote.toggleState = _this.toggleState.bind(_assertThisInitialized(_this));
    InnerReactSummernote.insertImage = _this.insertImage.bind(_assertThisInitialized(_this));
    InnerReactSummernote.insertNode = _this.insertNode.bind(_assertThisInitialized(_this));
    InnerReactSummernote.insertText = _this.insertText.bind(_assertThisInitialized(_this));
    InnerReactSummernote.pasteHTML = _this.pasteHTML.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(InnerReactSummernote, [{
    key: "componentWillReceiveProps",
    //componentDidMount() {
    // const options = this.props.options || {};
    // const codeview = this.props.codeview;
    // // const codeviewCommand = codeview ? 'codeview.activate' : 'codeview.deactivate';
    // options.callbacks = this.callbacks;
    // this.editor = $(`#${this.uid}`);
    // this.editor.summernote(options);
    // if (codeview) {
    //     this.editor.summernote('codeview.activate');
    // }
    //}
    value: function componentWillReceiveProps(nextProps) {
      var props = this.props;
      var codeview = nextProps.codeview;
      var codeviewCommand = codeview ? "codeview.activate" : "codeview.deactivate";

      if (typeof nextProps.value === "string" && props.value !== nextProps.value) {
        this.replace(nextProps.value);
      }

      if (typeof nextProps.disabled === "boolean" && props.disabled !== nextProps.disabled) {
        this.toggleState(nextProps.disabled);
      }

      if (codeview !== props.codeview) {
        this.editor.summernote(codeviewCommand);
      }

      if (props.destroy) {
        this.editor.summernote("destroy");
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.editor.summernote) {
        this.editor.summernote("destroy");
      }
    }
  }, {
    key: "onInit",
    value: function onInit() {
      var _this$props2 = this.props,
          disabled = _this$props2.disabled,
          onInit = _this$props2.onInit;
      var $container = this.editor.parent();
      this.noteEditable = $container.find(".note-editable");
      this.notePlaceholder = $container.find(".note-placeholder");

      if (typeof disabled === "boolean") {
        this.toggleState(disabled);
      }

      if (typeof onInit === "function") {
        onInit({
          summernote: this.editor.summernote.bind(this.editor),
          focus: this.focus,
          isEmpty: this.isEmpty,
          reset: this.reset,
          replace: this.replace,
          disable: this.disable,
          enable: this.enable,
          insertImage: this.insertImage,
          insertNode: this.insertNode,
          insertText: this.insertText,
          pasteHTML: this.pasteHTML
        });
      }
    }
  }, {
    key: "onImageUpload",
    value: function onImageUpload(images) {
      var onImageUpload = this.props.onImageUpload;

      if (typeof onImageUpload === "function") {
        onImageUpload(images, this.insertImage);
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      //console.log(this.editor);
      this.editor.summernote("focus");
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.editor.summernote("isEmpty");
    }
  }, {
    key: "reset",
    value: function reset() {
      this.editor.summernote("reset");
    }
  }, {
    key: "replace",
    value: function replace(content) {
      var noteEditable = this.noteEditable,
          notePlaceholder = this.notePlaceholder;
      var prevContent = noteEditable.html();
      var contentLength = content.length;

      if (prevContent !== content) {
        if (this.isEmpty() && contentLength > 0) {
          notePlaceholder.hide();
        } else if (contentLength === 0) {
          notePlaceholder.show();
        }

        noteEditable.html(content);
      }
    }
  }, {
    key: "disable",
    value: function disable() {
      this.editor.summernote("disable");
    }
  }, {
    key: "enable",
    value: function enable() {
      this.editor.summernote("enable");
    }
  }, {
    key: "toggleState",
    value: function toggleState(disabled) {
      if (disabled) {
        this.disable();
      } else {
        this.enable();
      }
    }
  }, {
    key: "insertImage",
    value: function insertImage(url, filenameOrCallback) {
      //console.log(this.editor)
      this.editor.summernote("focus");
      this.editor.summernote("insertImage", url, filenameOrCallback);
    }
  }, {
    key: "insertNode",
    value: function insertNode(node) {
      this.editor.summernote("focus");
      this.editor.summernote("insertNode", node);
    }
  }, {
    key: "insertText",
    value: function insertText(text) {
      this.editor.summernote("focus");
      this.editor.summernote("insertText", text);
    }
  }, {
    key: "pasteHTML",
    value: function pasteHTML(html) {
      this.editor.summernote("focus");
      this.editor.summernote("pasteHTML", html);
    }
  }, {
    key: "createRange",
    value: function createRange() {
      this.editor.summernote("focus");
      var range = this.editor.summernote("createRange");
      return range;
    }
  }, {
    key: "handleChange",
    value: function handleChange(txt) {
      var _this2 = this;

      var _this$props3 = this.props,
          onChange = _this$props3.onChange,
          onImagePasteFromWord = _this$props3.onImagePasteFromWord;
      var editorbox = $(this.editorbox.current);
      editorbox.find('span[style*="mso-ignore"]').remove(); // convert <v:imagedata> to <img>

      editorbox.find('v\\:shape v\\:imagedata').each(function (i, el) {
        var newElem = $('<img></img>');
        $.each(el.attributes, function (j, attr) {
          newElem.attr(attr['name'], attr['value']);
        });
        newElem.attr('style', $(el).parent().attr('style'));
        $(el).replaceWith(newElem);
      });
      var $pastedImgs = editorbox.find('img[src*="file://"]').not(".zap-img-uploading").addClass('zap-img-uploading').each(function (i, el) {
        // console.log(el, 'src', this.pasteResource[i])
        $(el).attr('src', _this2.pasteResource[i]);
      });

      if (typeof onImagePasteFromWord === "function" && this.isPasteFromWord) {
        this.isPasteFromWord = false;
        onImagePasteFromWord($pastedImgs);
      }

      if (typeof onChange === "function") onChange(txt);
    } // if ctrl+v : fire this first

  }, {
    key: "handlePaste",
    value: function handlePaste(e) {
      var _this3 = this;

      //console.log('handlePaste this.counter', this.counter)
      // if have media, it will fire upload image event ,so skip paste
      // const editorbox = $(this.editorbox.current)
      var onPaste = this.props.onPaste;
      if (/MSIE|Trident/i.test(navigator.userAgent)) return; // const files = e.originalEvent.clipboardData.files;
      // only one pic, dont paste the photo
      // if (files.length) return e.preventDefault();

      var items = e.originalEvent.clipboardData.items;

      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("rtf") > -1) {
          var _ret = function () {
            var rtf = e.originalEvent.clipboardData.getData('text/rtf');
            var doc = Object(_lib_trf2html__WEBPACK_IMPORTED_MODULE_2__["default"])(rtf),
                imgs = [];
            doc.forEach(function (el) {
              imgs.push(el);
            });
            _this3.pasteResource = imgs;
            _this3.isPasteFromWord = true;
            return "break";
          }();

          if (_ret === "break") break;
        }
      }

      if (typeof onPaste === "function") onPaste(e);
      var ua = navigator.userAgent,
          clipboardHTML = e.originalEvent.clipboardData.getData('text/html'); // if browser is not msie and paste excel table
      // remove images, add style inline

      var excel = clipboardHTML.indexOf('office:excel') > -1,
          msie = /MSIE|Trident/i.test(ua);

      if (excel && !msie) {
        e.preventDefault();
        var table = _lib_ExcelTable__WEBPACK_IMPORTED_MODULE_3__["default"].getTable(clipboardHTML),
            style = _lib_ExcelTable__WEBPACK_IMPORTED_MODULE_3__["default"].createStylesheet(clipboardHTML);
        _lib_ExcelTable__WEBPACK_IMPORTED_MODULE_3__["default"].applyStyleInline(table, style);
        _lib_ExcelTable__WEBPACK_IMPORTED_MODULE_3__["default"].removeImage(table);
        var range = this.createRange(),
            target = range.sc; // range start container

        if (!target.tagName) target = target.parentNode;
        var $block = $(target).closest('.note-editing-area').find('.jtable-block');

        if (!!target.closest('table') && !!$block && $block.css('display') == 'block') {
          table.className = 'jtable-paste';
          target.closest('table').appendChild(table);
          table.style.display = 'none';
        } else range.pasteHTML(table.outerHTML);
      } // if browser is Firefox and doc rely on vml
      // prevent default paste event


      var ff = ua.indexOf('Firefox') > -1,
          vml = clipboardHTML.indexOf('RelyOnVML') > -1;

      if (ff && vml) {
        e.preventDefault();
        var start = clipboardHTML.indexOf('<!--StartFragment-->') + '<!--StartFragment-->'.length,
            end = clipboardHTML.indexOf('<!--EndFragment-->'),
            str = clipboardHTML.substring(start, end);
        var selection = window.getSelection(),
            selected = selection.rangeCount > 0 && selection.getRangeAt(0);

        if (selected.startOffset !== selected.endOffset) {
          // replace selection
          var range = selected.cloneRange();
          selection.deleteFromDocument(); // delete selection content
          // paste data after cursor

          var newNode = document.createElement('p');
          newNode.innerHTML = str;
          newNode.appendChild(range.extractContents());
          range.insertNode(newNode);
          selection.removeAllRanges();
        } else this.pasteHTML(str);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          className = _this$props4.className,
          id = _this$props4.id,
          tag = _this$props4.tag;
      var Tag = tag || 'div';
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: className,
        ref: this.editorbox,
        id: id
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Tag, {
        ref: this.handleEditorRef
      }));
    }
  }, {
    key: "callbacks",
    get: function get() {
      var props = this.props;
      return {
        onInit: this.onInit,
        onEnter: props.onEnter,
        onFocus: props.onFocus,
        onBlur: props.onBlur,
        onKeyup: props.onKeyUp,
        onKeydown: props.onKeyDown,
        onPaste: this.handlePaste,
        onChange: this.handleChange,
        onImageUpload: this.onImageUpload,
        onChangeCodeview: this.handleChange
      };
    }
  }]);

  return InnerReactSummernote;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

InnerReactSummernote.propTypes = {
  tag: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  // will determing using div or textarea field for form components like redux-form
  //children: PropTypes.node, // instead of value, using children makes more sense for div and textarea blocks
  codeview: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  className: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  options: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  onInit: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onEnter: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onFocus: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onBlur: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onKeyUp: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onKeyDown: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onPaste: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onChange: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onImageUpload: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onImagePasteFromWord: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  destroy: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool
};
var ReactSummernote = react__WEBPACK_IMPORTED_MODULE_0___default.a.forwardRef(function (props, ref) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(InnerReactSummernote, _extends({
    innerRef: ref
  }, props));
});
ReactSummernote.ImportCode = _ImportCode__WEBPACK_IMPORTED_MODULE_4___default.a;
/* harmony default export */ __webpack_exports__["default"] = (ReactSummernote);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./src/lib/ExcelTable.js":
/*!*******************************!*\
  !*** ./src/lib/ExcelTable.js ***!
  \*******************************/
/*! exports provided: default */
/*! ModuleConcatenation bailout: Module uses injected variables ($) */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["default"] = ({
  getTable: function getTable(text) {
    // get table content
    var table = document.createElement('table'),
        start = text.indexOf('<!--StartFragment-->') + '<!--StartFragment-->'.length,
        end = text.indexOf('<!--EndFragment-->'),
        str = text.substring(start, end);
    table.innerHTML = str;
    return table;
  },
  createStylesheet: function createStylesheet(text) {
    // create isolated stylesheet
    var begin = text.indexOf('<!--table'),
        end = text.indexOf('-->', begin + '<!--table'.length),
        content = text.substring(begin + '<!--table'.length, end),
        style = document.createElement('style'),
        iframe = document.createElement('iframe');
    style.innerHTML = content;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentDocument.documentElement.appendChild(style);
    document.body.removeChild(iframe);
    return style;
  },
  applyStyleInline: function applyStyleInline(table, style) {
    // put css to inline
    var rules = style.sheet.rules || style.sheet.cssRules;

    if (rules.length) {
      var _loop = function _loop(i) {
        // To detect if the rule contains styles and is not an at-rule, it's enough to check rule's type.
        if (rules[i].type === window.CSSRule.STYLE_RULE) {
          $(table).find(rules[i].selectorText).each(function (index, el) {
            el.style = el.style.cssText + rules[i].style.cssText;
          });
        }
      };

      for (var i = 0; i < rules.length; i++) {
        _loop(i);
      }
    }
  },
  removeImage: function removeImage(table) {
    // remove excel img tag
    var imgs = $(table).find('img');

    for (var index = 0; index < imgs.length; index++) {
      var el = imgs[index];
      el.remove();
    }
  }
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./src/lib/trf2html.js":
/*!*****************************!*\
  !*** ./src/lib/trf2html.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function newstringToArrayBuffer(string) {
  var ret = [],
      rePictureHeader = /\{\\pict[\s\S]+?\\bliptag\-?\d+(\\blipupi\-?\d+)?(\{\\\*\\blipuid\s?[\da-fA-F]+)?[\s\}]*?/,
      rePicture = new RegExp('(?:(' + rePictureHeader.source + '))([\\da-fA-F\\s]+)\\}', 'g'),
      wholeImages,
      imageType;
  var start = string.indexOf('\{\\*\\listpicture');

  if (start > -1) {
    var brackets = 0,
        i = start;

    for (i; i < string.length; i++) {
      var _char = string[i];
      if (_char == '{') brackets = brackets + 1;
      if (_char == '}') brackets = brackets - 1;
      if (brackets == 0) break;
    }

    var str = string.substring(0, start) + string.substring(i);
  } else str = string;

  wholeImages = str.match(rePicture);

  if (!wholeImages) {
    return ret;
  }

  for (var i = 0; i < wholeImages.length; i++) {
    if (rePictureHeader.test(wholeImages[i])) {
      if (wholeImages[i].indexOf('\\pngblip') !== -1) {
        imageType = 'image/png';
      } else if (wholeImages[i].indexOf('\\jpegblip') !== -1) {
        imageType = 'image/jpeg';
      } else {
        continue;
      }

      ret.push({
        hex: imageType ? wholeImages[i].replace(rePictureHeader, '').replace(/[^\da-fA-F]/g, '') : null,
        type: imageType
      });
    }
  }

  return ret;
}

function convertHexStringToBytes(hexString) {
  var bytesArray = [],
      bytesArrayLength = hexString.length / 2,
      i;

  for (i = 0; i < bytesArrayLength; i++) {
    bytesArray.push(parseInt(hexString.substr(i * 2, 2), 16));
  }

  return bytesArray;
}

function convertBytesToBase64(bytesArray) {
  var base64characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      base64string = '',
      bytesArrayLength = bytesArray.length,
      i;

  for (i = 0; i < bytesArrayLength; i += 3) {
    var array3 = bytesArray.slice(i, i + 3),
        array3length = array3.length,
        array4 = [],
        j;

    if (array3length < 3) {
      for (j = array3length; j < 3; j++) {
        array3[j] = 0;
      }
    } // 0xFC -> 11111100 || 0x03 -> 00000011 || 0x0F -> 00001111 || 0xC0 -> 11000000 || 0x3F -> 00111111


    array4[0] = (array3[0] & 0xFC) >> 2;
    array4[1] = (array3[0] & 0x03) << 4 | array3[1] >> 4;
    array4[2] = (array3[1] & 0x0F) << 2 | (array3[2] & 0xC0) >> 6;
    array4[3] = array3[2] & 0x3F;

    for (j = 0; j < 4; j++) {
      if (j <= array3length) {
        base64string += base64characters.charAt(array4[j]);
      } else {
        base64string += '=';
      }
    }
  }

  return base64string;
}

function createSrcWithBase64(img) {
  return img.type ? 'data:' + img.type + ';base64,' + convertBytesToBase64(convertHexStringToBytes(img.hex)) : null;
}

/* harmony default export */ __webpack_exports__["default"] = (function (rtf) {
  if (!rtf) rtf = '';
  var hexImage = newstringToArrayBuffer(rtf);
  var newSrcValues = [];
  hexImage.forEach(function (img) {
    newSrcValues.push(createSrcWithBase64(img));
  });
  return newSrcValues;
});

/***/ }),

/***/ "./src/plugin/custom/summernote-custom.js":
/*!************************************************!*\
  !*** ./src/plugin/custom/summernote-custom.js ***!
  \************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  $.extend($.summernote.plugins, {
    'custom': function custom(context) {
      var range = $.summernote.range;
      var dom = $.summernote.dom;
      var lists = $.summernote.lists;
      var self = this,
          ui = $.summernote.ui,
          $note = context.layoutInfo.note,
          $editor = context.layoutInfo.editor,
          $editable = context.layoutInfo.editable,
          $toolbar = context.layoutInfo.toolbar,
          $statusbar = context.layoutInfo.statusbar,
          modules = context.modules,
          options = context.options,
          lang = options.langInfo;

      this.wrapCommand = function (fn) {
        return function () {
          context.invoke("beforeCommand");
          fn.apply(this, arguments);
          context.invoke("afterCommand");
        };
      };
      /**
       * "customUL" insert Unordered List
       * add style on ul
       */


      context.memo('button.customUL', function () {
        return ui.button({
          className: 'custom-ul',
          contents: ui.icon(options.icons.unorderedlist),
          tooltip: lang.lists.unordered + modules.buttons.representShortcut.call(modules.buttons, 'insertUnorderedList'),
          click: self.wrapCommand(function (event) {
            modules.editor.bullet.insertUnorderedList();
            var rng = range.create();
            $(rng.sc).closest('ul').css('padding-left', '40px');
          })
        }).render();
      });
    }
  });
  $.extend(true, $.summernote.lang, {
    'zh-TW': {
      // table popover 中文尚未 release 目前以 plugin 覆寫
      // commit: 9f80ec892ce40d3fed3c239436d0e3ec16afd50f
      table: {
        table: '表格',
        addRowAbove: '上方插入列',
        addRowBelow: '下方插入列',
        addColLeft: '左方插入欄',
        addColRight: '右方插入欄',
        delRow: '刪除列',
        delCol: '刪除欄',
        delTable: '刪除表格'
      }
    }
  });
});

/***/ }),

/***/ "./src/plugin/custom/summernote-toc.js":
/*!*********************************************!*\
  !*** ./src/plugin/custom/summernote-toc.js ***!
  \*********************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * options={{
        toolbar: [
            ['toc', ['anchor', 'toc', 'markAnchor']]
        ],
    }}
 * insert anchor shortcut: (ctrl + shift + a)
 */
(function (factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  $.extend($.summernote.options, {
    toc: {
      selector: null,
      prefix: null
    }
  });
  $.extend($.summernote.plugins, {
    'toc': function toc(context) {
      var range = $.summernote.range;
      var dom = $.summernote.dom;
      var self = this,
          ui = $.summernote.ui,
          $note = context.layoutInfo.note,
          $editor = context.layoutInfo.editor,
          $editable = context.layoutInfo.editable,
          $editingArea = context.layoutInfo.editingArea,
          $toolbar = context.layoutInfo.toolbar,
          $statusbar = context.layoutInfo.statusbar,
          modules = modules = context.modules,
          options = context.options,
          lang = options.langInfo;
      this.$document = $(document);
      var prefix = options.toc.prefix || 'summernote';
      var isMac = navigator.appVersion.indexOf('Mac') > -1;
      var shortcut = 'CTRL+SHIFT+A';

      if (isMac) {
        shortcut = 'CMD+⇧+A';
      } else {
        shortcut = 'CTRL+SHIFT+A';
      }

      var linkicon = "\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-link-45deg\" viewBox=\"0 0 16 16\">\n                <path d=\"M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z\"/>\n                <path d=\"M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z\"/>\n            </svg>";

      this.initialize = function () {
        if ($("#".concat(prefix, "-toc-style")).length == 0) {
          this.css = $('<style>').html(".".concat(prefix, "-toc-anchor{position:relative;}.").concat(prefix, "-toc-anchor::before{content:\"#\";opacity:0.6;position:absolute;left:-0.7em;visibility:hidden;}.").concat(prefix, "-toc-anchor:hover::before{visibility:visible;}"));
          this.css.attr('id', "".concat(prefix, "-toc-style"));
          $(document.head).append(this.css);
        }

        if ($("#".concat(prefix, "-toc-temp-style")).length == 0) {
          this.tempcss = $('<style>').html(".".concat(prefix, "-toc-mark{background-color:yellow;}.").concat(prefix, "-toc-mark::before{visibility:visible;}.").concat(prefix, "-toc-form-container{max-height:700px;overflow-y:auto;}.").concat(prefix, "-toc-form-group{display:flex;}.").concat(prefix, "-toc-form-group>.").concat(prefix, "-toc-data-id{width:50%;}.").concat(prefix, "-toc-form-group>.").concat(prefix, "-toc-data-text{width:50%;}"));
          this.tempcss.attr('id', "".concat(prefix, "-toc-temp-style"));
          $(document.head).append(this.tempcss);
        }

        this.$toc = $("<div class=\"".concat(prefix, "-toc\"></div>"));

        if (!!options.toc.selector) {
          $(options.toc.selector).append(this.$toc);
        } else {
          $toolbar.append(this.$toc);
        }

        this.$dialog = ui.dialog({
          title: "".concat(lang.toc.editAnchortext),
          fade: options.dialogsFade,
          body: "\n                    <div class=\"form-group ".concat(prefix, "-toc-form-group\">\n                        <b>").concat(lang.toc.message, "</b>\n                    </div>"),
          footer: "<button href=\"#\" class=\"btn btn-primary ".concat(prefix, "-toc-btn\">").concat(lang.toc.addtoc, "</button>")
        }).render().appendTo(options.container);
        this.$dialog.find('.modal-body').addClass("".concat(prefix, "-toc-form-container"));
        $editingArea.css('display', 'flex').css('flex-direction', 'row');
        $editable.css('width', '100%');
        this.$editAnchorContainer = $("<div style=\"background-color:rgba(0,0,0,.03);border-right: 1px solid rgba(0,0,0,.125); width:30em; overflow-y:auto; \" class=\"".concat(prefix, "-edit-anchor-container\"><div style=\"width:20em;\" class=\"").concat(prefix, "-edit-anchor\"></div></div>"));
        $editingArea.prepend(this.$editAnchorContainer);
        this.$editAnchorContainer.hide();
        this.$editAnchor = $editingArea.find(".".concat(prefix, "-edit-anchor"));
        this.$editAnchor.css('padding', '1em 0');
        $editable.css('padding', '1.5rem');
      };

      this.wrapCommand = function (fn) {
        return function () {
          context.invoke("beforeCommand");
          fn.apply(this, arguments);
          context.invoke("afterCommand");
        };
      };

      this.events = {
        'summernote.init': function summernoteInit(_, layoutInfo) {
          layoutInfo.editable.on('keyup', function (event) {
            if (event.keyCode === 8) {
              //key backspace
              setTimeout(function () {
                var code = context.invoke('code');

                if (code.length == 0) {
                  context.invoke('pasteHTML', '<p><br></p>');
                }
              }, 1);
            }
          });
          layoutInfo.editable.on('keydown', function (e) {
            // toggle anchor
            var key = e.keyCode,
                ctrlKey = e.ctrlKey,
                shiftKey = e.shiftKey;

            if (key == 65 && ctrlKey && shiftKey) {
              // ctrl + shift + a
              context.invoke("beforeCommand");
              self.anchor();
              context.invoke("afterCommand");
            }
          });
          layoutInfo.statusbar.on('mousedown', function (event) {
            // resize height of edit anchor area
            EDITABLE_PADDING = 24;
            event.preventDefault();
            event.stopPropagation();

            var onMouseMove = function onMouseMove(event) {
              var height = $editable.outerHeight();
              self.$editAnchorContainer.height(height);
            };

            self.$document.on('mousemove', onMouseMove).one('mouseup', function () {
              self.$document.off('mousemove', onMouseMove);
            });
          });
        },
        'summernote.enter': function summernoteEnter() {
          // insert paragraph
          setTimeout(function () {
            context.invoke("beforeCommand");
            var rng = range.create();
            var node = dom.ancestor(rng.commonAncestor(), function (node) {
              return node && $(node).hasClass("".concat(prefix, "-toc-anchor"));
            }) || $(rng.sc).find(".".concat(prefix, "-toc-anchor")); // remove duplicated anchor

            if (!!node && $editable.find("#".concat($(node).attr('id'))).length > 0) {
              $(node).removeAttr('id').removeAttr('data-anchortext').removeClass(["".concat(prefix, "-toc-anchor"), "".concat(prefix, "-toc-mark")]);
            }

            context.invoke("afterCommand");
          }, 1);
        },
        'summernote.codeview.toggled': function summernoteCodeviewToggled() {
          // toggle edit anchor area
          var codeview = context.invoke('codeview.isActivated');

          if (codeview) {
            self.displayEdit = self.$editAnchorContainer.css('display') == 'none';
            self.$editAnchorContainer.hide();
          } else {
            !self.displayEdit && self.$editAnchorContainer.show();
            self.resetEditAnchor();
          }
        },
        'summernote.change': function summernoteChange() {
          self.resetHeight();
        }
      };

      this.resetHeight = function () {
        // set edit anchor area height
        var height = $editable.outerHeight();
        self.$editAnchorContainer.height(height);
      };

      this.resetEditAnchor = function ($target) {
        self.resetHeight(); // reset anchor list

        var anchors = $editor.find(".".concat(prefix, "-toc-anchor[id]"));
        self.$editAnchor.html('<ul>');
        anchors.each(function (i, d) {
          var id = $(d).attr('id'),
              text = $(d).attr('data-anchortext');
          var $anchor = $('<a>').text(text).attr('href', '#' + id).css('flex', '2').css('align-self', 'center').css('overflow', 'hidden').css('text-overflow', 'ellipsis').css('white-space', 'nowrap');
          var $input = $('<input>').attr('value', text).addClass("".concat(prefix, "-toc-data-text"));
          var $edit = $('<button>').text('編輯').addClass(['btn', 'btn-primary']);
          var $del = $('<button>').text('移除').addClass(['btn', 'btn-primary']);
          var $check = $('<button>').text('確認').addClass(['btn', 'btn-primary']);
          var $cancel = $('<button>').text('取消').addClass(['btn', 'btn-primary']);
          var $btncontainer = $('<div>').append([$edit, $check, $cancel, $del]).css('flex', '2').css('display', 'flex').css('justify-content', 'space-evenly');
          var $div = $('<li>').addClass(['form-group', "".concat(prefix, "-toc-form-group")]).append([$anchor, $input, $btncontainer]);
          self.$editAnchor.find('ul').append($div);

          function viewmode() {
            $anchor.show();
            $edit.show();
            $del.show();
            $input.hide();
            $check.hide();
            $cancel.hide();
          }

          function editmode() {
            $anchor.hide();
            $edit.hide();
            $del.hide();
            $input.show();
            $check.show();
            $cancel.show();
          }

          viewmode();
          $edit.click(function (event) {
            editmode();
          });
          $input.on('keydown', function (event) {
            if (event.keyCode === 13) {
              context.invoke("beforeCommand");
              event.preventDefault();
              $editor.find(".".concat(prefix, "-toc-anchor#").concat(id)).attr('data-anchortext', $input.val());
              self.resetEditAnchor();
              viewmode();
              context.invoke("afterCommand");
            }

            if (event.keyCode === 27) {
              viewmode();
            }
          });
          $check.click(self.wrapCommand(function (event) {
            $editor.find(".".concat(prefix, "-toc-anchor#").concat(id)).attr('data-anchortext', $input.val()); // $anchor.text($input.val())

            self.resetEditAnchor();
            viewmode();
          }));
          $cancel.click(function (event) {
            viewmode();
          });
          $del.click(self.wrapCommand(function (event) {
            $editor.find("#".concat(id)).removeClass(["".concat(prefix, "-toc-anchor"), "".concat(prefix, "-toc-mark")]).removeAttr('id');
            self.resetEditAnchor();
          })); // remove event when close edit anchor area

          !!$target && $target.bind('hideEditAnchor', function () {
            $edit.off();
            $del.off();
            $input.off();
            $check.off();
            $cancel.off();
          });
        });
      };

      context.memo('button.editAnchor', function () {
        return ui.button({
          className: "".concat(prefix, "-btn-edit-anchor"),
          contents: "<i class=\"note-icon ".concat(prefix, "-mark-anchor\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-card-list\" viewBox=\"0 0 16 16\">\n                    <path d=\"M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z\"/>\n                    <path d=\"M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z\"/>\n                  </svg></i>"),
          tooltip: lang.toc.editAnchor,
          click: function click(event) {
            var $target = $(event.target).closest('button'); // toggle edit anchor area

            self.$editAnchorContainer.animate({
              'width': 'toggle'
            });
            $target.toggleClass("".concat(prefix, "-show-edit-anchor"));

            if ($target.hasClass("".concat(prefix, "-show-edit-anchor"))) {
              // create custom event
              $target.on('hideEditAnchor');
              self.resetEditAnchor($target);
            } else {
              $target.trigger('hideEditAnchor');
              $target.off('hideEditAnchor');
            }
          }
        }).render();
      });
      context.memo('button.markAnchor', function () {
        return ui.button({
          className: "".concat(prefix, "-btn-mark-anchor"),
          contents: "<i class=\"note-icon ".concat(prefix, "-mark-anchor\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-binoculars-fill\" viewBox=\"0 0 16 16\">\n                    <path d=\"M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1h-1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4h4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14H1zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14H9zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5V3z\"/>\n                  </svg></i>"),
          tooltip: lang.toc.markAnchor,
          click: self.wrapCommand(function (event) {
            var $target = $(event.target).closest('button');

            if ($target.find(".".concat(prefix, "-toc-mark")).length) {
              $target.find(".".concat(prefix, "-mark-anchor")).removeClass("".concat(prefix, "-toc-mark"));
              $editable.find(".".concat(prefix, "-toc-anchor[id]")).removeClass("".concat(prefix, "-toc-mark"));
            } else {
              $target.find(".".concat(prefix, "-mark-anchor")).addClass("".concat(prefix, "-toc-mark"));
              $editable.find(".".concat(prefix, "-toc-anchor[id]")).addClass("".concat(prefix, "-toc-mark"));
            }
          })
        }).render();
      });

      this.anchor = function () {
        var rng = range.create();
        if (!rng) return;
        var node = dom.ancestor(rng.commonAncestor(), function (node) {
          return node && /DIV|P|LI|H[1-7]|SPAN/.test(node.nodeName.toUpperCase());
        });

        if ($editable.find(node).length > 0) {
          var text = $(node).text(),
              id = $(node).text();
          id = id.replace(/[\s!"#\$%&'\(\)\*\+,\.\/:;<=>\?@\[\]\^`\{\|\}~]/g, '-'); // 空白段落消除錨點

          if (id.length == 0) {
            $(node).removeClass(["".concat(prefix, "-toc-anchor"), "".concat(prefix, "-toc-mark")]);
            self.resetEditAnchor();
            return;
          }

          if ($(node).attr('id') === id) {
            $(node).toggleClass("".concat(prefix, "-toc-anchor"));
          } else {
            var index = 0;

            while ($editable.find("#".concat(id).concat(index || '')).length) {
              index += 1;
            }

            $(node).attr('id', "".concat(id).concat(index || '')).toggleClass("".concat(prefix, "-toc-anchor")).attr('data-anchortext', text);
          }

          if ($toolbar.find(".".concat(prefix, "-btn-mark-anchor .").concat(prefix, "-toc-mark")).length && $(node).hasClass("".concat(prefix, "-toc-anchor"))) {
            $(node).addClass("".concat(prefix, "-toc-mark"));
          } else {
            $(node).removeClass("".concat(prefix, "-toc-mark"));
          }
        }

        self.resetEditAnchor();
      };

      context.memo('button.anchor', function () {
        return ui.button({
          className: "".concat(prefix, "-anchor"),
          contents: "<i class=\"note-icon\">#</i>",
          tooltip: "".concat(lang.toc.insertanchor, " (").concat(shortcut, ")"),
          click: self.wrapCommand(function (event) {
            self.anchor();
          })
        }).render();
      });

      this.resetTOC = function () {
        self.$toc.html('');
        $editor.find(".".concat(prefix, "-toc-anchor")).each(function (i, d) {
          var text = $(d).attr('data-anchortext'),
              id = $(d).attr('id'); // 產生 TOC

          var anchor = $('<a>').attr('href', '#' + id);
          anchor.text(text);
          var li = $('<li>').append(anchor);
          self.$toc.append(li);
        });
      };

      this.showDialog = function () {
        ui.showDialog(this.$dialog);
        var $body = self.$dialog.find('.modal-body');
        var anchors = $editor.find(".".concat(prefix, "-toc-anchor[id]"));

        if (anchors.length == 0) {
          $body.html("\n                    <div class=\"form-group ".concat(prefix, "-toc-form-group\">\n                        <b>").concat(lang.toc.message, "</b>\n                    </div>"));
          return;
        } // reset dialog body


        $body.html("\n                <div class=\"form-group ".concat(prefix, "-toc-form-group\">\n                    <b class=\"").concat(prefix, "-toc-data-id\">id</b>\n                    <b class=\"").concat(prefix, "-toc-data-text\">").concat(lang.toc.anchortext, "</b>\n                </div>"));
        anchors.each(function (i, d) {
          var id = $(d).attr('id'),
              text = $(d).attr('data-anchortext');
          var label = $('<label>').text(id).addClass("".concat(prefix, "-toc-data-id"));
          var input = $('<input>').attr('value', text).attr('id', id).addClass("".concat(prefix, "-toc-data-text"));
          var div = $('<div>').addClass(['form-group', "".concat(prefix, "-toc-form-group")]).append(label).append(input);
          $body.append(div);
        });
        var $btn = self.$dialog.find(".modal-footer .".concat(prefix, "-toc-btn"));
        $btn.click(self.wrapCommand(function (event) {
          ui.hideDialog(self.$dialog); // reset toc

          var input = self.$dialog.find(".".concat(prefix, "-toc-data-text")).not('b');
          input.each(function (i, d) {
            var text = $(d).val(),
                id = $(d).attr('id'); // update anchor text

            $editor.find(".".concat(prefix, "-toc-anchor#").concat(id)).attr('data-anchortext', text);
          });
          self.resetTOC();
          self.resetEditAnchor();
        }));
        ui.onDialogHidden(self.$dialog, function () {
          $btn.off();
        });
      };

      context.memo('button.toc', function () {
        return ui.button({
          className: "".concat(prefix, "-toc"),
          contents: "<i class=\"note-icon\">".concat(linkicon, "</i>"),
          tooltip: lang.toc.addtoc,
          click: function click(event) {
            context.invoke('editor.saveRange');
            self.showDialog();
            context.invoke('editor.restoreRange');
          }
        }).render();
      });

      self.destroy = function () {
        ui.hideDialog(this.$dialog);
        this.$dialog.remove();
        this.$editAnchorContainer.remove();
        !!this.tempcss && $(this.tempcss).remove();
      };
    }
  });
  $.extend(true, $.summernote.lang, {
    'zh-TW': {
      toc: {
        anchor: '錨點',
        toc: '目錄',
        anchortext: '錨點文字',
        editAnchortext: '編輯錨點文字',
        addtoc: '新增目錄',
        insertanchor: '插入錨點',
        message: '目前尚無錨點',
        markAnchor: '檢視錨點',
        editAnchor: '編輯錨點'
      }
    },
    'en-US': {
      toc: {
        anchor: 'anchor',
        toc: 'toc',
        anchortext: 'anchor text',
        editAnchortext: 'Edit anchor text',
        addtoc: 'add toc',
        insertanchor: 'insert anchor',
        message: 'Cannot find any anchor',
        markAnchor: 'mark anchor',
        editAnchor: 'edit anchor'
      }
    }
  });
});

/***/ }),

/***/ "./src/plugin/emoji/summernote-ext-emoji-ajax.css":
/*!********************************************************!*\
  !*** ./src/plugin/emoji/summernote-ext-emoji-ajax.css ***!
  \********************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!./summernote-ext-emoji-ajax.css */ "./node_modules/css-loader/dist/cjs.js!./src/plugin/emoji/summernote-ext-emoji-ajax.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../../node_modules/css-loader/dist/cjs.js!./summernote-ext-emoji-ajax.css */ "./node_modules/css-loader/dist/cjs.js!./src/plugin/emoji/summernote-ext-emoji-ajax.css", function() {
		var newContent = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!./summernote-ext-emoji-ajax.css */ "./node_modules/css-loader/dist/cjs.js!./src/plugin/emoji/summernote-ext-emoji-ajax.css");

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/plugin/emoji/summernote-ext-emoji-ajax.js":
/*!*******************************************************!*\
  !*** ./src/plugin/emoji/summernote-ext-emoji-ajax.js ***!
  \*******************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * These extensions/snippets were used as templates to figure out how to build this extension.
 * Thanks to the original authors!
 *
 * http://summernote.org/examples/#hint-for-emoji
 * https://github.com/nilobarp/summernote-ext-emoji
 * https://github.com/JustinEldracher/summernote-plugins
 *
 */
(function (factory) {
  /* global define */
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  // Extends plugins for emoji plugin.
  $.extend($.summernote.plugins, {
    'emoji': function emoji(context) {
      var self = this;
      var ui = $.summernote.ui;
      var options = context.options; // Don't close when clicking in search input

      var addListener = function addListener() {
        $('body').on('click', '.note-ext-emoji-search :input', function (e) {
          e.stopPropagation();
        });
      }; // This events will be attached when editor is initialized.


      this.events = {
        // This will be called after modules are initialized.
        'summernote.init': function summernoteInit(we, e) {
          addListener();
        }
      };
      context.memo('button.emoji', function () {
        return ui.buttonGroup({
          className: 'note-ext-emoji',
          children: [ui.button({
            className: 'dropdown-toggle',
            contents: '<img src="https://github.githubassets.com/images/icons/emoji/unicode/1f603.png?v8" width="20"/> ',
            tooltip: 'Emoji',
            data: {
              toggle: 'dropdown'
            },
            click: function click() {
              // Cursor position must be saved because is lost when dropdown is opened.
              context.invoke('editor.saveRange');
            }
          }), ui.dropdown({
            className: 'dropdown-emoji',
            items: ['  <div class="note-ext-emoji-search">', '   <input type="text" placeholder="search..." class="form-control" />', '  </div>', '  <table class="note-emoji-menu-tabs">', '      <tbody>', '          <tr>', '              <td title="all" class="note-emoji-all note-emoji-tabs-btn selected-emoji-type"><div>all</div></td>', '              <td title="people" class="note-emoji-people note-emoji-tabs-btn"><img src="https://github.githubassets.com/images/icons/emoji/unicode/1f603.png?v8" /></td>', '              <td title="nature" class="note-emoji-nature note-emoji-tabs-btn"><img src="https://github.githubassets.com/images/icons/emoji/unicode/1f41c.png?v8" /></td>', '              <td title="objects" class="note-emoji-objects note-emoji-tabs-btn"><img src="https://github.githubassets.com/images/icons/emoji/unicode/1f3b1.png?v8" /></td>', '              <td title="places" class="note-emoji-places note-emoji-tabs-btn"><img src="https://github.githubassets.com/images/icons/emoji/unicode/1f6a1.png?v8" /></td>', '              <td title="symbols" class="note-emoji-symbols note-emoji-tabs-btn"><img src="https://github.githubassets.com/images/icons/emoji/unicode/1f4af.png?v8" /></td>', '          </tr>', '      </tbody>', '  </table>', '  <div class="note-ext-emoji-list">', '     <div class="note-ext-emoji-loading">', '         <i class="fa fa-spinner fa-spin fa-fw"></i> Loading...', '     </div>', '  </div>'].join(''),
            callback: function callback($dropdown) {
              self.$search = $('.note-ext-emoji-search :input', $dropdown);
              self.$list = $('.note-ext-emoji-list', $dropdown);
              self.$tabs = $('.note-emoji-menu-tabs', $dropdown);
              $dropdown.on('click', '.note-emoji-menu-tabs', function (e) {
                e.stopPropagation();
              });
              $.each($dropdown.find('.note-emoji-tabs-btn'), function (index, el) {
                var type = el.classList[0].slice(11);
                $dropdown.on('click', ".note-emoji-".concat(type), function (e) {
                  self.$tabs.find(".note-emoji-".concat(type)).toggleClass('selected-emoji-type', true);
                  self.$tabs.find('.note-emoji-tabs-btn').not(".note-emoji-".concat(type)).toggleClass('selected-emoji-type', false);

                  if (type == 'all') {
                    self.$list.find(".note-emoji-btn").show();
                  } else {
                    self.$list.find(".emoji-".concat(type)).show();
                    var other_type = self.$list.find('.note-emoji-btn').not(".emoji-".concat(type));
                    other_type.hide();
                  }
                });
              });
            }
          })]
        }).render();
      });

      this.wrapCommand = function (fn) {
        return function () {
          context.invoke("beforeCommand");
          fn.apply(this, arguments);
          context.invoke("afterCommand");
        };
      };

      self.initialize = function () {
        var $search = self.$search;
        var $list = self.$list; // http://summernote.org/examples/#hint-for-emoji

        $.ajax({
          url: 'https://api.github.com/emojis' // async :false

        }).then(function (data) {
          window.emojis = Object.keys(data);
          window.emojiUrls = data; // remove the loading icon

          $('.note-ext-emoji-loading').remove();
          self.$list && $.each(window.emojiUrls, function (name, url) {
            setTimeout(function () {
              // prevents lag during DOM insertion
              var type = self.filter_type(name);
              var $btn = $('<button/>', {
                'class': 'note-emoji-btn btn btn-link ' + type,
                'title': name,
                'type': 'button',
                'tabindex': '-1'
              });
              var $img = $('<img/>', {
                'src': url
              });
              $btn.html($img);
              $btn.click(self.wrapCommand(function (event) {
                event.preventDefault();
                context.invoke('emoji.insertEmoji', name, url);
              }));
              self.$list.append($btn);
            }, 0); //timeout
          }); // $each
        }); // .then
        // filter the emoji list based on current search text

        !!self.$search && self.$search.keyup(function () {
          self.filter($search.val());
        });
      };

      self.filter_type = function (name) {
        var People = ["bowtie", "smile", "simple_smile", "laughing", "blush", "smiley", "relaxed", "smirk", "heart_eyes", "kissing_heart", "kissing_closed_eyes", "flushed", "relieved", "satisfied", "grin", "wink", "stuck_out_tongue_winking_eye", "stuck_out_tongue_closed_eyes", "grinning", "kissing", "kissing_smiling_eyes", "stuck_out_tongue", "sleeping", "worried", "frowning", "anguished", "open_mouth", "grimacing", "confused", "hushed", "expressionless", "unamused", "sweat_smile", "sweat", "disappointed_relieved", "weary", "pensive", "disappointed", "confounded", "fearful", "cold_sweat", "persevere", "cry", "sob", "joy", "astonished", "scream", "neckbeard", "tired_face", "angry", "rage", "triumph", "sleepy", "yum", "mask", "sunglasses", "dizzy_face", "imp", "smiling_imp", "neutral_face", "no_mouth", "innocent", "alien", "yellow_heart", "blue_heart", "purple_heart", "heart", "green_heart", "broken_heart", "heartbeat", "heartpulse", "two_hearts", "revolving_hearts", "cupid", "sparkling_heart", "sparkles", "star", "star2", "dizzy", "boom", "collision", "anger", "exclamation", "question", "grey_exclamation", "grey_question", "zzz", "dash", "sweat_drops", "notes", "musical_note", "fire", "hankey", "poop", "shit", "+1", "thumbsup", "-1", "thumbsdown", "ok_hand", "punch", "facepunch", "fist", "v", "wave", "hand", "raised_hand", "open_hands", "point_up", "point_down", "point_left", "point_right", "raised_hands", "pray", "point_up_2", "clap", "muscle", "metal", "fu", "runner", "running", "couple", "family", "two_men_holding_hands", "two_women_holding_hands", "dancer", "dancers", "ok_woman", "no_good", "information_desk_person", "raising_hand", "bride_with_veil", "person_with_pouting_face", "person_frowning", "bow", "couplekiss", "couple_with_heart", "massage", "haircut", "nail_care", "boy", "girl", "woman", "man", "baby", "older_woman", "older_man", "person_with_blond_hair", "man_with_gua_pi_mao", "man_with_turban", "construction_worker", "cop", "angel", "princess", "smiley_cat", "smile_cat", "heart_eyes_cat", "kissing_cat", "smirk_cat", "scream_cat", "crying_cat_face", "joy_cat", "pouting_cat", "japanese_ogre", "japanese_goblin", "see_no_evil", "hear_no_evil", "speak_no_evil", "guardsman", "skull", "feet", "lips", "kiss", "droplet", "ear", "eyes", "nose", "tongue", "love_letter", "bust_in_silhouette", "busts_in_silhouette", "speech_balloon", "thought_balloon", "feelsgood", "finnadie", "goberserk", "godmode", "hurtrealbad", "rage1", "rage2", "rage3", "rage4", "suspect", "trollface"];
        var Nature = ["sunny", "umbrella", "cloud", "snowflake", "snowman", "zap", "cyclone", "foggy", "ocean", "cat", "dog", "mouse", "hamster", "rabbit", "wolf", "frog", "tiger", "koala", "bear", "pig", "pig_nose", "cow", "boar", "monkey_face", "monkey", "horse", "racehorse", "camel", "sheep", "elephant", "panda_face", "snake", "bird", "baby_chick", "hatched_chick", "hatching_chick", "chicken", "penguin", "turtle", "bug", "honeybee", "ant", "beetle", "snail", "octopus", "tropical_fish", "fish", "whale", "whale2", "dolphin", "cow2", "ram", "rat", "water_buffalo", "tiger2", "rabbit2", "dragon", "goat", "rooster", "dog2", "pig2", "mouse2", "ox", "dragon_face", "blowfish", "crocodile", "dromedary_camel", "leopard", "cat2", "poodle", "paw_prints", "bouquet", "cherry_blossom", "tulip", "four_leaf_clover", "rose", "sunflower", "hibiscus", "maple_leaf", "leaves", "fallen_leaf", "herb", "mushroom", "cactus", "palm_tree", "evergreen_tree", "deciduous_tree", "chestnut", "seedling", "blossom", "ear_of_rice", "shell", "globe_with_meridians", "sun_with_face", "full_moon_with_face", "new_moon_with_face", "new_moon", "waxing_crescent_moon", "first_quarter_moon", "waxing_gibbous_moon", "full_moon", "waning_gibbous_moon", "last_quarter_moon", "waning_crescent_moon", "last_quarter_moon_with_face", "first_quarter_moon_with_face", "crescent_moon", "earth_africa", "earth_americas", "earth_asia", "volcano", "milky_way", "partly_sunny", "octocat", "squirrel"];
        var Objects = ["bamboo", "gift_heart", "dolls", "school_satchel", "mortar_board", "flags", "fireworks", "sparkler", "wind_chime", "rice_scene", "jack_o_lantern", "ghost", "santa", "christmas_tree", "gift", "bell", "no_bell", "tanabata_tree", "tada", "confetti_ball", "balloon", "crystal_ball", "cd", "dvd", "floppy_disk", "camera", "video_camera", "movie_camera", "computer", "tv", "iphone", "phone", "telephone", "telephone_receiver", "pager", "fax", "minidisc", "vhs", "sound", "speaker", "mute", "loudspeaker", "mega", "hourglass", "hourglass_flowing_sand", "alarm_clock", "watch", "radio", "satellite", "loop", "mag", "mag_right", "unlock", "lock", "lock_with_ink_pen", "closed_lock_with_key", "key", "bulb", "flashlight", "high_brightness", "low_brightness", "electric_plug", "battery", "calling", "email", "mailbox", "postbox", "bath", "bathtub", "shower", "toilet", "wrench", "nut_and_bolt", "hammer", "seat", "moneybag", "yen", "dollar", "pound", "euro", "credit_card", "money_with_wings", "e - mail", "inbox_tray", "outbox_tray", "envelope", "incoming_envelope", "postal_horn", "mailbox_closed", "mailbox_with_mail", "mailbox_with_no_mail", "package", "door", "smoking", "bomb", "gun", "hocho", "pill", "syringe", "page_facing_up", "page_with_curl", "bookmark_tabs", "bar_chart", "chart_with_upwards_trend", "chart_with_downwards_trend", "scroll", "clipboard", "calendar", "date", "card_index", "file_folder", "open_file_folder", "scissors", "pushpin", "paperclip", "black_nib", "pencil2", "straight_ruler", "triangular_ruler", "closed_book", "green_book", "blue_book", "orange_book", "notebook", "notebook_with_decorative_cover", "ledger", "books", "bookmark", "name_badge", "microscope", "telescope", "newspaper", "football", "basketball", "soccer", "baseball", "tennis", "8ball", "rugby_football", "bowling", "golf", "mountain_bicyclist", "bicyclist", "horse_racing", "snowboarder", "swimmer", "surfer", "ski", "spades", "hearts", "clubs", "diamonds", "gem", "ring", "trophy", "musical_score", "musical_keyboard", "violin", "space_invader", "video_game", "black_joker", "flower_playing_cards", "game_die", "dart", "mahjong", "clapper", "memo", "pencil", "book", "art", "microphone", "headphones", "trumpet", "saxophone", "guitar", "shoe", "sandal", "high_heel", "lipstick", "boot", "shirt", "tshirt", "necktie", "womans_clothes", "dress", "running_shirt_with_sash", "jeans", "kimono", "bikini", "ribbon", "tophat", "crown", "womans_hat", "mans_shoe", "closed_umbrella", "briefcase", "handbag", "pouch", "purse", "eyeglasses", "fishing_pole_and_fish", "coffee", "tea", "sake", "baby_bottle", "beer", "beers", "cocktail", "tropical_drink", "wine_glass", "fork_and_knife", "pizza", "hamburger", "fries", "poultry_leg", "meat_on_bone", "spaghetti", "curry", "fried_shrimp", "bento", "sushi", "fish_cake", "rice_ball", "rice_cracker", "rice", "ramen", "stew", "oden", "dango", "egg", "bread", "doughnut", "custard", "icecream", "ice_cream", "shaved_ice", "birthday", "cake", "cookie", "chocolate_bar", "candy", "lollipop", "honey_pot", "apple", "green_apple", "tangerine", "lemon", "cherries", "grapes", "watermelon", "strawberry", "peach", "melon", "banana", "pear", "pineapple", "sweet_potato", "eggplant", "tomato", "corn"];
        var Places = ["house", "house_with_garden", "school", "office", "post_office", "hospital", "bank", "convenience_store", "love_hotel", "hotel", "wedding", "church", "department_store", "european_post_office", "city_sunrise", "city_sunset", "japanese_castle", "european_castle", "tent", "factory", "tokyo_tower", "japan", "mount_fuji", "sunrise_over_mountains", "sunrise", "stars", "statue_of_liberty", "bridge_at_night", "carousel_horse", "rainbow", "ferris_wheel", "fountain", "roller_coaster", "ship", "speedboat", "boat", "sailboat", "rowboat", "anchor", "rocket", "airplane", "helicopter", "steam_locomotive", "tram", "mountain_railway", "bike", "aerial_tramway", "suspension_railway", "mountain_cableway", "tractor", "blue_car", "oncoming_automobile", "car", "red_car", "taxi", "oncoming_taxi", "articulated_lorry", "bus", "oncoming_bus", "rotating_light", "police_car", "oncoming_police_car", "fire_engine", "ambulance", "minibus", "truck", "train", "station", "train2", "bullettrain_front", "bullettrain_side", "light_rail", "monorail", "railway_car", "trolleybus", "ticket", "fuelpump", "vertical_traffic_light", "traffic_light", "warning", "construction", "beginner", "atm", "slot_machine", "busstop", "barber", "hotsprings", "checkered_flag", "crossed_flags", "izakaya_lantern", "moyai", "circus_tent", "performing_arts", "round_pushpin", "triangular_flag_on_post", "jp", "kr", "cn", "us", "fr", "es", "it", "ru", "gb", "uk", "de"];
        var Symbols = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "keycap_ten", "1234", "zero", "hash", "symbols", "arrow_backward", "arrow_down", "arrow_forward", "arrow_left", "capital_abcd", "abcd", "abc", "arrow_lower_left", "arrow_lower_right", "arrow_right", "arrow_up", "arrow_upper_left", "arrow_upper_right", "arrow_double_down", "arrow_double_up", "arrow_down_small", "arrow_heading_down", "arrow_heading_up", "leftwards_arrow_with_hook", "arrow_right_hook", "left_right_arrow", "arrow_up_down", "arrow_up_small", "arrows_clockwise", "arrows_counterclockwise", "rewind", "fast_forward", "information_source", "ok", "twisted_rightwards_arrows", "repeat", "repeat_one", "new", "top", "up", "cool", "free", "ng", "cinema", "koko", "signal_strength", "u5272", "u5408", "u55b6", "u6307", "u6708", "u6709", "u6e80", "u7121", "u7533", "u7a7a", "u7981", "sa", "restroom", "mens", "womens", "baby_symbol", "no_smoking", "parking", "wheelchair", "metro", "baggage_claim", "accept", "wc", "potable_water", "put_litter_in_its_place", "secret", "congratulations", "m", "passport_control", "left_luggage", "customs", "ideograph_advantage", "cl", "sos", "id", "no_entry_sign", "underage", "no_mobile_phones", "do_not_litter", "non-potable_water", "no_bicycles", "no_pedestrians", "children_crossing", "no_entry", "eight_spoked_asterisk", "sparkle", "eight_pointed_black_star", "heart_decoration", "vs", "vibration_mode", "mobile_phone_off", "chart", "currency_exchange", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpius", "sagittarius", "capricorn", "aquarius", "pisces", "ophiuchus", "six_pointed_star", "negative_squared_cross_mark", "a", "b", "ab", "o2", "diamond_shape_with_a_dot_inside", "recycle", "end", "back", "on", "soon", "clock1", "clock130", "clock10", "clock1030", "clock11", "clock1130", "clock12", "clock1230", "clock2", "clock230", "clock3", "clock330", "clock4", "clock430", "clock5", "clock530", "clock6", "clock630", "clock7", "clock730", "clock8", "clock830", "clock9", "clock930", "heavy_dollar_sign", "copyright", "registered", "tm", "x", "heavy_exclamation_mark", "bangbang", "interrobang", "o", "heavy_multiplication_x", "heavy_plus_sign", "heavy_minus_sign", "heavy_division_sign", "white_flower", "100", "heavy_check_mark", "ballot_box_with_check", "radio_button", "link", "curly_loop", "wavy_dash", "part_alternation_mark", "trident", "black_small_square", "white_small_square", "black_medium_small_square", "white_medium_small_square", "black_medium_square", "white_medium_square", "black_large_square", "white_large_square", "white_check_mark", "black_square_button", "white_square_button", "black_circle", "white_circle", "red_circle", "large_blue_circle", "large_blue_diamond", "large_orange_diamond", "small_blue_diamond", "small_orange_diamond", "small_red_triangle", "small_red_triangle_down", "shipit"];
        if (People.includes(name)) return 'emoji-people';else if (Nature.includes(name)) return 'emoji-nature';else if (Objects.includes(name)) return 'emoji-objects';else if (Places.includes(name)) return 'emoji-places';else if (Symbols.includes(name)) return 'emoji-symbols'; // else return 'emoji-others'
      }; // apply search filter on each key press in search input


      self.filter = function (filter) {
        var $icons = $('button', self.$list);
        var rx_filter;

        if (filter === '') {
          $icons.show();
        } else {
          rx_filter = new RegExp(filter);
          $icons.each(function () {
            var $item = $(this);

            if (rx_filter.test($item.attr('title'))) {
              $item.show();
            } else {
              $item.hide();
            }
          });
        }
      };

      self.insertEmoji = function (name, url) {
        var img = new Image();
        img.src = url;
        img.alt = name;
        img.title = name;
        img.className = 'emoji-img-inline'; // We restore cursor position and element is inserted in correct pos.

        context.invoke('editor.restoreRange');
        context.invoke('editor.focus');
        context.invoke('editor.insertNode', img);
      };
    }
  });
});

/***/ }),

/***/ "./src/plugin/formatting/summernote-addclass.js":
/*!******************************************************!*\
  !*** ./src/plugin/formatting/summernote-addclass.js ***!
  \******************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * 
 * copyright 2016 creativeprogramming.it di Stefano Gargiulo
 * email: info@creativeprogramming.it
 * accepting tips at https://www.paypal.me/creativedotit 
 * license: MIT
 * 
 */
(function (factory) {
  /* global define */
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  $.extend(true, $.summernote.lang, {
    'zh-TW': {
      addClass: {
        style: '套用 CSS class'
      }
    },
    'en-US': {
      addClass: {
        style: 'toggle CSS class'
      }
    }
  }); // Extends plugins for adding hello.
  //  - plugin is external module for customizing.

  $.extend($.summernote.plugins, {
    /**
     * @param {Object} context - context object has status of editor.
     */
    'addclass': function addclass(context) {
      var self = this;

      if (typeof context.options.addclass === 'undefined') {
        context.options.addclass = {};
      }

      if (typeof context.options.addclass.classTags === 'undefined') {
        context.options.addclass.classTags = ["jumbotron", "lead", "img-rounded", "img-circle", "img-responsive", "btn", "btn btn-success", "btn btn-danger", "text-muted", "text-primary", "text-warning", "text-danger", "text-success", "table-bordered", "table-responsive", "alert", "alert alert-success", "alert alert-info", "alert alert-warning", "alert alert-danger", "visible-sm", "hidden-xs", "hidden-md", "hidden-lg", "hidden-print"]; //  console.log("Please define your summernote.options.addclass.classTags array");
      } // ui has renders to build ui elements.
      //  - you can create a button with `ui.button`


      var ui = $.summernote.ui;

      this.wrapCommand = function (fn) {
        return function () {
          context.invoke("beforeCommand");
          fn.apply(this, arguments);
          context.invoke("afterCommand");
        };
      };

      var options = context.options,
          lang = options.langInfo;
      context.memo('button.addclass', function () {
        return ui.buttonGroup([ui.button({
          className: 'dropdown-toggle',
          contents: '<i class="text-primary">CSS3</i>',
          // contents: '<i class="fa fa-css3"\/>' + ' ' + ui.icon(context.options.icons.caret, 'span'),
          //ui.icon(context.options.icons.magic) + ' ' + ui.icon(context.options.icons.caret, 'span'),
          tooltip: lang.addClass.style,
          //lang.style.style,
          data: {
            toggle: 'dropdown'
          }
        }), ui.dropdown({
          className: 'dropdown-style scrollable-menu',
          items: context.options.addclass.classTags,
          template: function template(item) {
            if (typeof item === 'string') {
              item = {
                tag: "div",
                title: item,
                value: item
              };
            }

            var tag = item.tag;
            var title = item.title;
            var style = item.style ? ' style="' + item.style + '" ' : '';
            var cssclass = item.value ? ' class="' + item.value + '" ' : '';
            return '<' + tag + ' ' + style + cssclass + '>' + title + '</' + tag + '>';
          },
          click: self.wrapCommand(function (event, namespace, value) {
            event.preventDefault();
            value = value || $(event.target).closest('[data-value]').data('value');
            var $node = $(context.invoke("restoreTarget"));

            if ($node.length == 0) {
              $node = $(document.getSelection().focusNode.parentElement, ".note-editable");
            }

            if (typeof context.options.addclass !== 'undefined' && typeof context.options.addclass.debug !== 'undefined' && context.options.addclass.debug) {
              console.debug(context.invoke("restoreTarget"), $node, "toggling class: " + value, window.getSelection());
            }

            $node.toggleClass(value);
          })
        })]).render();
        return $optionList;
      });

      function addStyleString(str, id) {
        var node = document.createElement('style');
        node.innerHTML = str;
        node.setAttribute('id', id);
        document.head.appendChild(node);
        return node;
      } // This events will be attached when editor is initialized.


      this.events = {
        // This will be called after modules are initialized.
        'summernote.init': function summernoteInit(we, e) {//console.log('summernote initialized', we, e);
        },
        // This will be called when user releases a key on editable.
        'summernote.keyup': function summernoteKeyup(we, e) {//  console.log('summernote keyup', we, e);
        }
      }; // This method will be called when editor is initialized by $('..').summernote();
      // You can create elements for plugin

      this.initialize = function () {
        if ($('#summernote-addClass-style').length == 0) {
          this.css = addStyleString(".scrollable-menu {height: auto; max-height: 200px; max-width:300px; overflow-x: hidden;}", 'summernote-addClass-style');
        }
      }; // This methods will be called when editor is destroyed by $('..').summernote('destroy');
      // You should remove elements on `initialize`.


      this.destroy = function () {
        /*  this.$panel.remove();
         this.$panel = null; */
        !!this.css && $(this.css).remove();
      };
    }
  });
});

/***/ }),

/***/ "./src/plugin/formatting/summernote-case-converter.js":
/*!************************************************************!*\
  !*** ./src/plugin/formatting/summernote-case-converter.js ***!
  \************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
 * Case Converter, a plugin for Summernote.
 * ---
 * The plugin is a button for case convert 
 * between upper, lower, sentence and title case.
 * ---
 * Version 1
 * copyright [2019] [PiraTera].
 * email: piranga8 [at] gmail [dot] com
 * license: GPL
 * 
 */
(function (factory) {
  /* Global define */
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  /**
   * @class plugin.examplePlugin
   *
   * example Plugin
   */
  $.extend(true, $.summernote.lang, {
    'zh-TW': {
      caseConverter: {
        title: '大小寫傳換',
        lowerCase: '小寫',
        upperCase: '大寫',
        sentenceCase: '句子大寫',
        titleCase: '標題大寫'
      }
    },
    'en-US': {
      /* US English(Default Language) */
      caseConverter: {
        title: 'Case Converter',
        lowerCase: 'Lower case.',
        upperCase: 'Upper case.',
        sentenceCase: 'Sentence case.',
        titleCase: 'Title case.'
      }
    },
    'es-ES': {
      caseConverter: {
        title: 'Cambiar tipo de carácter.',
        lowerCase: 'Minúscula.',
        upperCase: 'Mayúsculas.',
        sentenceCase: 'Tipo oración.',
        titleCase: 'Tipo título.'
      }
    }
  });
  $.extend($.summernote.options, {
    caseConverter: {
      icon: 'Aa',
      tooltip: 'Example Plugin Tooltip'
    }
  });
  $.extend($.summernote.plugins, {
    /**
     *  @param {Object} context - context object has status of editor.
     */
    'caseConverter': function caseConverter(context) {
      var self = this,
          ui = $.summernote.ui,
          // ui has renders to build ui elements for e.g. you can create a button with 'ui.button'
      $note = context.layoutInfo.note,
          // Note element
      $editor = context.layoutInfo.editor,
          // contentEditable element
      $editable = context.layoutInfo.editable,
          // contentEditable element
      $toolbar = context.layoutInfo.toolbar,
          // contentEditable element                
      options = context.options,
          // options holds the Options Information from Summernote and what we extended above. 
      lang = options.langInfo,
          // lang holds the Language Information from Summernote and what we extended above.
      modules = modules = context.modules;

      this.wrapCommand = function (fn) {
        return function () {
          context.invoke("beforeCommand");
          fn.apply(this, arguments);
          context.invoke("afterCommand");
        };
      };

      context.memo('button.caseConverter', function () {
        // Dropdown HTML
        var htmlDropdownList = '';
        htmlDropdownList += '<li><a href="#" data-value="lowerCase">' + lang.caseConverter.lowerCase + '</a></li>';
        htmlDropdownList += '<li><a href="#" data-value="upperCase">' + lang.caseConverter.upperCase + '</a></li>';
        htmlDropdownList += '<li><a href="#" data-value="sentenceCase">' + lang.caseConverter.sentenceCase + '</a></li>';
        htmlDropdownList += '<li><a href="#" data-value="titleCase">' + lang.caseConverter.titleCase + '</a></li>'; // create button

        var button = ui.buttonGroup([ui.button({
          className: 'caseConverter-toggle dropdown-toggle',
          contents: options.caseConverter.icon,
          tooltip: lang.caseConverter.title,
          data: {
            toggle: 'dropdown'
          }
        }), ui.dropdown({
          className: 'dropdown-caseConverter',
          items: htmlDropdownList,
          callback: function callback($dropdown) {
            $dropdown.css('padding', '.5rem');
          },
          click: self.wrapCommand(function (event) {
            event.preventDefault();
            var selected = $note.summernote('createRange');

            if (selected.toString()) {
              var texto;
              var count = 0;
              var $button = $(event.target);
              var value = $button.data('value');
              var nodes = selected.nodes();

              for (var i = 0; i < nodes.length; ++i) {
                if (nodes[i].nodeName == "#text") {
                  count++;
                  texto = nodes[i].nodeValue;
                  nodes[i].nodeValue = texto.toLowerCase();

                  if (value == 'upperCase') {
                    nodes[i].nodeValue = texto.toUpperCase();
                  } else if (value == 'titleCase' || value == 'sentenceCase' && count == 1) {
                    nodes[i].nodeValue = texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
                  }
                }
              }
            }

            $("#summernote").summernote("editor.restoreRange");
            $("#summernote").summernote("editor.focus");
          })
        })]);
        return button.render();
      });
    }
  });
});

/***/ }),

/***/ "./src/plugin/formatting/summernote-image-captionit.js":
/*!*************************************************************!*\
  !*** ./src/plugin/formatting/summernote-image-captionit.js ***!
  \*************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* https://github.com/DiemenDesign/summernote-image-captionit */
(function (factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  $.extend(true, $.summernote.lang, {
    'en-US': {
      captionIt: {
        tooltip: 'Caption It',
        captionText: 'Caption Goes Here.'
      }
    },
    'zh-TW': {
      captionIt: {
        tooltip: '圖片標題',
        captionText: '這是圖片標題'
      }
    }
  });
  $.extend($.summernote.options, {
    captionIt: {
      icon: '<i class="note-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path d="M 8.781,11.11 7,11.469 7.3595,9.688 8.781,11.11 Z M 7.713,9.334 9.135,10.7565 13,6.8915 11.5775,5.469 7.713,9.334 Z M 6.258,9.5 8.513,7.12 7.5,5.5 6.24,7.5 5,6.52 3,9.5 6.258,9.5 Z M 4.5,5.25 C 4.5,4.836 4.164,4.5 3.75,4.5 3.336,4.5 3,4.836 3,5.25 3,5.6645 3.336,6 3.75,6 4.164,6 4.5,5.6645 4.5,5.25 Z m 1.676,5.25 -4.176,0 0,-7 9,0 0,1.156 1,0 0,-2.156 -11,0 0,9 4.9845,0 0.1915,-1 z"/></svg></i>',
      figureClass: '',
      figcaptionClass: '',
      captionText: ''
    }
  });
  $.extend($.summernote.plugins, {
    'captionIt': function captionIt(context) {
      var ui = $.summernote.ui,
          $editable = context.layoutInfo.editable,
          options = context.options,
          lang = options.langInfo,
          self = this;

      this.wrapCommand = function (fn) {
        return function () {
          context.invoke("beforeCommand");
          fn.apply(this, arguments);
          context.invoke("afterCommand");
        };
      };

      context.memo('button.captionIt', function () {
        var button = ui.button({
          contents: options.captionIt.icon,
          tooltip: lang.captionIt.tooltip,
          click: self.wrapCommand(function () {
            var img = $($editable.data('target'));
            var $parentAnchorLink = img.parent();

            if (img.parent('figure').length) {
              img.next('figcaption').remove();
              img.unwrap('figure');
            } else {
              var titleText = img.attr('title'),
                  altText = img.attr('alt'),
                  classList = img.attr('class'),
                  inlineStyles = img.attr('style'),
                  classList = img.attr('class'),
                  inlineStyles = img.attr('style'),
                  imgWidth = img.width(),
                  captionText = '';

              if (titleText) {
                captionText = titleText;
              } else if (altText) {
                captionText = altText;
              } else {
                captionText = options.captionIt.captionText || lang.captionIt.captionText;
              }

              if ($parentAnchorLink.is('a')) {
                $newFigure = $parentAnchorLink.wrap('<figure class="' + options.captionIt.figureClass + '"></figure>').parent();
                $newFigure.append('<figcaption class="' + options.captionIt.figcaptionClass + '>' + captionText + '</figcaption>');
                $newFigure.width(imgWidth);
              } else {
                $newFigure = img.wrap('<figure class="' + options.captionIt.figureClass + '"></figure>').parent();
                img.after('<figcaption class="' + options.captionIt.figcaptionClass + '">' + captionText + '</figcaption>');
                $newFigure.width(imgWidth);
              }
            }
          })
        });
        return button.render();
      });
    }
  });
});

/***/ }),

/***/ "./src/plugin/formatting/summernote-image-shapes.js":
/*!**********************************************************!*\
  !*** ./src/plugin/formatting/summernote-image-shapes.js ***!
  \**********************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* https://github.com/DiemenDesign/summernote-image-shapes */
(function (factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  $.extend(true, $.summernote.lang, {
    'en-US': {
      imageShapes: {
        tooltip: 'Image Shapes',
        tooltipShapeOptions: ['Responsive', 'Rounded', 'Circle', 'Thumbnail', 'None']
      }
    },
    'zh-TW': {
      imageShapes: {
        tooltip: '圖片外框',
        tooltipShapeOptions: ['自動', '圓角', '圓形', '縮圖', '無']
      }
    }
  });
  $.extend($.summernote.options, {
    imageShapes: {
      icon: '<i class="note-icon-picture"/>',

      /* Must keep the same order as in lang.imageAttributes.tooltipShapeOptions */
      shapes: ['img-fluid', 'rounded', 'rounded-circle', 'img-thumbnail', '']
    }
  });
  $.extend($.summernote.plugins, {
    'imageShapes': function imageShapes(context) {
      var ui = $.summernote.ui,
          $editable = context.layoutInfo.editable,
          options = context.options,
          lang = options.langInfo,
          dom = $.summernote.dom,
          modules = context.modules;
      context.memo('button.imageShapes', function () {
        var button = ui.buttonGroup([ui.button({
          className: 'dropdown-toggle',
          contents: options.imageShapes.icon + '&nbsp;&nbsp;<span class="caret"></span>',
          tooltip: lang.imageShapes.tooltip,
          data: {
            toggle: 'dropdown'
          },
          click: function click(e) {
            var $target = $(e.target),
                $toggle = $target.closest('.dropdown-toggle');
            var img = $($editable.data('target')),
                left = $target.closest('.popover').css('left'),
                top = $target.closest('.popover').css('top'),
                height = $target.css('height');
            setTimeout(function () {
              modules.handle.update(img[0], e);
              var $popover = $target.closest('.popover'),
                  $dropdown = $toggle.next('.dropdown-menu');
              $popover.css({
                left: left,
                top: top
              });
              $dropdown.css({
                transform: "translate3d(0px, ".concat(height, ", 0px)")
              });
            }, 0);
          }
        }), ui.dropdown({
          className: 'dropdown-shape',
          items: lang.imageShapes.tooltipShapeOptions,
          click: function click(e) {
            var $button = $(e.target);
            var $img = $($editable.data('target'));
            var index = $.inArray($button.data('value'), lang.imageShapes.tooltipShapeOptions);
            $.each(options.imageShapes.shapes, function (index, value) {
              $img.removeClass(value);
            });
            $img.addClass(options.imageShapes.shapes[index]);
            context.invoke('editor.afterCommand');
          }
        })]);
        return button.render();
      });
    }
  });
});

/***/ }),

/***/ "./src/plugin/formatting/summernote-list-styles.css":
/*!**********************************************************!*\
  !*** ./src/plugin/formatting/summernote-list-styles.css ***!
  \**********************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!./summernote-list-styles.css */ "./node_modules/css-loader/dist/cjs.js!./src/plugin/formatting/summernote-list-styles.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../../node_modules/css-loader/dist/cjs.js!./summernote-list-styles.css */ "./node_modules/css-loader/dist/cjs.js!./src/plugin/formatting/summernote-list-styles.css", function() {
		var newContent = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!./summernote-list-styles.css */ "./node_modules/css-loader/dist/cjs.js!./src/plugin/formatting/summernote-list-styles.css");

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/plugin/formatting/summernote-list-styles.js":
/*!*********************************************************!*\
  !*** ./src/plugin/formatting/summernote-list-styles.js ***!
  \*********************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* https://github.com/tylerecouture/summernote-lists  */
(function (factory) {
  /* global define */
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  $.extend(true, $.summernote.lang, {
    "en-US": {
      listStyleTypes: {
        tooltip: "List Styles",
        labelsListStyleTypes: ["Numbered", "Lower Alpha", "Upper Alpha", "Lower Roman", "Upper Roman", "Disc", "Circle", "Square"]
      }
    },
    "zh-TW": {
      listStyleTypes: {
        tooltip: "清單樣式",
        labelsListStyleTypes: ["數字", "小寫字母", "大寫字母", "小寫羅馬數字", "大寫羅馬數字", "實心圓形", "空心圓形", "實心方形"]
      }
    }
  });
  $.extend($.summernote.options, {
    listStyleTypes: {
      /* Must keep the same order as in lang.imageAttributes.tooltipShapeOptions */
      styles: ["decimal", "lower-alpha", "upper-alpha", "lower-roman", "upper-roman", "disc", "circle", "square"]
    }
  }); // Extends plugins for emoji plugin.

  $.extend($.summernote.plugins, {
    listStyles: function listStyles(context) {
      var self = this;
      var ui = $.summernote.ui;
      var options = context.options;
      var lang = options.langInfo;
      var listStyleTypes = options.listStyleTypes.styles;
      var listStyleLabels = lang.listStyleTypes.labelsListStyleTypes;
      var modules = context.modules;
      var list = "";

      for (var i = 0; i < listStyleTypes.length; i++) {
        list += '<li><div class="list-style-item" data-value=' + listStyleTypes[i] + ">";
        list += '<i class="note-icon-menu-check float-left"></i>';
        list += '<ol><li style="list-style-type: ' + listStyleTypes[i] + ';">';
        list += listStyleLabels[i] + "</li></ol></div></li>";
      }

      context.memo("button.listStyles", function () {
        return ui.buttonGroup([ui.button({
          className: "dropdown-toggle list-styles more",
          contents: '',
          // twbs3 = ui.icon(options.icons.caret, "span"),
          tooltip: lang.listStyleTypes.tooltip,
          data: {
            toggle: "dropdown"
          },
          callback: function callback($dropdownBtn) {
            $dropdownBtn.click(function (e) {
              e.preventDefault();
              self.updateListStyleMenuState($dropdownBtn);
            });
          }
        }), ui.dropdownCheck({
          className: "dropdown-list-styles",
          checkClassName: options.icons.menuCheck,
          contents: list,
          callback: function callback($dropdown) {
            $dropdown.find("div").each(function () {
              $(this).click(function (e) {
                e.preventDefault();
                self.updateStyleType($(this).data("value"));
              });
            });
          } // callback

        })]).render();
      });
      /* Makes sure the check marks are on the currently applied styles */

      self.updateListStyleMenuState = function ($dropdownButton) {
        // editor loses selected range (e.g after blur)
        // save here... and restore after menu selection
        context.invoke('editor.saveRange');
        var $selectedtList = self.getParentList();
        var selectedListStyleType = !!$selectedtList && $selectedtList.css('list-style-type'); // console.log(selectedListStyleType);
        // console.log($parentList.attr('list-style-type'));

        var $listItems = $dropdownButton.next().find("div");
        var styleFound = false;
        $listItems.each(function () {
          var itemListStyleType = $(this).data("value");

          if (selectedListStyleType == itemListStyleType) {
            $(this).addClass("checked");
            styleFound = true;
          } else {
            $(this).removeClass("checked");
          }

          if (!styleFound) {
            // check the default style
            $listItems.filter('[data-value=""]').addClass("checked");
          }
        });
      };

      self.updateStyleType = function (style) {
        // editor loses selected range (e.g after blur)
        // restoring here
        context.invoke('editor.restoreRange');
        context.invoke('editor.focus');
        context.invoke("beforeCommand");
        self.getParentList().css("list-style-type", style);
        context.invoke("afterCommand");
      };

      self.getParentList = function (node) {
        var dom = $.summernote.dom;
        var rng = modules.editor.getLastRange.call(modules.editor);
        var node = rng.commonAncestor();
        var list = dom.ancestor(rng.commonAncestor(), dom.isList);
        if (!list) context.invoke('insertOrderedList');

        if (window.getSelection) {
          var $focusNode = $(window.getSelection().focusNode);
          var $parentList = $focusNode.closest("div.note-editable ol, div.note-editable ul");
          return $parentList;
        }

        return null;
      };

      this.events = {
        'summernote.init': function summernoteInit(_, layoutInfo) {
          var range = $.summernote.range;
          layoutInfo.toolbar.on('mouseup', '.note-btn', function (event) {
            var $target = $(event.currentTarget);
            var $listicon = $target.find('.note-icon-unorderedlist, .note-icon-orderedlist');

            if ($listicon.length) {
              setTimeout(function () {
                var rng = range.create();
                $(rng.sc).closest('ul,ol').css('list-style-type', '');
              }, 10);
            } else return;
          });
        }
      };
    }
  });
});

/***/ }),

/***/ "./src/plugin/formatting/summernote-pagebreak.js":
/*!*******************************************************!*\
  !*** ./src/plugin/formatting/summernote-pagebreak.js ***!
  \*******************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* https://github.com/DiemenDesign/summernote-pagebreak */
(function (factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  $.extend(true, $.summernote.lang, {
    'en-US': {
      pagebreak: {
        tooltip: 'Page Break'
      }
    },
    'zh-TW': {
      pagebreak: {
        tooltip: '分頁符號'
      }
    }
  });
  $.extend($.summernote.options, {
    pagebreak: {
      icon: '<i class="note-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path d="M 4,5.5 4,1 l 9,0 0,4.5 -0.750612,0 0,-3.74939 -7.498776,0 0,3.75061 L 4,5.50122 Z M 13,7.75061 13,13 4,13 4,7.75061 l 0.750612,0 0,4.5 7.5,0 0,-4.5 0.749388,0 z m -6,-1.5 1.5,0 L 8.5,7 7,7 7,6.25061 Z m -2.249388,0 1.5,0 0,0.74939 -1.5,0 0,-0.74939 z m 4.5,0 1.5,0 0,0.74939 -1.5,0 0,-0.74939 z m 2.249388,0 1.5,0 L 13,7 11.5,7 11.5,6.25061 Z M 1,4.37469 3.250612,6.62531 1,8.87469 l 0,-4.5 z"/></svg></i>',
      css: '@media all{.note-editable .page-break{position:relative;display:block;width:100%;height:1px;background-color:#ddd;margin:15px 0;}.note-editable .page-break:after{content:"Page-Break";position:absolute;width:100%;height:20px;top:-10px;color:#ddd;-webkit-text-shadow:0 0 5px #fff,0 0 5px #fff,0 0 5px #fff,0 0 5px #fff;-moz-text-shadow:0 0 5px #fff,0 0 5px #fff,0 0 5px #fff,0 0 5px #fff;text-shadow:0 0 5px #fff,0 0 5px #fff,0 0 5px #fff,0 0 5px #fff;text-align:center;}}@media print{.note-editable .page-break{display:block;page-break-before:always;}}'
    }
  });
  $.extend($.summernote.plugins, {
    'pagebreak': function pagebreak(context) {
      var ui = $.summernote.ui;
      var options = context.options;
      var lang = options.langInfo;
      var $editable = context.layoutInfo.editable;
      var self = this;

      if ($('#summernote-pagebreak-style').length == 0) {
        this.css = $('<style>').html(options.pagebreak.css);
        this.css.attr('id', 'summernote-pagebreak-style');
        $("head").append(this.css);
      }

      this.wrapCommand = function (fn) {
        return function () {
          context.invoke("beforeCommand");
          fn.apply(this, arguments);
          context.invoke("afterCommand");
        };
      };

      this.destroy = function () {
        !!this.css && $(this.css).remove();
      };

      context.memo('button.pagebreak', function () {
        var button = ui.button({
          contents: options.pagebreak.icon,
          tooltip: lang.pagebreak.tooltip,
          container: 'body',
          click: self.wrapCommand(function (e) {
            e.preventDefault();

            if (getSelection().rangeCount > 0) {
              var el = getSelection().getRangeAt(0).commonAncestorContainer.parentNode;

              if ($(el).hasClass('note-editable')) {
                el = getSelection().getRangeAt(0).commonAncestorContainer;
              }

              if (!$(el).hasClass('page-break')) {
                if ($(el).next('div.page-break').length < 1) $('<div class="page-break"></div><p><br></p>').insertAfter(el);
              }
            } else {
              if ($editable.find('div').last().attr('class') !== 'page-break') $editable.append('<div class="page-break"></div><p><br></p>');
            } // Launching this method to force Summernote sync it's content with the bound textarea element
            // context.invoke('editor.insertText','');

          })
        });
        return button.render();
      });
    }
  });
});

/***/ }),

/***/ "./src/plugin/formatting/summernote-video-attributes.js":
/*!**************************************************************!*\
  !*** ./src/plugin/formatting/summernote-video-attributes.js ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* https://github.com/DiemenDesign/summernote-video-attributes */
(function (factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  $.extend(true, $.summernote.lang, {
    'en-US': {
      /* English */
      videoAttributes: {
        dialogTitle: 'Video Attributes',
        tooltip: 'Video Attributes',
        pluginTitle: 'Video Attributes',
        href: 'URL',
        videoSize: 'Video size',
        videoOption0: 'Responsive',
        videoOption1: '1280x720',
        videoOption2: '853x480',
        videoOption3: '640x360',
        videoOption4: '560x315',
        alignment: 'Alignment',
        alignmentOption0: 'None',
        alignmentOption1: 'Left',
        alignmentOption2: 'Right',
        alignmentOption3: 'Initial',
        alignmentOption4: 'Inherit',
        suggested: 'Show Suggested videos when the video finishes',
        controls: 'Show player controls',
        autoplay: 'Autoplay',
        loop: 'Loop',
        note: 'Note: Not all options are available with all services...',
        ok: 'OK'
      }
    },
    'zh-TW': {
      videoAttributes: {
        dialogTitle: '影片屬性',
        tooltip: '影片',
        pluginTitle: '影片屬性',
        href: '網址',
        videoSize: '影片尺寸',
        videoOption0: 'Responsive',
        videoOption1: '1280x720',
        videoOption2: '853x480',
        videoOption3: '640x360',
        videoOption4: '560x315',
        alignment: '對齊方式',
        alignmentOption0: '無',
        alignmentOption1: '左',
        alignmentOption2: '右',
        alignmentOption3: '預設',
        alignmentOption4: '繼承',
        suggested: '影片結束後顯示推薦影片',
        controls: '顯示播放器控制項',
        autoplay: '自動播放',
        loop: '循環播放',
        note: 'Note: Not all options are available with all services...',
        ok: '確認'
      }
    }
  });
  var defaults = {
    showVideoSize: true,
    showVideoAlignment: true,
    showSuggestedVideos: true,
    showPlayerControls: true,
    showAutoplay: true,
    showLoop: true // icon: '<i class="note-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path d="m 12.503106,4.03105 -3.087752,0 -0.09237,-0.72049 c 0,-0.41163 -0.333714,-0.74534 -0.745341,-0.74534 l -3.180124,0 c -0.411628,0 -0.745342,0.33372 -0.745342,0.74534 l -0.09237,0.72049 -3.062907,0 C 1.22246,4.03105 1,4.24109 1,4.51553 l 0,6.40993 c 0,0.27444 0.22246,0.50932 0.496894,0.50932 l 11.006212,0 C 12.77754,11.43478 13,11.1999 13,10.92546 L 13,4.51553 C 13,4.24109 12.77754,4.03105 12.503106,4.03105 Z M 7.00236,10.77794 c -1.687652,0 -3.055751,-1.3681 -3.055751,-3.05573 0,-1.68765 1.368099,-3.05574 3.055751,-3.05574 1.687652,0 3.055752,1.3681 3.055752,3.05574 0,1.6876 -1.3681,3.05573 -3.055752,3.05573 z m 5.426211,-5.43012 -2.608695,0 0,-0.77017 2.608695,0 0,0.77017 z M 8.876472,7.71575 A 1.8687454,1.8687454 0 0 1 7.007727,9.58449 1.8687454,1.8687454 0 0 1 5.138981,7.71575 1.8687454,1.8687454 0 0 1 7.007727,5.84701 1.8687454,1.8687454 0 0 1 8.876472,7.71575 Z"/></svg></i>'

  };
  $.extend($.summernote.options, {
    videoAttributes: defaults
  });
  $.extend($.summernote.plugins, {
    'videoAttributes': function videoAttributes(context) {
      var self = this,
          ui = $.summernote.ui,
          $editor = context.layoutInfo.editor,
          $editable = context.layoutInfo.editable,
          options = context.options,
          lang = options.langInfo;
      context.memo('button.videoAttributes', function () {
        var button = ui.button({
          contents: ui.icon(options.icons.video),
          container: false,
          tooltip: lang.videoAttributes.tooltip,
          click: function click(e) {
            context.invoke('saveRange');
            context.invoke('videoAttributes.show');
          }
        });
        return button.render();
      });

      this.initialize = function () {
        var $container = options.dialogsInBody ? $(document.body) : $editor;
        var body = '<div class="form-group">' + '  <label for="note-video-attributes-href" class="control-label col-xs-3">' + lang.videoAttributes.href + '</label>' + '  <div class="input-group col-xs-9">';
        var a = options.videoAttributes.videoUrls;
        var b = Array.isArray(options.videoAttributes.videoUrls);

        if (options.videoAttributes.videoUrls !== undefined && Array.isArray(options.videoAttributes.videoUrls)) {
          body += ' <select class="note-video-attributes-href form-control">';
          options.videoAttributes.videoUrls.forEach(function (element) {
            return body += ' <option value="' + element + '">' + element + '</option>';
          });
          body += ' </select>';
        } else {
          body += '<input type="text" class="note-video-attributes-href form-control">';
        }

        body += '  </div>' + '</div>';

        if (options.videoAttributes.showVideoSize === true) {
          body += '<div class="form-group">' + '  <label for="note-video-attributes-video-size" class="control-label col-xs-3">' + lang.videoAttributes.videoSize + '</label>' + '  <div class="input-group col-xs-9">' + '    <select id="note-video-attributes-size" class="note-video-attributes-size form-control col-xs-6" readonly="readonly">' + '      <option value="0">' + lang.videoAttributes.videoOption0 + '</option>' + '      <option value="1">' + lang.videoAttributes.videoOption1 + '</option>' + '      <option value="2">' + lang.videoAttributes.videoOption2 + '</option>' + '      <option value="3" selected>' + lang.videoAttributes.videoOption3 + '</option>' + '      <option value="4">' + lang.videoAttributes.videoOption4 + '</option>' + '    </select>' + '  </div>' + '</div>';
        }

        if (options.videoAttributes.showVideoAlignment === true) {
          body += '<div class="form-group">' + '  <label for="note-video-attributes-video-alignment" class="control-label col-xs-3">' + lang.videoAttributes.alignment + '</label>' + '  <div class="input-group col-xs-9">' + '    <select id="note-video-attributes-alignment" class="note-video-attributes-alignment form-control col-xs-6">' + '      <option value="none" selected>' + lang.videoAttributes.alignmentOption0 + '</option>' + '      <option value="left">' + lang.videoAttributes.alignmentOption1 + '</option>' + '      <option value="right">' + lang.videoAttributes.alignmentOption2 + '</option>' + '      <option value="initial">' + lang.videoAttributes.alignmentOption3 + '</option>' + '      <option value="inherit">' + lang.videoAttributes.alignmentOption4 + '</option>' + '    </select>' + '  </div>' + '</div>';
        }

        if (options.videoAttributes.showSuggestedVideos === true) {
          body += '<div class="form-group clearfix">' + '  <div class="control-label col-xs-3"></div>' + '  <div class="input-group col-xs-9">' + '    <div class="checkbox checkbox-success">' + '      <input type="checkbox" id="note-video-attributes-suggested-checkbox" class="note-video-attributes-suggested-checkbox" checked>' + '      <label for="note-video-attributes-suggested-checkbox">' + lang.videoAttributes.suggested + '</label>' + '    </div>' + '  </div>' + '</div>';
        }

        if (options.videoAttributes.showPlayerControls === true) {
          body += '<div class="form-group clearfix">' + '  <div class="control-label col-xs-3"></div>' + '  <div class="input-group col-xs-9">' + '    <div class="checkbox checkbox-success">' + '      <input type="checkbox" id="note-video-attributes-controls-checkbox" class="note-video-attributes-controls-checkbox" checked>' + '      <label for="note-video-attributes-controls-checkbox">' + lang.videoAttributes.controls + '</label>' + '    </div>' + '  </div>' + '</div>';
        }

        if (options.videoAttributes.showAutoplay === true) {
          body += '<div class="form-group clearfix">' + '  <div class="control-label col-xs-3"></div>' + '  <div class="input-group col-xs-9">' + '    <div class="checkbox checkbox-success">' + '      <input type="checkbox" id="note-video-attributes-autoplay-checkbox" class="note-video-attributes-autoplay-checkbox">' + '      <label for="note-video-attributes-autoplay-checkbox">' + lang.videoAttributes.autoplay + '</label>' + '    </div>' + '  </div>' + '</div>';
        }

        if (options.videoAttributes.showLoop === true) {
          body += '<div class="form-group clearfix">' + '  <div class="control-label col-xs-3"></div>' + '  <div class="input-group col-xs-9">' + '    <div class="checkbox checkbox-success">' + '      <input type="checkbox" id="note-video-attributes-loop-checkbox" class="note-video-attributes-loop-checkbox">' + '      <label for="note-video-attributes-loop-checkbox">' + lang.videoAttributes.loop + '</label>' + '    </div>' + '  </div>' + '</div>';
        }

        body += '<div class="form-group">' + '  <div class="col-xs-3"></div>' + '  <div class="col-xs-9 help-block">' + lang.videoAttributes.note + '</div>' + '</div>';
        this.$dialog = ui.dialog({
          title: lang.videoAttributes.dialogTitle,
          body: body,
          footer: '<button href="#" class="btn btn-primary note-video-attributes-btn">' + lang.videoAttributes.ok + '</button>'
        }).render().appendTo($container);
      };

      this.destroy = function () {
        ui.hideDialog(this.$dialog);
        this.$dialog.remove();
      };

      this.bindEnterKey = function ($input, $btn) {
        $input.on('keypress', function (e) {
          if (e.keyCode === 13) $btn.trigger('click');
        });
      };

      this.bindLabels = function () {
        self.$dialog.find('.form-control:first').focus().select();
        self.$dialog.find('label').on('click', function () {
          $(this).parent().find('.form-control:first').focus();
        });
      };

      this.show = function () {
        var $vid = $($editable.data('target'));
        var vidInfo = {
          vidDom: $vid,
          href: $vid.attr('href')
        };
        this.showLinkDialog(vidInfo).then(function (vidInfo) {
          ui.hideDialog(self.$dialog);
          var $vid = vidInfo.vidDom,
              $videoHref = self.$dialog.find('.note-video-attributes-href'),
              $videoSize = self.$dialog.find('.note-video-attributes-size'),
              $videoAlignment = self.$dialog.find('.note-video-attributes-alignment'),
              $videoSuggested = self.$dialog.find('.note-video-attributes-suggested-checkbox'),
              $videoControls = self.$dialog.find('.note-video-attributes-controls-checkbox'),
              $videoAutoplay = self.$dialog.find('.note-video-attributes-autoplay-checkbox'),
              $videoLoop = self.$dialog.find('.note-video-attributes-loop-checkbox'),
              url = $videoHref.val(),
              $videoHTML = $('<div/>');

          if ($videoSize.val() === 0) {
            $videoHTML.addClass('embed-responsive embed-responsive-16by9');
            $videoHTML.css({
              'float': $videoAlignment.val()
            });
          }

          var videoWidth = 'auto',
              videoHeight = 'auto';
          if ($videoSize.val() === "1") videoWidth = '1280', videoHeight = '720';
          if ($videoSize.val() === "2") videoWidth = '853', videoHeight = '480';
          if ($videoSize.val() === "3") videoWidth = '640', videoHeight = '360';
          if ($videoSize.val() === "4") videoWidth = '560', videoHeight = '315';
          var ytMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/);
          var igMatch = url.match(/(?:www\.|\/\/)instagram\.com\/p\/(.[a-zA-Z0-9_-]*)/);
          var vMatch = url.match(/\/\/vine\.co\/v\/([a-zA-Z0-9]+)/);
          var vimMatch = url.match(/\/\/(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/);
          var dmMatch = url.match(/.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
          var youkuMatch = url.match(/\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/);
          var mp4Match = url.match(/^.+.(mp4|m4v)$/);
          var oggMatch = url.match(/^.+.(ogg|ogv)$/);
          var webmMatch = url.match(/^.+.(webm)$/);
          var $video;
          var urlVars = '';

          if (ytMatch && ytMatch[1].length === 11) {
            if (!$videoSuggested.is(':checked')) urlVars += 'rel=0';
            if (!$videoControls.is(':checked')) urlVars += '&controls=0';
            if ($videoAutoplay.is(':checked')) urlVars += '&autoplay=1';
            if (!$videoLoop.is(':checked')) urlVars += '&loop=0';
            var youtubeId = ytMatch[1];
            $video = $('<iframe>').attr('frameborder', 0).attr('src', '//www.youtube.com/embed/' + youtubeId + '?' + urlVars).attr('width', videoWidth).attr('height', videoHeight);
          } else if (igMatch && igMatch[0].length) {
            $video = $('<iframe>').attr('frameborder', 0).attr('src', 'https://instagram.com/p/' + igMatch[1] + '/embed/').attr('width', videoWidth).attr('height', videoHeight).attr('scrolling', 'no').attr('allowtransparency', 'true');
          } else if (vMatch && vMatch[0].length) {
            $video = $('<iframe>').attr('frameborder', 0).attr('src', vMatch[0] + '/embed/simple').attr('width', videoWidth).attr('height', videoHeight).attr('class', 'vine-embed');
          } else if (vimMatch && vimMatch[3].length) {
            if ($videoAutoplay.is(':checked')) urlVars += '&autoplay=1';
            if ($videoLoop.is(':checked')) urlVars += '&loop=1';
            $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>').attr('frameborder', 0).attr('src', '//player.vimeo.com/video/' + vimMatch[3] + '?' + urlVars).attr('width', videoWidth).attr('height', videoHeight);
          } else if (dmMatch && dmMatch[2].length) {
            if (!$videoSuggested.is(':checked')) urlVars += 'related=1';
            if (!$videoAutoplay.is(':checked')) urlVars += 'autoplay=1';else urlVars += 'autoplay=0';
            $video = $('<iframe>').attr('frameborder', 0).attr('src', '//www.dailymotion.com/embed/video/' + dmMatch[2]).attr('width', videoWidth).attr('height', videoHeight);
          } else if (youkuMatch && youkuMatch[1].length) {
            $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>').attr('frameborder', 0).attr('width', videoWidth).attr('height', videoHeight).attr('src', '//player.youku.com/embed/' + youkuMatch[1]);
          } else if (mp4Match || oggMatch || webmMatch) {
            $video = $('<video controls>').attr('src', url).attr('width', videoWidth).attr('height', videoHeight);
          }

          if ($videoSize.val() === 0) $video.addClass('embed-responsive');else $video.css({
            'float': $videoAlignment.val()
          });
          $video.addClass('note-video-clip');
          $videoHTML.html($video);
          context.invoke('restoreRange');
          context.invoke('editor.insertNode', $videoHTML[0]);
        });
      };

      this.showLinkDialog = function (vidInfo) {
        return $.Deferred(function (deferred) {
          var $videoHref = self.$dialog.find('.note-video-attributes-href');
          $editBtn = self.$dialog.find('.note-video-attributes-btn');
          ui.onDialogShown(self.$dialog, function () {
            context.triggerEvent('dialog.shown');
            $editBtn.click(function (e) {
              e.preventDefault();
              deferred.resolve({
                vidDom: vidInfo.vidDom,
                href: $videoHref.val()
              });
            });
            $videoHref.val(vidInfo.href).focus;
            self.bindEnterKey($editBtn);
            self.bindLabels();
          });
          ui.onDialogHidden(self.$dialog, function () {
            $editBtn.off('click');
            if (deferred.state() === 'pending') deferred.reject();
          });
          ui.showDialog(self.$dialog);
        });
      };
    }
  });
});

/***/ }),

/***/ "./src/plugin/insert/summernote-at-mention.js":
/*!****************************************************!*\
  !*** ./src/plugin/insert/summernote-at-mention.js ***!
  \****************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

/******/
(function (modules) {
  // webpackBootstrap

  /******/
  // The module cache

  /******/
  var installedModules = {};
  /******/

  /******/
  // The require function

  /******/

  function __webpack_require__(moduleId) {
    /******/

    /******/
    // Check if module is in cache

    /******/
    if (installedModules[moduleId]) {
      /******/
      return installedModules[moduleId].exports;
      /******/
    }
    /******/
    // Create a new module (and put it into the cache)

    /******/


    var module = installedModules[moduleId] = {
      /******/
      i: moduleId,

      /******/
      l: false,

      /******/
      exports: {}
      /******/

    };
    /******/

    /******/
    // Execute the module function

    /******/

    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/

    /******/
    // Flag the module as loaded

    /******/

    module.l = true;
    /******/

    /******/
    // Return the exports of the module

    /******/

    return module.exports;
    /******/
  }
  /******/

  /******/

  /******/
  // expose the modules object (__webpack_modules__)

  /******/


  __webpack_require__.m = modules;
  /******/

  /******/
  // expose the module cache

  /******/

  __webpack_require__.c = installedModules;
  /******/

  /******/
  // define getter function for harmony exports

  /******/

  __webpack_require__.d = function (exports, name, getter) {
    /******/
    if (!__webpack_require__.o(exports, name)) {
      /******/
      Object.defineProperty(exports, name, {
        /******/
        configurable: false,

        /******/
        enumerable: true,

        /******/
        get: getter
        /******/

      });
      /******/
    }
    /******/

  };
  /******/

  /******/
  // getDefaultExport function for compatibility with non-harmony modules

  /******/


  __webpack_require__.n = function (module) {
    /******/
    var getter = module && module.__esModule ?
    /******/
    function getDefault() {
      return module['default'];
    } :
    /******/
    function getModuleExports() {
      return module;
    };
    /******/

    __webpack_require__.d(getter, 'a', getter);
    /******/


    return getter;
    /******/
  };
  /******/

  /******/
  // Object.prototype.hasOwnProperty.call

  /******/


  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/

  /******/
  // __webpack_public_path__

  /******/


  __webpack_require__.p = "";
  /******/

  /******/
  // Load entry module and return exports

  /******/

  return __webpack_require__(__webpack_require__.s = 0);
  /******/
})(
/************************************************************************/

/******/
[
/* 0 */

/***/
function (module, exports, __webpack_require__) {
  module.exports = __webpack_require__(1);
  /***/
},
/* 1 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

  var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return _typeof2(obj);
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
  };

  var _selectionPreserver = __webpack_require__(2);

  var _selectionPreserver2 = _interopRequireDefault(_selectionPreserver);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  var WORD_REGEX = /^[^\s]+$/;
  var UP_KEY_CODE = 38;
  var DOWN_KEY_CODE = 40;
  var ENTER_KEY_CODE = 13;

  (function (factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
  })(function ($) {
    $.extend($.summernote.plugins, {
      summernoteAtMention: function summernoteAtMention(context) {
        var _this = this;
        /************************
         * Setup instance vars. *
         ************************/


        this.editableEl = context.layoutInfo.editable[0];
        this.editorEl = context.layoutInfo.editor[0];
        this.autocompleteAnchor = {
          left: null,
          top: null
        };
        this.autocompleteContainer = null;
        this.showingAutocomplete = false;
        this.selectedIndex = null;
        this.suggestions = null;

        this.getSuggestions = function (_) {
          return [];
        };
        /********************
         * Read-in options. *
         ********************/


        if (context.options && context.options.callbacks && context.options.callbacks.summernoteAtMention) {
          var summernoteCallbacks = context.options.callbacks.summernoteAtMention;

          if (summernoteCallbacks.getSuggestions) {
            this.getSuggestions = summernoteCallbacks.getSuggestions;
          }

          if (summernoteCallbacks.onSelect) {
            this.onSelect = summernoteCallbacks.onSelect;
          }
        }
        /**********
         * Events *
         **********/


        this.events = {
          "summernote.blur": function summernoteBlur() {
            if (_this.showingAutocomplete) _this.hideAutocomplete();
          },
          "summernote.keydown": function summernoteKeydown(_, event) {
            if (_this.showingAutocomplete) {
              switch (event.keyCode) {
                case ENTER_KEY_CODE:
                  {
                    event.preventDefault();
                    event.stopPropagation();

                    _this.handleEnter();

                    break;
                  }

                case UP_KEY_CODE:
                  {
                    event.preventDefault();
                    event.stopPropagation();
                    var newIndex = _this.selectedIndex === 0 ? 0 : _this.selectedIndex - 1;

                    _this.updateAutocomplete(_this.suggestions, newIndex);

                    break;
                  }

                case DOWN_KEY_CODE:
                  {
                    event.preventDefault();
                    event.stopPropagation();

                    var _newIndex = _this.selectedIndex === _this.suggestions.length - 1 ? _this.selectedIndex : _this.selectedIndex + 1;

                    _this.updateAutocomplete(_this.suggestions, _newIndex);

                    break;
                  }
              }
            }
          },
          "summernote.keyup": function summernoteKeyup(_, event) {
            var selection = document.getSelection();
            var currentText = selection.anchorNode.nodeValue;

            var _findWordAndIndices = _this.findWordAndIndices(currentText || "", selection.anchorOffset),
                word = _findWordAndIndices.word,
                absoluteIndex = _findWordAndIndices.absoluteIndex;

            var trimmedWord = word.slice(1);

            if (_this.showingAutocomplete && ![DOWN_KEY_CODE, UP_KEY_CODE, ENTER_KEY_CODE].includes(event.keyCode)) {
              if (word[0] === "@") {
                var suggestions = _this.getSuggestions(trimmedWord);

                _this.updateAutocomplete(suggestions, _this.selectedIndex);
              } else {
                _this.hideAutocomplete();
              }
            } else if (!_this.showingAutocomplete && word[0] === "@") {
              _this.suggestions = _this.getSuggestions(trimmedWord);
              _this.selectedIndex = 0;

              _this.showAutocomplete(absoluteIndex, selection.anchorNode);
            }
          }
        };
        /***********
         * Helpers *
         ***********/

        this.handleEnter = function () {
          _this.handleSelection();
        };

        this.handleClick = function (suggestion) {
          var selectedIndex = _this.suggestions.findIndex(function (s) {
            return s === suggestion;
          });

          if (selectedIndex === -1) {
            throw new Error("Unable to find suggestion in suggestions.");
          }

          _this.selectedIndex = selectedIndex;

          _this.handleSelection();
        };

        this.handleSelection = function () {
          if (_this.suggestions === null || _this.suggestions.length === 0) {
            return;
          }

          var newWord = _this.suggestions[_this.selectedIndex];

          if (_this.onSelect !== undefined) {
            _this.onSelect(newWord);

            return;
          }

          var selection = document.getSelection();
          var currentText = selection.anchorNode.nodeValue;

          var _findWordAndIndices2 = _this.findWordAndIndices(currentText || "", selection.anchorOffset),
              word = _findWordAndIndices2.word,
              absoluteIndex = _findWordAndIndices2.absoluteIndex;

          var selectionPreserver = new _selectionPreserver2["default"](_this.editableEl);
          selectionPreserver.preserve();
          selection.anchorNode.textContent = currentText.slice(0, absoluteIndex + 1) + newWord + " " + currentText.slice(absoluteIndex + word.length);
          selectionPreserver.restore(absoluteIndex + newWord.length + 1);

          if (context.options.callbacks.onChange !== undefined) {
            context.options.callbacks.onChange(_this.editableEl.innerHTML);
          }
        };

        this.updateAutocomplete = function (suggestions, selectedIndex) {
          _this.selectedIndex = selectedIndex;
          _this.suggestions = suggestions;

          _this.renderAutocomplete();
        };

        this.showAutocomplete = function (atTextIndex, indexAnchor) {
          if (_this.showingAutocomplete) {
            throw new Error("Cannot call showAutocomplete if autocomplete is already showing.");
          }

          _this.setAutocompleteAnchor(atTextIndex, indexAnchor);

          _this.renderAutocompleteContainer();

          _this.renderAutocomplete();

          _this.showingAutocomplete = true;
        };

        this.renderAutocompleteContainer = function () {
          _this.autocompleteContainer = document.createElement("div");
          _this.autocompleteContainer.style.top = String(_this.autocompleteAnchor.top) + "px";
          _this.autocompleteContainer.style.left = String(_this.autocompleteAnchor.left) + "px";
          _this.autocompleteContainer.style.position = "absolute";
          _this.autocompleteContainer.style.backgroundColor = "#e4e4e4";
          _this.autocompleteContainer.style.zIndex = Number.MAX_SAFE_INTEGER;
          document.body.appendChild(_this.autocompleteContainer);
        };

        this.renderAutocomplete = function () {
          if (_this.autocompleteContainer === null) {
            throw new Error("Cannot call renderAutocomplete without an autocompleteContainer. ");
          }

          var autocompleteContent = document.createElement("div");

          _this.suggestions.forEach(function (suggestion, idx) {
            var suggestionDiv = document.createElement("div");
            suggestionDiv.textContent = suggestion;
            suggestionDiv.style.padding = "5px 10px";

            if (_this.selectedIndex === idx) {
              suggestionDiv.style.backgroundColor = "#2e6da4";
              suggestionDiv.style.color = "white";
            }

            suggestionDiv.addEventListener("mousedown", function () {
              _this.handleClick(suggestion);
            });
            autocompleteContent.appendChild(suggestionDiv);
          });

          _this.autocompleteContainer.innerHTML = "";

          _this.autocompleteContainer.appendChild(autocompleteContent);
        };

        this.hideAutocomplete = function () {
          if (!_this.showingAutocomplete) throw new Error("Cannot call hideAutocomplete if autocomplete is not showing.");
          document.body.removeChild(_this.autocompleteContainer);
          _this.autocompleteAnchor = {
            left: null,
            top: null
          };
          _this.selectedIndex = null;
          _this.suggestions = null;
          _this.showingAutocomplete = false;
        };

        this.findWordAndIndices = function (text, offset) {
          if (offset > text.length) {
            return {
              word: "",
              relativeIndex: 0
            };
          } else {
            var leftWord = "";
            var rightWord = "";
            var relativeIndex = 0;
            var absoluteIndex = offset;

            for (var currentOffset = offset; currentOffset > 0; currentOffset--) {
              if (text[currentOffset - 1].match(WORD_REGEX)) {
                leftWord = text[currentOffset - 1] + leftWord;
                relativeIndex++;
                absoluteIndex--;
              } else {
                break;
              }
            }

            for (var _currentOffset = offset - 1; _currentOffset > 0 && _currentOffset < text.length - 1; _currentOffset++) {
              if (text[_currentOffset + 1].match(WORD_REGEX)) {
                rightWord = rightWord + text[_currentOffset + 1];
              } else {
                break;
              }
            }

            return {
              word: leftWord + rightWord,
              relativeIndex: relativeIndex,
              absoluteIndex: absoluteIndex
            };
          }
        };

        this.setAutocompleteAnchor = function (atTextIndex, indexAnchor) {
          var html = indexAnchor.parentNode.innerHTML;
          var text = indexAnchor.nodeValue;
          var atIndex = -1;

          for (var i = 0; i <= atTextIndex; i++) {
            if (text[i] === "@") {
              atIndex++;
            }
          }

          var htmlIndex = void 0;

          for (var _i = 0, htmlAtIndex = 0; _i < html.length; _i++) {
            if (html[_i] === "@") {
              if (htmlAtIndex === atIndex) {
                htmlIndex = _i;
                break;
              } else {
                htmlAtIndex++;
              }
            }
          }

          var atNodeId = "at-node-" + String(Math.floor(Math.random() * 10000));
          var spanString = "<span id=\"" + atNodeId + "\">@</span>";
          var selectionPreserver = new _selectionPreserver2["default"](_this.editableEl);
          selectionPreserver.preserve();
          indexAnchor.parentNode.innerHTML = html.slice(0, htmlIndex) + spanString + html.slice(htmlIndex + 1);
          var anchorElement = document.querySelector("#" + atNodeId);
          var anchorBoundingRect = anchorElement.getBoundingClientRect();
          _this.autocompleteAnchor = {
            top: anchorBoundingRect.top + anchorBoundingRect.height + 2,
            left: anchorBoundingRect.left
          };
          selectionPreserver.findRangeStartContainer().parentNode.innerHTML = html;
          selectionPreserver.restore();
        };
      }
    });
  });
  /***/

},
/* 2 */

/***/
function (module, exports, __webpack_require__) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var SelectionPreserver = function () {
    function SelectionPreserver(rootNode) {
      _classCallCheck(this, SelectionPreserver);

      if (rootNode === undefined || rootNode === null) {
        throw new Error("Please provide a valid rootNode.");
      }

      this.rootNode = rootNode;
      this.rangeStartContainerAddress = null;
      this.rangeStartOffset = null;
    }

    _createClass(SelectionPreserver, [{
      key: "preserve",
      value: function preserve() {
        var selection = window.getSelection();
        this.rangeStartOffset = selection.getRangeAt(0).startOffset;
        this.rangeStartContainerAddress = this.findRangeStartContainerAddress(selection);
      }
    }, {
      key: "restore",
      value: function restore(restoreIndex) {
        if (this.rangeStartOffset === null || this.rangeStartContainerAddress === null) {
          throw new Error("Please call preserve() first.");
        }

        var rangeStartContainer = this.findRangeStartContainer();
        var range = document.createRange();
        var offSet = restoreIndex || this.rangeStartOffset;
        range.setStart(rangeStartContainer, offSet);
        range.collapse();
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }, {
      key: "findRangeStartContainer",
      value: function findRangeStartContainer() {
        var rangeStartContainer = this.rootNode;
        this.rangeStartContainerAddress.forEach(function (address) {
          rangeStartContainer = rangeStartContainer.childNodes[address];
        });
        return rangeStartContainer;
      }
    }, {
      key: "findRangeStartContainerAddress",
      value: function findRangeStartContainerAddress(selection) {
        var rangeStartContainerAddress = [];

        for (var currentContainer = selection.getRangeAt(0).startContainer; currentContainer !== this.rootNode; currentContainer = currentContainer.parentNode) {
          var parent = currentContainer.parentElement;
          var children = parent.childNodes;

          for (var i = 0; i < children.length; i++) {
            if (children[i] === currentContainer) {
              rangeStartContainerAddress = [i].concat(_toConsumableArray(rangeStartContainerAddress));
              break;
            }
          }
        }

        return rangeStartContainerAddress;
      }
    }]);

    return SelectionPreserver;
  }();

  exports["default"] = SelectionPreserver;
  /***/
},
/* 3 */

/***/
function (module, exports) {
  module.exports = $;
  /***/
}]);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./src/plugin/insert/summernote-element-template.js":
/*!**********************************************************!*\
  !*** ./src/plugin/insert/summernote-element-template.js ***!
  \**********************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * base on
 * [summernote-template](https://github.com/Nanakii/summernote-plugins/tree/master/plugin/template)
 * [summernote-templates](https://github.com/DiemenDesign/summernote-templates)
 */
(function (factory) {
  /* global define */
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  $.extend(true, $.summernote.lang, {
    'zh-TW': {
      template: {
        template: '模版',
        insert: '插入模版'
      }
    },
    'en-US': {
      template: {
        template: 'Template',
        insert: 'Insert Template'
      }
    }
  });
  $.extend($.summernote.options, {
    template: {}
  }); // Extend plugins for adding templates

  $.extend($.summernote.plugins, {
    /**
     * @param {Object} context - context object has status of editor.
     */
    'template': function template(context) {
      var ui = $.summernote.ui;
      var lang = context.options.langInfo.template;
      var options = context.options.template;
      var defaultOptions = {
        label: lang.template,
        tooltip: lang.insert,
        list: {}
      }; // Assign default values if not supplied

      for (var propertyName in defaultOptions) {
        if (options.hasOwnProperty(propertyName) === false) {
          options[propertyName] = defaultOptions[propertyName];
        }
      } // add template button


      context.memo('button.template', function () {
        // create button
        var button = ui.buttonGroup([ui.button({
          className: 'dropdown-toggle',
          contents: '<span class="template"/> ' + options.label + ' <span class="caret"></span>',
          tooltip: options.tooltip,
          data: {
            toggle: 'dropdown'
          }
        }), ui.dropdown({
          className: 'dropdown-template',
          items: Object.keys(options.list),
          click: function click(event) {
            event.preventDefault();
            var $button = $(event.target);
            var value = $button.data('value');
            var node = options.list[value].get(0);
            context.invoke('editor.insertNode', node);
          }
        })]); // create jQuery object from button instance.

        return button.render();
      });
    }
  });
});

/***/ }),

/***/ "./src/plugin/insert/summernote-file.js":
/*!**********************************************!*\
  !*** ./src/plugin/insert/summernote-file.js ***!
  \**********************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Copyright 2019 [nobsod | Mathieu Coingt].
 * Website: https://www.nobsod.fr
 * Email: dev@nobsod.fr
 * License: MIT
 *
 * Fork from summernote-audio : https://github.com/taalendigitaal/summernote-audio
 */
(function (factory) {
  /* Global define */
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  $.extend(true, $.summernote.lang, {
    'en-US': {
      file: {
        file: 'File',
        btn: 'File',
        insert: 'Insert File',
        selectFromFiles: 'Select from files',
        url: 'File URL',
        maximumFileSize: 'Maximum file size',
        maximumFileSizeError: 'Maximum file size exceeded.'
      }
    },
    'zh-TW': {
      file: {
        file: '檔案',
        btn: '檔案',
        insert: '插入檔案',
        selectFromFiles: '從本機上傳',
        url: '檔案網址',
        maximumFileSize: '檔案大小上限',
        maximumFileSizeError: '檔案過大'
      }
    },
    'fr-FR': {
      file: {
        file: 'Fichier',
        btn: 'Fichier',
        insert: 'Insérer un fichier',
        selectFromFiles: 'Sélectionner depuis les fichiers',
        url: 'URL du fichier',
        maximumFileSize: 'Poids maximum du fichier',
        maximumFileSizeError: 'Poids maximum dépassé.'
      }
    },
    'cs-CZ': {
      file: {
        file: 'Soubor',
        btn: 'Soubor',
        insert: 'Vložit soubor',
        selectFromFiles: 'Vybrat ze souborů',
        url: 'URL souboru',
        maximumFileSize: 'Maximální velikost souboru',
        maximumFileSizeError: 'Maximální velikost souboru překročena.'
      }
    }
  });
  $.extend($.summernote.options, {
    file: {
      icon: '<i class="note-icon-file"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="14px" height="14px"><path d="M 16 3.59375 L 15.28125 4.28125 L 8.28125 11.28125 L 9.71875 12.71875 L 15 7.4375 L 15 24 L 17 24 L 17 7.4375 L 22.28125 12.71875 L 23.71875 11.28125 L 16.71875 4.28125 L 16 3.59375 z M 7 26 L 7 28 L 25 28 L 25 26 L 7 26 z" style="fill:none;stroke:#111111;stroke-width:3;stroke-linecap:round;"/></svg></i>'
    },
    callbacks: {
      onFileUpload: null,
      onFileUploadError: null,
      onFileLinkInsert: null,
      onFileUploadDone: null
    }
  });
  $.extend($.summernote.plugins, {
    /**
     *  @param {Object} context - context object has status of editor.
     */
    'file': function file(context) {
      var self = this,
          // ui has renders to build ui elements
      // for e.g. you can create a button with 'ui.button'
      ui = $.summernote.ui,
          $note = context.layoutInfo.note,
          // contentEditable element
      $editor = context.layoutInfo.editor,
          $editable = context.layoutInfo.editable,
          $toolbar = context.layoutInfo.toolbar,
          // options holds the Options Information from Summernote and what we extended above.
      options = context.options,
          // lang holds the Language Information from Summernote and what we extended above.
      lang = options.langInfo;
      context.memo('button.file', function () {
        // Here we create a button
        var button = ui.button({
          // icon for button
          contents: options.file.icon,
          // tooltip for button
          tooltip: lang.file.file,
          click: function click(e) {
            context.invoke('file.show');
          }
        });
        return button.render();
      });

      this.initialize = function () {
        // This is how we can add a Modal Dialog to allow users to interact with the Plugin.
        // get the correct container for the plugin how it's attached to the document DOM.
        var $container = options.dialogsInBody ? $(document.body) : $editor;
        var fileLimitation = '';

        if (options.maximumFileSize) {
          var unit = Math.floor(Math.log(options.maximumFileSize) / Math.log(1024));
          var readableSize = (options.maximumFileSize / Math.pow(1024, unit)).toFixed(2) * 1 + ' ' + ' KMGTP'[unit] + 'B';
          fileLimitation = '<small>' + lang.file.maximumFileSize + ' : ' + readableSize + '</small>';
        } // Build the Body HTML of the Dialog.


        var body = ['<div class="form-group note-form-group note-group-select-from-files">', "<label class=\"note-form-label\" for=\"note-dialog-file-".concat(options.id, "\">") + lang.file.selectFromFiles + '</label>', '<input class="note-file-input note-form-control form-control-file note-input" ', " id=\"note-dialog-file-".concat(options.id, "\""), ' type="file" name="files" accept="*/*">', '</div>', fileLimitation, '<div class="form-group note-group-image-url" style="overflow:auto;">', '<label class="note-form-label">' + lang.file.url + '</label>', '<input class="note-file-url form-control note-form-control note-input ', ' col-md-12" type="text">', '</div>'].join(''); // Build the Footer HTML of the Dialog.

        var footer = '<button href="#" class="btn btn-primary note-file-btn">' + lang.file.insert + '</button>';
        this.$dialog = ui.dialog({
          // Set the title for the Dialog. Note: We don't need to build the markup for the Modal
          // Header, we only need to set the Title.
          title: lang.file.insert,
          // Set the Body of the Dialog.
          body: body,
          // Set the Footer of the Dialog.
          footer: footer // This adds the Modal to the DOM.

        }).render().appendTo($container);
      };

      this.destroy = function () {
        ui.hideDialog(this.$dialog);
        this.$dialog.remove();
      };

      this.bindEnterKey = function ($input, $btn) {
        $input.on('keypress', function (event) {
          if (event.keyCode === 13) $btn.trigger('click');
        });
      };

      this.bindLabels = function () {
        self.$dialog.find('.form-control:first').focus().select();
        self.$dialog.find('label').on('click', function () {
          $(this).parent().find('.form-control:first').focus();
        });
      };
      /**
       * @method readFileAsDataURL
       *
       * read contents of file as representing URL
       *
       * @param {File} file
       * @return {Promise} - then: dataUrl
       *
       * @todo this method already exists in summernote.js so we should use that one
       */


      this.readFileAsDataURL = function (file) {
        return $.Deferred(function (deferred) {
          $.extend(new FileReader(), {
            onload: function onload(e) {
              var dataURL = e.target.result;
              deferred.resolve(dataURL);
            },
            onerror: function onerror(err) {
              deferred.reject(err);
            }
          }).readAsDataURL(file);
        }).promise();
      };

      this.createFile = function (url) {
        // IMG url patterns (jpg, jpeg, png, gif, svg, webp)
        var imgRegExp = /^.+.(jpg|jpeg|png|gif|svg|webp)$/;
        var imgBase64RegExp = /^data:(image\/jpeg|image\/png|image\/gif|image\/svg|image\/webp).+$/; // AUDIO url patterns (mp3, ogg, oga)

        var audioRegExp = /^.+.(mp3|ogg|oga)$/;
        var audioBase64RegExp = /^data:(audio\/mpeg|audio\/ogg).+$/; // VIDEO url patterns (mp4, ogc, webm)

        var videoRegExp = /^.+.(mp4|ogv|webm)$/;
        var videoBase64RegExp = /^data:(video\/mpeg|video\/mp4|video\/ogv|video\/webm).+$/;
        var $file;

        if (url.match(imgRegExp) || url.match(imgBase64RegExp)) {
          $file = $('<img>').attr('src', url);
        } else if (url.match(audioRegExp) || url.match(audioBase64RegExp)) {
          $file = $('<audio controls>').attr('src', url);
        } else if (url.match(videoRegExp) || url.match(videoBase64RegExp)) {
          $file = $('<video controls>').attr('src', url);
        } else {
          //We can't use this type of file. You have to implement onFileUpload into your Summernote
          console.log('File type not supported. Please define "onFileUpload" callback in Summernote.');
          return false;
        }

        $file.addClass('note-file-clip');
        return $file;
      };

      this.insertFile = function (src, param) {
        var $file = self.createFile(src);

        if (!$file) {
          context.triggerEvent('file.upload.error');
        }

        context.invoke('editor.beforeCommand');

        if (typeof param === 'string') {
          $file.attr('data-filename', param);
        }

        $file.show();
        context.invoke('editor.insertNode', $file[0]);
        context.invoke('editor.afterCommand');
      };

      this.insertFilesAsDataURL = function (files) {
        $.each(files, function (idx, file) {
          var filename = file.name;

          if (options.maximumFileSize && options.maximumFileSize < file.size) {
            context.triggerEvent('file.upload.error', lang.file.maximumFileSizeError);
          } else {
            self.readFileAsDataURL(file).then(function (dataURL) {
              return self.insertFile(dataURL, filename);
            }).fail(function () {
              context.triggerEvent('file.upload.error');
            });
          }
        });
      };

      this.show = function (data) {
        context.invoke('editor.saveRange');
        this.showFileDialog().then(function (data) {
          // [workaround] hide dialog before restore range for IE range focus
          ui.hideDialog(self.$dialog);
          context.invoke('editor.restoreRange');

          if (typeof data === 'string') {
            // file url
            // If onFileLinkInsert set
            if (options.callbacks.onFileLinkInsert) {
              context.triggerEvent('file.link.insert', data);
            } else {
              self.insertFile(data);
            }
          } else {
            // array of files
            // If onFileUpload set
            if (options.callbacks.onFileUpload) {
              context.triggerEvent('file.upload', data);
            } else {
              // else insert File as dataURL
              self.insertFilesAsDataURL(data);
            }
          }
        }).fail(function () {
          context.invoke('editor.restoreRange');
        }).done(function () {
          if (!!options.callbacks.onFileUploadDone) options.callbacks.onFileUploadDone();
        });
      };

      this.showFileDialog = function () {
        return $.Deferred(function (deferred) {
          var $fileInput = self.$dialog.find('.note-file-input');
          var $fileUrl = self.$dialog.find('.note-file-url');
          var $fileBtn = self.$dialog.find('.note-file-btn');
          ui.onDialogShown(self.$dialog, function () {
            context.triggerEvent('dialog.shown'); // Cloning FileInput to clear element.

            $fileInput.replaceWith($fileInput.clone().on('change', function (event) {
              deferred.resolve(event.target.files || event.target.value);
            }).val(''));
            $fileBtn.click(function (e) {
              e.preventDefault();
              deferred.resolve($fileUrl.val());
            });
            $fileUrl.on('keyup paste', function () {
              var url = $fileUrl.val();
              ui.toggleBtn($fileBtn, url);
            }).val('');
            self.bindEnterKey($fileUrl, $fileBtn);
            self.bindLabels();
          });
          ui.onDialogHidden(self.$dialog, function () {
            $fileInput.off('change');
            $fileUrl.off('keyup paste keypress');
            $fileBtn.off('click');
            if (deferred.state() === 'pending') deferred.reject();
          });
          ui.showDialog(self.$dialog);
        });
      };
    }
  });
});

/***/ }),

/***/ "./src/plugin/misc/font/summernote-ext-table.eot":
/*!*******************************************************!*\
  !*** ./src/plugin/misc/font/summernote-ext-table.eot ***!
  \*******************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "02574bad7d20c3cd09a76329c39cea71.eot";

/***/ }),

/***/ "./src/plugin/misc/font/summernote-ext-table.ttf":
/*!*******************************************************!*\
  !*** ./src/plugin/misc/font/summernote-ext-table.ttf ***!
  \*******************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fbeb5e0f04ab769ee7dbcac2f48ff5f1.ttf";

/***/ }),

/***/ "./src/plugin/misc/font/summernote-ext-table.woff":
/*!********************************************************!*\
  !*** ./src/plugin/misc/font/summernote-ext-table.woff ***!
  \********************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "2adc3336b1f0f264f0196b023b162551.woff";

/***/ }),

/***/ "./src/plugin/misc/font/summernote-ext-table.woff2":
/*!*********************************************************!*\
  !*** ./src/plugin/misc/font/summernote-ext-table.woff2 ***!
  \*********************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "9fbc6dd827f265717322bb1bcb4bc6b9.woff2";

/***/ }),

/***/ "./src/plugin/misc/summernote-ext-print.js":
/*!*************************************************!*\
  !*** ./src/plugin/misc/summernote-ext-print.js ***!
  \*************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  /* global define */
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  // Extends lang for print plugin.
  $.extend(true, $.summernote.lang, {
    'en-US': {
      print: {
        print: 'Print'
      }
    },
    'ko-KR': {
      print: {
        print: '인쇄'
      }
    },
    'pt-BR': {
      print: {
        print: 'Imprimir'
      }
    },
    'zh-TW': {
      print: {
        print: '列印'
      }
    }
  }); // Extends plugins for print plugin.

  $.extend($.summernote.plugins, {
    /**
     * @param {Object} context - context object has status of editor.
     */
    'print': function print(context) {
      var self = this; // ui has renders to build ui elements.
      //  - you can create a button with `ui.button`

      var ui = $.summernote.ui;
      var $editor = context.layoutInfo.editor;
      var options = context.options;
      var lang = options.langInfo;

      var isFF = function isFF() {
        var userAgent = navigator.userAgent;
        var isEdge = /Edge\/\d+/.test(userAgent);
        return !isEdge && /firefox/i.test(userAgent);
      };

      var fillContentAndPrint = function fillContentAndPrint($frame, content) {
        $frame.contents().find('body').html(content);
        setTimeout(function () {
          $frame[0].contentWindow.focus();
          $frame[0].contentWindow.print();
          $frame.remove();
          $frame = null;
        }, 250);
      };

      var getPrintframe = function getPrintframe($container) {
        var $frame = $('<iframe name="summernotePrintFrame"' + 'width="0" height="0" frameborder="0" src="about:blank" style="visibility:hidden">' + '</iframe>');
        $frame.appendTo($editor.parent());
        var $head = $frame.contents().find('head');

        if (options.print && options.print.stylesheetUrl) {
          // Use dedicated styles
          var css = document.createElement('link');
          css.href = options.print.stylesheetUrl;
          css.rel = 'stylesheet';
          css.type = 'text/css';
          $head.append(css);
        } else {
          // Inherit styles from document
          $('style, link[rel=stylesheet]', document).each(function () {
            $head.append($(this).clone());
          });
        } // pagebreak plugin


        $head.append('<style>@media all{body .page-break{position:relative;display:block;width:100%;height:1px;background-color:#ddd;margin:15px 0;}body .page-break:after{content:"Page-Break";position:absolute;width:100%;height:20px;top:-10px;color:#ddd;-webkit-text-shadow:0 0 5px #fff,0 0 5px #fff,0 0 5px #fff,0 0 5px #fff;-moz-text-shadow:0 0 5px #fff,0 0 5px #fff,0 0 5px #fff,0 0 5px #fff;text-shadow:0 0 5px #fff,0 0 5px #fff,0 0 5px #fff,0 0 5px #fff;text-align:center;}}@media print{body .page-break{display:block;page-break-before:always;}body .page-break:after{visibility:hidden}}</style>');
        return $frame;
      }; // add print button


      context.memo('button.print', function () {
        // create button
        var button = ui.button({
          // contents: '<i class="fa fa-print"/> ' + lang.print.print,
          contents: "<i class=\"note-icon\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-printer\" viewBox=\"0 0 16 16\">\n            <path d=\"M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z\"/>\n            <path d=\"M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z\"/>\n            </svg></i>",
          tooltip: lang.print.print,
          container: options.container,
          click: function click() {
            var $frame = getPrintframe();
            var content = context.invoke('code');

            if (isFF()) {
              $frame[0].onload = function () {
                fillContentAndPrint($frame, content);
              };
            } else {
              fillContentAndPrint($frame, content);
            }
          }
        });
        return button.render();
      });
    }
  });
});

/***/ }),

/***/ "./src/plugin/misc/summernote-ext-table.css":
/*!**************************************************!*\
  !*** ./src/plugin/misc/summernote-ext-table.css ***!
  \**************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!./summernote-ext-table.css */ "./node_modules/css-loader/dist/cjs.js!./src/plugin/misc/summernote-ext-table.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../../node_modules/css-loader/dist/cjs.js!./summernote-ext-table.css */ "./node_modules/css-loader/dist/cjs.js!./src/plugin/misc/summernote-ext-table.css", function() {
		var newContent = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!./summernote-ext-table.css */ "./node_modules/css-loader/dist/cjs.js!./src/plugin/misc/summernote-ext-table.css");

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/plugin/misc/summernote-ext-table.js":
/*!*************************************************!*\
  !*** ./src/plugin/misc/summernote-ext-table.js ***!
  \*************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * summernote-ext-table
 * https://github.com/ksy11/summernote-ext-table 
 */
(function (factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  // add table / table col resize start
  var JTablePlugin = function JTablePlugin(context) {
    var self = this,
        dom = $.summernote.dom,
        ui = $.summernote.ui,
        modules = context.modules,
        options = context.options,
        $editable = context.layoutInfo.editable,
        lang = options.langInfo,
        $mergeDialog,
        $tableInfoDialog;
    var userAgent = navigator.userAgent,
        isMSIE = /MSIE|Trident/i.test(userAgent),
        isEdge = /Edge\/\d+/.test(userAgent),
        isFF = !isEdge && /firefox/i.test(userAgent),
        isFF = !isEdge && /firefox/i.test(userAgent),
        isPhantom = /PhantomJS/i.test(userAgent),
        isWebkit = !isEdge && /webkit/i.test(userAgent),
        isChrome = !isEdge && /chrome/i.test(userAgent),
        isSafari = !isEdge && /safari/i.test(userAgent) && !/chrome/i.test(userAgent);
    var tableResize = {
      pressed: false,
      rightFlag: false,
      bottomFlag: false,
      currentTableEl: undefined,
      currentTrEl: undefined,
      firstTdEl: undefined,
      colEl: undefined,
      currentTdEl: undefined,
      currentTdLeft: undefined,
      currentTdRight: undefined,
      currentTdTop: undefined,
      currentTdBottom: undefined,
      startX: undefined,
      startWidth: undefined,
      startY: undefined,
      startHeight: undefined,
      contenteditable: false
    };
    var tableBlock = {
      pressed: false,
      currentTableEl: undefined,
      currentTdEl: undefined,
      currentTdLeft: undefined,
      currentTdRight: undefined,
      currentTdTop: undefined,
      currentTdBottom: undefined,
      currentTdPosition: {
        row: undefined,
        col: undefined
      },
      width: undefined,
      height: undefined,
      top: undefined,
      left: undefined,
      effect: {
        row: {
          start: undefined,
          end: undefined
        },
        col: {
          start: undefined,
          end: undefined
        }
      }
    };
    var addRowCol = [ui.button({
      className: 'btn-md',
      contents: ui.icon(options.icons.rowAbove),
      tooltip: lang.table.addRowAbove,
      container: options.container,
      click: context.createInvokeHandler('jTable.jAddRow', 'top')
    }), ui.button({
      className: 'btn-md',
      contents: ui.icon(options.icons.rowBelow),
      tooltip: lang.table.addRowBelow,
      container: options.container,
      click: context.createInvokeHandler('jTable.jAddRow', 'bottom')
    }), ui.button({
      className: 'btn-md',
      contents: ui.icon(options.icons.colBefore),
      tooltip: lang.table.addColLeft,
      container: options.container,
      click: context.createInvokeHandler('jTable.jAddCol', 'left')
    }), ui.button({
      className: 'btn-md',
      contents: ui.icon(options.icons.colAfter),
      tooltip: lang.table.addColRight,
      container: options.container,
      click: context.createInvokeHandler('jTable.jAddCol', 'right')
    })];
    var deleteRowCol = [ui.button({
      className: 'btn-md',
      contents: ui.icon(options.icons.rowRemove),
      tooltip: lang.table.delRow,
      container: options.container,
      click: context.createInvokeHandler('jTable.jDeleteRow')
    }), ui.button({
      className: 'btn-md',
      contents: ui.icon(options.icons.colRemove),
      tooltip: lang.table.delCol,
      container: options.container,
      click: context.createInvokeHandler('jTable.jDeleteCol')
    })];
    /**
     * recover table popover after click dropdown
     * @param {jQuery.Event} event 
     */

    self.recoverPopover = function (event) {
      var $button = $(event.target).closest('button'),
          $toggle = $button.closest('.dropdown-toggle');
      var rng = modules.editor.getLastRange.call(modules.editor);
      var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);

      if ($button.closest('.popover').length) {
        var left = $button.closest('.popover').css('left'),
            top = $button.closest('.popover').css('top'),
            height = $button.outerHeight();
        setTimeout(function () {
          modules.tablePopover.update(cell);
          var $popover = $button.closest('.popover'),
              $dropdown = $toggle.next('.dropdown-menu');
          $popover.css({
            left: left,
            top: top
          });
          $dropdown.css({
            transform: "translate3d(0px, ".concat(height, "px, 0px)")
          });
        }, 0);
      }
    };

    context.memo('button.jAddDeleteRowCol', function () {
      return ui.buttonGroup({
        className: 'jtable-add-del-row-col jtable-display',
        children: [ui.button({
          className: 'dropdown-toggle',
          contents: ui.dropdownButtonContents(ui.icon(options.icons.rowAbove), options),
          tooltip: lang.jTable.addDeleteRowCOl,
          container: options.container,
          data: {
            toggle: 'dropdown'
          },
          click: function click(event) {
            var $parent = $(this).closest('.jtable-add-del-row-col');
            var $btns = $parent.find('.btn-md');
            var hasSpan = false;
            var rng = modules.editor.getLastRange.call(modules.editor);

            if (rng.isCollapsed() && rng.isOnCell()) {
              var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
              hasSpan = cell.rowSpan > 1 || cell.colSpan > 1;

              if (!hasSpan) {
                var $table = $(cell).closest('table');
                var $tr = $(cell).closest('tr');
                var trIndex = $tr[0].rowIndex;
                var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
                var matrixTable = vTable.getMatrixTable();
                var tdList = matrixTable[trIndex];
                var currentTdIndex = 0;

                for (var colIndex = 0; colIndex < tdList.length; colIndex++) {
                  var virtualTd = tdList[colIndex];
                  if (!virtualTd.isVirtual && cell == virtualTd.baseCell) currentTdIndex = colIndex;

                  if (virtualTd.baseCell.colSpan > 1 || virtualTd.baseCell.rowSpan > 1) {
                    hasSpan = true;
                  }
                }

                for (var rowIndex = 0; rowIndex < matrixTable.length; rowIndex++) {
                  var virtualTd = matrixTable[rowIndex][currentTdIndex];

                  if (virtualTd.baseCell.colSpan > 1 || virtualTd.baseCell.rowSpan > 1) {
                    hasSpan = true;
                  }
                }
              }
            }

            $btns.toggleClass('disabled', hasSpan);
            $btns.attr('disabled', hasSpan);
            var $btnGroup = $parent.find('.jtable-add-row-col-button-group, .jtable-del-row-col-button-group');
            var $message = $parent.find('.jtable-dropdown-message');
            var $dropdown = $parent.find('.jtable-add-del-row-col-dropdown');

            if (hasSpan) {
              $btnGroup.hide();
              $message.show();
            } else {
              $btnGroup.show();
              $message.hide();
              $dropdown.css('width', '');
            }

            self.recoverPopover(event);
          }
        }), ui.dropdown({
          className: 'jtable-add-del-row-col-dropdown',
          children: [ui.button({
            className: 'jtable-dropdown-message',
            contents: lang.jTable.message,
            container: options.container // callback : function($node) {
            //     console.log($node);
            // },

          }), ui.buttonGroup({
            className: 'jtable-add-row-col-button-group',
            children: addRowCol
          }), ui.buttonGroup({
            className: 'jtable-del-row-col-button-group',
            children: deleteRowCol
          })]
        })]
      }).render();
    });

    self.jAddRow = function (position) {
      var rng = modules.editor.getLastRange.call(modules.editor);

      if (rng.isCollapsed() && rng.isOnCell()) {
        self.beforeCommand();
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        self.addRow(cell, position);
        self.afterCommand();
      }
    };

    self.addRow = function (cell, position) {
      var currentTr = $(cell).closest('tr');
      var trAttributes = self.recoverAttributes(currentTr);
      var html = $('<tr' + trAttributes + '></tr>');
      var vTable = new TableResultAction(cell, TableResultAction.where.Row, TableResultAction.requestAction.Add, $(currentTr).closest('table')[0]);
      var actions = vTable.getActionList();

      for (var idCell = 0; idCell < actions.length; idCell++) {
        var currentCell = actions[idCell];
        var tdAttributes = self.recoverAttributes(currentCell.baseCell);

        switch (currentCell.action) {
          case TableResultAction.resultAction.AddCell:
            html.append('<td' + tdAttributes + '>' + dom.blank + '</td>');
            break;

          case TableResultAction.resultAction.SumSpanCount:
            {
              if (position === 'top') {
                var baseCellTr = currentCell.baseCell.parent;
                var isTopFromRowSpan = (!baseCellTr ? 0 : currentCell.baseCell.closest('tr').rowIndex) <= currentTr[0].rowIndex;

                if (isTopFromRowSpan) {
                  var newTd = $('<div></div>').append($('<td' + tdAttributes + '>' + dom.blank + '</td>').removeAttr('rowspan')).html();
                  html.append(newTd);
                  break;
                }
              }

              var rowspanNumber = parseInt(currentCell.baseCell.rowSpan, 10);
              rowspanNumber++;
              currentCell.baseCell.setAttribute('rowSpan', rowspanNumber);
            }
            break;
        }
      }

      if (position === 'top') {
        currentTr.before(html);
      } else {
        var cellHasRowspan = cell.rowSpan > 1;

        if (cellHasRowspan) {
          var lastTrIndex = currentTr[0].rowIndex + (cell.rowSpan - 2);
          $($(currentTr).parent().find('tr')[lastTrIndex]).after($(html));
          return;
        }

        currentTr.after(html);
      }
    };

    self.jAddCol = function (position) {
      var rng = modules.editor.getLastRange.call(modules.editor);

      if (rng.isCollapsed() && rng.isOnCell()) {
        self.beforeCommand();
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        self.addCol(cell, position);
        self.afterCommand();
      }
    };

    self.addCol = function (cell, position) {
      var row = $(cell).closest('tr');
      var colgroup = $(row).closest('table').find('colgroup').children('col');
      var tdIndex = row.children().index($(cell));
      var vTable = new TableResultAction(cell, TableResultAction.where.Column, TableResultAction.requestAction.Add, $(row).closest('table')[0]);
      var actions = vTable.getActionList();

      for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
        var currentCell = actions[actionIndex];
        var tdAttributes = self.recoverAttributes(currentCell.baseCell);

        switch (currentCell.action) {
          case TableResultAction.resultAction.AddCell:
            if (position === 'right') {
              $(currentCell.baseCell).after('<td' + tdAttributes + '>' + dom.blank + '</td>');
            } else {
              $(currentCell.baseCell).before('<td' + tdAttributes + '>' + dom.blank + '</td>');
            }

            break;

          case TableResultAction.resultAction.SumSpanCount:
            var colspanNumber = parseInt(currentCell.baseCell.colSpan, 10);
            colspanNumber++;
            currentCell.baseCell.setAttribute('colSpan', colspanNumber);
            break;
        }
      }

      if (colgroup.length) {
        /**
         * expand colgroup col span
         */
        for (var index = 0; index < colgroup.length; index++) {
          var col = colgroup[index];
          var span = col.span;
          col.span = 1;

          while (span > 1) {
            $(col).after($(col).prop('outerHTML'));
            span = span - 1;
          }
        }

        var baseCol = colgroup[tdIndex];
        var colAttributes = self.recoverAttributes(baseCol);
        var $col = $('<col' + colAttributes + '/>');
        $col.width(100);

        if (position === 'right') {
          $(baseCol).after($col[0]);
        } else {
          $(baseCol).before($col[0]);
        }
      }
    };

    self.jDeleteRow = function () {
      var rng = modules.editor.getLastRange.call(modules.editor);

      if (rng.isCollapsed() && rng.isOnCell()) {
        self.beforeCommand();
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        var row = $(cell).closest('tr');
        var cellPos = row.children('td, th').index($(cell));
        var rowPos = row[0].rowIndex;
        var vTable = new TableResultAction(cell, TableResultAction.where.Row, TableResultAction.requestAction.Delete, $(row).closest('table')[0]);
        var actions = vTable.getActionList();

        for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
          if (!actions[actionIndex]) {
            continue;
          }

          var baseCell = actions[actionIndex].baseCell;
          var virtualPosition = actions[actionIndex].virtualTable;
          var hasRowspan = baseCell.rowSpan && baseCell.rowSpan > 1;
          var rowspanNumber = hasRowspan ? parseInt(baseCell.rowSpan, 10) : 0;

          switch (actions[actionIndex].action) {
            case TableResultAction.resultAction.Ignore:
              continue;

            case TableResultAction.resultAction.AddCell:
              {
                var nextRow = row.next('tr')[0];

                if (!nextRow) {
                  continue;
                }

                var cloneRow = row[0].cells[cellPos];

                if (hasRowspan) {
                  if (rowspanNumber > 2) {
                    rowspanNumber--;
                    nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
                    nextRow.cells[cellPos].setAttribute('rowSpan', rowspanNumber);
                    nextRow.cells[cellPos].innerHTML = '';
                  } else if (rowspanNumber === 2) {
                    nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
                    nextRow.cells[cellPos].removeAttribute('rowSpan');
                    nextRow.cells[cellPos].innerHTML = '';
                  }
                }
              }
              continue;

            case TableResultAction.resultAction.SubtractSpanCount:
              if (hasRowspan) {
                if (rowspanNumber > 2) {
                  rowspanNumber--;
                  baseCell.setAttribute('rowSpan', rowspanNumber);

                  if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) {
                    baseCell.innerHTML = '';
                  }
                } else if (rowspanNumber === 2) {
                  baseCell.removeAttribute('rowSpan');

                  if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) {
                    baseCell.innerHTML = '';
                  }
                }
              }

              continue;

            case TableResultAction.resultAction.RemoveCell:
              // Do not need remove cell because row will be deleted.
              continue;
          }
        }

        row.remove();
        self.afterCommand();
      }
    };

    self.jDeleteCol = function () {
      var rng = modules.editor.getLastRange.call(modules.editor);

      if (rng.isCollapsed() && rng.isOnCell()) {
        self.beforeCommand();
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        var row = $(cell).closest('tr');
        var cellPos = row.children('td, th').index($(cell));
        var colgroup = $(row).closest('table').find('colgroup').children('col');
        var tdIndex = row.children().index($(cell));
        var vTable = new TableResultAction(cell, TableResultAction.where.Column, TableResultAction.requestAction.Delete, $(row).closest('table')[0]);
        var actions = vTable.getActionList();

        for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
          if (!actions[actionIndex]) {
            continue;
          }

          switch (actions[actionIndex].action) {
            case TableResultAction.resultAction.Ignore:
              continue;

            case TableResultAction.resultAction.SubtractSpanCount:
              {
                var baseCell = actions[actionIndex].baseCell;
                var hasColspan = baseCell.colSpan && baseCell.colSpan > 1;

                if (hasColspan) {
                  var colspanNumber = baseCell.colSpan ? parseInt(baseCell.colSpan, 10) : 0;

                  if (colspanNumber > 2) {
                    colspanNumber--;
                    baseCell.setAttribute('colSpan', colspanNumber);

                    if (baseCell.cellIndex === cellPos) {
                      baseCell.innerHTML = '';
                    }
                  } else if (colspanNumber === 2) {
                    baseCell.removeAttribute('colSpan');

                    if (baseCell.cellIndex === cellPos) {
                      baseCell.innerHTML = '';
                    }
                  }
                }
              }
              continue;

            case TableResultAction.resultAction.RemoveCell:
              dom.remove(actions[actionIndex].baseCell, true);
              continue;
          }
        }

        if (colgroup.length) {
          var baseCol = colgroup[tdIndex];
          $(baseCol).remove();
        }

        self.afterCommand();
      }
    };

    self.recoverAttributes = function (el) {
      var resultStr = '';

      if (!el) {
        return resultStr;
      }

      var attrList = el.attributes || [];

      for (var i = 0; i < attrList.length; i++) {
        if (attrList[i].name.toLowerCase() === 'id') {
          continue;
        }

        if (attrList[i].name.toLowerCase() === 'span' && el.tagName.toLowerCase() == 'col') {
          continue;
        }

        if (attrList[i].specified) {
          resultStr += ' ' + attrList[i].name + '=\'' + attrList[i].value + '\'';
        }
      }

      return resultStr;
    };

    self.beforeCommand = function () {
      modules.editor.beforeCommand.call(modules.editor);
    };

    self.afterCommand = function () {
      modules.editor.afterCommand.call(modules.editor);
    };

    context.memo('button.jTable', function () {
      return ui.buttonGroup([ui.button({
        className: 'dropdown-toggle',
        contents: ui.dropdownButtonContents(ui.icon(options.icons.table), options),
        tooltip: lang.table.table,
        container: options.container,
        data: {
          toggle: 'dropdown'
        },
        click: function click(event) {
          self.recoverPopover(event);
        }
      }), ui.dropdown({
        title: lang.table.table,
        className: 'note-table',
        items: ['<div class="note-dimension-picker">', '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"/>', '<div class="note-dimension-picker-highlighted"/>', '<div class="note-dimension-picker-unhighlighted"/>', '</div>', '<div class="note-dimension-display">1 x 1</div>'].join('')
      })], {
        callback: function callback($node) {
          var $catcher = $node.find('.note-dimension-picker-mousecatcher');
          $catcher.css({
            width: options.insertTableMaxSize.col + 'em',
            height: options.insertTableMaxSize.row + 'em'
          }).mousedown(context.createInvokeHandler("jTable.insertTable")).on('mousemove', modules.buttons.tableMoveHandler.bind(context));
        }
      }).render();
    });

    self.insertTable = function (dim) {
      self.beforeCommand();
      var dimension = dim.split('x');
      var rng = modules.editor.getLastRange().deleteContents();
      var tableDivEl = self.createTable(dimension[0], dimension[1], options);
      rng.insertNode(tableDivEl);
      self.afterCommand();
    };

    self.createTable = function (colCount, rowCount, options) {
      var colgroup = [];
      var colgroupHTML;
      var tds = [];
      var tdHTML;

      for (var idxCol = 0; idxCol < colCount; idxCol++) {
        tds.push('<td>' + dom.blank + '</td>');
        colgroup.push('<col style="width: 100px;"/>');
      }

      colgroupHTML = '<colgroup>' + colgroup.join('') + '</colgroup>';
      tdHTML = tds.join('');
      var trs = [];
      var trHTML;

      for (var idxRow = 0; idxRow < rowCount; idxRow++) {
        trs.push('<tr>' + tdHTML + '</tr>');
      }

      trHTML = trs.join('');
      var $table = $('<table class="jtable-expanded" style="width: auto !important;">' + colgroupHTML + trHTML + '</table>');

      if (options && options.tableClassName) {
        $table.addClass(options.tableClassName);
      }

      return $table[0];
    };

    context.memo('button.jBorderColor', function () {
      return self.colorPalette('note-color-table-border', lang.jTable.borderColor, self.jBorderColor);
    });

    self.jBorderColor = function (borderColor) {
      self.beforeCommand();
      var cell = tableBlock.currentTdEl;
      if (!cell) return self.afterCommand();
      var $cell = $(cell);
      $cell.closest('table').find('td, th').css('border', '1px solid ' + borderColor); // resetTableBlock($cell);

      self.afterCommand();
    };

    context.memo('button.jBackcolor', function () {
      return self.colorPalette('note-color-back', lang.color.background, self.color);
    });

    self.color = function (backColor) {
      self.beforeCommand();
      var cell = tableBlock.currentTdEl;
      if (!cell) return self.afterCommand();
      var $cell = $(cell);
      var $table = $cell.closest('table');
      var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
      var matrixTable = vTable.getMatrixTable();
      var effectRow = tableBlock.effect.row;
      var effectCol = tableBlock.effect.col;

      for (var rowIndex = effectRow.start; rowIndex <= effectRow.end; rowIndex++) {
        for (var colIndex = effectCol.start; colIndex <= effectCol.end; colIndex++) {
          var virtualTd = matrixTable[rowIndex][colIndex];
          $(virtualTd.baseCell).css('background-color', backColor);
        }
      } // resetTableBlock($cell);


      self.afterCommand();
    };

    self.colorPalette = function (className, tooltip, callbackFnc) {
      return ui.buttonGroup({
        className: 'note-color jtable-display ' + className,
        children: [ui.button({
          className: 'note-current-color-button note-table-color',
          contents: ui.icon(options.icons.font + ' note-recent-color'),
          tooltip: tooltip,
          container: options.container,
          click: function click(e) {
            var $button = $(e.currentTarget);
            var value = $button.attr('data-backColor');
            callbackFnc(value);
          },
          callback: function callback($button) {
            var $recentColor = $button.find('.note-recent-color');
            $recentColor.css('background-color', className == 'note-color-table-border' ? '#000000' : options.colorButton.backColor);
            $button.attr('data-backColor', className == 'note-color-table-border' ? '#000000' : options.colorButton.backColor);
            $recentColor.css('color', 'transparent');
          }
        }), ui.button({
          className: 'dropdown-toggle',
          contents: ui.dropdownButtonContents('', options),
          tooltip: lang.color.more,
          container: options.container,
          data: {
            toggle: 'dropdown'
          },
          click: function click(event) {
            self.recoverPopover(event);
          }
        }), ui.dropdown({
          items: ['<div class="note-palette">', '<div class="note-palette-title">' + tooltip + '</div>', '<div>', '<button type="button" class="note-color-reset btn btn-light" data-event="backColor" data-value="inherit">', lang.color.transparent, '</button>', '</div>', '<div class="note-holder" data-event="backColor"/>', '<div>'].join(''),
          callback: function callback($dropdown) {
            $dropdown.find('.note-holder').each(function (idx, item) {
              var $holder = $(item);
              $holder.append(ui.palette(_defineProperty({
                colors: options.colors,
                colorsName: options.colorsName,
                eventName: $holder.data('event'),
                container: options.container,
                tooltip: options.tooltip
              }, "container", options.container)).render());
            });
            /* TODO: do we have to record recent custom colors within cookies? */

            var customColors = [['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']];
            $dropdown.find('.note-holder-custom').each(function (idx, item) {
              var $holder = $(item);
              $holder.append(ui.palette(_defineProperty({
                colors: customColors,
                colorsName: customColors,
                eventName: $holder.data('event'),
                container: options.container,
                tooltip: options.tooltip
              }, "container", options.container)).render());
            });
            $dropdown.find('input[type=color]').each(function (idx, item) {
              $(item).change(function () {
                var $chip = $dropdown.find('#' + $(this).data('event')).find('.note-color-btn').first();
                var color = this.value.toUpperCase();
                $chip.css('background-color', color).attr('aria-label', color).attr('data-value', color).attr('data-original-title', color);
                $chip.click();
              });
            });
          },
          click: function click(event) {
            // event.stopPropagation();
            var $parent = $(this).closest('.note-popover').find('.note-dropdown-menu');
            var $button = $(event.target);
            var eventName = $button.data('event');
            var value = $button.attr('data-value');

            if (eventName === 'openPalette') {
              var $picker = $parent.find('#' + value);
              var $palette = $($parent.find('#' + $picker.data('event')).find('.note-color-row')[0]); // Shift palette chips

              var $chip = $palette.find('.note-color-btn').last().detach(); // Set chip attributes

              var color = $picker.val();
              $chip.css('background-color', color).attr('aria-label', color).attr('data-value', color).attr('data-original-title', color);
              $palette.prepend($chip);
              $picker.click();
            } else {
              // eventName == 'backColor'
              var key = eventName === 'backColor' ? 'background-color' : 'color';
              var $color = $button.closest('.note-color').find('.note-recent-color');
              var $currentButton = $button.closest('.note-color').find('.note-current-color-button');
              $color.css(key, value);
              $currentButton.attr('data-' + eventName, value);
              callbackFnc(value);
            }
          }
        })]
      }).render();
    };

    self.setCellHorizontalAlign = function (position) {
      self.beforeCommand();
      var cell = tableBlock.currentTdEl;
      var $cell = $(cell);
      var $table = $cell.closest('table');
      var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
      var matrixTable = vTable.getMatrixTable();
      var effectRow = tableBlock.effect.row;
      var effectCol = tableBlock.effect.col;

      for (var rowIndex = effectRow.start; rowIndex <= effectRow.end; rowIndex++) {
        for (var colIndex = effectCol.start; colIndex <= effectCol.end; colIndex++) {
          var virtualTd = matrixTable[rowIndex][colIndex];
          $(virtualTd.baseCell).css('text-align', position);
        }
      } // resetTableBlock($cell);


      self.afterCommand();
    };

    self.setCellVerticalAlign = function (position) {
      self.beforeCommand();
      var cell = tableBlock.currentTdEl;
      var $cell = $(cell);
      var $table = $cell.closest('table');
      var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
      var matrixTable = vTable.getMatrixTable();
      var effectRow = tableBlock.effect.row;
      var effectCol = tableBlock.effect.col;

      for (var rowIndex = effectRow.start; rowIndex <= effectRow.end; rowIndex++) {
        for (var colIndex = effectCol.start; colIndex <= effectCol.end; colIndex++) {
          var virtualTd = matrixTable[rowIndex][colIndex];
          $(virtualTd.baseCell).css('vertical-align', position);
        }
      } // resetTableBlock($cell);


      self.afterCommand();
    };

    var horizontal = [ui.button({
      contents: ui.icon(options.icons.alignLeft),
      tooltip: lang.paragraph.left,
      container: options.container,
      click: context.createInvokeHandler('jTable.setCellHorizontalAlign', 'left')
    }), ui.button({
      contents: ui.icon(options.icons.alignCenter),
      tooltip: lang.paragraph.center,
      container: options.container,
      click: context.createInvokeHandler('jTable.setCellHorizontalAlign', 'center')
    }), ui.button({
      contents: ui.icon(options.icons.alignRight),
      tooltip: lang.paragraph.right,
      container: options.container,
      click: context.createInvokeHandler('jTable.setCellHorizontalAlign', 'right')
    }), ui.button({
      contents: ui.icon(options.icons.alignJustify),
      tooltip: lang.paragraph.justify,
      container: options.container,
      click: context.createInvokeHandler('jTable.setCellHorizontalAlign', 'justify')
    })];
    var vertical = [ui.button({
      className: 'jtable-vertical-align-btn-top',
      contents: ui.icon(options.icons.alignJustify),
      tooltip: lang.jTable.align.top,
      container: options.container,
      click: context.createInvokeHandler('jTable.setCellVerticalAlign', 'top')
    }), ui.button({
      className: 'jtable-vertical-align-btn-middle',
      contents: ui.icon(options.icons.alignJustify),
      tooltip: lang.jTable.align.middle,
      container: options.container,
      click: context.createInvokeHandler('jTable.setCellVerticalAlign', 'middle')
    }), ui.button({
      className: 'jtable-vertical-align-btn-bottom',
      contents: ui.icon(options.icons.alignJustify),
      tooltip: lang.jTable.align.bottom,
      container: options.container,
      click: context.createInvokeHandler('jTable.setCellVerticalAlign', 'bottom')
    }), ui.button({
      className: 'jtable-vertical-align-btn-baseline',
      contents: ui.icon(options.icons.alignJustify),
      tooltip: lang.jTable.align.baseline,
      container: options.container,
      click: context.createInvokeHandler('jTable.setCellVerticalAlign', 'baseline')
    })];
    context.memo('button.jAlign', function () {
      return ui.buttonGroup([ui.button({
        className: 'dropdown-toggle jtable-display',
        contents: ui.dropdownButtonContents(ui.icon(options.icons.alignLeft), options),
        tooltip: lang.paragraph.paragraph,
        container: options.container,
        data: {
          toggle: 'dropdown'
        },
        click: function click(event) {
          self.recoverPopover(event);
        }
      }), ui.dropdown({
        className: 'jtable-align-dropdown',
        children: [ui.buttonGroup({
          className: 'jtable-horizontal-align-button-group',
          children: horizontal
        }), ui.buttonGroup({
          className: 'jtable-vertical-align-button-group',
          children: vertical
        })]
      })], {
        callback: function callback($node) {// console.log($node);
        }
      }).render();
    });
    var mergeBody = ['<div class="form-group">', '<label for="jtable-cell-merge-col' + options.id + '" class="note-form-label jtable-merge-label">' + lang.jTable.merge.colspan + '</label>', '<input id="jtable-cell-merge-col' + options.id + '" class="note-input jtable-merge-input jtable-merge-col-input" type="number" name="col"/>', '<span class="jtable-merge-hint-span">(min : <span class="jtable-merge-hint-col-min">1</span> / max : <span class="jtable-merge-hint-col-max">1</span>)</span>', '</div>', '<div class="form-group jtable-merge-row-info-div">', '<label for="jtable-cell-merge-row' + options.id + '" class="note-form-label jtable-merge-label">' + lang.jTable.merge.rowspan + '</label>', '<input id="jtable-cell-merge-row' + options.id + '" class="note-input jtable-merge-input jtable-merge-row-input" type="number" name="row"/>', '<span class="jtable-merge-hint-span">(min : <span class="jtable-merge-hint-row-min">1</span> / max : <span class="jtable-merge-hint-row-max">1</span>)</span>', '</div>'].join('');
    var mergeFooter = '<input type="button" href="#" class="btn btn-primary note-btn note-btn-primary jtable-merge-btn" value="' + lang.jTable.merge.merge + '" disabled>';
    $mergeDialog = ui.dialog({
      title: lang.jTable.merge.merge,
      fade: options.dialogsFade,
      body: mergeBody,
      footer: mergeFooter
    }).render().appendTo(options.container);
    $mergeDialog.find('.note-modal-content').width(340);
    $mergeDialog.find('.note-modal-body').css('padding', '20px 20px 10px 20px');
    var cellSplit = [ui.button({
      contents: ui.icon('note-icon-table-merge'),
      tooltip: lang.jTable.merge.merge,
      container: options.container,
      click: context.createInvokeHandler('jTable.cellMerge')
    }), ui.button({
      className: 'note-btn-jtable-cell-split',
      contents: ui.icon('note-icon-table-cell-split'),
      tooltip: lang.jTable.merge.split,
      container: options.container,
      click: context.createInvokeHandler('jTable.cellSplit')
    })];
    context.memo('button.jMerge', function () {
      return ui.buttonGroup({
        className: 'jtable-display',
        children: [ui.button({
          className: 'dropdown-toggle jtable-cell-split-dropdown-toggle',
          contents: ui.dropdownButtonContents(ui.icon('note-icon-table-merge'), options),
          tooltip: lang.jTable.merge.merge,
          container: options.container,
          data: {
            toggle: 'dropdown'
          },
          click: function click(event) {
            var $parent = $(this).parent();
            var $cellSplitBtn = $parent.find('.note-btn-jtable-cell-split');
            var cellHasSpan = false;
            var rng = modules.editor.getLastRange.call(modules.editor);

            if (rng.isCollapsed() && rng.isOnCell()) {
              var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
              cellHasSpan = cell.rowSpan > 1 || cell.colSpan > 1;
            }

            $cellSplitBtn.toggleClass('disabled', !cellHasSpan);
            $cellSplitBtn.attr('disabled', !cellHasSpan);
            self.recoverPopover(event);
          }
        }), ui.dropdown({
          className: 'jtable-cell-split-dropdown',
          children: [ui.buttonGroup({
            className: 'jtable-cell-split-button-group',
            children: cellSplit
          })]
        })]
      }).render();
    });

    self.cellMerge = function () {
      if (options.jTable.mergeMode == 'drag') {
        self.dragCellMerge();
      } else {
        self.mergeDialogShow();
      }
    };

    self.dragCellMerge = function () {
      var cell = tableBlock.currentTdEl;
      var $cell = $(cell);
      var $table = $cell.closest('table');
      var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
      var matrixTable = vTable.getMatrixTable();
      var effectRow = tableBlock.effect.row;
      var effectCol = tableBlock.effect.col;

      if (effectRow.start == effectRow.end && effectCol.start == effectCol.end) {
        resetTableBlock($cell);
        return true;
      }

      for (var rowIndex = effectRow.start; rowIndex <= effectRow.end; rowIndex++) {
        for (var colIndex = effectCol.start; colIndex <= effectCol.end; colIndex++) {
          var virtualTd = matrixTable[rowIndex][colIndex];
          cellUnMerge(virtualTd.baseCell);
        }
      }

      var cellData = getMergeCellData(cell);
      var data = {
        trIndex: cellData.trIndex,
        colIndex: cellData.colIndex,
        current: {
          col: cellData.current.col,
          row: cellData.current.row
        },
        merge: {
          col: parseInt(effectCol.end - effectCol.start + 1, 10),
          row: parseInt(effectRow.end - effectRow.start + 1, 10)
        },
        effect: {
          col: cellData.effect.col,
          row: cellData.effect.row
        }
      };
      var mergeCell = matrixTable[effectRow.start][effectCol.start];
      tableCellMerge(mergeCell.baseCell, data);
      resetTableBlock($cell);
    };

    self.mergeDialogShow = function () {
      var rng = modules.editor.getLastRange.call(modules.editor);

      if (rng.isCollapsed() && rng.isOnCell()) {
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        var cellData = getMergeCellData(cell);
        modules.tablePopover.hide();
        context.invoke('editor.saveRange');
        showMergeDialog(cellData).then(function (data) {
          // [workaround] hide dialog before restore range for IE range focus
          ui.hideDialog($mergeDialog);
          context.invoke('editor.restoreRange');
          var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
          tableCellMerge(cell, data);
        }).fail(function () {
          context.invoke('editor.restoreRange');
        });
      }
    };

    function tableCellMerge(cell, data) {
      self.beforeCommand();
      var $cell = $(cell);
      var colRemoveCount = data.merge.col - data.current.col;
      var rowRemoveCount = data.merge.row - data.current.row;
      $cell.prop("colspan", data.merge.col);

      for (var i = 0; i < colRemoveCount; i++) {
        $(data.effect.col[i]).remove();
      }

      $cell.prop("rowspan", data.merge.row);

      for (var i = 0; i < rowRemoveCount; i++) {
        var effectCell = data.effect.row[i];

        if (colRemoveCount > 0) {
          for (var j = 0; j < colRemoveCount; j++) {
            $(effectCell).next().remove();
          }
        }

        $(effectCell).remove();
      }

      var $table = $cell.closest('table');
      var $trList = $table.children('tr');
      if (!$trList.length) $trList = $table.children('tbody').children('tr');

      for (var i = 0; i < $trList.length; i++) {
        var $tr = $($trList[i]);
        var $cellList = $tr.find('td, th');
        if (!$cellList.length) $tr.remove(); // console.log('aaaaaaaaa');
      }

      self.afterCommand();
    }

    function showMergeDialog(cellData) {
      return $.Deferred(function (deferred) {
        var $spanCountInput = $mergeDialog.find('.jtable-merge-input');
        var $colInput = $mergeDialog.find('.jtable-merge-col-input');
        var $colMinSapn = $mergeDialog.find('.jtable-merge-hint-col-min');
        var $colMaxSapn = $mergeDialog.find('.jtable-merge-hint-col-max');
        var $rowInput = $mergeDialog.find('.jtable-merge-row-input');
        var $rowMinSapn = $mergeDialog.find('.jtable-merge-hint-row-min');
        var $rowMaxSapn = $mergeDialog.find('.jtable-merge-hint-row-max');
        var $mergeBtn = $mergeDialog.find('.jtable-merge-btn');
        $colInput.val(cellData.current.col);
        $colMinSapn.text(cellData.current.col);
        $colMaxSapn.text(cellData.max.col);
        $rowInput.val(cellData.current.row);
        $rowMinSapn.text(cellData.current.row);
        $rowMaxSapn.text(cellData.max.row);
        ui.onDialogShown($mergeDialog, function () {
          context.triggerEvent('dialog.shown');
          $spanCountInput.on('input paste propertychange', function () {
            var toggleBtnFlag = false;
            var col = parseInt($colInput.val(), 10);
            var row = parseInt($rowInput.val(), 10);

            if (col == cellData.current.col && row == cellData.current.row) {
              toggleBtnFlag = false;
            } else if (col >= cellData.current.col && col <= cellData.max.col && row >= cellData.current.row && row <= cellData.max.row) {
              toggleBtnFlag = true;
            }

            ui.toggleBtn($mergeBtn, toggleBtnFlag);
          });
          $mergeBtn.click(function (event) {
            event.preventDefault();
            deferred.resolve({
              trIndex: cellData.trIndex,
              colIndex: cellData.colIndex,
              current: {
                col: cellData.current.col,
                row: cellData.current.row
              },
              merge: {
                col: parseInt($colInput.val(), 10),
                row: parseInt($rowInput.val(), 10)
              },
              effect: {
                col: cellData.effect.col,
                row: cellData.effect.row
              }
            });
          }); // bindEnterKey($imageUrl, $imageBtn);
        });
        ui.onDialogHidden($mergeDialog, function () {
          $spanCountInput.off();
          $mergeBtn.off();
          ui.toggleBtn($mergeBtn, false);

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        });
        ui.showDialog($mergeDialog);
      });
    }

    self.cellSplit = function () {
      var rng = modules.editor.getLastRange.call(modules.editor);

      if (rng.isCollapsed() && rng.isOnCell()) {
        self.beforeCommand();
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        cellUnMerge(cell);
        self.afterCommand();
      }
    };

    function cellUnMerge(cell) {
      var $cell = $(cell);
      var $table = $cell.closest('table');
      var $tr = $cell.closest('tr');
      var currentColspan = parseInt(cell.colSpan, 10);
      var currentRowspan = parseInt(cell.rowSpan, 10);
      var insertColTdCount = currentColspan - 1;
      var startTrIndex = $tr[0].rowIndex;
      var endTrIndex = startTrIndex + currentRowspan - 1;
      var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
      var matrixTable = vTable.getMatrixTable();
      var colCount = vTable.getColCount();
      var insertFlag = false;
      var targetCell = [];

      for (var rowIndex = startTrIndex; rowIndex <= endTrIndex; rowIndex++) {
        var row = matrixTable[rowIndex];

        for (var colIndex = 0; colIndex < row.length; colIndex++) {
          if (insertFlag && cell != row[colIndex].baseCell && !row[colIndex].isVirtual) {
            targetCell.push(row[colIndex].baseCell);

            if (rowIndex == startTrIndex) {
              for (var i = 0; i < insertColTdCount; i++) {
                $(row[colIndex].baseCell).before($('<td/>'));
              }
            } else {
              for (var i = 0; i < currentColspan; i++) {
                $(row[colIndex].baseCell).before($('<td/>'));
              }
            }

            break;
          }

          if (cell == row[colIndex].baseCell) {
            insertFlag = true;
          }

          if (insertFlag && colIndex == row.length - 1) {
            var baseCell = row[colIndex].baseCell; // current Cell is last Cell

            if (rowIndex == startTrIndex) {
              for (var i = 0; i < insertColTdCount; i++) {
                $(baseCell).after($('<td/>'));
              }
            } else {
              var $trList = $table.children('tr');
              if (!$trList.length) $trList = $trList.children('tbody').children('tr');
              baseCell = $($trList[rowIndex]).children().last();

              for (var i = 0; i < currentColspan; i++) {
                $(baseCell).after($('<td/>'));
              }
            }
          }
        }

        insertFlag = false;
      }

      $cell.prop("colspan", 1);
      $cell.prop("rowspan", 1);
    }

    function getMergeCellData(cell) {
      var $table = $(cell).closest('table');
      var $tr = $(cell).closest('tr');
      var trIndex = $tr[0].rowIndex;
      var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
      var matrixTable = vTable.getMatrixTable();
      var tdList = matrixTable[trIndex];
      var tdIndex = 0;
      var countFlag = false;
      var maxCol = 1;
      var effectCol = [];

      if (cell.rowSpan > 1) {
        maxCol = cell.colSpan;
      } else {
        for (var colIndex = 0; colIndex < tdList.length; colIndex++) {
          var virtualTd = tdList[colIndex];

          if (countFlag) {
            effectCol.push(virtualTd.baseCell);
            maxCol++;
          }

          if (!countFlag && cell == virtualTd.baseCell) {
            tdIndex = colIndex;
            countFlag = true;
          } else if (countFlag && (virtualTd.baseCell.colSpan > 1 || virtualTd.baseCell.rowSpan > 1)) {
            maxCol--;
            effectCol.pop();
            countFlag = false;
          }
        }
      }

      countFlag = false;
      var maxRow = 1;
      var effectRow = [];

      if (cell.colSpan > 1) {
        maxRow = cell.rowSpan;
      } else {
        for (var rowIndex = 0; rowIndex < matrixTable.length; rowIndex++) {
          var virtualTd = matrixTable[rowIndex][tdIndex];

          if (countFlag) {
            effectRow.push(virtualTd.baseCell);
            maxRow++;
          }

          if (!countFlag && cell == virtualTd.baseCell) {
            countFlag = true;
          } else if (countFlag && (virtualTd.baseCell.colSpan > 1 || virtualTd.baseCell.rowSpan > 1)) {
            maxRow--;
            effectRow.pop();
            countFlag = false;
          }
        }
      }

      return {
        trIndex: trIndex,
        tdIndex: tdIndex,
        current: {
          col: cell.colSpan,
          row: cell.rowSpan
        },
        max: {
          col: maxCol,
          row: maxRow
        },
        effect: {
          col: effectCol,
          row: effectRow
        }
      };
    }

    var tableInfoBody = ['<div class="form-group form-group-jtable-table-info-margin">', '<div class="jtable-table-info-margin-top-bottom"><input type="number" value="0" class="jtable-table-info-margin-input jtable-table-info-margin-input-top"><span>px</span></div>', '<div class="jtable-table-info-margin-middle">', '<div class="jtable-table-info-margin-left"><input type="number" value="0" class="jtable-table-info-margin-input jtable-table-info-margin-input-left"><span>px</span></div>', '<div class="jtable-table-info-margin-center"><b>Table</b><br><span class="jtable-table-info-width">0</span> X <span class="jtable-table-info-height">0</span></div>', '<div class="jtable-table-info-margin-right"><input type="number" value="0" class="jtable-table-info-margin-input jtable-table-info-margin-input-right"><span>px</span></div>', '</div>', '<div class="jtable-table-info-margin-top-bottom"><input type="number" value="0" class="jtable-table-info-margin-input jtable-table-info-margin-input-bottom"><span>px</span></div>', '</div>'].join('');
    var tableInfoFooter = '<input type="button" href="#" class="btn btn-primary note-btn note-btn-primary jtable-apply-btn" value="' + lang.jTable.apply + '" >';
    $tableInfoDialog = ui.dialog({
      title: lang.table.table + ' ' + lang.jTable.info.margin,
      fade: options.dialogsFade,
      body: tableInfoBody,
      footer: tableInfoFooter
    }).render().appendTo(options.container); // $tableInfoDialog.find('.note-modal-content').width(340);

    $tableInfoDialog.find('.note-modal-body').css('padding', '20px 20px 10px 20px');
    context.memo('button.jTableInfo', function () {
      return ui.button({
        className: 'jtable-display',
        contents: ui.icon('note-icon-table-margin'),
        tooltip: lang.table.table + ' ' + lang.jTable.info.margin,
        container: options.container,
        click: context.createInvokeHandler('jTable.tableInfoDialogShow')
      }).render();
    });

    self.tableInfoDialogShow = function () {
      var rng = modules.editor.getLastRange.call(modules.editor);

      if (rng.isCollapsed() && rng.isOnCell()) {
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        var $table = $(cell).closest('table');
        modules.tablePopover.hide();
        showTableInfoDialog($table).then(function (data) {
          // [workaround] hide dialog before restore range for IE range focus
          ui.hideDialog($tableInfoDialog);
          context.invoke('editor.restoreRange');
          $table.css('margin', data.join(' '));
        }).fail(function () {
          context.invoke('editor.restoreRange');
        });
      }
    };

    function showTableInfoDialog($table) {
      return $.Deferred(function (deferred) {
        var $applyBtn = $tableInfoDialog.find('.jtable-apply-btn');
        var $marginInput = $tableInfoDialog.find('.jtable-table-info-margin-input');
        var $marginTopInput = $tableInfoDialog.find('.jtable-table-info-margin-input-top');
        var $marginLeftInput = $tableInfoDialog.find('.jtable-table-info-margin-input-left');
        var $marginRightInput = $tableInfoDialog.find('.jtable-table-info-margin-input-right');
        var $marginBottomInput = $tableInfoDialog.find('.jtable-table-info-margin-input-bottom');
        var $tableWidthtSpan = $tableInfoDialog.find('.jtable-table-info-width');
        var $tableHeightSpan = $tableInfoDialog.find('.jtable-table-info-height');
        $marginTopInput.val(parseInt($table.css('margin-top'), 10));
        $marginLeftInput.val(parseInt($table.css('margin-left'), 10));
        $marginRightInput.val(parseInt($table.css('margin-right'), 10));
        $marginBottomInput.val(parseInt($table.css('margin-bottom'), 10));
        $tableWidthtSpan.text($table.width());
        $tableHeightSpan.text($table.height());
        ui.onDialogShown($tableInfoDialog, function () {
          context.triggerEvent('dialog.shown');
          $marginInput.on('input paste propertychange', function () {
            var toggleBtnFlag = true;
            var top = parseInt($marginTopInput.val(), 10);
            var left = parseInt($marginLeftInput.val(), 10);
            var right = parseInt($marginRightInput.val(), 10);
            var bottom = parseInt($marginBottomInput.val(), 10);

            if (top < 0 || left < 0 || right < 0 || bottom < 0) {
              toggleBtnFlag = false;
            }

            ui.toggleBtn($applyBtn, toggleBtnFlag);
          });
          $applyBtn.click(function (event) {
            context.invoke('beforeCommand');
            event.preventDefault();
            deferred.resolve([parseInt($marginTopInput.val(), 10) + 'px', parseInt($marginRightInput.val(), 10) + 'px', parseInt($marginBottomInput.val(), 10) + 'px', parseInt($marginLeftInput.val(), 10) + 'px']);
            context.invoke('afterCommand');
          });
        });
        ui.onDialogHidden($mergeDialog, function () {
          $marginInput.off();
          $applyBtn.off();
          ui.toggleBtn($applyBtn, false);

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        });
        ui.showDialog($tableInfoDialog);
      });
    }

    context.memo('button.jWidthHeightReset', function () {
      return ui.button({
        className: 'jtable-display',
        contents: ui.icon('note-icon-table-width-height-reset'),
        tooltip: lang.table.table + ' ' + lang.jTable.areaReset,
        container: options.container,
        click: context.createInvokeHandler('jTable.jWidthHeightReset')
      }).render();
    });

    self.jWidthHeightReset = function () {
      var rng = modules.editor.getLastRange.call(modules.editor);

      if (rng.isCollapsed() && rng.isOnCell()) {
        self.beforeCommand();
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        var $table = $(cell).closest('table');
        $table.removeAttr('width');
        $table.removeAttr('height');
        $table.css('width', 'auto');
        $table.css('height', '');
        var $cell = $table.find('tr, td, th');
        $cell.removeAttr('width');
        $cell.removeAttr('height');
        $cell.css('width', '');
        $cell.css('height', '');
        var vTable = new TableResultAction(cell, undefined, undefined, $table[0]);
        var colCount = vTable.getColCount();
        $table.find('colgroup:first').remove();
        var $colgroup = $('<colgroup/>');

        for (var colIndex = 0; colIndex < colCount; colIndex++) {
          $colgroup.append('<col style="width: 100px;"/>');
        }

        $table.prepend($colgroup);
        self.afterCommand();
      }
    };

    self.expandColgroup = function (colgroup) {
      /**
       * expand colgroup col span
       */
      var innerHTML = '',
          table = colgroup.closest('table');
      table.removeAttr('width');
      table.removeAttr('style');

      for (var index = 0; index < colgroup.length; index++) {
        var col = colgroup[index];
        var span = col.span;
        col.removeAttribute('width');
        var attr = self.recoverAttributes(col);

        while (span > 0) {
          innerHTML = innerHTML.concat("<col ".concat(attr, " />"));
          span = span - 1;
        }
      }

      colgroup.closest('colgroup').html(innerHTML);
    };

    self.events = {
      'summernote.init': function summernoteInit(_, layoutInfo) {
        layoutInfo.editingArea.append('<div class="jtable-block"><div/>');
        layoutInfo.toolbar.find('.jtable-display').hide();
        /**
         * copy table
         */

        layoutInfo.editingArea.on('keydown', function (event) {
          if ((event.metaKey || event.ctrlKey) && String.fromCharCode(event.which).toLowerCase() === 'c') {
            var $this = $(event.target),
                $block = $this.closest('.note-editing-area').find('.jtable-block');

            if ($block.css('display') == 'block') {
              var table = tableBlock.currentTableEl,
                  effect = tableBlock.effect,
                  vTable = new TableResultAction(this, undefined, undefined, table),
                  virtualTable = vTable.getVirtualTable();
              var newTable = document.createElement('table');
              newTable.className = table.className; // IE will miss colgroup => regenerate colgroup after paste

              $(newTable).toggleClass('jtable-expanded', false);
              var colgroup = document.createElement('colgroup'),
                  col = $(table).find('colgroup col');

              for (var index = 0; index < virtualTable[0].length; index++) {
                var td = virtualTable[0][index];
                var new_col = document.createElement('col'),
                    width = !!col[index].style.width ? col[index].style.width : td.baseCell.style.width;
                new_col.style.width = width;
                colgroup.appendChild(new_col);
              }

              newTable.appendChild(colgroup);

              for (var r = effect.row.start; r <= effect.row.end; r++) {
                var row = virtualTable[r];
                var tr = document.createElement('tr');

                for (var c = effect.col.start, i = 0; c <= effect.col.end; c++, i++) {
                  var cell = row[c];
                  if (cell.isVirtual) continue; // IE will miss colgroup so set width in tr

                  tr.style.width = colgroup.childNodes[i].style.width;
                  $(tr).append(cell.baseCell.outerHTML);
                }

                newTable.appendChild(tr);
              }

              $this.closest('.note-editor').after(newTable);
              var range = $.summernote.range.createFromNode(newTable);
              range.select();
              document.execCommand('copy');
              $(newTable).remove();
            }
          }
        });
        /**
         * expand colgroup after paste
         * row height => each td
         * col width => colgroup
         */

        layoutInfo.editingArea.on('paste', '.note-editable', function (event) {
          var $this = $(event.target).closest('.note-editable');
          setTimeout(function () {
            var expandTable = $this.find('table').not('.jtable-expanded');

            for (var t = 0; t < expandTable.length; t++) {
              var table = $(expandTable[t]);

              if (!table.find('col').length) {
                var vTable = new TableResultAction(this, undefined, undefined, expandTable[t]);
                var virtualTable = vTable.getVirtualTable();
                var colgroup = document.createElement('colgroup');

                for (var index = 0; index < virtualTable[0].length; index++) {
                  var td = virtualTable[0][index];
                  var col = document.createElement('col'),
                      width = td.baseCell.style.width;

                  if (td.baseCell.colSpan > 1) {
                    var pattern = width.match(/([0-9]*)([a-z]*$)/);
                    width = pattern[1] / td.baseCell.colSpan + pattern[2];
                  }

                  col.style.width = width;
                  colgroup.appendChild(col);
                }

                table.prepend(colgroup);
              } else {
                var colgroup = table.find('col');
                self.expandColgroup(colgroup);
                table.toggleClass('jtable-expanded', true);
              }
            }
          }, 1);
        });
        /**
         * paste cells
         */

        layoutInfo.editingArea.on('paste', '.note-editable', function (event) {
          setTimeout(function () {
            var $this = $(event.target).closest('.note-editable'),
                $block = $this.closest('.note-editing-area').find('.jtable-block');
            if (!tableBlock.currentTableEl || !$block[0] || $block[0].style.display == 'none') return true;
            var $p_Table = $this.find('table.jtable-paste');

            if (!$p_Table.length) {
              $p_Table = $(event.target).find('table');
            }

            if (!$p_Table.length) return true;
            $p_Table.remove();
            var $p_cell = $p_Table.find('tr, td, th'),
                p_vTable = new TableResultAction($p_cell, undefined, undefined, $p_Table[0]),
                p_matrixTable = p_vTable.getMatrixTable(),
                p_rows = p_matrixTable.length,
                p_cols = p_matrixTable[0].length;
            var b_table = tableBlock.currentTableEl,
                b_cell = tableBlock.currentTdEl,
                effectRow = tableBlock.effect.row,
                effectCol = tableBlock.effect.col,
                rows = effectRow.end - effectRow.start + 1,
                cols = effectCol.end - effectCol.start + 1;
            var type = 0;
            if (p_rows == rows && p_cols == cols) type = 1; // completely match rows & columns
            else if (p_cols > cols || p_rows > rows) type = 2; // need to add cols or rows
              else type = 0; // replace by cell ignore rows & columns

            if (type > 0) {
              if (type == 2) {
                // new col
                for (var index = cols; index < p_cols; index++) {
                  // self.jAddCol('right')
                  self.addCol(b_cell, 'right');
                }

                cols = p_cols; // new row

                for (var _index = rows; _index < p_rows; _index++) {
                  // self.jAddRow('bottom')
                  self.addRow(b_cell, 'bottom');
                }

                rows = p_rows;
              } // replace by row & column


              var vTable = new TableResultAction(b_cell, undefined, undefined, b_table),
                  matrixTable = vTable.getMatrixTable();

              for (var i = 0; i < rows; i++) {
                var row = matrixTable[i + effectRow.start],
                    p_row = p_matrixTable[i].filter(function (cell) {
                  return !cell.isVirtual;
                });

                for (var j = 0; j < cols; j++) {
                  var cell = row[j + effectCol.start];
                  if (!cell || !p_row[j]) continue;
                  cell.baseCell.innerText = p_row[j].baseCell.innerText;
                }
              }
            } else {
              // replace by cell ignore rows & columns
              var p_cells = [],
                  cellIndex = 0; // expand matrixTable

              for (var p_rIndex = 0; p_rIndex < p_matrixTable.length; p_rIndex++) {
                var _rows = p_matrixTable[p_rIndex];

                for (var p_cIndex = 0; p_cIndex < _rows.length; p_cIndex++) {
                  var _cell = _rows[p_cIndex];
                  p_cells.push(_cell);
                }
              } // replace by cell


              for (var _i = 0; _i < rows; _i++) {
                var $row = b_table.rows[_i + effectRow.start];

                for (var _j = 0; _j < cols; _j++, cellIndex++) {
                  var cell = $row.cells[_j + effectCol.start];
                  if (!p_cells[cellIndex]) break;
                  cell.innerText = p_cells[cellIndex].baseCell.innerText;
                }
              }
            }

            $block.hide();
          }, 1);
        });
        layoutInfo.editingArea.on('click', function (event) {
          var $jtable = $(event.target).closest('.note-editor').find('.note-toolbar .jtable-display'),
              $block = $(event.target).closest('.note-editable').next('.jtable-block');
          if ($block.css('display') == 'none') $jtable.hide();
        });
        layoutInfo.editingArea.on('click', '.note-editable table', function (event) {
          var $target = $(event.target).closest('td');
          if (!$target.length) $target = $(event.target).closest('th');
          if ($target.length) modules.tablePopover.update($target[0]);
          var $jtable = $(event.target).closest('.note-editor').find('.note-toolbar .jtable-display');
          $jtable.show();
          event.stopPropagation();
        });
        /**
         * change cursor when hover on table border
         */

        layoutInfo.editingArea.on('mouseleave', '.note-editable tr', function (event) {
          if (tableBlock.pressed) return true;
          if (tableResize.pressed) return true;
          var $this = $(this),
              cursor = $this.closest('.note-editing-area').css('cursor');
          if (cursor == 'row-resize' || cursor == 'col-resize') $this.closest('.note-editing-area').css('cursor', 'auto');
        });
        layoutInfo.editingArea.on('mousemove', '.note-editable td,th', function (event) {
          if (tableBlock.pressed) return true;
          if (tableResize.pressed) return true;
          var $this = $(this),
              $table = $this.closest('table'),
              $tr = $this.closest('tr'),
              targetLeft = $this.offset().left,
              targetWidth = $this.outerWidth(),
              targetRight = targetLeft + targetWidth,
              targetTop = $tr.offset().top,
              targetHeight = $this.outerHeight(),
              targetBottom = targetTop + targetHeight;
          var rightFlag = false;

          if (targetRight - 5 <= event.pageX) {
            rightFlag = true;
          }

          var bottomFlag = false;

          if (targetBottom - 5 <= event.pageY) {
            bottomFlag = true;
          }

          var cursor;

          if (rightFlag) {
            cursor = 'col-resize';
          } else if (bottomFlag) {
            cursor = 'row-resize';
          } else {
            cursor = 'auto';
          }

          $this.closest('.note-editing-area').css('cursor', cursor);
        });
        /**----- */

        /**
         * get table block info
         */

        layoutInfo.editingArea.on('mousedown', 'td', function (event) {
          if (tableBlock.pressed) return true;
          var $this = $(this);
          resetTableBlock($this);
          if (tableResize.pressed) return true;
          var $table = $this.closest('table');
          var targetTop = $this.offset().top;
          var targetLeft = $this.offset().left;
          var targetWidth = $this.outerWidth();
          var targetHeight = $this.outerHeight();
          var targetRight = targetLeft + targetWidth;
          var targetBottom = targetTop + targetHeight;
          var cellPosition = getCellPosition(this, $table[0]);
          tableBlock = {
            pressed: true,
            currentTableEl: $table[0],
            currentTdEl: this,
            currentTdLeft: targetLeft,
            currentTdRight: targetRight,
            currentTdTop: targetTop,
            currentTdBottom: targetBottom,
            currentTdPosition: {
              row: cellPosition.row,
              col: cellPosition.col
            },
            width: targetRight,
            height: targetBottom,
            top: targetTop,
            left: targetLeft,
            effect: {
              row: {
                start: cellPosition.row,
                end: cellPosition.row
              },
              col: {
                start: cellPosition.col,
                end: cellPosition.col
              }
            }
          };
          event.stopPropagation(); // prevent default selection

          if (isMSIE) {
            $table.toggleClass('unselectable', true);
            $table.attr('unselectable', 'on');
          }
        });
        /**
         * select table cell
         */

        layoutInfo.editingArea.on('mousemove', '.note-editable', function (event) {
          if (!tableBlock.pressed) return true;
          modules.tablePopover.hide();
          var $this = $(event.target).closest('td');
          if (!$this.length) $this = $(event.target).closest('th');
          var $block = $this.closest('.note-editing-area').find('.jtable-block');

          if ($this.length) {
            var $table = $this.closest('table');
            var targetTop = $this.offset().top;
            var targetLeft = $this.offset().left;
            var targetWidth = $this.outerWidth();
            var targetHeight = $this.outerHeight();
            var targetRight = targetLeft + targetWidth;
            var targetBottom = targetTop + targetHeight;
            var cellPosition = getCellPosition($this[0], $table[0]);
            var colPos = tableBlock.effect.col;
            var rowPos = tableBlock.effect.row;

            if (tableBlock.currentTdLeft >= targetLeft) {
              tableBlock.left = targetLeft;
              tableBlock.width = tableBlock.currentTdRight - targetLeft;
              colPos.end = tableBlock.currentTdPosition.col;
              colPos.start = cellPosition.col;
            } else {
              tableBlock.width = targetRight - tableBlock.left;
              colPos.end = cellPosition.col;
            }

            if (tableBlock.currentTdTop >= targetTop) {
              tableBlock.top = targetTop;
              tableBlock.height = tableBlock.currentTdBottom - targetTop;
              rowPos.end = tableBlock.currentTdPosition.row;
              rowPos.start = cellPosition.row;
            } else {
              tableBlock.height = targetBottom - tableBlock.top;
              rowPos.end = cellPosition.row;
            }

            $block.show();
            $block.offset({
              left: tableBlock.left,
              top: tableBlock.top
            });
            $block.css({
              width: tableBlock.width,
              height: tableBlock.height
            });
          }
        });
        /**
         * when onblur table hide jtable-block(cell selection)
         */

        layoutInfo.editingArea.on('mousedown', '.note-editable', function (event) {
          var $block = $(event.target).closest('.note-editable').next('.jtable-block');
          $block.hide();
        });
        layoutInfo.editingArea.on('mousemove mousedown touchstart', '.note-editable', function (event) {
          if (!tableBlock.pressed) return true;
          event.preventDefault();
        });
        /**
         * reset table pressed and update table popover
         */

        layoutInfo.editingArea.on('mouseup', '.note-editable', function (event) {
          if (isMSIE) {
            var $table = $('table.unselectable');
            $table.toggleClass('unselectable', false);
            $table.attr('unselectable', 'off');
          }

          if (!tableBlock.pressed) return true;
          tableBlock.pressed = false;
          var $target = $(event.target).closest('td');
          if (!$target.length) $target = $(event.target).closest('th');
          if ($target.length) modules.tablePopover.update($target[0]);
        });
        /**
         * get table resize info
         */

        layoutInfo.editingArea.on('mousedown', 'td', function (event) {
          var $this = $(this);
          var $table = $this.closest('table');
          var $tr = $this.closest('tr');
          var targetLeft = $this.offset().left;
          var targetWidth = $this.outerWidth();
          var targetRight = targetLeft + targetWidth;
          var targetTop = $tr.offset().top;
          var targetHeight = $this.outerHeight();
          var targetBottom = targetTop + targetHeight;
          var rightFlag = false;

          if (targetRight - 5 <= event.pageX) {
            rightFlag = true;
          }

          var bottomFlag = false;

          if (targetBottom - 5 <= event.pageY) {
            bottomFlag = true;
          }

          var contenteditable = $this.closest('.note-editable').prop('contenteditable');

          if (!rightFlag && !bottomFlag) {
            resetTableResizeCursor($this, contenteditable);
            resetTableResize();
            return;
          }

          modules.tablePopover.hide();
          var cursor;

          if (rightFlag) {
            cursor = 'col-resize';
          } else {
            cursor = 'row-resize';
          }

          $this.closest('.note-editing-area').css('cursor', cursor);
          $this.closest('.note-editable').removeAttr('contenteditable');
          /**
           * expand colgroup col span
           */

          var colgroup = $table.find('col');
          self.expandColgroup(colgroup);
          /**
           * remove td width turn into <col> width
           */

          var tds = $table.find('td');

          for (var index = 0; index < tds.length; index++) {
            var td = tds[index];
            if (!!td.width) td.width = '';
            if (!!td.style.width) td.style.width = '';
          }

          var vTable = new TableResultAction(this, undefined, undefined, $table[0]);
          var virtualTable = vTable.getVirtualTable();
          var trIndex = $tr[0].rowIndex;
          var cellHasColspan = this.colSpan > 1;
          var tdList = virtualTable[trIndex];

          for (var colIndex = 0; colIndex < tdList.length; colIndex++) {
            var virtualTd = tdList[colIndex];
            if (this == virtualTd.baseCell) break;
          }

          if (cellHasColspan) {
            colIndex += this.colSpan - 1;
          }

          var firstTdEl = virtualTable[0][colIndex].baseCell;
          var colEl = $table.find('colgroup:first col')[colIndex];
          var startWidth = $this.width();

          if (colEl) {
            startWidth = $(colEl).width();
          }

          tableResize = {
            pressed: true,
            rightFlag: rightFlag,
            bottomFlag: bottomFlag,
            currentTableEl: $table[0],
            currentTrEl: $tr[0],
            firstTdEl: firstTdEl,
            colEl: colEl,
            currentTdEl: this,
            currentTdLeft: targetLeft,
            currentTdRight: targetRight,
            currentTdTop: targetTop,
            currentTdBottom: targetBottom,
            startX: event.pageX,
            startWidth: startWidth,
            startY: event.pageY,
            startHeight: $this.height(),
            contenteditable: contenteditable
          }; // prevent default selection

          if (isMSIE) {
            $table.toggleClass('unselectable', true);
            $table.attr('unselectable', 'on');
          }

          resetTableBlock($this);
          event.stopPropagation();
        });
        /**
         * table resize
         */

        layoutInfo.editingArea.on('mousemove', '.note-editable', function (event) {
          if (!tableResize.pressed) return true;
          var $this = $(this);
          var targetLeft = tableResize.currentTdLeft;
          var targetTop = tableResize.currentTdTop;

          if (tableResize.rightFlag) {
            if (!(targetLeft + 1 <= event.pageX)) {
              resetTableResizeCursor($this, tableResize.contenteditable);
              resetTableResize();
              return true;
            }

            var resizeTargetEl = tableResize.firstTdEl;

            if (tableResize.colEl) {
              resizeTargetEl = tableResize.colEl;
            }

            var width = tableResize.startWidth + (event.pageX - tableResize.startX);
            execTableResize('width', $(resizeTargetEl), width);
          } else if (tableResize.bottomFlag) {
            if (!(targetTop + 1 <= event.pageY)) {
              resetTableResizeCursor($this, tableResize.contenteditable);
              resetTableResize();
              return true;
            }

            var resizeTargetEl = tableResize.currentTrEl;
            var height = tableResize.startHeight + (event.pageY - tableResize.startY);
            execTableResize('height', $(resizeTargetEl), height);
          }
        });
        layoutInfo.editingArea.on('mousemove mousedown touchstart', '.note-editable', function (event) {
          if (!tableResize.pressed) return true;
          event.preventDefault();
        });
        /**
         * reset table resize info
         */

        layoutInfo.editingArea.on('mouseup', '.note-editable', function (event) {
          var $table = $('table.unselectable');
          $table.toggleClass('unselectable', false);
          $table.attr('unselectable', 'off');
          if (!tableResize.pressed) return true;
          context.invoke('beforeCommand');
          resetTableResizeCursor($(this), tableResize.contenteditable);
          resetTableResize();
          context.invoke("afterCommand");
        });
      }
    };

    self.initialize = function () {};

    self.destroy = function () {
      ui.hideDialog($mergeDialog);
      $mergeDialog.remove();
      ui.hideDialog($tableInfoDialog);
      $tableInfoDialog.remove();
    };

    function execTableResize(type, $resizeTargetEl, size) {
      switch (type) {
        case 'width':
          $resizeTargetEl.width(size);
          break;

        case 'height':
          $resizeTargetEl.children().height(size);
          break;
      }
    }

    function resetTableResizeCursor($this, contenteditable) {
      $this.closest('.note-editing-area').css('cursor', 'auto');
      $this.closest('.note-editable').prop('contenteditable', contenteditable);
    }

    function resetTableResize() {
      tableResize = {
        pressed: false,
        rightFlag: false,
        bottomFlag: false,
        currentTableEl: undefined,
        firstTdEl: undefined,
        colEl: undefined,
        currentTdEl: undefined,
        currentTdLeft: undefined,
        currentTdRight: undefined,
        currentTdTop: undefined,
        currentTdBottom: undefined,
        startX: undefined,
        startWidth: undefined,
        startY: undefined,
        startHeight: undefined,
        contenteditable: false
      };
    }

    function resetTableBlock($this) {
      tableBlock = {
        pressed: false,
        currentTableEl: undefined,
        currentTdEl: undefined,
        currentTdLeft: undefined,
        currentTdRight: undefined,
        currentTdTop: undefined,
        currentTdBottom: undefined,
        currentTdPosition: {
          row: undefined,
          col: undefined
        },
        width: undefined,
        height: undefined,
        top: undefined,
        left: undefined,
        effect: {
          row: {
            start: undefined,
            end: undefined
          },
          col: {
            start: undefined,
            end: undefined
          }
        }
      };
      var $block = $this.closest('.note-editing-area').find('.jtable-block');
      $block.hide();
    }

    function getCellPosition(cellEl, tableEl) {
      var vTable = new TableResultAction(cellEl, undefined, undefined, tableEl);
      var matrixTable = vTable.getMatrixTable();

      for (var rowIndex = 0; rowIndex < matrixTable.length; rowIndex++) {
        var virtualTr = matrixTable[rowIndex];

        for (var colIndex = 0; colIndex < virtualTr.length; colIndex++) {
          var virtualTd = matrixTable[rowIndex][colIndex];

          if (virtualTd.baseCell == cellEl) {
            return {
              row: rowIndex,
              col: colIndex
            };
          }
        }
      }
    }
  }; // add table / table col resize end
  // 'TableResultAction' copy 'summernote-0.8.16\src\js\base\editing\Table.js'

  /**
   * @class Create a virtual table to create what actions to do in change.
   * @param {object} startPoint Cell selected to apply change.
   * @param {enum} where  Where change will be applied Row or Col. Use enum: TableResultAction.where
   * @param {enum} action Action to be applied. Use enum: TableResultAction.requestAction
   * @param {object} domTable Dom element of table to make changes.
   */


  var TableResultAction = function TableResultAction(startPoint, where, action, domTable) {
    var _startPoint = {
      'colPos': 0,
      'rowPos': 0
    };
    var _virtualTable = [];
    var _actionCellList = [];
    var _matrixTable = []; /// ///////////////////////////////////////////
    // Private functions
    /// ///////////////////////////////////////////

    /**
     * Set the startPoint of action.
     */

    function setStartPoint() {
      if (!startPoint || !startPoint.tagName || startPoint.tagName.toLowerCase() !== 'td' && startPoint.tagName.toLowerCase() !== 'th') {
        // Impossible to identify start Cell point
        return;
      }

      _startPoint.colPos = startPoint.cellIndex;

      if (!startPoint.parentElement || !startPoint.parentElement.tagName || startPoint.parentElement.tagName.toLowerCase() !== 'tr') {
        // Impossible to identify start Row point
        return;
      }

      _startPoint.rowPos = startPoint.parentElement.rowIndex;
    }
    /**
     * Define virtual table position info object.
     *
     * @param {int} rowIndex Index position in line of virtual table.
     * @param {int} cellIndex Index position in column of virtual table.
     * @param {object} baseRow Row affected by this position.
     * @param {object} baseCell Cell affected by this position.
     * @param {bool} isSpan Inform if it is an span cell/row.
     */


    function setVirtualTablePosition(rowIndex, cellIndex, baseRow, baseCell, isRowSpan, isColSpan, isVirtualCell) {
      var objPosition = {
        'baseRow': baseRow,
        'baseCell': baseCell,
        'isRowSpan': isRowSpan,
        'isColSpan': isColSpan,
        'isVirtual': isVirtualCell
      };

      if (!_virtualTable[rowIndex]) {
        _virtualTable[rowIndex] = [];
      }

      _virtualTable[rowIndex][cellIndex] = objPosition;
    }
    /**
     * Create action cell object.
     *
     * @param {object} virtualTableCellObj Object of specific position on virtual table.
     * @param {enum} resultAction Action to be applied in that item.
     */


    function getActionCell(virtualTableCellObj, resultAction, virtualRowPosition, virtualColPosition) {
      return {
        'baseCell': virtualTableCellObj.baseCell,
        'action': resultAction,
        'virtualTable': {
          'rowIndex': virtualRowPosition,
          'cellIndex': virtualColPosition
        }
      };
    }
    /**
     * Recover free index of row to append Cell.
     *
     * @param {Array} _table _virtualTable / _matrixTable.
     * @param {int} rowIndex Index of row to find free space.
     * @param {int} cellIndex Index of cell to find free space in table.
     */


    function recoverCellIndex(_table, rowIndex, cellIndex) {
      if (!_table[rowIndex]) {
        return cellIndex;
      }

      if (!_table[rowIndex][cellIndex]) {
        return cellIndex;
      }

      var newCellIndex = cellIndex;

      while (_table[rowIndex][newCellIndex]) {
        newCellIndex++;

        if (!_table[rowIndex][newCellIndex]) {
          return newCellIndex;
        }
      }
    }
    /**
     * Recover info about row and cell and add information to virtual table.
     *
     * @param {object} row Row to recover information.
     * @param {object} cell Cell to recover information.
     */


    function addCellInfoToVirtual(row, cell) {
      var cellIndex = recoverCellIndex(_virtualTable, row.rowIndex, cell.cellIndex);
      var cellHasColspan = cell.colSpan > 1;
      var cellHasRowspan = cell.rowSpan > 1;
      var isThisSelectedCell = row.rowIndex === _startPoint.rowPos && cell.cellIndex === _startPoint.colPos;
      setVirtualTablePosition(row.rowIndex, cellIndex, row, cell, cellHasRowspan, cellHasColspan, false); // Add span rows to virtual Table.

      var rowspanNumber = cell.attributes.rowSpan ? parseInt(cell.attributes.rowSpan.value, 10) : 0;

      if (rowspanNumber > 1) {
        for (var rp = 1; rp < rowspanNumber; rp++) {
          var rowspanIndex = row.rowIndex + rp;
          adjustStartPoint(rowspanIndex, cellIndex, cell, isThisSelectedCell);
          setVirtualTablePosition(rowspanIndex, cellIndex, row, cell, true, cellHasColspan, true);
        }
      } // Add span cols to virtual table.


      var colspanNumber = cell.attributes.colSpan ? parseInt(cell.attributes.colSpan.value, 10) : 0;

      if (colspanNumber > 1) {
        for (var cp = 1; cp < colspanNumber; cp++) {
          var cellspanIndex = recoverCellIndex(_virtualTable, row.rowIndex, cellIndex + cp);
          adjustStartPoint(row.rowIndex, cellspanIndex, cell, isThisSelectedCell);
          setVirtualTablePosition(row.rowIndex, cellspanIndex, row, cell, cellHasRowspan, true, true);
        }
      }
    }
    /**
     * Process validation and adjust of start point if needed
     *
     * @param {int} rowIndex
     * @param {int} cellIndex
     * @param {object} cell
     * @param {bool} isSelectedCell
     */


    function adjustStartPoint(rowIndex, cellIndex, cell, isSelectedCell) {
      if (rowIndex === _startPoint.rowPos && _startPoint.colPos >= cell.cellIndex && cell.cellIndex <= cellIndex && !isSelectedCell) {
        _startPoint.colPos++;
      }
    }
    /**
     * Create virtual table of cells with all cells, including span cells.
     */


    function createVirtualTable() {
      var rows = domTable.rows;

      for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var cells = rows[rowIndex].cells;

        for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
          addCellInfoToVirtual(rows[rowIndex], cells[cellIndex]);
        }
      }
    }
    /**
     * Get action to be applied on the cell.
     *
     * @param {object} cell virtual table cell to apply action
     */


    function getDeleteResultActionToCell(cell) {
      switch (where) {
        case TableResultAction.where.Column:
          if (cell.isColSpan) {
            return TableResultAction.resultAction.SubtractSpanCount;
          }

          break;

        case TableResultAction.where.Row:
          if (!cell.isVirtual && cell.isRowSpan) {
            return TableResultAction.resultAction.AddCell;
          } else if (cell.isRowSpan) {
            return TableResultAction.resultAction.SubtractSpanCount;
          }

          break;
      }

      return TableResultAction.resultAction.RemoveCell;
    }
    /**
     * Get action to be applied on the cell.
     *
     * @param {object} cell virtual table cell to apply action
     */


    function getAddResultActionToCell(cell) {
      switch (where) {
        case TableResultAction.where.Column:
          if (cell.isColSpan) {
            return TableResultAction.resultAction.SumSpanCount;
          } else if (cell.isRowSpan && cell.isVirtual) {
            return TableResultAction.resultAction.Ignore;
          }

          break;

        case TableResultAction.where.Row:
          if (cell.isRowSpan) {
            return TableResultAction.resultAction.SumSpanCount;
          } else if (cell.isColSpan && cell.isVirtual) {
            return TableResultAction.resultAction.Ignore;
          }

          break;
      }

      return TableResultAction.resultAction.AddCell;
    }
    /**
     * Create matrix table of cells with all cells, including span cells.
     */


    function createMatrixTable() {
      var rows = domTable.rows;

      for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var cells = rows[rowIndex].cells;

        for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
          addCellInfoToMatrix(rows[rowIndex], cells[cellIndex]);
        }
      }
    }
    /**
     * Define matrix table position info object.
     *
     * @param {int} rowIndex Index position in line of matrix table.
     * @param {int} cellIndex Index position in column of matrix table.
     * @param {object} baseRow Row affected by this position.
     * @param {object} baseCell Cell affected by this position.
     * @param {bool} isRowSpan Inform if it is an span row.
     * @param {bool} isColSpan Inform if it is an span cell.
     * @param {bool} isVirtualCell Inform if it is an virtual cell.
     */


    function setMatrixTable(rowIndex, cellIndex, baseRow, baseCell, isRowSpan, isColSpan, isVirtualCell) {
      var objPosition = {
        'baseRow': baseRow,
        'baseCell': baseCell,
        'isRowSpan': isRowSpan,
        'isColSpan': isColSpan,
        'isVirtual': isVirtualCell
      };

      if (!_matrixTable[rowIndex]) {
        _matrixTable[rowIndex] = [];
      }

      _matrixTable[rowIndex][cellIndex] = objPosition;
    }
    /**
     * Recover info about row and cell and add information to matrix table.
     *
     * @param {object} row Row to recover information.
     * @param {object} cell Cell to recover information.
     */


    function addCellInfoToMatrix(row, cell) {
      var rowIndex = row.rowIndex;
      var cellIndex = recoverCellIndex(_matrixTable, row.rowIndex, cell.cellIndex);
      var cellHasRowspan = cell.rowSpan > 1;
      var cellHasColspan = cell.colSpan > 1;
      setMatrixTable(rowIndex, cellIndex, row, cell, cellHasRowspan, cellHasColspan, false);
      var rowspanNumber = cell.rowSpan;
      var colspanNumber = cell.colSpan;

      if (cellHasColspan) {
        for (var colCount = 1; colCount < colspanNumber; colCount++) {
          setMatrixTable(rowIndex, cellIndex + colCount, row, cell, cellHasRowspan, cellHasColspan, true);
        }
      }

      if (cellHasRowspan) {
        for (var rowCount = 1; rowCount < rowspanNumber; rowCount++) {
          setMatrixTable(rowIndex + rowCount, cellIndex, row, cell, cellHasRowspan, cellHasColspan, true);

          if (cellHasColspan) {
            for (var _colCount = 1; _colCount < colspanNumber; _colCount++) {
              setMatrixTable(rowIndex + rowCount, cellIndex + _colCount, row, cell, cellHasRowspan, cellHasColspan, true);
            }
          }
        }
      }
    }

    function init() {
      setStartPoint();
      createVirtualTable();
      createMatrixTable();
    } /// ///////////////////////////////////////////
    // Public functions
    /// ///////////////////////////////////////////

    /**
     * Recover array os what to do in table.
     */


    this.getActionList = function () {
      var fixedRow = where === TableResultAction.where.Row ? _startPoint.rowPos : -1;
      var fixedCol = where === TableResultAction.where.Column ? _startPoint.colPos : -1;
      var actualPosition = 0;
      var canContinue = true;

      while (canContinue) {
        var rowPosition = fixedRow >= 0 ? fixedRow : actualPosition;
        var colPosition = fixedCol >= 0 ? fixedCol : actualPosition;
        var row = _virtualTable[rowPosition];

        if (!row) {
          canContinue = false;
          return _actionCellList;
        }

        var cell = row[colPosition];

        if (!cell) {
          canContinue = false;
          return _actionCellList;
        } // Define action to be applied in this cell


        var resultAction = TableResultAction.resultAction.Ignore;

        switch (action) {
          case TableResultAction.requestAction.Add:
            resultAction = getAddResultActionToCell(cell);
            break;

          case TableResultAction.requestAction.Delete:
            resultAction = getDeleteResultActionToCell(cell);
            break;
        }

        _actionCellList.push(getActionCell(cell, resultAction, rowPosition, colPosition));

        actualPosition++;
      }

      return _actionCellList;
    };
    /**
     * Return _virtualTable
     */


    this.getVirtualTable = function () {
      return _virtualTable;
    };
    /**
     * Return _matrixTable
     */


    this.getMatrixTable = function () {
      return _matrixTable;
    };
    /**
     * Return Column count
     */


    this.getColCount = function () {
      var columnCount = 0;

      for (var i = 0; i < _matrixTable.length; i++) {
        var row = _matrixTable[i];
        if (columnCount <= row.length) columnCount = row.length;
      }

      return columnCount;
    };

    init();
  };
  /**
   *
   * Where action occours enum.
   */


  TableResultAction.where = {
    'Row': 0,
    'Column': 1
  };
  /**
   *
   * Requested action to apply enum.
   */

  TableResultAction.requestAction = {
    'Add': 0,
    'Delete': 1
  };
  /**
   *
   * Result action to be executed enum.
   */

  TableResultAction.resultAction = {
    'Ignore': 0,
    'SubtractSpanCount': 1,
    'RemoveCell': 2,
    'AddCell': 3,
    'SumSpanCount': 4
  }; // Extends summernote

  $.extend(true, $.summernote.options, {
    jTable: {
      mergeMode: 'drag' // drag || dialog

    }
  });
  $.extend(true, $.summernote.lang, {
    'zh-TW': {
      jTable: {
        borderColor: '外框顏色',
        merge: {
          merge: '合併儲存格',
          colspan: '欄',
          rowspan: '列',
          split: '取消合併儲存格'
        },
        align: {
          top: '靠上對齊',
          middle: '置中對齊',
          bottom: '靠下對齊',
          baseline: 'baseline'
        },
        info: {
          info: 'table info',
          margin: '邊界'
        },
        apply: '套用',
        addDeleteRowCOl: '欄/列(插入/刪除)',
        areaReset: '清除格式',
        message: '<b>取消合併儲存格才可使用</br>'
      }
    },
    'en-US': {
      jTable: {
        borderColor: 'Border color',
        merge: {
          merge: 'cell merge',
          colspan: 'colspan',
          rowspan: 'rowspan',
          split: 'cell split'
        },
        align: {
          top: 'top',
          middle: 'middle',
          bottom: 'bottom',
          baseline: 'baseline'
        },
        info: {
          info: 'table info',
          margin: 'margin'
        },
        apply: 'apply',
        addDeleteRowCOl: 'Row/Col(Add/Del)',
        areaReset: 'area Reset',
        message: '<b>Available after unmerge<br/>current or surrounding cells</br>'
      }
    },
    'ko-KR': {
      jTable: {
        borderColor: '선색',
        merge: {
          merge: '셀 합치기',
          colspan: '가로',
          rowspan: '세로',
          split: '셀 나누기'
        },
        align: {
          top: '위쪽 정렬',
          middle: '가운데 정렬',
          bottom: '아래쪽 정렬',
          baseline: '기본 정렬'
        },
        info: {
          info: '테이블 정보',
          margin: '여백'
        },
        apply: '적용',
        addDeleteRowCOl: '행/열(추가/삭제)',
        areaReset: '넓이/높이 초기화',
        message: '<b>현재 또는 주위 셀<br/>병합 해제 후 사용 가능</b>'
      }
    }
  });
  $.extend(true, $.summernote, {
    plugins: {
      jTable: JTablePlugin
    }
  });
});

/***/ }),

/***/ "./src/plugin/misc/summernote-text-findnreplace.js":
/*!*********************************************************!*\
  !*** ./src/plugin/misc/summernote-text-findnreplace.js ***!
  \*********************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  $.extend(true, $.summernote.lang, {
    'en-US': {
      /* English */
      findnreplace: {
        tooltip: "Find 'N Replace",
        findBtn: 'Find ',
        findPlaceholder: 'Enter the text you want to find...',
        findResult: ' results found for ',
        findError: 'Nothing entered to find...',
        replaceBtn: 'Replace',
        replacePlaceholder: 'Enter the text to replace the text above or selected...',
        replaceResult: ', replaced by ',
        replaceError: 'Nothing entered to replace...',
        noneSelected: 'Nothing selected to replace...'
      }
    },
    'zh-TW': {
      findnreplace: {
        tooltip: "\u641C\u5C0B\u8207\u53D6\u4EE3",
        findBtn: '搜尋',
        findPlaceholder: '搜尋...',
        findResult: ' 個結果 ',
        findError: '查無結果',
        replaceBtn: '取代',
        replacePlaceholder: '取代...',
        replaceResult: ', 取代成 ',
        replaceError: '查無結果',
        noneSelected: '查無結果'
      }
    }
  });
  $.extend($.summernote.options, {
    findnreplace: {
      classHidden: 'note-display-none',
      icon: '<i class="note-icon" data-toggle="findnreplace"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="12" height="12"><path d="m 5.8,2.3764705 c 0.941176,0 1.811765,0.376471 2.423529,1.011765 l -1.741176,1.741176 4.117647,0 0,-4.117647 -1.411765,1.411765 C 8.317647,1.5529415 7.117647,1.0117645 5.8,1.0117645 c -2.423529,0 -4.423529,1.788236 -4.752941,4.117647 l 1.388235,0 C 2.741176,3.5529415 4.129412,2.3764705 5.8,2.3764705 Z m 3.8588235,6.282353 c 0.4470585,-0.611764 0.7764705,-1.341176 0.8705885,-2.164706 l -1.388236,0 c -0.305882,1.552942 -1.694117,2.752942 -3.364705,2.752942 -0.941177,0 -1.811765,-0.376471 -2.42353,-1.011765 L 5.094118,6.4941175 1,6.4941175 1,10.611765 2.411765,9.2000005 C 3.282353,10.070589 4.482353,10.611765 5.8,10.611765 c 1.058824,0 2.047059,-0.352942 2.847059,-0.9411765 L 11.988235,12.988236 13,11.97647 9.6588235,8.6588235 Z"/></svg></i>'
    }
  });
  $.extend($.summernote.plugins, {
    'findnreplace': function findnreplace(context) {
      var ui = $.summernote.ui,
          $note = context.layoutInfo.note,
          $editor = context.layoutInfo.editor,
          $toolbar = context.layoutInfo.toolbar,
          $statusbar = context.layoutInfo.statusbar,
          options = context.options,
          lang = options.langInfo;

      if ($('#summernote-findnreplace-style').length == 0) {
        this.css = $("\n        <style>\n          .findnreplaceToolbar {\n            padding: 5px;\n            background-color: var(--note-toolbar-background-color) !important;\n            border-bottom: var(--note-toolbar-border-width) var(--note-toolbar-border-style) var(--note-toolbar-border-color);\n          }\n          .findnreplaceToolbar .note-form-group {\n            padding: 0;\n          }\n          .note-display-none {\n            display: none !important; }\n          \n          .note-display-block {\n            display: block !important; }\n          \n          span.note-findnreplace {\n            background-color: #ff0; }\n        </style>");
        this.css.attr('id', 'summernote-findnreplace-style');
        this.css.appendTo('head');
      }

      context.memo('button.findnreplace', function () {
        var button = ui.button({
          contents: options.findnreplace.icon,
          container: options.container,
          tooltip: lang.findnreplace.tooltip,
          placement: options.placement,
          click: function click(e) {
            e.preventDefault();
            $editor.find('.note-findnreplace').contents().unwrap('span');
            $toolbar.find('.findnreplaceToolbar').toggleClass(options.findnreplace.classHidden);
            $statusbar.find('.note-status-output').text('');

            if ($note.summernote('createRange').toString()) {
              var selected = $note.summernote('createRange').toString();
              $toolbar.find('.note-findnreplace-find').val(selected);
            }
          }
        });
        return button.render();
      });

      this.initialize = function () {
        this.fnrBody = $('<div class="findnreplaceToolbar note-display-none">' + '<div class="note-form-group">' + '<input type="text" class="note-findnreplace-find note-input" value="" placeholder="' + lang.findnreplace.findPlaceholder + '">' + '<button class="note-findnreplace-find-btn btn btn-default note-btn" style="width:100px;">' + lang.findnreplace.findBtn + '</button>' + '</div>' + '<div class="note-form-group">' + '<input type="text" class="note-findnreplace-replace note-input" value="" placeholder="' + lang.findnreplace.replacePlaceholder + '">' + '<button class="note-findnreplace-replace-btn btn btn-default note-btn" style="width:100px;">' + lang.findnreplace.replaceBtn + '</button>' + '</div>' + '</div>');
        $toolbar.append(this.fnrBody);
        this.show();
      };

      this.findnreplace = function () {
        var $fnrFindBtn = $toolbar.find('.note-findnreplace-find-btn');
        var $fnrReplaceBtn = $toolbar.find('.note-findnreplace-replace-btn');
        $fnrFindBtn.click(function (e) {
          e.preventDefault();
          $editor.find('.note-findnreplace').contents().unwrap('span');
          var fnrCode = context.invoke('code');
          var fnrFind = $toolbar.find('.note-findnreplace-find').val();
          var fnrReplace = $toolbar.find('.note-findnreplace-replace').val();
          var fnrCount = (fnrCode.match(new RegExp(fnrFind + "(?![^<>]*>)", "gi")) || []).length;

          if (fnrFind) {
            $statusbar.find('.note-status-output').text(fnrCount + lang.findnreplace.findResult + "`" + fnrFind + "`");
            var fnrReplaced = fnrCode.replace(new RegExp(fnrFind + "(?![^<>]*>)", "gi"), function (e) {
              return '<span class="note-findnreplace">' + e + '</span>';
            });
            $note.summernote('code', fnrReplaced);
          } else $statusbar.find('.note-status-output').html(lang.findnreplace.findError);
        });
        $fnrReplaceBtn.click(function (e) {
          e.preventDefault();
          $editor.find('.note-findnreplace').contents().unwrap('span');
          var fnrCode = context.invoke('code');
          var fnrFind = $toolbar.find('.note-findnreplace-find').val();
          var fnrReplace = $toolbar.find('.note-findnreplace-replace').val();
          var fnrCount = (fnrCode.match(new RegExp(fnrFind, "gi")) || []).length;

          if (fnrFind) {
            $statusbar.find('.note-status-output').text(fnrCount + lang.findnreplace.findResult + "`" + fnrFind + "`" + lang.findnreplace.replaceResult + "`" + fnrReplace + "`");
            var fnrReplaced = fnrCode.replace(new RegExp(fnrFind + "(?![^<>]*>)", "gi"), fnrReplace);
            $note.summernote('code', fnrReplaced);
          } else {
            if (fnrReplace) {
              if ($note.summernote('createRange').toString()) {
                $note.summernote('insertText', fnrReplace);
                $statusbar.find('.note-status-output').text('');
              } else $statusbar.find('.note-status-output').html(lang.findnreplace.noneSelected);
            } else $statusbar.find('.note-status-output').html(lang.findnreplace.replaceError);
          }
        });
      };

      this.show = function () {
        this.findnreplace();
      };

      this.destroy = function () {
        !!this.css && $(this.css).remove();
        this.fnrBody.remove();
      };
    }
  });
});

/***/ }),

/***/ "./src/plugin/misc/summernoteDrafts.js":
/*!*********************************************!*\
  !*** ./src/plugin/misc/summernoteDrafts.js ***!
  \*********************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(store) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
 * @package summernoteDrafts.js
 * @version 1.0
 * @author Jessica González <suki@missallsunday.com>
 * @copyright Copyright (c) 2017, Jessica González
 * @license https://opensource.org/licenses/MIT MIT
 */
(function () {
  (function (factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
  })(function ($) {
    $.extend($.summernote.options, {
      sDrafts: {
        storePrefix: 'sDrafts',
        dateFormat: null,
        saveIcon: null,
        loadIcon: null
      }
    });
    $.extend($.summernote.lang['en-US'], {
      sDrafts: {
        save: 'Save Draft',
        load: 'Load Drafts',
        select: 'select the draft you want to load',
        provideName: 'Provide a name for this draft',
        saved: 'Draft was successfully saved',
        loaded: 'Draft was successfully loaded',
        deleteAll: 'Delete all drafts',
        noDraft: 'The selected draft couldn\'t be loaded, try again or select another one',
        nosavedDrafts: 'There aren\'t any drafts saved',
        deleteDraft: 'delete',
        youSure: 'Are you sure you want to do this?'
      }
    });
    $.extend($.summernote.lang['zh-TW'], {
      sDrafts: {
        save: '儲存草稿',
        load: '載入草稿',
        select: '選擇要載入的草稿',
        provideName: '輸入草稿名稱',
        saved: '成功儲存草稿',
        loaded: '成功載入草告',
        deleteAll: '刪除所有草稿',
        noDraft: '無法載入選擇的草稿，重試或選擇其他草稿',
        nosavedDrafts: '目前尚無儲存的草稿',
        deleteDraft: '刪除',
        youSure: '確定要刪除所有草稿？'
      }
    });
    $.extend($.summernote.plugins, {
      'sDraftsSave': function sDraftsSave(context) {
        var $editor, lang, options, ui;
        ui = $.summernote.ui;
        options = context.options;
        lang = options.langInfo.sDrafts;
        $editor = context.layoutInfo.editor;
        context.memo('button.sDraftsSave', function () {
          var button;
          button = ui.button({
            contents: options.sDrafts.saveIcon || "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-journal-bookmark\" viewBox=\"0 0 16 16\">\n                        <path fill-rule=\"evenodd\" d=\"M6 8V1h1v6.117L8.743 6.07a.5.5 0 0 1 .514 0L11 7.117V1h1v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z\"/>\n                        <path d=\"M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z\"/>\n                        <path d=\"M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z\"/>\n                    </svg>",
            tooltip: lang.save,
            click: function click(e) {
              e.preventDefault();
              context.invoke('sDraftsSave.show');
              return false;
            }
          });
          return button.render();
        });

        this.initialize = function (_this) {
          return function () {
            var $container, body, footer;
            $container = options.dialogsInBody ? $(document.body) : $editor;
            body = "<div class='form-group'><label>" + lang.provideName + "</label><input class='note-draftName form-control' type='text' /></div>";
            footer = "<button href='#' class='btn btn-primary note-link-btn'>" + lang.save + "</button>";
            _this.$dialog = ui.dialog({
              className: 'link-dialog',
              title: lang.save,
              fade: options.dialogsFade,
              body: body,
              footer: footer
            }).render().appendTo($container);
          };
        }(this);

        this.destroy = function (_this) {
          return function () {
            ui.hideDialog(_this.$dialog);

            _this.$dialog.remove();
          };
        }(this);

        this.show = function (_this) {
          return function () {
            var $saveBtn;
            ui.showDialog(_this.$dialog);
            return $saveBtn = _this.$dialog.find('.note-link-btn').click(function (e) {
              var draftName;
              e.preventDefault;
              draftName = _this.$dialog.find('.note-draftName').val();

              _this.saveDraft(draftName);

              return false;
            });
          };
        }(this);

        this.saveDraft = function (_this) {
          return function (name) {
            var body, isoDate, keyName;
            isoDate = new Date().toISOString();

            if (name == null) {
              name = isoDate;
            }

            keyName = options.sDrafts.storePrefix + '-' + name;
            body = context.code();
            store.set(keyName, {
              name: name,
              sDate: isoDate,
              body: body
            });
            alert(lang.saved);

            _this.destroy();
          };
        }(this);
      }
    });
    return $.extend($.summernote.plugins, {
      'sDraftsLoad': function sDraftsLoad(context) {
        var $editor, draft, drafts, fn, htmlList, key, lang, options, ui;
        ui = $.summernote.ui;
        options = context.options;
        lang = options.langInfo.sDrafts;
        $editor = context.layoutInfo.editor;
        drafts = [];
        store.each(function (value, key) {
          if (typeof key === 'string' && key.indexOf(options.sDrafts.storePrefix) >= 0) {
            return drafts[key] = value;
          }
        });
        htmlList = '';

        fn = function fn() {
          var fDate;
          fDate = options.sDrafts.dateFormat && typeof options.sDrafts.dateFormat === 'function' ? options.sDrafts.dateFormat(draft.sDate) : draft.sDate;
          return htmlList += "<li class='list-group-item'><a href='#' class='note-draft' data-draft='" + key + "'>" + draft.name + " - <small>" + fDate + "</small></a><a href='#' class='label label-danger pull-right delete-draft' data-draft='" + key + "' style='float:right;'>" + lang.deleteDraft + "</a></li>";
        };

        for (key in drafts) {
          draft = drafts[key];
          fn();
        }

        context.memo('button.sDraftsLoad', function () {
          var button;
          button = ui.button({
            contents: options.sDrafts.loadIcon || "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-journals\" viewBox=\"0 0 16 16\">\n                        <path d=\"M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z\"/>\n                        <path d=\"M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z\"/>\n                    </svg>",
            tooltip: lang.load,
            click: function click(e) {
              e.preventDefault();
              context.invoke('sDraftsLoad.show');
              return false;
            }
          });
          return button.render();
        });

        this.initialize = function (_this) {
          return function () {
            var $container, body, footer;
            $container = options.dialogsInBody ? $(document.body) : $editor;
            body = htmlList.length ? "<h4>" + lang.select + "</h4><ul class='list-group'>" + htmlList + "</ul>" : "<h4>" + lang.nosavedDrafts + "</h4>";
            footer = htmlList.length ? "<button href='#' class='btn btn-primary deleteAll'>" + lang.deleteAll + "</button>" : "";
            _this.$dialog = ui.dialog({
              className: 'link-dialog',
              title: lang.load,
              fade: options.dialogsFade,
              body: body,
              footer: footer
            }).render().appendTo($container);
          };
        }(this);

        this.destroy = function (_this) {
          return function () {
            ui.hideDialog(_this.$dialog);

            _this.$dialog.remove();
          };
        }(this);

        this.show = function (_this) {
          return function () {
            var $deleteAllDrafts, $deleteDraft, $selectedDraft, self;
            ui.showDialog(_this.$dialog);
            self = _this;
            $selectedDraft = _this.$dialog.find('.note-draft').click(function (e) {
              var data, div;
              e.preventDefault;
              div = document.createElement('div');
              key = $(this).data('draft');
              data = drafts[key];

              if (data) {
                div.innerHTML = data.body;
                context.invoke('editor.insertNode', div);
                alert(lang.loaded);
              } else {
                alert(lang.noDraft);
              }

              self.destroy();
              return false;
            });
            $deleteDraft = _this.$dialog.find('a.delete-draft').click(function (e) {
              var data;

              if (confirm(lang.youSure)) {
                key = $(this).data('draft');
                data = drafts[key];

                if (data) {
                  store.remove(key);
                  self = $(this);
                  return self.parent().hide('slow', function () {
                    $(this).remove();
                  });
                } else {
                  return alert(lang.noDraft);
                }
              }
            });
            $deleteAllDrafts = _this.$dialog.find('button.deleteAll').click(function (e) {
              var fn1, selfButton, uiDialog;
              selfButton = $(this);

              if (confirm(lang.youSure)) {
                fn1 = function fn1() {
                  return store.remove(key);
                };

                for (key in drafts) {
                  draft = drafts[key];
                  fn1();
                }

                return uiDialog = self.$dialog.find('ul.list-group').hide('slow', function () {
                  $(this).replaceWith("<h4>" + lang.nosavedDrafts + "</h4>");
                  selfButton.hide('slow');
                });
              }
            });
          };
        }(this);
      }
    });
  });
}).call(this);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! store */ "./node_modules/store/dist/store.legacy.js")))

/***/ }),

/***/ "./src/plugin/special_characters/summernote-ext-specialchars.js":
/*!**********************************************************************!*\
  !*** ./src/plugin/special_characters/summernote-ext-specialchars.js ***!
  \**********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (factory) {
  /* global define */
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function ($) {
  /**
  * @class plugin.specialChar
  *
  * Special Characters Plugin
  *
  * ### load script
  *
  * ```
  * < script src="plugin/summernote-ext-specialchar.js"></script >
  * ```
  *
  * ### use a plugin in toolbar
  * ```
  *    $("#editor").summernote({
  *    ...
  *    toolbar : [
  *        ['group', [ 'specialChar' ]]
  *    ]
  *    ...    
  *    });
  * ```
  */
  $.extend($.summernote.plugins, {
    'specialChar': function specialChar(context) {
      // core functions: range, dom
      var range = $.summernote.range;
      var dom = $.summernote.dom;
      var ui = $.summernote.ui,
          $note = context.layoutInfo.note,
          $editor = context.layoutInfo.editor,
          $editable = context.layoutInfo.editable,
          $toolbar = context.layoutInfo.toolbar,
          $statusbar = context.layoutInfo.statusbar,
          options = context.options,
          lang = options.langInfo;
      var KEY = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        ENTER: 13
      };
      var COLUMN_LENGTH = 15;
      var COLUMN_WIDTH = 35;
      var currentColumn,
          currentRow,
          totalColumn,
          totalRow = 0; // special characters data set

      var specialCharDataSet = [
      /*'&quot;',   // "
      '&amp;',    // &
      '&lt;',     // <
      '&gt;',     // >*/
      '&aacute;', '&eacute;', '&iacute;', '&oacute;', '&uacute;', '&uuml;', '&ntilde;', '&Aacute;', '&Eacute;', '&Iacute;', '&Ntilde;', '&Oacute;', '&Uacute;', '&Uuml;', '&iexcl;', '&iquest;', '&cent;', '&pound;', '&curren;', '&yen;', '&brvbar;', '&sect;', '&uml;', '&copy;', '&ordf;', '&laquo;', '&not;', //'&shy;',
      '&reg;', '&macr;', '&deg;', '&plusmn;', '&sup2;', '&sup3;', '&acute;', '&micro;', '&para;', '&middot;', '&cedil;', '&sup1;', '&ordm;', '&raquo;', '&frac14;', '&frac12;', '&frac34;', '&times;', '&divide;', '&fnof;', '&circ;', '&tilde;',
      /*'&ensp;',
      '&emsp;',
      '&thinsp;',
      '&zwnj;',
      '&zwj;',
      '&lrm;',
      '&rlm;',*/
      '&ndash;', '&mdash;', '&lsquo;', '&rsquo;', '&sbquo;', '&ldquo;', '&rdquo;', '&bdquo;', '&dagger;', '&Dagger;', '&bull;', '&hellip;', '&permil;', '&lsaquo;', '&rsaquo;', '&oline;', '&frasl;', '&euro;', '&image;', '&weierp;', '&real;', '&trade;', '&alefsym;', '&larr;', '&uarr;', '&rarr;', '&darr;', '&harr;', '&crarr;', '&lArr;', '&uArr;', '&rArr;', '&dArr;', '&hArr;', '&forall;', '&part;', '&exist;', '&empty;', '&nabla;', '&isin;', '&notin;', '&ni;', '&prod;', '&sum;', '&minus;', '&lowast;', '&radic;', '&prop;', '&infin;', '&ang;', '&and;', '&or;', '&cap;', '&cup;', '&int;', '&there4;', '&sim;', '&cong;', '&asymp;', '&ne;', '&equiv;', '&le;', '&ge;', '&sub;', '&sup;', '&nsub;', '&sube;', '&supe;', '&oplus;', '&otimes;', '&perp;', '&sdot;', '&lceil;', '&rceil;', '&lfloor;', '&rfloor;', //'&lang;',
      //'&rang;',
      '&loz;', '&spades;', '&clubs;', '&hearts;', '&diams;', '&malt;'];

      this.initialize = function () {
        var body = '<div class="form-group row-fluid">' + this.makeSpecialCharSetTable()[0].outerHTML + '</div>';
        this.$dialog = ui.dialog({
          className: 'note-specialchar-dialog',
          // Set the title for the Dialog. Note: We don't need to build the markup for the Modal
          // Header, we only need to set the Title.
          title: lang.specialChar.select,
          // Set the Body of the Dialog.
          body: body // This adds the Modal to the DOM.

        }).render().appendTo($editor);
      };

      this.destroy = function () {
        this.$dialog.remove();
      };
      /**
       * @member plugin.specialChar
       * @private
       * @param {jQuery} $editable
       * @return {String}
       */


      this.getTextOnRange = function () {
        $editable.focus();
        var rng = range.create(); // if range on anchor, expand range with anchor

        if (rng.isOnAnchor()) {
          var anchor = dom.ancestor(rng.sc, dom.isAnchor);
          rng = range.createFromNode(anchor);
        }

        return rng.toString();
      };
      /**
       * Make Special Characters Table
       *
       * @member plugin.specialChar
       * @private
       * @return {jQuery}
       */


      this.makeSpecialCharSetTable = function () {
        var $table = $("<div/>").attr("id", "specialCharTable");
        $.each(specialCharDataSet, function (idx, text) {
          var $block = $("<span/>").attr("style", "border:1px solid black;display:inline-block;height:50px;width:35px;text-align:center;font-size:14pt;color:black;padding-top:10px;cursor:pointer;").addClass("note-specialchar-node char-" + idx).attr("title", text).attr("id", "char-" + idx);
          $block.append(text);
          $table.append($block);
        });
        return $table;
      };
      /**
       * Show Special Characters and set event handlers on dialog controls.
       *
       * @member plugin.specialChar
       * @private
       * @param {jQuery} $dialog
       * @param {Object} text
       * @return {Promise}
       */


      this.showSpecialCharDialog = function (text) {
        var $specialCharDialog = this.$dialog;
        return $.Deferred(function (deferred) {
          // var $specialCharDialog = $dialog.find('.note-specialchar-dialog');
          var $specialCharNode = $specialCharDialog.find('.note-specialchar-node');
          var $selectedNode = null;
          var ARROW_KEYS = [KEY.UP, KEY.DOWN, KEY.LEFT, KEY.RIGHT];
          var ENTER_KEY = KEY.ENTER;
          var pos = 0;
          var end = specialCharDataSet.length;

          function addActiveClass($target) {
            if (!$target) {
              return;
            }

            $target.find('span').addClass('active');
            $selectedNode = $target;
          }

          function removeActiveClass($target) {
            $target.find('span').removeClass('active');
            $selectedNode = null;
          } // find next node


          function findNextNode(row, column) {
            var findNode = null;
            $.each($specialCharNode, function (idx, $node) {
              var findRow = Math.ceil((idx + 1) / COLUMN_LENGTH);
              var findColumn = (idx + 1) % COLUMN_LENGTH === 0 ? COLUMN_LENGTH : (idx + 1) % COLUMN_LENGTH;

              if (findRow === row && findColumn === column) {
                findNode = $node;
                return false;
              }
            });
            return $(findNode);
          }

          function arrowKeyHandler(keyCode) {
            // left, right, up, down key
            var w = $("#specialCharTable").css("width") + "";
            w = w.substr(0, w.length - 2);
            var cols = Math.floor(w / 35);
            pos = parseInt(pos);

            if (KEY.LEFT === keyCode) {
              if (pos > 0) {
                pos--;
                clear();
                $(".char-" + pos).css("border", "1px solid blue").css("background-color", "aliceblue");
                $selectedNode = $(".char-" + pos);
              }
            } else if (KEY.RIGHT === keyCode) {
              if (pos < end - 1) {
                pos++;
                clear();
                $(".char-" + pos).css("border", "1px solid blue").css("background-color", "aliceblue");
                $selectedNode = $(".char-" + pos);
              }
            } else if (KEY.UP === keyCode) {
              if (pos - cols >= 0) {
                clear();
                pos = pos - cols;
                $(".char-" + pos).css("border", "1px solid blue").css("background-color", "aliceblue");
                $selectedNode = $(".char-" + pos);
              }
            } else if (KEY.DOWN === keyCode) {
              if (pos + cols <= end) {
                clear();
                pos = pos + cols;
                $(".char-" + pos).css("border", "1px solid blue").css("background-color", "aliceblue");
                $selectedNode = $(".char-" + pos);
              }
            }
          }

          function enterKeyHandler() {
            if (!$selectedNode) {
              return;
            }

            pos = 0;
            deferred.resolve(decodeURIComponent($selectedNode.attr("title")));
            $specialCharDialog.modal('hide');
          }

          function keyDownEventHandler(event) {
            event.preventDefault();
            var keyCode = event.keyCode;

            if (keyCode === undefined || keyCode === null) {
              return;
            } // check arrowKeys match


            if (ARROW_KEYS.indexOf(keyCode) > -1) {
              arrowKeyHandler(keyCode);
            } else if (keyCode === ENTER_KEY) {
              enterKeyHandler();
            }

            return false;
          } // remove class


          removeActiveClass($specialCharNode); // find selected node

          if (text) {
            for (var i = 0; i < $specialCharNode.length; i++) {
              var $checkNode = $($specialCharNode[i]);

              if ($checkNode.text() === text) {
                addActiveClass($checkNode);
                currentRow = Math.ceil((i + 1) / COLUMN_LENGTH);
                currentColumn = (i + 1) % COLUMN_LENGTH;
              }
            }
          }

          $specialCharDialog.one('shown.bs.modal', function () {
            $(document).on('keydown', keyDownEventHandler);
            $specialCharNode.on('click', function (event) {
              event.preventDefault();
              pos = 0;
              deferred.resolve(decodeURIComponent(event.currentTarget.title));
              $specialCharDialog.modal('hide');
            });
            $specialCharNode.mouseenter(function () {
              clear();
              $(this).css("border", "1px solid blue").css("background-color", "aliceblue");
              $selectedNode = $(this);
              var thisid = $(this).attr("id") + "";
              pos = thisid.substr(5);
            });
            $specialCharNode.mouseleave(function () {
              clear();
            });
          }).one('hidden.bs.modal', function () {
            $specialCharNode.off('click');
            $(document).off('keydown', keyDownEventHandler);

            if (deferred.state() === 'pending') {
              deferred.reject();
            }
          }).modal('show'); // tooltip

          /*$dialog.find('span').tooltip({
            container: $specialCharDialog.find('.form-group'),
            trigger: 'hover',
            placement: 'top'
          });*/
          // $editable blur

          $editable.blur();

          function clear() {
            $specialCharNode.css("border", "1px solid black").css("background-color", "white");
            $selectedNode = null;
          }
        });
      };

      this.show = function (text) {
        this.showSpecialCharDialog(text).then(function (selectChar) {
          // when ok button clicked
          // restore range
          context.invoke('editor.restoreRange'); // build node

          var $node = $('<span></span>').html(selectChar)[0]; //var $node = $(selectChar)[0];

          if ($node) {
            // insert character node
            context.invoke('editor.insertNode', $node);
          }
        }).fail(function () {
          // when cancel button clicked
          context.invoke('editor.restoreRange');
        });
      };

      context.memo('button.specialChar', function () {
        var button = ui.button({
          contents: 'á',
          container: options.container,
          tooltip: lang.specialChar.specialChar,
          placement: options.placement,
          click: function click(e) {
            e.preventDefault();
            var currentSpecialChar = context.invoke('specialChar.getTextOnRange'); // save current range

            context.invoke('editor.saveRange', $editable);
            context.invoke('specialChar.show', currentSpecialChar);
          }
        });
        return button.render();
      });
    }
  });
  $.extend(true, $.summernote.lang, {
    'en-US': {
      specialChar: {
        specialChar: 'Special Characters',
        select: 'Select Special characters'
      }
    },
    'ko-KR': {
      specialChar: {
        specialChar: '특수문자',
        select: '특수문자를 선택하세요'
      }
    },
    'zh-TW': {
      specialChar: {
        specialChar: '特殊字元',
        select: '插入特殊字元'
      }
    }
  });
});

/***/ }),

/***/ "./src/start.js":
/*!**********************!*\
  !*** ./src/start.js ***!
  \**********************/
/*! no exports provided */
/*! ModuleConcatenation bailout: Module is an entry point */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_App_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/App.jsx */ "./src/components/App.jsx");



Object(react_dom__WEBPACK_IMPORTED_MODULE_1__["render"])(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_App_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], null), document.getElementById('root'));

/***/ })

/******/ });