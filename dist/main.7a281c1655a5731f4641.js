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
/******/ 	var hotCurrentHash = "7a281c1655a5731f4641";
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

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



 // import required codes

_SummerNote__WEBPACK_IMPORTED_MODULE_1__["default"].ImportCode();
var htmldata = '<p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);"><a href="https://ai.facebook.com/blog/open-sourcing-pyrobot-to-accelerate-ai-robotics-research" style="vertical-align: top; color: rgb(0, 0, 0); text-decoration-line: none; border-bottom: 1px dotted rgb(187, 187, 187); padding-bottom: 5px;">臉書與卡內基美隆大學合作，共同開發了機器人控制框架PyRobot</a>，希望讓研究人員能夠在幾小時內，在不需要具備硬體或是裝置驅動程式等相關細節知識，就能啟動並且使機器人開始運作。臉書提到，他們希望提供一個像深度學習開發框架PyTorch這樣的機器人框架，提供一定程度的抽象，以簡化系統建置工作，也讓共享函式庫和工具更為簡單。</p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">機器人研究領域有一個笑話，把機器人當作博士研究碖文，論文中的每一個機器人，都會為論文發表時間往後增加一年，臉書提到，要讓機器人揮動手臂，就可能要花上數天甚至一周的時間，來調整機器人軟體，而PyRobot的出現，就是要來解決這樣的研究困境。</p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">PyRobot是機器人作業系統ROS上的輕量級高階介面，提供了一組無關硬體的中介API，供開發人員控制各種的機器人，PyRobot抽象了低階控制器與程序之間溝通的細節，因此對於人工智慧研究人員來說，可以不再需要理解機器人的低階操作，能夠專注地建置高階人工智慧機器人應用程式。</p><p class="rtecenter" style="vertical-align: top; margin: 0px 0px 1.5em; text-align: center; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);"><img alt="" src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/65208991_366432120743262_8971157212042887168_n.gif?_nc_cat=108&amp;_nc_eui2=AeGyV1lVHG2s1TboCa6qoybvi_exikgXF83atf7IgQtcg2ht2rzMSP5Z6vmBlM8ZJcnnfaZ_f_391EouH25dKf_Cm_hcjqrbTPgif4LGSlHNdg&amp;_nc_oc=AQktp8ytYjE29QHmTShUNGjHn7tNgP5lfP-V6p7ApWDkpidjto4pd_Ld9zTFk3vwjsc&amp;_nc_ht=scontent-tpe1-1.xx&amp;oh=649852a5e43ef82748a309c259957b33&amp;oe=5DBB8202" style="vertical-align: middle; max-width: 100%; height: auto; border: 0px; width: 600px;"></p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">研究人員可以使用PyRobot中，適用於各種機器人的通用功能，控制機器人關節的位置、速度或是力矩，還能使用複雜的功能，包括笛卡爾路徑規畫或是視覺SLAM等。PyRobot目前雖然僅支援LoCoBot和Sawyer機器人，但還會繼續增加支援各種不同的機器人。PyRobot雖然提供抽象的高階控制，但研究人員依然可以使用不同層級的元件，像是能夠繞過規畫器，直接設定關節速度和力矩等。</p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">臉書已經將PyRobot用在各種的機器人應用上，像是點到點的導航，或是推與抓的任務，也用在遠端操作以收集訓練機器人的資料。PyRobot中包含了一些現成的演算法實作，並提供可將自行開發的演算法，簡單地部署到機器人上的方法，臉書也提到，研究人員可以使用PyTorch訓練深度學習模型，並使用PyRobot在機器人上執行演算法。</p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">PyRobot可以讓研究社群更容易地使用機器人資料集、演算法實作以及模型，同時也能幫助他們訂定基準，得以互相比較成果，或是基於其他人的成果往前發展，臉書表示，像是在使用LoCoBot這類低成本的機器人平臺，PyRobot有助於降低進入門檻，並使研究成果能夠與其他人分享。臉書也順勢在PyRobot釋出的同時，公開了一項徵求提案活動，任何研究團隊都可以提交PyRobot搭配LoCoBot的研究提案，獲勝者可以贏得一份研究用LoCoBot工具包。</p>'; //import IconButton from './ToolBar/IconButton'

var App =
/*#__PURE__*/
function (_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "demo"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, "React SummerNote App"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SummerNote__WEBPACK_IMPORTED_MODULE_1__["default"], {
        destroy: false,
        value: htmldata,
        options: {
          lang: "zh-TW",
          height: 350,
          dialogsInBody: true,
          toolbar: [["style", ["style"]], ["font", ["bold", "underline", "clear"]], ["fontname", ["fontname"]], ["para", ["ul", "ol", "paragraph"]], ["table", ["table"]], ["insert", ["link", "picture", "video"]], ["view", ["fullscreen", "codeview"]]]
        },
        onChange: onChange,
        onImageUpload: onImageUpload,
        onImagePasteFromWord: onImagePasteFromWord //onPaste={onPaste}
        ,
        onInit: function onInit(e) {
          return console.log("--------- onInit --------", e);
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

function onImageUpload(file, cb, e) {
  console.log("--------- onImageUpload --------", file, cb, e);
  var image = file[0];
  _SummerNote__WEBPACK_IMPORTED_MODULE_1__["default"].insertImage("https://i.imgur.com/JOOEENx.png", function ($image) {
    $image.css("width", Math.floor($image.width() / 2));
    $image.attr("title", image.name);
  });
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
/* harmony import */ var _ImportCode__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ImportCode */ "./src/components/ImportCode.js");
/* harmony import */ var _ImportCode__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_ImportCode__WEBPACK_IMPORTED_MODULE_3__);
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




 //const randomUid = () => Math.floor(Math.random() * 100000);

var ReactSummernote =
/*#__PURE__*/
function (_Component) {
  _inherits(ReactSummernote, _Component);

  function ReactSummernote(props) {
    var _this;

    _classCallCheck(this, ReactSummernote);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReactSummernote).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "handleEditorRef", function (node) {
      if (!node) return;
      var options = _this.props.options || {};
      var _this$props = _this.props,
          codeview = _this$props.codeview,
          destroy = _this$props.destroy,
          value = _this$props.value;
      options.callbacks = _this.callbacks; // load lang pack
      //if (options.lang && options.lang != 'en') this.loadModule(`summernote/dist/lang/summernote-${options.lang}.js`)
      //if (options.lang) require(`summernote/lang/summernote-${options.lang}.js`)

      _this.editor = $(node);

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
    });

    _this.counter = 0; // counter for identitify for paste word content
    //this.uid = `react-summernote-${randomUid()}`;

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
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handlePaste = _this.handlePaste.bind(_assertThisInitialized(_this));
    ReactSummernote.focus = _this.focus.bind(_assertThisInitialized(_this));
    ReactSummernote.isEmpty = _this.isEmpty.bind(_assertThisInitialized(_this));
    ReactSummernote.reset = _this.reset.bind(_assertThisInitialized(_this));
    ReactSummernote.replace = _this.replace.bind(_assertThisInitialized(_this));
    ReactSummernote.disable = _this.disable.bind(_assertThisInitialized(_this));
    ReactSummernote.enable = _this.enable.bind(_assertThisInitialized(_this));
    ReactSummernote.toggleState = _this.toggleState.bind(_assertThisInitialized(_this));
    ReactSummernote.insertImage = _this.insertImage.bind(_assertThisInitialized(_this));
    ReactSummernote.insertNode = _this.insertNode.bind(_assertThisInitialized(_this));
    ReactSummernote.insertText = _this.insertText.bind(_assertThisInitialized(_this));
    return _this;
  } //loadModule = path => require(path)


  _createClass(ReactSummernote, [{
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
          insertText: this.insertText
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
      this.editor.summernote("insertImage", url, filenameOrCallback);
    }
  }, {
    key: "insertNode",
    value: function insertNode(node) {
      this.editor.summernote("insertNode", node);
    }
  }, {
    key: "insertText",
    value: function insertText(text) {
      this.editor.summernote("insertText", text);
    }
  }, {
    key: "handleChange",
    value: function handleChange(txt) {
      $('span[style*="mso-ignore"]').remove();
      var onChange = this.props.onChange;
      var $pastedImgs = $('img[src*="file://"]').not(".zap-img-uploading").addClass("zap-img-uploading").addClass("zap-img-uploading-".concat(this.counter));
      if ($pastedImgs.length) this.counter = this.counter + 1;
      if (typeof onChange === "function") onChange(txt);
    }
  }, {
    key: "handlePaste",
    value: function handlePaste(e) {
      var _this2 = this;

      // if have media, it will fire upload image event ,so skip paste
      var _this$props3 = this.props,
          onPaste = _this$props3.onPaste,
          onImagePasteFromWord = _this$props3.onImagePasteFromWord;
      var files = e.originalEvent.clipboardData.files; // only one pic, dont paste the photo

      if (files.length) return e.preventDefault();
      var items = e.originalEvent.clipboardData.items;

      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("rtf") > -1) {
          items[i].getAsString(function (rtf) {
            var doc = Object(_lib_trf2html__WEBPACK_IMPORTED_MODULE_2__["default"])(rtf);
            var imgs = [];
            doc.forEach(function (el) {
              imgs.push(el);
            });
            setTimeout(function () {
              var $pasteImgs = $(".zap-img-uploading-".concat(_this2.counter - 1)).each(function (i, el) {
                if (imgs[i]) el.src = imgs[i];
              });
              if (typeof onImagePasteFromWord === "function") onImagePasteFromWord($pasteImgs);
            }, 0);
          });
          break;
        }
      }

      if (typeof onPaste === "function") onPaste(e);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          Tag = _this$props4.tag,
          children = _this$props4.children,
          className = _this$props4.className,
          name = _this$props4.name;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: className
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Tag, {
        ref: this.handleEditorRef
      }, children));
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
        onImageUpload: this.onImageUpload
      };
    }
  }]);

  return ReactSummernote;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

ReactSummernote.propTypes = {
  tag: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  // will determing using div or textarea field for form components like redux-form
  children: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.node,
  // instead of value, using children makes more sense for div and textarea blocks
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
ReactSummernote.defaultProps = {
  tag: "div"
};
ReactSummernote.prototype.ImportCode = _ImportCode__WEBPACK_IMPORTED_MODULE_3___default.a;
ReactSummernote.ImportCode = _ImportCode__WEBPACK_IMPORTED_MODULE_3___default.a;
/* harmony default export */ __webpack_exports__["default"] = (ReactSummernote);
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
  wholeImages = string.match(rePicture);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvQXBwLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9JbXBvcnRDb2RlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1N1bW1lck5vdGUuanN4Iiwid2VicGFjazovLy8uL3NyYy9saWIvdHJmMmh0bWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXJ0LmpzIl0sIm5hbWVzIjpbIlN1bW1lck5vdGUiLCJJbXBvcnRDb2RlIiwiaHRtbGRhdGEiLCJBcHAiLCJsYW5nIiwiaGVpZ2h0IiwiZGlhbG9nc0luQm9keSIsInRvb2xiYXIiLCJvbkNoYW5nZSIsIm9uSW1hZ2VVcGxvYWQiLCJvbkltYWdlUGFzdGVGcm9tV29yZCIsImUiLCJjb25zb2xlIiwibG9nIiwiQ29tcG9uZW50IiwiJGltZ3MiLCJmaWxlIiwiY2IiLCJpbWFnZSIsImluc2VydEltYWdlIiwiJGltYWdlIiwiY3NzIiwiTWF0aCIsImZsb29yIiwid2lkdGgiLCJhdHRyIiwibmFtZSIsIm9uUGFzdGUiLCJpdGVtcyIsIm9yaWdpbmFsRXZlbnQiLCJjbGlwYm9hcmREYXRhIiwiZmlsZXMiLCJpIiwibGVuZ3RoIiwicHJldmVudERlZmF1bHQiLCJ0eXBlIiwiaW5kZXhPZiIsImdldEFzU3RyaW5nIiwicnRmIiwiZG9jIiwicnRmMmh0bWwiLCJyZW5kZXIiLCJ0aGVuIiwiaHRtbEVsZW1lbnRzIiwiaW1ncyIsImZvckVhY2giLCIkaHRtbCIsImZpbmQiLCJlYWNoIiwiZWwiLCJwdXNoIiwic2V0VGltZW91dCIsIiQiLCJzcmMiLCJlcnJvciIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1aXJlIiwiUmVhY3RTdW1tZXJub3RlIiwicHJvcHMiLCJub2RlIiwib3B0aW9ucyIsImNvZGV2aWV3IiwiZGVzdHJveSIsInZhbHVlIiwiY2FsbGJhY2tzIiwiZWRpdG9yIiwic3VtbWVybm90ZSIsInJlcGxhY2UiLCJzZXRTdGF0ZSIsImNvdW50ZXIiLCJub3RlRWRpdGFibGUiLCJub3RlUGxhY2Vob2xkZXIiLCJvbkluaXQiLCJiaW5kIiwiZm9jdXMiLCJpc0VtcHR5IiwicmVzZXQiLCJkaXNhYmxlIiwiZW5hYmxlIiwidG9nZ2xlU3RhdGUiLCJpbnNlcnROb2RlIiwiaW5zZXJ0VGV4dCIsImhhbmRsZUNoYW5nZSIsImhhbmRsZVBhc3RlIiwibmV4dFByb3BzIiwiY29kZXZpZXdDb21tYW5kIiwiZGlzYWJsZWQiLCIkY29udGFpbmVyIiwicGFyZW50IiwiaW1hZ2VzIiwiY29udGVudCIsInByZXZDb250ZW50IiwiaHRtbCIsImNvbnRlbnRMZW5ndGgiLCJoaWRlIiwic2hvdyIsInVybCIsImZpbGVuYW1lT3JDYWxsYmFjayIsInRleHQiLCJ0eHQiLCJyZW1vdmUiLCIkcGFzdGVkSW1ncyIsIm5vdCIsImFkZENsYXNzIiwiJHBhc3RlSW1ncyIsIlRhZyIsInRhZyIsImNoaWxkcmVuIiwiY2xhc3NOYW1lIiwiaGFuZGxlRWRpdG9yUmVmIiwib25FbnRlciIsIm9uRm9jdXMiLCJvbkJsdXIiLCJvbktleXVwIiwib25LZXlVcCIsIm9uS2V5ZG93biIsIm9uS2V5RG93biIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsImJvb2wiLCJvYmplY3QiLCJmdW5jIiwiZGVmYXVsdFByb3BzIiwicHJvdG90eXBlIiwibmV3c3RyaW5nVG9BcnJheUJ1ZmZlciIsInJldCIsInJlUGljdHVyZUhlYWRlciIsInJlUGljdHVyZSIsIlJlZ0V4cCIsInNvdXJjZSIsIndob2xlSW1hZ2VzIiwiaW1hZ2VUeXBlIiwibWF0Y2giLCJ0ZXN0IiwiaGV4IiwiY29udmVydEhleFN0cmluZ1RvQnl0ZXMiLCJoZXhTdHJpbmciLCJieXRlc0FycmF5IiwiYnl0ZXNBcnJheUxlbmd0aCIsInBhcnNlSW50Iiwic3Vic3RyIiwiY29udmVydEJ5dGVzVG9CYXNlNjQiLCJiYXNlNjRjaGFyYWN0ZXJzIiwiYmFzZTY0c3RyaW5nIiwiYXJyYXkzIiwic2xpY2UiLCJhcnJheTNsZW5ndGgiLCJhcnJheTQiLCJqIiwiY2hhckF0IiwiY3JlYXRlU3JjV2l0aEJhc2U2NCIsImltZyIsImhleEltYWdlIiwibmV3U3JjVmFsdWVzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQVEsb0JBQW9CO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQWlCLDRCQUE0QjtBQUM3QztBQUNBO0FBQ0EsMEJBQWtCLDJCQUEyQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQTZCO0FBQzdCLHFDQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBcUIsZ0JBQWdCO0FBQ3JDO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsNkJBQXFCLGdCQUFnQjtBQUNyQztBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUFrQiw4QkFBOEI7QUFDaEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLDJCQUEyQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBbUIsY0FBYztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtB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Ozs7Ozs7Ozs7QUMzRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUFsSCx3REFBTSxDQUNGLDJEQUFDLDJEQUFELE9BREUsRUFFQW1ILFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixNQUF4QixDQUZBLENBQU4sQyIsImZpbGUiOiJtYWluLjdhMjgxYzE2NTVhNTczMWY0NjQxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdHJldHVybiByZXN1bHQ7XG4gXHR9XG4gXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gd2luZG93W1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHdpbmRvd1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XG4gXHRcdGlmIChwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xuIFx0fSA7XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuIFx0XHRzY3JpcHQuY2hhcnNldCA9IFwidXRmLThcIjtcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcbiBcdFx0aWYgKG51bGwpIHNjcmlwdC5jcm9zc09yaWdpbiA9IG51bGw7XG4gXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KHJlcXVlc3RUaW1lb3V0KSB7XG4gXHRcdHJlcXVlc3RUaW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQgfHwgMTAwMDA7XG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XG4gXHRcdFx0fVxuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xuIFx0XHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQ7XG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XG4gXHRcdFx0fVxuIFx0XHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRpZiAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XG4gXHRcdFx0XHRpZiAocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxuIFx0XHRcdFx0XHRyZWplY3QoXG4gXHRcdFx0XHRcdFx0bmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKVxuIFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gNDA0KSB7XG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuIFx0XHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXG4gXHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xuIFx0XHRcdFx0XHRcdHJldHVybjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCI3YTI4MWMxNjU1YTU3MzFmNDY0MVwiO1xuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0aWYgKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiBcdFx0XHRpZiAobWUuaG90LmFjdGl2ZSkge1xuIFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcbiBcdFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSkge1xuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcbiBcdFx0XHRcdFx0XHRyZXF1ZXN0ICtcbiBcdFx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuIFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHQpO1xuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XG4gXHRcdH07XG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcbiBcdFx0XHRcdH0sXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9O1xuIFx0XHRmb3IgKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwiZVwiICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcInRcIlxuIFx0XHRcdCkge1xuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInJlYWR5XCIpIGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XG4gXHRcdFx0XHR0aHJvdyBlcnI7XG4gXHRcdFx0fSk7XG5cbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XG4gXHRcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xuIFx0XHRcdFx0XHRpZiAoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fTtcbiBcdFx0Zm4udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdFx0aWYgKG1vZGUgJiAxKSB2YWx1ZSA9IGZuKHZhbHVlKTtcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy50KHZhbHVlLCBtb2RlICYgfjEpO1xuIFx0XHR9O1xuIFx0XHRyZXR1cm4gZm47XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBob3QgPSB7XG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcblxuIFx0XHRcdC8vIE1vZHVsZSBBUElcbiBcdFx0XHRhY3RpdmU6IHRydWUsXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdFx0ZWxzZSBob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XG4gXHRcdFx0fSxcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRpZiAoIWwpIHJldHVybiBob3RTdGF0dXM7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXG4gXHRcdH07XG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcbiBcdFx0cmV0dXJuIGhvdDtcbiBcdH1cblxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XG5cbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xuIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcbiBcdH1cblxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3REZWZlcnJlZDtcblxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XG4gXHRcdHZhciBpc051bWJlciA9ICtpZCArIFwiXCIgPT09IGlkO1xuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHtcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcbiBcdFx0fVxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcbiBcdFx0XHRpZiAoIXVwZGF0ZSkge1xuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0XHRcdHJldHVybiBudWxsO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xuXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xuIFx0XHRcdGZvcih2YXIgY2h1bmtJZCBpbiBpbnN0YWxsZWRDaHVua3MpXG4gXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWxvbmUtYmxvY2tzXG4gXHRcdFx0e1xuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nID09PSAwICYmXG4gXHRcdFx0XHRob3RXYWl0aW5nRmlsZXMgPT09IDBcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxuIFx0XHRcdHJldHVybjtcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcbiBcdFx0Zm9yICh2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmICgtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XG4gXHRcdGlmICghZGVmZXJyZWQpIHJldHVybjtcbiBcdFx0aWYgKGhvdEFwcGx5T25VcGRhdGUpIHtcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKVxuIFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcbiBcdFx0XHRcdH0pXG4gXHRcdFx0XHQudGhlbihcbiBcdFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuIFx0XHRcdFx0XHR9LFxuIFx0XHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0KTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiBcdFx0dmFyIGNiO1xuIFx0XHR2YXIgaTtcbiBcdFx0dmFyIGo7XG4gXHRcdHZhciBtb2R1bGU7XG4gXHRcdHZhciBtb2R1bGVJZDtcblxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMubWFwKGZ1bmN0aW9uKGlkKSB7XG4gXHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcbiBcdFx0XHRcdFx0aWQ6IGlkXG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmICghbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZCkgY29udGludWU7XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX21haW4pIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdGlmICghcGFyZW50KSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdFx0Y29udGludWU7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG5cbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcbiBcdFx0XHR9O1xuIFx0XHR9XG5cbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xuIFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xuIFx0XHRcdFx0aWYgKGEuaW5kZXhPZihpdGVtKSA9PT0gLTEpIGEucHVzaChpdGVtKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XG5cbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcbiBcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIlxuIFx0XHRcdCk7XG4gXHRcdH07XG5cbiBcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcbiBcdFx0XHRcdC8qKiBAdHlwZSB7VE9ET30gKi9cbiBcdFx0XHRcdHZhciByZXN1bHQ7XG4gXHRcdFx0XHRpZiAoaG90VXBkYXRlW2lkXSkge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHQvKiogQHR5cGUge0Vycm9yfGZhbHNlfSAqL1xuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcbiBcdFx0XHRcdGlmIChyZXN1bHQuY2hhaW4pIHtcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0c3dpdGNoIChyZXN1bHQudHlwZSkge1xuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRcIiBpbiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0LnBhcmVudElkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25VbmFjY2VwdGVkKSBvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkFjY2VwdGVkKSBvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EaXNwb3NlZCkgb3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGFib3J0RXJyb3IpIHtcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0FwcGx5KSB7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0XHRcdFx0Zm9yIChtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRcdFx0XHRpZiAoXG4gXHRcdFx0XHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoXG4gXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcyxcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWRcbiBcdFx0XHRcdFx0XHRcdClcbiBcdFx0XHRcdFx0XHQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KFxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sXG4gXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF1cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9EaXNwb3NlKSB7XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZCAmJlxuIFx0XHRcdFx0Ly8gcmVtb3ZlZCBzZWxmLWFjY2VwdGVkIG1vZHVsZXMgc2hvdWxkIG5vdCBiZSByZXF1aXJlZFxuIFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gIT09IHdhcm5VbmV4cGVjdGVkUmVxdWlyZVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0XHR9KTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdH0pO1xuXG4gXHRcdHZhciBpZHg7XG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xuIFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0aWYgKCFtb2R1bGUpIGNvbnRpbnVlO1xuXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcblxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XG4gXHRcdFx0XHRjYihkYXRhKTtcbiBcdFx0XHR9XG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcblxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcblxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcbiBcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XG4gXHRcdFx0XHRpZiAoIWNoaWxkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIHtcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xuIFx0XHRcdFx0XHRcdGlmIChpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiYXBwbHlcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcblxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXG4gXHRcdGZvciAobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xuIFx0XHRcdFx0XHRcdGlmIChjYikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrcy5pbmRleE9mKGNiKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XG4gXHRcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcbiBcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0dHJ5IHtcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xuIFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gXHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcbiBcdFx0XHRcdFx0fSBjYXRjaCAoZXJyMikge1xuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxuIFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnIyO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXG4gXHRcdGlmIChlcnJvcikge1xuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiBcdFx0fVxuXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3NcbiBcdC8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuIFx0Ly8gUHJvbWlzZSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdFwibWFpblwiOiAwXG4gXHR9O1xuXG4gXHR2YXIgZGVmZXJyZWRNb2R1bGVzID0gW107XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHR2YXIganNvbnBBcnJheSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSB8fCBbXTtcbiBcdHZhciBvbGRKc29ucEZ1bmN0aW9uID0ganNvbnBBcnJheS5wdXNoLmJpbmQoanNvbnBBcnJheSk7XG4gXHRqc29ucEFycmF5LnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjaztcbiBcdGpzb25wQXJyYXkgPSBqc29ucEFycmF5LnNsaWNlKCk7XG4gXHRmb3IodmFyIGkgPSAwOyBpIDwganNvbnBBcnJheS5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soanNvbnBBcnJheVtpXSk7XG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IG9sZEpzb25wRnVuY3Rpb247XG5cblxuIFx0Ly8gYWRkIGVudHJ5IG1vZHVsZSB0byBkZWZlcnJlZCBsaXN0XG4gXHRkZWZlcnJlZE1vZHVsZXMucHVzaChbXCIuL3NyYy9zdGFydC5qc1wiLFwibW9kdWxlc1wiLFwidmVuZG9yc1wiXSk7XG4gXHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIHJlYWR5XG4gXHRyZXR1cm4gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKTtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IFN1bW1lck5vdGUgZnJvbSBcIi4vU3VtbWVyTm90ZVwiO1xyXG5pbXBvcnQgcnRmMmh0bWwgZnJvbSBcIi4uL2xpYi90cmYyaHRtbFwiO1xyXG4vLyBpbXBvcnQgcmVxdWlyZWQgY29kZXNcclxuU3VtbWVyTm90ZS5JbXBvcnRDb2RlKCk7XHJcblxyXG5jb25zdCBodG1sZGF0YSA9XHJcblx0JzxwIHN0eWxlPVwidmVydGljYWwtYWxpZ246IHRvcDsgbWFyZ2luOiAwcHggMHB4IDEuNWVtOyBmb250LXNpemU6IDE0cHQ7IGxpbmUtaGVpZ2h0OiAyZW07IGNvbG9yOiByZ2IoNTEsIDUxLCA1MSk7IGZvbnQtZmFtaWx5OiDlvq7ou5/mraPpu5Hpq5QsIHNhbnMtc2VyaWY7IGJhY2tncm91bmQtY29sb3I6IHJnYigyNDcsIDI0NywgMjQ3KTtcIj48YSBocmVmPVwiaHR0cHM6Ly9haS5mYWNlYm9vay5jb20vYmxvZy9vcGVuLXNvdXJjaW5nLXB5cm9ib3QtdG8tYWNjZWxlcmF0ZS1haS1yb2JvdGljcy1yZXNlYXJjaFwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246IHRvcDsgY29sb3I6IHJnYigwLCAwLCAwKTsgdGV4dC1kZWNvcmF0aW9uLWxpbmU6IG5vbmU7IGJvcmRlci1ib3R0b206IDFweCBkb3R0ZWQgcmdiKDE4NywgMTg3LCAxODcpOyBwYWRkaW5nLWJvdHRvbTogNXB4O1wiPuiHieabuOiIh+WNoeWFp+Wfuue+jumahuWkp+WtuOWQiOS9nO+8jOWFseWQjOmWi+eZvOS6huapn+WZqOS6uuaOp+WItuahhuaetlB5Um9ib3Q8L2E+77yM5biM5pyb6K6T56CU56m25Lq65ZOh6IO95aSg5Zyo5bm+5bCP5pmC5YWn77yM5Zyo5LiN6ZyA6KaB5YW35YKZ56Gs6auU5oiW5piv6KOd572u6amF5YuV56iL5byP562J55u46Zec57Sw56+A55+l6K2Y77yM5bCx6IO95ZWf5YuV5Lim5LiU5L2/5qmf5Zmo5Lq66ZaL5aeL6YGL5L2c44CC6IeJ5pu45o+Q5Yiw77yM5LuW5YCR5biM5pyb5o+Q5L6b5LiA5YCL5YOP5rex5bqm5a2457+S6ZaL55m85qGG5p62UHlUb3JjaOmAmeaoo+eahOapn+WZqOS6uuahhuaetu+8jOaPkOS+m+S4gOWumueoi+W6pueahOaKveixoe+8jOS7peewoeWMluezu+e1seW7uue9ruW3peS9nO+8jOS5n+iuk+WFseS6q+WHveW8j+W6q+WSjOW3peWFt+abtOeCuuewoeWWruOAgjwvcD48cCBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiB0b3A7IG1hcmdpbjogMHB4IDBweCAxLjVlbTsgZm9udC1zaXplOiAxNHB0OyBsaW5lLWhlaWdodDogMmVtOyBjb2xvcjogcmdiKDUxLCA1MSwgNTEpOyBmb250LWZhbWlseTog5b6u6Luf5q2j6buR6auULCBzYW5zLXNlcmlmOyBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjQ3LCAyNDcsIDI0Nyk7XCI+5qmf5Zmo5Lq656CU56m26aCY5Z+f5pyJ5LiA5YCL56yR6Kmx77yM5oqK5qmf5Zmo5Lq655W25L2c5Y2a5aOr56CU56m256KW5paH77yM6KuW5paH5Lit55qE5q+P5LiA5YCL5qmf5Zmo5Lq677yM6YO95pyD54K66KuW5paH55m86KGo5pmC6ZaT5b6A5b6M5aKe5Yqg5LiA5bm077yM6IeJ5pu45o+Q5Yiw77yM6KaB6K6T5qmf5Zmo5Lq65o+u5YuV5omL6IeC77yM5bCx5Y+v6IO96KaB6Iqx5LiK5pW45aSp55Sa6Iez5LiA5ZGo55qE5pmC6ZaT77yM5L6G6Kq/5pW05qmf5Zmo5Lq66Luf6auU77yM6ICMUHlSb2JvdOeahOWHuuePvu+8jOWwseaYr+imgeS+huino+axuumAmeaoo+eahOeglOeptuWbsOWig+OAgjwvcD48cCBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiB0b3A7IG1hcmdpbjogMHB4IDBweCAxLjVlbTsgZm9udC1zaXplOiAxNHB0OyBsaW5lLWhlaWdodDogMmVtOyBjb2xvcjogcmdiKDUxLCA1MSwgNTEpOyBmb250LWZhbWlseTog5b6u6Luf5q2j6buR6auULCBzYW5zLXNlcmlmOyBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjQ3LCAyNDcsIDI0Nyk7XCI+UHlSb2JvdOaYr+apn+WZqOS6uuS9nOalreezu+e1sVJPU+S4iueahOi8lemHj+e0mumrmOmajuS7i+mdou+8jOaPkOS+m+S6huS4gOe1hOeEoemXnOehrOmrlOeahOS4reS7i0FQSe+8jOS+m+mWi+eZvOS6uuWToeaOp+WItuWQhOeorueahOapn+WZqOS6uu+8jFB5Um9ib3Tmir3osaHkuobkvY7pmo7mjqfliLblmajoiIfnqIvluo/kuYvplpPmup3pgJrnmoTntLDnr4DvvIzlm6DmraTlsI3mlrzkurrlt6XmmbrmhafnoJTnqbbkurrlk6HkvoboqqrvvIzlj6/ku6XkuI3lho3pnIDopoHnkIbop6PmqZ/lmajkurrnmoTkvY7pmo7mk43kvZzvvIzog73lpKDlsIjms6jlnLDlu7rnva7pq5jpmo7kurrlt6XmmbrmhafmqZ/lmajkurrmh4nnlKjnqIvlvI/jgII8L3A+PHAgY2xhc3M9XCJydGVjZW50ZXJcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiB0b3A7IG1hcmdpbjogMHB4IDBweCAxLjVlbTsgdGV4dC1hbGlnbjogY2VudGVyOyBmb250LXNpemU6IDE0cHQ7IGxpbmUtaGVpZ2h0OiAyZW07IGNvbG9yOiByZ2IoNTEsIDUxLCA1MSk7IGZvbnQtZmFtaWx5OiDlvq7ou5/mraPpu5Hpq5QsIHNhbnMtc2VyaWY7IGJhY2tncm91bmQtY29sb3I6IHJnYigyNDcsIDI0NywgMjQ3KTtcIj48aW1nIGFsdD1cIlwiIHNyYz1cImh0dHBzOi8vc2NvbnRlbnQtdHBlMS0xLnh4LmZiY2RuLm5ldC92L3QzOS4yMzY1LTYvNjUyMDg5OTFfMzY2NDMyMTIwNzQzMjYyXzg5NzExNTcyMTIwNDI4ODcxNjhfbi5naWY/X25jX2NhdD0xMDgmYW1wO19uY19ldWkyPUFlR3lWMWxWSEcyczFUYm9DYTZxb3lidmlfZXhpa2dYRjgzYXRmN0lnUXRjZzJodDJyek1TUDVaNnZtQmxNOFpKY25uZmFaX2ZfMzkxRW91SDI1ZEtmX0NtX2hjanFyYlRQZ2lmNExHU2xITmRnJmFtcDtfbmNfb2M9QVFrdHA4eXRZakUyOVFIbVRTaFVOR2pIbjd0TmdQNWxmUC1WNnA3QXBXRGtwaWRqdG80cGRfTGQ5elRGazN2d2pzYyZhbXA7X25jX2h0PXNjb250ZW50LXRwZTEtMS54eCZhbXA7b2g9NjQ5ODUyYTVlNDNlZjgyNzQ4YTMwOWMyNTk5NTdiMzMmYW1wO29lPTVEQkI4MjAyXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBtYXgtd2lkdGg6IDEwMCU7IGhlaWdodDogYXV0bzsgYm9yZGVyOiAwcHg7IHdpZHRoOiA2MDBweDtcIj48L3A+PHAgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogdG9wOyBtYXJnaW46IDBweCAwcHggMS41ZW07IGZvbnQtc2l6ZTogMTRwdDsgbGluZS1oZWlnaHQ6IDJlbTsgY29sb3I6IHJnYig1MSwgNTEsIDUxKTsgZm9udC1mYW1pbHk6IOW+rui7n+ato+m7kemrlCwgc2Fucy1zZXJpZjsgYmFja2dyb3VuZC1jb2xvcjogcmdiKDI0NywgMjQ3LCAyNDcpO1wiPueglOeptuS6uuWToeWPr+S7peS9v+eUqFB5Um9ib3TkuK3vvIzpgannlKjmlrzlkITnqK7mqZ/lmajkurrnmoTpgJrnlKjlip/og73vvIzmjqfliLbmqZ/lmajkurrpl5znr4DnmoTkvY3nva7jgIHpgJ/luqbmiJbmmK/lipvnn6nvvIzpgoTog73kvb/nlKjopIfpm5znmoTlip/og73vvIzljIXmi6znrJvljaHniL7ot6/lvpHopo/nlavmiJbmmK/oppboprpTTEFN562J44CCUHlSb2JvdOebruWJjemblueEtuWDheaUr+aPtExvQ29Cb3TlkoxTYXd5ZXLmqZ/lmajkurrvvIzkvYbpgoTmnIPnubznuozlop7liqDmlK/mj7TlkITnqK7kuI3lkIznmoTmqZ/lmajkurrjgIJQeVJvYm906ZuW54S25o+Q5L6b5oq96LGh55qE6auY6ZqO5o6n5Yi277yM5L2G56CU56m25Lq65ZOh5L6d54S25Y+v5Lul5L2/55So5LiN5ZCM5bGk57Sa55qE5YWD5Lu277yM5YOP5piv6IO95aSg57me6YGO6KaP55Wr5Zmo77yM55u05o6l6Kit5a6a6Zec56+A6YCf5bqm5ZKM5Yqb55+p562J44CCPC9wPjxwIHN0eWxlPVwidmVydGljYWwtYWxpZ246IHRvcDsgbWFyZ2luOiAwcHggMHB4IDEuNWVtOyBmb250LXNpemU6IDE0cHQ7IGxpbmUtaGVpZ2h0OiAyZW07IGNvbG9yOiByZ2IoNTEsIDUxLCA1MSk7IGZvbnQtZmFtaWx5OiDlvq7ou5/mraPpu5Hpq5QsIHNhbnMtc2VyaWY7IGJhY2tncm91bmQtY29sb3I6IHJnYigyNDcsIDI0NywgMjQ3KTtcIj7oh4nmm7jlt7LntpPlsIdQeVJvYm9055So5Zyo5ZCE56iu55qE5qmf5Zmo5Lq65oeJ55So5LiK77yM5YOP5piv6bue5Yiw6bue55qE5bCO6Iiq77yM5oiW5piv5o6o6IiH5oqT55qE5Lu75YuZ77yM5Lmf55So5Zyo6YGg56uv5pON5L2c5Lul5pS26ZuG6KiT57e05qmf5Zmo5Lq655qE6LOH5paZ44CCUHlSb2JvdOS4reWMheWQq+S6huS4gOS6m+ePvuaIkOeahOa8lOeul+azleWvpuS9nO+8jOS4puaPkOS+m+WPr+Wwh+iHquihjOmWi+eZvOeahOa8lOeul+azle+8jOewoeWWruWcsOmDqOe9suWIsOapn+WZqOS6uuS4iueahOaWueazle+8jOiHieabuOS5n+aPkOWIsO+8jOeglOeptuS6uuWToeWPr+S7peS9v+eUqFB5VG9yY2joqJPnt7Tmt7Hluqblrbjnv5LmqKHlnovvvIzkuKbkvb/nlKhQeVJvYm905Zyo5qmf5Zmo5Lq65LiK5Z+36KGM5ryU566X5rOV44CCPC9wPjxwIHN0eWxlPVwidmVydGljYWwtYWxpZ246IHRvcDsgbWFyZ2luOiAwcHggMHB4IDEuNWVtOyBmb250LXNpemU6IDE0cHQ7IGxpbmUtaGVpZ2h0OiAyZW07IGNvbG9yOiByZ2IoNTEsIDUxLCA1MSk7IGZvbnQtZmFtaWx5OiDlvq7ou5/mraPpu5Hpq5QsIHNhbnMtc2VyaWY7IGJhY2tncm91bmQtY29sb3I6IHJnYigyNDcsIDI0NywgMjQ3KTtcIj5QeVJvYm905Y+v5Lul6K6T56CU56m256S+576k5pu05a655piT5Zyw5L2/55So5qmf5Zmo5Lq66LOH5paZ6ZuG44CB5ryU566X5rOV5a+m5L2c5Lul5Y+K5qih5Z6L77yM5ZCM5pmC5Lmf6IO95bmr5Yqp5LuW5YCR6KiC5a6a5Z+65rqW77yM5b6X5Lul5LqS55u45q+U6LyD5oiQ5p6c77yM5oiW5piv5Z+65pa85YW25LuW5Lq655qE5oiQ5p6c5b6A5YmN55m85bGV77yM6IeJ5pu46KGo56S677yM5YOP5piv5Zyo5L2/55SoTG9Db0JvdOmAmemhnuS9juaIkOacrOeahOapn+WZqOS6uuW5s+iHuu+8jFB5Um9ib3TmnInliqnmlrzpmY3kvY7pgLLlhaXploDmqrvvvIzkuKbkvb/noJTnqbbmiJDmnpzog73lpKDoiIflhbbku5bkurrliIbkuqvjgILoh4nmm7jkuZ/poIbli6LlnKhQeVJvYm906YeL5Ye655qE5ZCM5pmC77yM5YWs6ZaL5LqG5LiA6aCF5b615rGC5o+Q5qGI5rS75YuV77yM5Lu75L2V56CU56m25ZyY6ZqK6YO95Y+v5Lul5o+Q5LqkUHlSb2JvdOaQremFjUxvQ29Cb3TnmoTnoJTnqbbmj5DmoYjvvIznjbLli53ogIXlj6/ku6XotI/lvpfkuIDku73noJTnqbbnlKhMb0NvQm905bel5YW35YyF44CCPC9wPic7XHJcblxyXG4vL2ltcG9ydCBJY29uQnV0dG9uIGZyb20gJy4vVG9vbEJhci9JY29uQnV0dG9uJ1xyXG5jbGFzcyBBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cdHJlbmRlcigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZGVtb1wiPlxyXG5cdFx0XHRcdDxoMT5SZWFjdCBTdW1tZXJOb3RlIEFwcDwvaDE+XHJcblx0XHRcdFx0PFN1bW1lck5vdGVcclxuXHRcdFx0XHRcdGRlc3Ryb3k9e2ZhbHNlfVxyXG5cdFx0XHRcdFx0dmFsdWU9e2h0bWxkYXRhfVxyXG5cdFx0XHRcdFx0b3B0aW9ucz17e1xyXG5cdFx0XHRcdFx0XHRsYW5nOiBcInpoLVRXXCIsXHJcblx0XHRcdFx0XHRcdGhlaWdodDogMzUwLFxyXG5cdFx0XHRcdFx0XHRkaWFsb2dzSW5Cb2R5OiB0cnVlLFxyXG5cdFx0XHRcdFx0XHR0b29sYmFyOiBbXHJcblx0XHRcdFx0XHRcdFx0W1wic3R5bGVcIiwgW1wic3R5bGVcIl1dLFxyXG5cdFx0XHRcdFx0XHRcdFtcImZvbnRcIiwgW1wiYm9sZFwiLCBcInVuZGVybGluZVwiLCBcImNsZWFyXCJdXSxcclxuXHRcdFx0XHRcdFx0XHRbXCJmb250bmFtZVwiLCBbXCJmb250bmFtZVwiXV0sXHJcblx0XHRcdFx0XHRcdFx0W1wicGFyYVwiLCBbXCJ1bFwiLCBcIm9sXCIsIFwicGFyYWdyYXBoXCJdXSxcclxuXHRcdFx0XHRcdFx0XHRbXCJ0YWJsZVwiLCBbXCJ0YWJsZVwiXV0sXHJcblx0XHRcdFx0XHRcdFx0W1wiaW5zZXJ0XCIsIFtcImxpbmtcIiwgXCJwaWN0dXJlXCIsIFwidmlkZW9cIl1dLFxyXG5cdFx0XHRcdFx0XHRcdFtcInZpZXdcIiwgW1wiZnVsbHNjcmVlblwiLCBcImNvZGV2aWV3XCJdXVxyXG5cdFx0XHRcdFx0XHRdXHJcblx0XHRcdFx0XHR9fVxyXG5cdFx0XHRcdFx0b25DaGFuZ2U9e29uQ2hhbmdlfVxyXG5cdFx0XHRcdFx0b25JbWFnZVVwbG9hZD17b25JbWFnZVVwbG9hZH1cclxuXHRcdFx0XHRcdG9uSW1hZ2VQYXN0ZUZyb21Xb3JkPXtvbkltYWdlUGFzdGVGcm9tV29yZH1cclxuXHRcdFx0XHRcdC8vb25QYXN0ZT17b25QYXN0ZX1cclxuXHRcdFx0XHRcdG9uSW5pdD17ZSA9PiBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLSBvbkluaXQgLS0tLS0tLS1cIiwgZSl9XHJcblx0XHRcdFx0Lz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gb25JbWFnZVBhc3RlRnJvbVdvcmQoJGltZ3MpIHtcclxuXHRjb25zb2xlLmxvZyhcIm9uSW1hZ2VQYXN0ZUZyb21Xb3JkXCIsICRpbWdzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25DaGFuZ2UoZSkge1xyXG5cdC8vJCgnc3BhbltzdHlsZSo9XCJtc28taWdub3JlXCJdJykucmVtb3ZlKClcclxuXHQvL2xldCBpbWcgPSAkKCdpbWdbc3JjKj1cImZpbGU6Ly9cIl0nKS5hdHRyKCdsb2FkaW5nJyx0cnVlKTtcclxuXHRjb25zb2xlLmxvZyhcImNoYW5nZVwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25JbWFnZVVwbG9hZChmaWxlLCBjYiwgZSkge1xyXG5cdGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tIG9uSW1hZ2VVcGxvYWQgLS0tLS0tLS1cIiwgZmlsZSwgY2IsIGUpO1xyXG5cdGxldCBpbWFnZSA9IGZpbGVbMF07XHJcblxyXG5cdFN1bW1lck5vdGUuaW5zZXJ0SW1hZ2UoXCJodHRwczovL2kuaW1ndXIuY29tL0pPT0VFTngucG5nXCIsICRpbWFnZSA9PiB7XHJcblx0XHQkaW1hZ2UuY3NzKFwid2lkdGhcIiwgTWF0aC5mbG9vcigkaW1hZ2Uud2lkdGgoKSAvIDIpKTtcclxuXHRcdCRpbWFnZS5hdHRyKFwidGl0bGVcIiwgaW1hZ2UubmFtZSk7XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uUGFzdGUoZSkge1xyXG5cdC8vY29uc29sZS5sb2coJy0tLS0tLS0tLSBvblBhc3RlIC0tLS0tLS0tJywgZSlcclxuXHJcblx0bGV0IGl0ZW1zID0gZS5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGEuaXRlbXM7XHJcblx0bGV0IGZpbGVzID0gZS5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGEuZmlsZXM7XHJcblxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHJldHVybiBlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0fVxyXG5cclxuXHQvL2NvbnNvbGUubG9nKCctLS0tLS0tLS0tIGl0ZW1zIC0tLS0tLS0tLS0tLS0nLCBpdGVtcylcclxuXHQvL2NvbnNvbGUubG9nKCctLS0tLS0tLS0tIGZpbGVzIC0tLS0tLS0tLS0tLS0nLCBmaWxlcylcclxuXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0Ly9jb25zb2xlLmxvZygnLS0tLS0tLS0tLSBpdGVtIC0tLS0tLS0tLS0tLS0nLCBpdGVtc1tpXSlcclxuXHRcdGlmIChpdGVtc1tpXS50eXBlLmluZGV4T2YoXCJydGZcIikgPiAtMSkge1xyXG5cdFx0XHRpdGVtc1tpXS5nZXRBc1N0cmluZyhmdW5jdGlvbiAocnRmKSB7XHJcblx0XHRcdFx0Y29uc3QgZG9jID0gcnRmMmh0bWwocnRmKTtcclxuXHRcdFx0XHQvL2NvbnN0IG1ldGEgPSBkb2MubWV0YWRhdGEoKTtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGRvYylcclxuXHRcdFx0XHRkb2NcclxuXHRcdFx0XHRcdC5yZW5kZXIoKVxyXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKGh0bWxFbGVtZW50cykge1xyXG5cdFx0XHRcdFx0XHR2YXIgaW1ncyA9IFtdO1xyXG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdtZXRhJywgbWV0YSk7XHJcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2h0bWxFbGVtZW50cycsIGh0bWxFbGVtZW50cyk7XHJcblx0XHRcdFx0XHRcdGh0bWxFbGVtZW50cy5mb3JFYWNoKCRodG1sID0+IHtcclxuXHRcdFx0XHRcdFx0XHQkaHRtbC5maW5kKCdpbWdbc3JjKj1cImRhdGE6aW1hZ2VcIl0nKS5lYWNoKChpLCBlbCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0aW1ncy5wdXNoKGVsKTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHQvLyQoJyN0ZXN0JykuYXBwZW5kKCRodG1sKVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhpbWdzKVxyXG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGltZ3MpXHJcblx0XHRcdFx0XHRcdFx0JChcImltZ1tsb2FkaW5nXVwiKS5lYWNoKChpLCBlbCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGltZ3NbaV0pIGVsLnNyYyA9IGltZ3NbaV0uc3JjO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9LCAwKTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblx0Ly9mb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0Ly8gICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0gZmlsZSAtLS0tLS0tLS0tLS0tJywgZmlsZXNbaV0pXHJcblx0Ly99XHJcblxyXG5cdC8vIHJldHJpZXZlSW1hZ2VGcm9tQ2xpcGJvYXJkQXNCbG9iKGUub3JpZ2luYWxFdmVudCwgYmxvYiA9PiB7XHJcblx0Ly8gICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tIGJsb2IgLS0tLS0tLS0tLS0tLScsIGJsb2IpXHJcblx0Ly8gfSlcclxuXHJcblx0Ly9jYXRjaFBhc3RlKGUsIHRoaXMsIGRhdGEgPT4gY29uc29sZS5sb2coJy0tLS0tLS0tLS0gY2xpcERhdGEgLS0tLS0tLS0tLS0tLScsIGRhdGEpKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcHA7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuICAgIHJlcXVpcmUoJ2Jvb3RzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzcycpXHJcbiAgICByZXF1aXJlKCdib290c3RyYXAvanMvZGlzdC9tb2RhbCcpXHJcbiAgICByZXF1aXJlKCdib290c3RyYXAvanMvZGlzdC9kcm9wZG93bicpXHJcbiAgICByZXF1aXJlKCdib290c3RyYXAvanMvZGlzdC90b29sdGlwJylcclxuICAgIHJlcXVpcmUoJ3N1bW1lcm5vdGUvZGlzdC9zdW1tZXJub3RlLWJzNC5jc3MnKVxyXG4gICAgcmVxdWlyZSgnc3VtbWVybm90ZS9kaXN0L3N1bW1lcm5vdGUtYnM0Lm1pbi5qcycpXHJcbn0iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcclxuaW1wb3J0IHJ0ZjJodG1sIGZyb20gXCIuLi9saWIvdHJmMmh0bWxcIjtcclxuaW1wb3J0IEltcG9ydENvZGUgZnJvbSBcIi4vSW1wb3J0Q29kZVwiO1xyXG5cclxuLy9jb25zdCByYW5kb21VaWQgPSAoKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDApO1xyXG5cclxuY2xhc3MgUmVhY3RTdW1tZXJub3RlIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cdFx0dGhpcy5jb3VudGVyID0gMDsgLy8gY291bnRlciBmb3IgaWRlbnRpdGlmeSBmb3IgcGFzdGUgd29yZCBjb250ZW50XHJcblx0XHQvL3RoaXMudWlkID0gYHJlYWN0LXN1bW1lcm5vdGUtJHtyYW5kb21VaWQoKX1gO1xyXG5cdFx0dGhpcy5lZGl0b3IgPSB7fTtcclxuXHRcdHRoaXMubm90ZUVkaXRhYmxlID0gbnVsbDtcclxuXHRcdHRoaXMubm90ZVBsYWNlaG9sZGVyID0gbnVsbDtcclxuXHRcdHRoaXMub25Jbml0ID0gdGhpcy5vbkluaXQuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMub25JbWFnZVVwbG9hZCA9IHRoaXMub25JbWFnZVVwbG9hZC5iaW5kKHRoaXMpO1xyXG5cdFx0dGhpcy5mb2N1cyA9IHRoaXMuZm9jdXMuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMuaXNFbXB0eSA9IHRoaXMuaXNFbXB0eS5iaW5kKHRoaXMpO1xyXG5cdFx0dGhpcy5yZXNldCA9IHRoaXMucmVzZXQuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMucmVwbGFjZSA9IHRoaXMucmVwbGFjZS5iaW5kKHRoaXMpO1xyXG5cdFx0dGhpcy5kaXNhYmxlID0gdGhpcy5kaXNhYmxlLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmVuYWJsZSA9IHRoaXMuZW5hYmxlLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLnRvZ2dsZVN0YXRlID0gdGhpcy50b2dnbGVTdGF0ZS5iaW5kKHRoaXMpO1xyXG5cdFx0dGhpcy5pbnNlcnRJbWFnZSA9IHRoaXMuaW5zZXJ0SW1hZ2UuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMuaW5zZXJ0Tm9kZSA9IHRoaXMuaW5zZXJ0Tm9kZS5iaW5kKHRoaXMpO1xyXG5cdFx0dGhpcy5pbnNlcnRUZXh0ID0gdGhpcy5pbnNlcnRUZXh0LmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmhhbmRsZVBhc3RlID0gdGhpcy5oYW5kbGVQYXN0ZS5iaW5kKHRoaXMpO1xyXG5cdFx0UmVhY3RTdW1tZXJub3RlLmZvY3VzID0gdGhpcy5mb2N1cy5iaW5kKHRoaXMpO1xyXG5cdFx0UmVhY3RTdW1tZXJub3RlLmlzRW1wdHkgPSB0aGlzLmlzRW1wdHkuYmluZCh0aGlzKTtcclxuXHRcdFJlYWN0U3VtbWVybm90ZS5yZXNldCA9IHRoaXMucmVzZXQuYmluZCh0aGlzKTtcclxuXHRcdFJlYWN0U3VtbWVybm90ZS5yZXBsYWNlID0gdGhpcy5yZXBsYWNlLmJpbmQodGhpcyk7XHJcblx0XHRSZWFjdFN1bW1lcm5vdGUuZGlzYWJsZSA9IHRoaXMuZGlzYWJsZS5iaW5kKHRoaXMpO1xyXG5cdFx0UmVhY3RTdW1tZXJub3RlLmVuYWJsZSA9IHRoaXMuZW5hYmxlLmJpbmQodGhpcyk7XHJcblx0XHRSZWFjdFN1bW1lcm5vdGUudG9nZ2xlU3RhdGUgPSB0aGlzLnRvZ2dsZVN0YXRlLmJpbmQodGhpcyk7XHJcblx0XHRSZWFjdFN1bW1lcm5vdGUuaW5zZXJ0SW1hZ2UgPSB0aGlzLmluc2VydEltYWdlLmJpbmQodGhpcyk7XHJcblx0XHRSZWFjdFN1bW1lcm5vdGUuaW5zZXJ0Tm9kZSA9IHRoaXMuaW5zZXJ0Tm9kZS5iaW5kKHRoaXMpO1xyXG5cdFx0UmVhY3RTdW1tZXJub3RlLmluc2VydFRleHQgPSB0aGlzLmluc2VydFRleHQuYmluZCh0aGlzKTtcclxuXHR9XHJcblxyXG5cdC8vbG9hZE1vZHVsZSA9IHBhdGggPT4gcmVxdWlyZShwYXRoKVxyXG5cclxuXHRoYW5kbGVFZGl0b3JSZWYgPSBub2RlID0+IHtcclxuXHRcdGlmICghbm9kZSkgcmV0dXJuO1xyXG5cdFx0Y29uc3Qgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucyB8fCB7fTtcclxuXHRcdGNvbnN0IHsgY29kZXZpZXcsIGRlc3Ryb3ksIHZhbHVlIH0gPSB0aGlzLnByb3BzO1xyXG5cdFx0b3B0aW9ucy5jYWxsYmFja3MgPSB0aGlzLmNhbGxiYWNrcztcclxuXHRcdC8vIGxvYWQgbGFuZyBwYWNrXHJcblx0XHQvL2lmIChvcHRpb25zLmxhbmcgJiYgb3B0aW9ucy5sYW5nICE9ICdlbicpIHRoaXMubG9hZE1vZHVsZShgc3VtbWVybm90ZS9kaXN0L2xhbmcvc3VtbWVybm90ZS0ke29wdGlvbnMubGFuZ30uanNgKVxyXG5cdFx0Ly9pZiAob3B0aW9ucy5sYW5nKSByZXF1aXJlKGBzdW1tZXJub3RlL2xhbmcvc3VtbWVybm90ZS0ke29wdGlvbnMubGFuZ30uanNgKVxyXG5cdFx0dGhpcy5lZGl0b3IgPSAkKG5vZGUpO1xyXG5cdFx0dGhpcy5lZGl0b3Iuc3VtbWVybm90ZShvcHRpb25zKTtcclxuXHRcdGlmICh2YWx1ZSkge1xyXG5cdFx0XHR0aGlzLnJlcGxhY2UodmFsdWUpO1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgdmFsdWUgfSk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29kZXZpZXcpIHtcclxuXHRcdFx0dGhpcy5lZGl0b3Iuc3VtbWVybm90ZShcImNvZGV2aWV3LmFjdGl2YXRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGRlc3Ryb3kpIHtcclxuXHRcdFx0dGhpcy5lZGl0b3Iuc3VtbWVybm90ZShcImRlc3Ryb3lcIik7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly9jb21wb25lbnREaWRNb3VudCgpIHtcclxuXHQvLyBjb25zdCBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zIHx8IHt9O1xyXG5cdC8vIGNvbnN0IGNvZGV2aWV3ID0gdGhpcy5wcm9wcy5jb2RldmlldztcclxuXHQvLyAvLyBjb25zdCBjb2Rldmlld0NvbW1hbmQgPSBjb2RldmlldyA/ICdjb2Rldmlldy5hY3RpdmF0ZScgOiAnY29kZXZpZXcuZGVhY3RpdmF0ZSc7XHJcblx0Ly8gb3B0aW9ucy5jYWxsYmFja3MgPSB0aGlzLmNhbGxiYWNrcztcclxuXHJcblx0Ly8gdGhpcy5lZGl0b3IgPSAkKGAjJHt0aGlzLnVpZH1gKTtcclxuXHQvLyB0aGlzLmVkaXRvci5zdW1tZXJub3RlKG9wdGlvbnMpO1xyXG5cdC8vIGlmIChjb2Rldmlldykge1xyXG5cdC8vICAgICB0aGlzLmVkaXRvci5zdW1tZXJub3RlKCdjb2Rldmlldy5hY3RpdmF0ZScpO1xyXG5cdC8vIH1cclxuXHQvL31cclxuXHJcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuXHRcdGNvbnN0IHsgcHJvcHMgfSA9IHRoaXM7XHJcblx0XHRjb25zdCBjb2RldmlldyA9IG5leHRQcm9wcy5jb2RldmlldztcclxuXHRcdGNvbnN0IGNvZGV2aWV3Q29tbWFuZCA9IGNvZGV2aWV3XHJcblx0XHRcdD8gXCJjb2Rldmlldy5hY3RpdmF0ZVwiXHJcblx0XHRcdDogXCJjb2Rldmlldy5kZWFjdGl2YXRlXCI7XHJcblx0XHRpZiAoXHJcblx0XHRcdHR5cGVvZiBuZXh0UHJvcHMudmFsdWUgPT09IFwic3RyaW5nXCIgJiZcclxuXHRcdFx0cHJvcHMudmFsdWUgIT09IG5leHRQcm9wcy52YWx1ZVxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMucmVwbGFjZShuZXh0UHJvcHMudmFsdWUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChcclxuXHRcdFx0dHlwZW9mIG5leHRQcm9wcy5kaXNhYmxlZCA9PT0gXCJib29sZWFuXCIgJiZcclxuXHRcdFx0cHJvcHMuZGlzYWJsZWQgIT09IG5leHRQcm9wcy5kaXNhYmxlZFxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMudG9nZ2xlU3RhdGUobmV4dFByb3BzLmRpc2FibGVkKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb2RldmlldyAhPT0gcHJvcHMuY29kZXZpZXcpIHtcclxuXHRcdFx0dGhpcy5lZGl0b3Iuc3VtbWVybm90ZShjb2Rldmlld0NvbW1hbmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHByb3BzLmRlc3Ryb3kpIHtcclxuXHRcdFx0dGhpcy5lZGl0b3Iuc3VtbWVybm90ZShcImRlc3Ryb3lcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzaG91bGRDb21wb25lbnRVcGRhdGUoKSB7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuXHRcdGlmICh0aGlzLmVkaXRvci5zdW1tZXJub3RlKSB7XHJcblx0XHRcdHRoaXMuZWRpdG9yLnN1bW1lcm5vdGUoXCJkZXN0cm95XCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b25Jbml0KCkge1xyXG5cdFx0Y29uc3QgeyBkaXNhYmxlZCwgb25Jbml0IH0gPSB0aGlzLnByb3BzO1xyXG5cclxuXHRcdGNvbnN0ICRjb250YWluZXIgPSB0aGlzLmVkaXRvci5wYXJlbnQoKTtcclxuXHRcdHRoaXMubm90ZUVkaXRhYmxlID0gJGNvbnRhaW5lci5maW5kKFwiLm5vdGUtZWRpdGFibGVcIik7XHJcblx0XHR0aGlzLm5vdGVQbGFjZWhvbGRlciA9ICRjb250YWluZXIuZmluZChcIi5ub3RlLXBsYWNlaG9sZGVyXCIpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgZGlzYWJsZWQgPT09IFwiYm9vbGVhblwiKSB7XHJcblx0XHRcdHRoaXMudG9nZ2xlU3RhdGUoZGlzYWJsZWQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0eXBlb2Ygb25Jbml0ID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0b25Jbml0KHtcclxuXHRcdFx0XHRzdW1tZXJub3RlOiB0aGlzLmVkaXRvci5zdW1tZXJub3RlLmJpbmQodGhpcy5lZGl0b3IpLFxyXG5cdFx0XHRcdGZvY3VzOiB0aGlzLmZvY3VzLFxyXG5cdFx0XHRcdGlzRW1wdHk6IHRoaXMuaXNFbXB0eSxcclxuXHRcdFx0XHRyZXNldDogdGhpcy5yZXNldCxcclxuXHRcdFx0XHRyZXBsYWNlOiB0aGlzLnJlcGxhY2UsXHJcblx0XHRcdFx0ZGlzYWJsZTogdGhpcy5kaXNhYmxlLFxyXG5cdFx0XHRcdGVuYWJsZTogdGhpcy5lbmFibGUsXHJcblx0XHRcdFx0aW5zZXJ0SW1hZ2U6IHRoaXMuaW5zZXJ0SW1hZ2UsXHJcblx0XHRcdFx0aW5zZXJ0Tm9kZTogdGhpcy5pbnNlcnROb2RlLFxyXG5cdFx0XHRcdGluc2VydFRleHQ6IHRoaXMuaW5zZXJ0VGV4dFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG9uSW1hZ2VVcGxvYWQoaW1hZ2VzKSB7XHJcblx0XHRjb25zdCB7IG9uSW1hZ2VVcGxvYWQgfSA9IHRoaXMucHJvcHM7XHJcblx0XHRpZiAodHlwZW9mIG9uSW1hZ2VVcGxvYWQgPT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHRvbkltYWdlVXBsb2FkKGltYWdlcywgdGhpcy5pbnNlcnRJbWFnZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmb2N1cygpIHtcclxuXHRcdC8vY29uc29sZS5sb2codGhpcy5lZGl0b3IpO1xyXG5cdFx0dGhpcy5lZGl0b3Iuc3VtbWVybm90ZShcImZvY3VzXCIpO1xyXG5cdH1cclxuXHJcblx0aXNFbXB0eSgpIHtcclxuXHRcdHJldHVybiB0aGlzLmVkaXRvci5zdW1tZXJub3RlKFwiaXNFbXB0eVwiKTtcclxuXHR9XHJcblxyXG5cdHJlc2V0KCkge1xyXG5cdFx0dGhpcy5lZGl0b3Iuc3VtbWVybm90ZShcInJlc2V0XCIpO1xyXG5cdH1cclxuXHJcblx0cmVwbGFjZShjb250ZW50KSB7XHJcblx0XHRjb25zdCB7IG5vdGVFZGl0YWJsZSwgbm90ZVBsYWNlaG9sZGVyIH0gPSB0aGlzO1xyXG5cdFx0Y29uc3QgcHJldkNvbnRlbnQgPSBub3RlRWRpdGFibGUuaHRtbCgpO1xyXG5cdFx0Y29uc3QgY29udGVudExlbmd0aCA9IGNvbnRlbnQubGVuZ3RoO1xyXG5cclxuXHRcdGlmIChwcmV2Q29udGVudCAhPT0gY29udGVudCkge1xyXG5cdFx0XHRpZiAodGhpcy5pc0VtcHR5KCkgJiYgY29udGVudExlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRub3RlUGxhY2Vob2xkZXIuaGlkZSgpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGNvbnRlbnRMZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRub3RlUGxhY2Vob2xkZXIuc2hvdygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdG5vdGVFZGl0YWJsZS5odG1sKGNvbnRlbnQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZGlzYWJsZSgpIHtcclxuXHRcdHRoaXMuZWRpdG9yLnN1bW1lcm5vdGUoXCJkaXNhYmxlXCIpO1xyXG5cdH1cclxuXHJcblx0ZW5hYmxlKCkge1xyXG5cdFx0dGhpcy5lZGl0b3Iuc3VtbWVybm90ZShcImVuYWJsZVwiKTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZVN0YXRlKGRpc2FibGVkKSB7XHJcblx0XHRpZiAoZGlzYWJsZWQpIHtcclxuXHRcdFx0dGhpcy5kaXNhYmxlKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmVuYWJsZSgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aW5zZXJ0SW1hZ2UodXJsLCBmaWxlbmFtZU9yQ2FsbGJhY2spIHtcclxuXHRcdHRoaXMuZWRpdG9yLnN1bW1lcm5vdGUoXCJpbnNlcnRJbWFnZVwiLCB1cmwsIGZpbGVuYW1lT3JDYWxsYmFjayk7XHJcblx0fVxyXG5cclxuXHRpbnNlcnROb2RlKG5vZGUpIHtcclxuXHRcdHRoaXMuZWRpdG9yLnN1bW1lcm5vdGUoXCJpbnNlcnROb2RlXCIsIG5vZGUpO1xyXG5cdH1cclxuXHJcblx0aW5zZXJ0VGV4dCh0ZXh0KSB7XHJcblx0XHR0aGlzLmVkaXRvci5zdW1tZXJub3RlKFwiaW5zZXJ0VGV4dFwiLCB0ZXh0KTtcclxuXHR9XHJcblxyXG5cdGhhbmRsZUNoYW5nZSh0eHQpIHtcclxuXHRcdCQoJ3NwYW5bc3R5bGUqPVwibXNvLWlnbm9yZVwiXScpLnJlbW92ZSgpO1xyXG5cdFx0Y29uc3QgeyBvbkNoYW5nZSB9ID0gdGhpcy5wcm9wcztcclxuXHRcdGNvbnN0ICRwYXN0ZWRJbWdzID0gJCgnaW1nW3NyYyo9XCJmaWxlOi8vXCJdJylcclxuXHRcdFx0Lm5vdChcIi56YXAtaW1nLXVwbG9hZGluZ1wiKVxyXG5cdFx0XHQuYWRkQ2xhc3MoXCJ6YXAtaW1nLXVwbG9hZGluZ1wiKVxyXG5cdFx0XHQuYWRkQ2xhc3MoYHphcC1pbWctdXBsb2FkaW5nLSR7dGhpcy5jb3VudGVyfWApO1xyXG5cclxuXHRcdGlmICgkcGFzdGVkSW1ncy5sZW5ndGgpIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciArIDE7XHJcblx0XHRpZiAodHlwZW9mIG9uQ2hhbmdlID09PSBcImZ1bmN0aW9uXCIpIG9uQ2hhbmdlKHR4dCk7XHJcblx0fVxyXG5cclxuXHRoYW5kbGVQYXN0ZShlKSB7XHJcblx0XHQvLyBpZiBoYXZlIG1lZGlhLCBpdCB3aWxsIGZpcmUgdXBsb2FkIGltYWdlIGV2ZW50ICxzbyBza2lwIHBhc3RlXHJcblx0XHRjb25zdCB7IG9uUGFzdGUsIG9uSW1hZ2VQYXN0ZUZyb21Xb3JkIH0gPSB0aGlzLnByb3BzO1xyXG5cdFx0Y29uc3QgZmlsZXMgPSBlLm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YS5maWxlcztcclxuXHRcdC8vIG9ubHkgb25lIHBpYywgZG9udCBwYXN0ZSB0aGUgcGhvdG9cclxuXHRcdGlmIChmaWxlcy5sZW5ndGgpIHJldHVybiBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0Y29uc3QgaXRlbXMgPSBlLm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YS5pdGVtcztcclxuXHJcblxyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKGl0ZW1zW2ldLnR5cGUuaW5kZXhPZihcInJ0ZlwiKSA+IC0xKSB7XHJcblx0XHRcdFx0aXRlbXNbaV0uZ2V0QXNTdHJpbmcocnRmID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IGRvYyA9IHJ0ZjJodG1sKHJ0Zik7XHJcblx0XHRcdFx0XHR2YXIgaW1ncyA9IFtdO1xyXG5cdFx0XHRcdFx0ZG9jLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0XHRcdGltZ3MucHVzaChlbCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgJHBhc3RlSW1ncyA9ICQoYC56YXAtaW1nLXVwbG9hZGluZy0ke3RoaXMuY291bnRlciAtIDF9YCkuZWFjaChcclxuXHRcdFx0XHRcdFx0XHQoaSwgZWwpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChpbWdzW2ldKSBlbC5zcmMgPSBpbWdzW2ldO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBvbkltYWdlUGFzdGVGcm9tV29yZCA9PT0gXCJmdW5jdGlvblwiKVxyXG5cdFx0XHRcdFx0XHRcdG9uSW1hZ2VQYXN0ZUZyb21Xb3JkKCRwYXN0ZUltZ3MpO1xyXG5cdFx0XHRcdFx0fSwgMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZW9mIG9uUGFzdGUgPT09IFwiZnVuY3Rpb25cIikgb25QYXN0ZShlKTtcclxuXHR9XHJcblxyXG5cdGdldCBjYWxsYmFja3MoKSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMucHJvcHM7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRvbkluaXQ6IHRoaXMub25Jbml0LFxyXG5cdFx0XHRvbkVudGVyOiBwcm9wcy5vbkVudGVyLFxyXG5cdFx0XHRvbkZvY3VzOiBwcm9wcy5vbkZvY3VzLFxyXG5cdFx0XHRvbkJsdXI6IHByb3BzLm9uQmx1cixcclxuXHRcdFx0b25LZXl1cDogcHJvcHMub25LZXlVcCxcclxuXHRcdFx0b25LZXlkb3duOiBwcm9wcy5vbktleURvd24sXHJcblx0XHRcdG9uUGFzdGU6IHRoaXMuaGFuZGxlUGFzdGUsXHJcblx0XHRcdG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZSxcclxuXHRcdFx0b25JbWFnZVVwbG9hZDogdGhpcy5vbkltYWdlVXBsb2FkXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgeyB0YWc6IFRhZywgY2hpbGRyZW4sIGNsYXNzTmFtZSwgbmFtZSB9ID0gdGhpcy5wcm9wcztcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWV9ID5cclxuXHRcdFx0XHQ8VGFnIHJlZj17dGhpcy5oYW5kbGVFZGl0b3JSZWZ9PntjaGlsZHJlbn08L1RhZz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuUmVhY3RTdW1tZXJub3RlLnByb3BUeXBlcyA9IHtcclxuXHR0YWc6IFByb3BUeXBlcy5zdHJpbmcsIC8vIHdpbGwgZGV0ZXJtaW5nIHVzaW5nIGRpdiBvciB0ZXh0YXJlYSBmaWVsZCBmb3IgZm9ybSBjb21wb25lbnRzIGxpa2UgcmVkdXgtZm9ybVxyXG5cdGNoaWxkcmVuOiBQcm9wVHlwZXMubm9kZSwgLy8gaW5zdGVhZCBvZiB2YWx1ZSwgdXNpbmcgY2hpbGRyZW4gbWFrZXMgbW9yZSBzZW5zZSBmb3IgZGl2IGFuZCB0ZXh0YXJlYSBibG9ja3NcclxuXHRjb2RldmlldzogUHJvcFR5cGVzLmJvb2wsXHJcblx0Y2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG5cdG9wdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXHJcblx0ZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxyXG5cdG9uSW5pdDogUHJvcFR5cGVzLmZ1bmMsXHJcblx0b25FbnRlcjogUHJvcFR5cGVzLmZ1bmMsXHJcblx0b25Gb2N1czogUHJvcFR5cGVzLmZ1bmMsXHJcblx0b25CbHVyOiBQcm9wVHlwZXMuZnVuYyxcclxuXHRvbktleVVwOiBQcm9wVHlwZXMuZnVuYyxcclxuXHRvbktleURvd246IFByb3BUeXBlcy5mdW5jLFxyXG5cdG9uUGFzdGU6IFByb3BUeXBlcy5mdW5jLFxyXG5cdG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcclxuXHRvbkltYWdlVXBsb2FkOiBQcm9wVHlwZXMuZnVuYyxcclxuXHRvbkltYWdlUGFzdGVGcm9tV29yZDogUHJvcFR5cGVzLmZ1bmMsXHJcblx0ZGVzdHJveTogUHJvcFR5cGVzLmJvb2xcclxufTtcclxuXHJcblJlYWN0U3VtbWVybm90ZS5kZWZhdWx0UHJvcHMgPSB7XHJcblx0dGFnOiBcImRpdlwiXHJcbn07XHJcblxyXG5SZWFjdFN1bW1lcm5vdGUucHJvdG90eXBlLkltcG9ydENvZGUgPSBJbXBvcnRDb2RlO1xyXG5SZWFjdFN1bW1lcm5vdGUuSW1wb3J0Q29kZSA9IEltcG9ydENvZGU7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZWFjdFN1bW1lcm5vdGU7XHJcbiIsImZ1bmN0aW9uIG5ld3N0cmluZ1RvQXJyYXlCdWZmZXIoc3RyaW5nKSB7XHJcblxyXG4gICAgdmFyIHJldCA9IFtdLFxyXG4gICAgICAgIHJlUGljdHVyZUhlYWRlciA9IC9cXHtcXFxccGljdFtcXHNcXFNdKz9cXFxcYmxpcHRhZ1xcLT9cXGQrKFxcXFxibGlwdXBpXFwtP1xcZCspPyhcXHtcXFxcXFwqXFxcXGJsaXB1aWRcXHM/W1xcZGEtZkEtRl0rKT9bXFxzXFx9XSo/LyxcclxuICAgICAgICByZVBpY3R1cmUgPSBuZXcgUmVnRXhwKCcoPzooJyArIHJlUGljdHVyZUhlYWRlci5zb3VyY2UgKyAnKSkoW1xcXFxkYS1mQS1GXFxcXHNdKylcXFxcfScsICdnJyksXHJcbiAgICAgICAgd2hvbGVJbWFnZXMsXHJcbiAgICAgICAgaW1hZ2VUeXBlXHJcblxyXG4gICAgd2hvbGVJbWFnZXMgPSBzdHJpbmcubWF0Y2gocmVQaWN0dXJlKTtcclxuXHJcbiAgICBpZiAoIXdob2xlSW1hZ2VzKSB7XHJcblxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aG9sZUltYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChyZVBpY3R1cmVIZWFkZXIudGVzdCh3aG9sZUltYWdlc1tpXSkpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aG9sZUltYWdlc1tpXS5pbmRleE9mKCdcXFxccG5nYmxpcCcpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaW1hZ2VUeXBlID0gJ2ltYWdlL3BuZyc7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2hvbGVJbWFnZXNbaV0uaW5kZXhPZignXFxcXGpwZWdibGlwJykgIT09IC0xKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2VUeXBlID0gJ2ltYWdlL2pwZWcnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGhleDogaW1hZ2VUeXBlID8gd2hvbGVJbWFnZXNbaV0ucmVwbGFjZShyZVBpY3R1cmVIZWFkZXIsICcnKS5yZXBsYWNlKC9bXlxcZGEtZkEtRl0vZywgJycpIDogbnVsbCxcclxuICAgICAgICAgICAgICAgIHR5cGU6IGltYWdlVHlwZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0O1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gY29udmVydEhleFN0cmluZ1RvQnl0ZXMoaGV4U3RyaW5nKSB7XHJcbiAgICB2YXIgYnl0ZXNBcnJheSA9IFtdLFxyXG4gICAgICAgIGJ5dGVzQXJyYXlMZW5ndGggPSBoZXhTdHJpbmcubGVuZ3RoIC8gMixcclxuICAgICAgICBpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBieXRlc0FycmF5TGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgYnl0ZXNBcnJheS5wdXNoKHBhcnNlSW50KGhleFN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNikpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzQXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnZlcnRCeXRlc1RvQmFzZTY0KGJ5dGVzQXJyYXkpIHtcclxuICAgIHZhciBiYXNlNjRjaGFyYWN0ZXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nLFxyXG4gICAgICAgIGJhc2U2NHN0cmluZyA9ICcnLFxyXG4gICAgICAgIGJ5dGVzQXJyYXlMZW5ndGggPSBieXRlc0FycmF5Lmxlbmd0aCxcclxuICAgICAgICBpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBieXRlc0FycmF5TGVuZ3RoOyBpICs9IDMpIHtcclxuICAgICAgICB2YXIgYXJyYXkzID0gYnl0ZXNBcnJheS5zbGljZShpLCBpICsgMyksXHJcbiAgICAgICAgICAgIGFycmF5M2xlbmd0aCA9IGFycmF5My5sZW5ndGgsXHJcbiAgICAgICAgICAgIGFycmF5NCA9IFtdLFxyXG4gICAgICAgICAgICBqO1xyXG5cclxuICAgICAgICBpZiAoYXJyYXkzbGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICBmb3IgKGogPSBhcnJheTNsZW5ndGg7IGogPCAzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGFycmF5M1tqXSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDB4RkMgLT4gMTExMTExMDAgfHwgMHgwMyAtPiAwMDAwMDAxMSB8fCAweDBGIC0+IDAwMDAxMTExIHx8IDB4QzAgLT4gMTEwMDAwMDAgfHwgMHgzRiAtPiAwMDExMTExMVxyXG4gICAgICAgIGFycmF5NFswXSA9IChhcnJheTNbMF0gJiAweEZDKSA+PiAyO1xyXG4gICAgICAgIGFycmF5NFsxXSA9ICgoYXJyYXkzWzBdICYgMHgwMykgPDwgNCkgfCAoYXJyYXkzWzFdID4+IDQpO1xyXG4gICAgICAgIGFycmF5NFsyXSA9ICgoYXJyYXkzWzFdICYgMHgwRikgPDwgMikgfCAoKGFycmF5M1syXSAmIDB4QzApID4+IDYpO1xyXG4gICAgICAgIGFycmF5NFszXSA9IGFycmF5M1syXSAmIDB4M0Y7XHJcblxyXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCA0OyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGogPD0gYXJyYXkzbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBiYXNlNjRzdHJpbmcgKz0gYmFzZTY0Y2hhcmFjdGVycy5jaGFyQXQoYXJyYXk0W2pdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJhc2U2NHN0cmluZyArPSAnPSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJhc2U2NHN0cmluZztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNyY1dpdGhCYXNlNjQoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLnR5cGUgPyAnZGF0YTonICsgaW1nLnR5cGUgKyAnO2Jhc2U2NCwnICsgY29udmVydEJ5dGVzVG9CYXNlNjQoY29udmVydEhleFN0cmluZ1RvQnl0ZXMoaW1nLmhleCkpIDogbnVsbDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJ0ZiA9PiB7XHJcbiAgICBpZiAoIXJ0ZikgcnRmID0gJydcclxuICAgIHZhciBoZXhJbWFnZSA9IG5ld3N0cmluZ1RvQXJyYXlCdWZmZXIocnRmKVxyXG4gICAgY29uc3QgbmV3U3JjVmFsdWVzID0gW11cclxuICAgIGhleEltYWdlLmZvckVhY2goZnVuY3Rpb24gKGltZykge1xyXG4gICAgICAgIG5ld1NyY1ZhbHVlcy5wdXNoKGNyZWF0ZVNyY1dpdGhCYXNlNjQoaW1nKSlcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIG5ld1NyY1ZhbHVlcztcclxufSIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJ1xyXG5pbXBvcnQgQXBwIGZyb20gJy4vY29tcG9uZW50cy9BcHAuanN4J1xyXG5cclxucmVuZGVyKFxyXG4gICAgPEFwcC8+XHJcbiAgICAsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JylcclxuKSJdLCJzb3VyY2VSb290IjoiIn0=