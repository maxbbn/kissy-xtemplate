#!/usr/bin/env node
//noinspection JSUnresolvedFunction,JSUnresolvedVariable
/**
 * Generate xtemplate function by xtemplate file using kissy xtemplate.
 * @author yiminghe@gmail.com
 */
var program = require('commander');
var esprima = require('esprima');
var escodegen = require('escodegen');
var encoding = 'utf-8';

var S = require('../lib/loader'),
    util = require('../lib/util'),
    XTemplateCompiler = require('../lib/xtemplate').XTemplate.Compiler,
    fs = require('fs'),
    path = require('path');

var jshint = '/*jshint quotmark:false, loopfunc:true, ' +
    'indent:false, asi:true, unused:false, boss:true, sub:true*/\n';

var tplTemplate = '' +
    '/*\n' +
    '  Generated by kissy-tpl2mod.' +
    '*/\n' +
    jshint +
    'KISSY.add(function(){\n' +
    'return \'{code}\';\n' +
    '});';

function normalizeSlash(str) {
    return str.replace(/\\/g, '/');
}

function getFunctionName(path) {
    var name = path;
    if (name.indexOf('/') !== -1) {
        name = name.substring(name.lastIndexOf('/') + 1);
    }
    name = name.replace(/[-.]([a-z])/ig, function () {
        return arguments[1].toUpperCase();
    });
    name = name.replace(/\..+$/, '');
    return name;
}

function myJsBeautify(str) {
    try {
        return escodegen.generate(esprima.parse(str));
    } catch (e) {
        console.log('syntax error: ');
        console.log(str);
        throw e;
    }
}

function getCompileModule(tplFilePath, tplName, wrap) {
    var tplContent = fs.readFileSync(tplFilePath, encoding);
    var functionName = getFunctionName(tplName);
    return '/** Compiled By kissy-xtemplate */\n' +
        jshint +
        myJsBeautify((wrap ? 'KISSY.add(function(S,require,exports,module){\n' : '') +
            'var ' + functionName + ' = ' +
            XTemplateCompiler.compileToStr(tplContent, tplName, true) + ';\n' +
            functionName + '.TPL_NAME = module.name;\n' +
            functionName + '.version = "' + S.version + '";\n' +
            'module.exports = ' + functionName + ';\n' +
            (wrap ? '});' : ''));
}

exports.getCompileModule = getCompileModule;
exports.getFunctionName = getFunctionName;
exports.compile = function(tplContent, tplName, wrap){
    var functionName = getFunctionName(tplName);
    return '/** Compiled By KISSY-XTemplate 5.0.0-alpha.3 */\n' +
        jshint +
        myJsBeautify((wrap ? 'KISSY.add(function(S,require,exports,module){\n' : '') +
            'var ' + functionName + ' = ' +
            XTemplateCompiler.compileToStr(tplContent, tplName, true) + ';\n' +
            functionName + '.TPL_NAME = module.name;\n' +
            functionName + '.version = "' + S.version + '";\n' +
            'module.exports = ' + functionName + ';\n' +
            (wrap ? '});' : ''));
};