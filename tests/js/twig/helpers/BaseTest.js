global._ = require('lodash');
global.fs = require('fs');
global.util = require('util');
global.path = require('path');
global.assert = require('chai').assert;
global.expect = require('chai').expect;
var Asserter = require('./Asserter');

var php = require('uniter').createEngine('PHP');
php.getStdout().on('data', function (text) { console.log(text); });
php.getStderr().on('data', function (text) {
    console.error('Bang:');
    console.error(text);
});

function BaseTest() {
	this.testsPath = path.resolve(__dirname + '/../../../unit/Jadu/Pulsar/Twig/Extension/');
	this.injectionsPath = path.resolve(__dirname + '/../injections/');
	this.asserter = new Asserter(this);
}

BaseTest.prototype.loadPreInjections = function () {
	var preInjectionsPath = path.resolve(this.injectionsPath + '/pre/');
	var preInjections = fs.readdirSync(preInjectionsPath);

	var loadedPreInjections = {};
	_.each(preInjections, function (injection) {
		var preInjectionPath = path.resolve(preInjectionsPath + '/' + injection);
		loadedPreInjections[injection] = fs.readFileSync(preInjectionPath).toString();
	});

	this.preInjections = loadedPreInjections;
};

BaseTest.prototype.loadPostInjections = function () {
	var postInjectionsPath = path.resolve(this.injectionsPath + '/post/');
	var postInjections = fs.readdirSync(postInjectionsPath);

	var loadedPostInjections = {};
	_.each(postInjections, function (injection) {
		var postInjectionPath = path.resolve(postInjectionsPath + '/' + injection);
		loadedPostInjections[injection] = fs.readFileSync(postInjectionPath).toString();
	});

	this.postInjections = loadedPostInjections;
};

BaseTest.prototype.loadInjections = function () {
	this.loadPreInjections();
	this.loadPostInjections();
};

BaseTest.prototype.rewriteTest = function (test) {
	//Strip out the opening php tag
	test = test.replace(/^[\s]*\<\?php\n/, '');

	var preInjections = '';
	//Inject all pre injections
	_.each(this.preInjections, function (preInjection) {
		preInjections += preInjection;
	});

	test = preInjections + test;

	//Reattach the opening php tag
	test = '<?php\n' + test;

	//Strip the closing brace on the class
	test = test.replace(/}[\s]*$/, '');

	//Inject all post injections
	_.each(this.postInjections, function (postInjection) {
		test += postInjection;
	});

	//Remove namespaces
	test = test.replace('namespace Jadu\\Pulsar\\Twig\\Extension;\n', '');

	return test;
};

BaseTest.prototype.calculateTestsToRun = function (test) {
	//Find tests to run by parsing the PHP file.
	//Uniter does not yet support class reflection.
	var testsToRun = [];
	var testNameRegex = /public function test([\S]*)\(\)/g;
	var testNames;
	while ((testNames = testNameRegex.exec(test)) !== null) {
		var testName = testNames[1];
		testsToRun.push('test' + testName);
	}

	this.testsToRun = testsToRun;
};

BaseTest.prototype.setTestName = function (testName) {
	this.nextTest = testName;
};

BaseTest.prototype.run = function () {
	this.test = this.testName + '.php';

	var testInstance = this;

	this.loadInjections();

	var testPath = path.resolve(this.testsPath + '/' + this.test);
	var test = fs.readFileSync(testPath).toString();

	this.calculateTestsToRun(test);
	test = this.rewriteTest(test);

	php.expose(this.extension, 'javascriptExtension');
	php.expose(this.testName, 'testName');
	php.expose(this.testsToRun, 'tests');
	php.expose(this.testsToRun.length, 'testsCount');
	php.expose(this, 'nameSetter');
	php.expose(this.asserter, 'asserter');

console.log(test);
	describe(this.testName, function () {
		php.execute(test);
	});
}

module.exports = BaseTest;