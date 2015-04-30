"use strict"
;(function () {
  
  var transTime = 500,
      pi = Math.PI,
      PIPI = pi * 2,
      HALFPI = pi / 2,
      baseColor = [90, 90, 255]
  
  var data = {
    entity: [],
    transTime: 0
  }
  
  var Triangles = (function () {
    
    function draw () {
      this.update().print()
    }
    
    function append (path) {
      this.entity.push({
        path: path,
        targetPath: path,
        color: baseColor,
        targetColor: baseColor,
        speed: []
      })
    }
    
    function _getDistance (p1, p2) {
      return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))
    }
    
    function _getDir (p1, p2) {
      var dir = 0
      if (p2[1] - p1[1] === 0) {
        if (p2[0] - p1[0] > 0) {
          dir = HALFPI
        } else {
          dir = -HALFPI
        }
      } else if (p2[0] - p1[0] === 0) {
        if (p2[1] - p1[1] > 0) {
          dir = 0
        } else {
          dir = pi
        }
      } else {
        dir = Math.atan((p2[0] - p1[0]) / (p2[1] - p1[1]))
        if (p2[0] - p1[0] > 0 && p2[1] - p1[1] > 0) {
          dir = dir
        } else if (p2[0] - p1[0] < 0 && p2[1] - p1[1] < 0) {
          dir = pi + dir
        } else if (p2[0] - p1[0] > 0 && p2[1] - p1[1] < 0) {
          dir = pi + dir
        } else {
          dir = dir
        }
        //console.log(360/PIPI * dir)
      }
      return dir
    }
    
    function trans (targets) {
      var arr = this.entity
      targets.map(function (v, i) {
        var p = v.path,
            c = v.color,
            speedArray = [],
            dirArray = [],
            colorSpeedArray = [],
            speed = 0
        arr[i].targetPath = p
        arr[i].targetColor = c
        arr[i].path.map(function (x, j) {
          speed = _getDistance(x, p[j]) / transTime
          speedArray.push(speed)
          dirArray.push(_getDir(x, p[j]))
        })
        arr[i].color.map(function (x, j) {
          speed = (c[j] - x) / transTime
          colorSpeedArray.push(speed)
        })
        arr[i].dir = dirArray
        arr[i].speed = speedArray
        arr[i].colorSpeed = colorSpeedArray
      })
      this.transTime = transTime
    }
    
    var printer = new Printer(null, function (sprite) {
      var arr = sprite.entity,
          ctx = sprite.ctx
      arr.map(function (v, i) {
        if (v.path.length) {
          var path = v.path,
              x1 = path[0],
              x2 = path[1],
              x3 = path[2]
          ctx.fillStyle = 'rgb(' + parseInt(v.color[0]) + ', ' + parseInt(v.color[1]) + ', ' + parseInt(v.color[2]) + ')'
          //RGB里面数字带小数点貌似不行啊...
          ctx.beginPath()
          ctx.moveTo(x1[0], x1[1])
          ctx.lineTo(x2[0], x2[1])
          ctx.lineTo(x3[0], x3[1])
          ctx.closePath()
          ctx.stroke()
          ctx.fill()
        }
      })
    })
    
    var update = new Behave(function (sprite) {
      var t = +new Date(),
          arr = sprite.entity,
          deltaTime = 0
      if (!sprite.now) {sprite.now = t; return}
      deltaTime = t - sprite.now
      if (sprite.transTime > 0) {
        sprite.transTime -= deltaTime
        arr.map(function (v, i) {
          var path = v.path,
              color = v.color,
              speed = v.speed,
              colorSpeed = v.colorSpeed,
              dir = v.dir,
              color = v.color
          path.map(function (x, j) {
            path[j][0] += deltaTime * speed[j] * Math.sin(dir[j])
            path[j][1] += deltaTime * speed[j] * Math.cos(dir[j])
          })
          color.map(function (x, j) {
            color[j] += deltaTime * colorSpeed[j]
          })
        })
      } else {
        if (arr[0] && arr[0].targetPath && arr[0].targetPath.length) {
          arr.map(function (v, i) {
            v.path = v.targetPath.slice(0)
            v.color = v.targetColor.slice(0)
          })
        }
      }
      sprite.now = t
    })
    
    return function (ctx) {
      var triangle =  new Sprite('triangle', printer, [update]).extend(data)
      triangle.ctx = ctx || document.getElementById('canvas').getContext('2d')
      triangle.draw = draw
      triangle.append = append
      triangle.trans = trans
      return triangle
    }
    
  }())
  
  if(typeof define === 'function' && define.amd) {
		define([], function () {
			return Triangles
		})
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Triangles
	} else {
		window.Triangles = Triangles
	}
  
}())