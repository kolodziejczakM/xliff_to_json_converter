#! /usr/bin/env node

/*
 * MIT License
 *
 * Copyright (c) 2017 Marcin Kołodziejczak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @fileOverview Script converts .xliff file to .json equivalent.
 * It takes only <source> and <target> tags into account.
 * @author <a href="mailto:kolodziejczak.mn@gmail.com">Marcin Kołodziejczak</a>
 * @example node <thisScriptName.js> <inputFile.xliff> <outputFile.json>
 */

const fs = require('fs'),
    Parser = require('xmldom').DOMParser,
    inputFile = process.argv[2],
    outputFile = process.argv[3];

main();

function main() {
    if(!inputFile || !outputFile) {
        process.stdout.write(
            `\x1b[31m ERROR: You must specify input and output file. \x1b[0m
            Example: node thisScriptName.js input.xliff output.json \n`
        );
    }

    fs.readFile(inputFile, (err, xmlContent) => {
        if (err) {
            throw err;
        }

        createOutputJSON(
            generateJSONContent(
                getTranslationNodes(xmlContent)
            )
        );
    });
}

/**
 * @param {String} JSON file content
 */
function createOutputJSON(content) {
    fs.writeFile(outputFile, content, (err) => {
        if (err) {
            throw err
        };

        process.stdout.write(`\x1b[32m Your translation file '${outputFile}' has been created. \x1b[0m \n`)
    });
}

/**
 * @param {Buffer} xmlContent Xliff source file
 * @returns {Object} Contains all relevant translation nodes
 */
function getTranslationNodes(xmlContent) {
    const xmlDoc = new Parser().parseFromString(xmlContent.toString());
    const [ sourceNodes, targetNodes ] = [ xmlDoc.getElementsByTagName('source'), xmlDoc.getElementsByTagName('target') ];

    return { sourceNodes, targetNodes };
}

/**
 * @param {Object} translationNodes Contains source and target nodes
 * @returns {String} Valid JSON
 */
function generateJSONContent(translationNodes) {
    const { sourceNodes, targetNodes } = translationNodes;

    const content = Array.from(sourceNodes).map((nodeElement, idx) => {
        return createTranslationEntity(
            nodeElement.childNodes[0].nodeValue,
            targetNodes[idx].childNodes[0].nodeValue
        );
    });

    return JSON.stringify(content);
}

/**
 * @param {String} source Translation key
 * @param {String} target Translation text to display
 * @returns {Object}
 */
function createTranslationEntity(source, target) {
    return { source, target };
}
