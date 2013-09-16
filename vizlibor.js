(function(){
    /* global d3 */
    "use strict";
    var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    MAX_BANK_RADIUS=50,

    parseDate = d3.time.format("%d/%m/%Y").parse,

    x = d3.time.scale()
        .range([0, width]),
    y = d3.scale.linear()
        .range([height, 0]),

    color = d3.scale.category10(),

    xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom"),

    yAxis = d3.svg.axis()
        .scale(y)
        .orient("left"),

    line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.rate); }),

    svg = d3.select("#viz").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/libor_data_3M.csv", function(error, data) {
        var k, i, aggregateTheft = {}, resetAggregateTheft;
        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
        data.forEach(function(d) {
            d.date = parseDate(d.date);
        });

        resetAggregateTheft = function(){
            for(var k in data[0]){
                if(k !== 'date'){ aggregateTheft[k] = 0.0;}
            }
        };
        resetAggregateTheft();

        var banks = color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {date: d.date, rate: +d[name]};
                })
            };
        });

        x.domain(d3.extent(data, function(d) { return d.date; }));

        y.domain([
            d3.min(banks, function(c) { return d3.min(c.values, function(v) { return v.rate; }); }),
            d3.max(banks, function(c) { return d3.max(c.values, function(v) { return v.rate; }); })
        ]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Dollar rate");

        var bank = svg.selectAll(".bank")
            .data(banks)
            .enter().append("g")
            .attr("class", "bank");
        
        var node = svg.selectAll(".node")
            .data(banks)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d,i){return "translate(" + 50 + "," + i*MAX_BANK_RADIUS + ")";});

        node.append("circle")
            .attr("r", 4.5);

        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });
        
        bank.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.name); });

        bank.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.rate) + ")"; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });
        
      line = svg.append("svg:line")
            .style('stroke', '#00e')
            .attr('y1', 0)
            .attr('y2', height);

        var reposition = function(index){
            var k, currentRate = data[index]['FIX - USD'],
            RADIUS_WEIGHTING = 5.0;
            
            if(index === 0){
                resetAggregateTheft();
            }
            line.attr('x1', x(data[index].date))
                .attr('x2', x(data[index].date));

            for(k in aggregateTheft){
                aggregateTheft[k] += data[index][k] - currentRate;
            }

            node.select('circle')
                .attr('r', function(d){return RADIUS_WEIGHTING * Math.abs(aggregateTheft[d.name]);})
                .attr('fill', function(d){
                    if(aggregateTheft[d.name] > 0.0){
                        return 'red';
                    }
                    return 'green';
                });
            
        };
                      
        subscribe('tick', reposition);
        reposition(0);
        
        var currentIndex = 0;
        var ticker = function () {
            publish('tick', [currentIndex]);
            currentIndex += 1;
            if (currentIndex === data.length) {
                currentIndex = 0;
                window.setTimeout(ticker, 5000);
            }
            else{
                window.setTimeout(ticker, 10);
            }
            
        };
        
        window.setTimeout(ticker, 25);
    });
})();
