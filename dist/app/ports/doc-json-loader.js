"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var request = __importStar(require("request"));
var path = __importStar(require("path"));
var os = __importStar(require("os"));
function loadFromPackageSite(_a, cb) {
    var name = _a.name, version = _a.version;
    request.get("http://package.elm-lang.org/packages/" + name + "/" + version + "/docs.json", function (err, _response, body) {
        if (err) {
            cb(null);
        }
        try {
            var parsed = JSON.parse(body);
            cb(parsed);
        }
        catch (e) {
            cb(null);
        }
    });
}
function loadFromElmHome(_a, directory) {
    var name = _a.name, version = _a.version;
    var projectElmJson = path.resolve(directory, 'elm.json');
    var elmVersion = require(projectElmJson)['elm-version'];
    var elmHome = process.env.ELM_HOME || path.resolve(os.homedir(), '.elm');
    var docsJsonPath = path.resolve(elmHome, elmVersion, 'package', name, version, 'docs.json');
    return require(docsJsonPath);
}
function setup(app, directory) {
    app.ports.loadDocsJson.subscribe(function (pointer) {
        var onLoaded = function (json) {
            return app.ports.onDocsJsonLoaded.send({
                dependency: pointer,
                json: json
            });
        };
        try {
            var docs = loadFromElmHome(pointer, directory);
            onLoaded(docs);
        }
        catch (e) {
            loadFromPackageSite(pointer, onLoaded);
        }
    });
}
exports.setup = setup;
