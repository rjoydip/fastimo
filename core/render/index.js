"use strict";

const { join } = require("path");
const { readFile } = require("fs");
const fp = require("fastify-plugin");
const ejs = require("ejs");

function render(fastify, opts, done) {
  let { charset } = opts;
  charset = charset || "utf-8";

  function $render(res, mod, data, opt = {}, callback) {
    let $callback = callback;

    if (typeof opt === "function") {
      $callback = opt;
    }

    readFile(join(fastify.config.modules[mod].view, `${mod}.ejs`), charset, (err, html) => {
      if (err) {
        return res.send(err);
      }

      const compiled = ejs.render(html, data, opt);

      if ($callback) {
        return callback(compiled);
      }

      return res.send(compiled);
    });
  }

  fastify.decorate("render", $render);
  done();
}

module.exports = fp(render, {
  name: module.require("./package").name,
});