"use strict"
;(function () {
  
  var Sprite = function (name, printer, behaves) {
    this.name = name
    this.printer = printer || {}
    this.behaves = behaves || []
    return this
  }
  
  Sprite.prototype = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    deg: 0,
    cellIndex: 0,
    extend: function (args) {
      var item = ''
      for (item in args) {
        this[item] = args[item]
      }
      return this
    },
    print: function () {
      this.printer.print && this.printer.print(this)
      return this
    },
    update: function () {
      var i = 0,
          l = this.behaves.length
      for (; i < l; i++) {
        this.behaves[i].execute && this.behaves[i].execute(this)
      }
      return this
    }
  }
  
  var Printer = function (context, print) {
    this.ctx = context
    this.print = print
    return this
  }
  
  var Behave = function (execute) {
    this.execute = execute
    return this
  }

  window.Sprite = Sprite
  window.Printer = Printer
  window.Behave = Behave

}())