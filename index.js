// Since we can't bring node's Recoverable Errors to Mongosh, we are bringing
// Mongosh to node's Recoverable errors.

// src: https://github.com/nodejs/node/blob/master/lib/internal/repl/utils.js
const { Parser, tokTypes} = require('acorn');
const staticClassFeatures = require('acorn-static-class-features');
const numericSeparator = require('acorn-numeric-separator');
const privateMethods = require('acorn-private-methods');
const classFields = require('acorn-class-fields');

console.log(isRecoverableError('function x() {'))

// If the error is that we've unexpectedly ended the input,
// then let the user try to recover by adding more input.
// Note: `e` (the original exception) is not used by the current implementation,
// but may be needed in the future.
function isRecoverableError(code) {
  // For similar reasons as `defaultEval`, wrap expressions starting with a
  // curly brace with parenthesis.  Note: only the open parenthesis is added
  // here as the point is to test for potentially valid but incomplete
  // expressions.
  // console.log(/^\s*\{/.test(code))
  if (/^\s*\{/.test(code) && isRecoverableError(`(${code}`)) return true;

  let recoverable = false;

  // Determine if the point of any error raised is at the end of the input.
  // There are two cases to consider:
  //
  //   1.  Any error raised after we have encountered the 'eof' token.
  //       This prevents us from declaring partial tokens (like '2e') as
  //       recoverable.
  //
  //   2.  Three cases where tokens can legally span lines.  This is
  //       template, comment, and strings with a backslash at the end of
  //       the line, indicating a continuation.  Note that we need to look
  //       for the specific errors of 'unterminated' kind (not, for example,
  //       a syntax error in a ${} expression in a template), and the only
  //       way to do that currently is to look at the message.  Should Acorn
  //       change these messages in the future, this will lead to a test
  //       failure, indicating that this code needs to be updated.
  //
  const RecoverableParser = Parser
    .extend(
      privateMethods,
      classFields,
      numericSeparator,
      staticClassFeatures,
      (AcornParser) => {
        return class extends AcornParser {
          readToken(code) {
            console.log('reading token', code);
            //@ts-ignore
            super.readToken();
          }
          nextToken() {
            //@ts-ignore
            console.log(this.type)
            //@ts-ignore
            super.nextToken();
            //@ts-ignore
            if (this.type === tokTypes.eof)
              recoverable = true;
          }
          raise(pos, message) {
            console.log(message)
            switch (message) {
              case 'Unterminated template':
              case 'Unterminated comment':
                recoverable = true;
                break;

              case 'Unterminated string constant':
                //@ts-ignore
                const token = this.input.slice(this.lastTokStart, this.pos);
                // See https://www.ecma-international.org/ecma-262/#sec-line-terminators
                if (/\\(?:\r\n?|\n|\u2028|\u2029)$/.test(token)) {
                  recoverable = true;
                }
            }
            //@ts-ignore
            super.raise(pos, message);
          }
        };
      }
    );

  // Try to parse the code with acorn.  If the parse fails, ignore the acorn
  // error and return the recoverable status.
  try {
    console.log(code)
    RecoverableParser.parse(code, { ecmaVersion: 11 });
    // Odd case: the underlying JS engine (V8, Chakra) rejected this input
    // but Acorn detected no issue.  Presume that additional text won't
    // address this issue.
    return false;
  } catch(e) {
    console.log('recoverable: in catch', recoverable)
    console.log(e)
    return recoverable;
  }
}
