/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/proxy/route";
exports.ids = ["app/api/proxy/route"];
exports.modules = {

/***/ "(rsc)/./app/api/proxy/route.ts":
/*!********************************!*\
  !*** ./app/api/proxy/route.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   OPTIONS: () => (/* binding */ OPTIONS)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nasync function GET(request) {\n    const url = request.nextUrl.searchParams.get(\"url\");\n    if (!url) {\n        return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(\"URL parameter is required\", {\n            status: 400\n        });\n    }\n    try {\n        const response = await fetch(url);\n        if (!response.ok) {\n            throw new Error(`Failed to fetch video: ${response.statusText}`);\n        }\n        // Get the content type from the response\n        const contentType = response.headers.get(\"content-type\") || \"video/mp4\";\n        // Create a new response with the video data\n        const videoData = await response.arrayBuffer();\n        return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(videoData, {\n            headers: {\n                \"Content-Type\": contentType,\n                \"Content-Length\": videoData.byteLength.toString(),\n                \"Access-Control-Allow-Origin\": \"*\",\n                \"Access-Control-Allow-Methods\": \"GET, OPTIONS\",\n                \"Access-Control-Allow-Headers\": \"Content-Type\"\n            }\n        });\n    } catch (error) {\n        console.error(\"Proxy error:\", error);\n        return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(\"Failed to fetch video\", {\n            status: 500\n        });\n    }\n}\nasync function OPTIONS() {\n    return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(null, {\n        headers: {\n            \"Access-Control-Allow-Origin\": \"*\",\n            \"Access-Control-Allow-Methods\": \"GET, OPTIONS\",\n            \"Access-Control-Allow-Headers\": \"Content-Type\"\n        }\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3Byb3h5L3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUF1RDtBQUVoRCxlQUFlQyxJQUFJQyxPQUFvQjtJQUM1QyxNQUFNQyxNQUFNRCxRQUFRRSxPQUFPLENBQUNDLFlBQVksQ0FBQ0MsR0FBRyxDQUFDO0lBRTdDLElBQUksQ0FBQ0gsS0FBSztRQUNSLE9BQU8sSUFBSUgscURBQVlBLENBQUMsNkJBQTZCO1lBQUVPLFFBQVE7UUFBSTtJQUNyRTtJQUVBLElBQUk7UUFDRixNQUFNQyxXQUFXLE1BQU1DLE1BQU1OO1FBRTdCLElBQUksQ0FBQ0ssU0FBU0UsRUFBRSxFQUFFO1lBQ2hCLE1BQU0sSUFBSUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFSCxTQUFTSSxVQUFVLEVBQUU7UUFDakU7UUFFQSx5Q0FBeUM7UUFDekMsTUFBTUMsY0FBY0wsU0FBU00sT0FBTyxDQUFDUixHQUFHLENBQUMsbUJBQW1CO1FBRTVELDRDQUE0QztRQUM1QyxNQUFNUyxZQUFZLE1BQU1QLFNBQVNRLFdBQVc7UUFFNUMsT0FBTyxJQUFJaEIscURBQVlBLENBQUNlLFdBQVc7WUFDakNELFNBQVM7Z0JBQ1AsZ0JBQWdCRDtnQkFDaEIsa0JBQWtCRSxVQUFVRSxVQUFVLENBQUNDLFFBQVE7Z0JBQy9DLCtCQUErQjtnQkFDL0IsZ0NBQWdDO2dCQUNoQyxnQ0FBZ0M7WUFDbEM7UUFDRjtJQUNGLEVBQUUsT0FBT0MsT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsZ0JBQWdCQTtRQUM5QixPQUFPLElBQUluQixxREFBWUEsQ0FBQyx5QkFBeUI7WUFBRU8sUUFBUTtRQUFJO0lBQ2pFO0FBQ0Y7QUFFTyxlQUFlYztJQUNwQixPQUFPLElBQUlyQixxREFBWUEsQ0FBQyxNQUFNO1FBQzVCYyxTQUFTO1lBQ1AsK0JBQStCO1lBQy9CLGdDQUFnQztZQUNoQyxnQ0FBZ0M7UUFDbEM7SUFDRjtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvaGVpdG9yLmNhbmRpZG8vRG9jdW1lbnRzL2lwdHYvaXB0di1hcHAvYXBwL2FwaS9wcm94eS9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCJcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xuICBjb25zdCB1cmwgPSByZXF1ZXN0Lm5leHRVcmwuc2VhcmNoUGFyYW1zLmdldChcInVybFwiKVxuICBcbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gbmV3IE5leHRSZXNwb25zZShcIlVSTCBwYXJhbWV0ZXIgaXMgcmVxdWlyZWRcIiwgeyBzdGF0dXM6IDQwMCB9KVxuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybClcbiAgICBcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBmZXRjaCB2aWRlbzogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApXG4gICAgfVxuXG4gICAgLy8gR2V0IHRoZSBjb250ZW50IHR5cGUgZnJvbSB0aGUgcmVzcG9uc2VcbiAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpIHx8IFwidmlkZW8vbXA0XCJcblxuICAgIC8vIENyZWF0ZSBhIG5ldyByZXNwb25zZSB3aXRoIHRoZSB2aWRlbyBkYXRhXG4gICAgY29uc3QgdmlkZW9EYXRhID0gYXdhaXQgcmVzcG9uc2UuYXJyYXlCdWZmZXIoKVxuICAgIFxuICAgIHJldHVybiBuZXcgTmV4dFJlc3BvbnNlKHZpZGVvRGF0YSwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBjb250ZW50VHlwZSxcbiAgICAgICAgXCJDb250ZW50LUxlbmd0aFwiOiB2aWRlb0RhdGEuYnl0ZUxlbmd0aC50b1N0cmluZygpLFxuICAgICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiOiBcIipcIixcbiAgICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzXCI6IFwiR0VULCBPUFRJT05TXCIsXG4gICAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiOiBcIkNvbnRlbnQtVHlwZVwiLFxuICAgICAgfSxcbiAgICB9KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJQcm94eSBlcnJvcjpcIiwgZXJyb3IpXG4gICAgcmV0dXJuIG5ldyBOZXh0UmVzcG9uc2UoXCJGYWlsZWQgdG8gZmV0Y2ggdmlkZW9cIiwgeyBzdGF0dXM6IDUwMCB9KVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBPUFRJT05TKCkge1xuICByZXR1cm4gbmV3IE5leHRSZXNwb25zZShudWxsLCB7XG4gICAgaGVhZGVyczoge1xuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCIqXCIsXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIjogXCJHRVQsIE9QVElPTlNcIixcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiOiBcIkNvbnRlbnQtVHlwZVwiLFxuICAgIH0sXG4gIH0pXG59ICJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJHRVQiLCJyZXF1ZXN0IiwidXJsIiwibmV4dFVybCIsInNlYXJjaFBhcmFtcyIsImdldCIsInN0YXR1cyIsInJlc3BvbnNlIiwiZmV0Y2giLCJvayIsIkVycm9yIiwic3RhdHVzVGV4dCIsImNvbnRlbnRUeXBlIiwiaGVhZGVycyIsInZpZGVvRGF0YSIsImFycmF5QnVmZmVyIiwiYnl0ZUxlbmd0aCIsInRvU3RyaW5nIiwiZXJyb3IiLCJjb25zb2xlIiwiT1BUSU9OUyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/proxy/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fproxy%2Froute&page=%2Fapi%2Fproxy%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fproxy%2Froute.ts&appDir=%2FUsers%2Fheitor.candido%2FDocuments%2Fiptv%2Fiptv-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fheitor.candido%2FDocuments%2Fiptv%2Fiptv-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fproxy%2Froute&page=%2Fapi%2Fproxy%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fproxy%2Froute.ts&appDir=%2FUsers%2Fheitor.candido%2FDocuments%2Fiptv%2Fiptv-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fheitor.candido%2FDocuments%2Fiptv%2Fiptv-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_heitor_candido_Documents_iptv_iptv_app_app_api_proxy_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/proxy/route.ts */ \"(rsc)/./app/api/proxy/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/proxy/route\",\n        pathname: \"/api/proxy\",\n        filename: \"route\",\n        bundlePath: \"app/api/proxy/route\"\n    },\n    resolvedPagePath: \"/Users/heitor.candido/Documents/iptv/iptv-app/app/api/proxy/route.ts\",\n    nextConfigOutput,\n    userland: _Users_heitor_candido_Documents_iptv_iptv_app_app_api_proxy_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZwcm94eSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGcHJveHklMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZwcm94eSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmhlaXRvci5jYW5kaWRvJTJGRG9jdW1lbnRzJTJGaXB0diUyRmlwdHYtYXBwJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmhlaXRvci5jYW5kaWRvJTJGRG9jdW1lbnRzJTJGaXB0diUyRmlwdHYtYXBwJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNvQjtBQUNqRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2hlaXRvci5jYW5kaWRvL0RvY3VtZW50cy9pcHR2L2lwdHYtYXBwL2FwcC9hcGkvcHJveHkvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3Byb3h5L3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcHJveHlcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3Byb3h5L3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2hlaXRvci5jYW5kaWRvL0RvY3VtZW50cy9pcHR2L2lwdHYtYXBwL2FwcC9hcGkvcHJveHkvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fproxy%2Froute&page=%2Fapi%2Fproxy%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fproxy%2Froute.ts&appDir=%2FUsers%2Fheitor.candido%2FDocuments%2Fiptv%2Fiptv-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fheitor.candido%2FDocuments%2Fiptv%2Fiptv-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fproxy%2Froute&page=%2Fapi%2Fproxy%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fproxy%2Froute.ts&appDir=%2FUsers%2Fheitor.candido%2FDocuments%2Fiptv%2Fiptv-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fheitor.candido%2FDocuments%2Fiptv%2Fiptv-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();