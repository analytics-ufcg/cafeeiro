var errorBar = {
  enter: function (self, storage, className, data, callbacks) {
    var insertionPoint = xChart.visutils.getInsertionPoint(9),
      container,
      // Map each error bar into 3 points, so it's easier to draw as a single path
      // Converts each point to a triplet with y from (y - e) to (y + e)
      // It would be better to use the `preUpdateScale` method here,
      // but for this quick example, we're taking a shortcut :)
      eData = data.map(function (d) {
        d.data = d.data.map(function (d) {
          return [{x: d.x, y: d.y - d.e}, {x: d.x, y: d.y}, {x: d.x, y: d.y + d.e}];
        });
        return d;
      }),
      paths;

    // It's always a good idea to create containers for sets
    container = self._g.selectAll('.errorLine' + className)
      .data(eData, function (d) {
        return d.className;
      });

    // The insertionPoint is a special method that helps us insert this
    // vis at a particular z-index
    // In this case, we've chosen the highest point (above everything else)
    container.enter().insert('g', insertionPoint)
      .attr('class', function (d, i) {
        return 'errorLine' + className.replace(/\./g, ' ') +
          ' color' + i;
      });

    // Tell each path about its data
    // and ensure we reuse any previously drawn item
    paths = container.selectAll('path')
      .data(function (d) {
        return d.data;
      }, function (d) {
        return d[0].x;
      });

    paths.enter().insert('path')
      .style('opacity', 0)
      .attr('d', d3.svg.line()
        .x(function (d) {
          // We offset by half the rangeBand, because this is a bar chart
          return self.xScale(d.x) + self.xScale.rangeBand() / 2;
        })
        .y(function (d) { return self.yScale(d.y); })
      );

    storage.containers = container;
    storage.paths = paths;
  },
  update: function (self, storage, timing) {
    // This is mostly duplication to the d3.svg.line from the enter() method
    storage.paths.transition().duration(timing)
      .style('opacity', 1)
      .attr('d', d3.svg.line()
        .x(function (d) {
          return self.xScale(d.x) + self.xScale.rangeBand() / 2;
        })
        .y(function (d) { return self.yScale(d.y); })
      );
  },
  exit: function (self, storage, timing) {
    storage.paths.exit()
      .transition().duration(timing)
      .style('opacity', 0);
  },
  destroy: function (self, storage, timing) {
    storage.paths.transition().duration(timing)
      .style('opacity', 0)
      .remove();
  }
};

var data = {
    "xScale": "ordinal",
    "yScale": "linear",
    "main": [
      {
        "className": ".errorExample",
        "data": [
          {
            "x": "Ponies",
            "y": 12
          },
          {
            "x": "Unicorns",
            "y": 23
          },
          {
            "x": "Trolls",
            "y": 1
          }
        ]
      }
    ],
    "comp": [
      {
        "type": "error",
        "className": ".comp.errorBar",
        "data": [
          {
            "x": "Ponies",
            "y": 12,
            "e": 5
          },
          {
            "x": "Unicorns",
            "y": 23,
            "e": 2
          },
          {
            "x": "Trolls",
            "y": 1,
            "e": 1
          }
        ]
      }
    ]
  };