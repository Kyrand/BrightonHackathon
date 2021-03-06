(function(){
    /* global d3 */
    "use strict";
    var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 860 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    MAX_BANK_RADIUS=30,

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
            .attr("transform", function(d,i){return "translate(" + width/2 + "," + i*MAX_BANK_RADIUS + ")";});

        node.append("circle")
            .attr("r", 4.5);

        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });

        node.append("line")
            .attr("stroke", function(d) { return color(d.name); })
            .attr("x1", -40)
            .attr("x2", -20);
        
        bank.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.name); });

        // bank.append("text")
        //     .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        //     .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.rate) + ")"; })
        //     .attr("x", 3)
        //     .attr("dy", ".35em")
        //     .text(function(d) { return d.name; });
        
      var time_line = svg.append("svg:line")
            .style('stroke', '#00e')
            .attr('y1', 0)
            .attr('y2', height),

       time_line_messages = [
            {date: new Date('01-01-2005'), text: 'Between January 2005 and June 2009, Barclays derivatives traders made a total of 257 requests to fix Libor and Euribor rates, according to a report by the FSA.</p><p>One Barclays trader told a trader from another bank in relation to three-month dollar Libor: "duuuude... what\'s up with ur guys 34.5 3m fix... tell him to get it up!".'
            },
            {date: new Date('05-01-2007'), text: "At the onset of the financial crisis in September 2007 with the collapse of Northern Rock, liquidity concerns drew public scrutiny towards Libor. Barclays manipulated Libor submissions to give a healthier picture of the bank's credit quality and its ability to raise funds. A lower submission would deflect concerns it had problems borrowing cash from the markets."},
            {date: new Date('11-28-2007'), text: 'On 28 November, a senior submitter at Barclays wrote in an internal email that "Libors are not reflecting the true cost of money", according to the FSA.</p><p>In early December, the CFTC said that the Barclays employee responsible for submitting the bank\'s dollar Libor rates contacted it to complain that Barclays was not setting "honest" rates.'},
            // {date: new Date('12-10-2007'), text: 'In early December, the CFTC said that the Barclays employee responsible for submitting the bank\'s dollar Libor rates contacted it to complain that Barclays was not setting "honest" rates.'},
            {date: new Date('04-01-2008'), text: 'In April the New York Fed queries a Barclays employee over Libor reporting.</p><p>The Wall Street Journal publishes the first article questioning the integrity of Libor.</p>'},
            // {date: new Date('05-01-2008'), text: 'The Wall Street Journal publishes the first article questioning the integrity of Libor.'},
           {date: new Date('07-01-2008'), text:  "Following the WSJ report, Barclays is contacted by the British Bankers' Association over concerns about the accuracy of its Libor submissions.</p><p>Later in the year, the Fed meets to begin inquiry. Fed boss Tim Geithner gives Bank of England governor Sir Mervyn King a note listing proposals to tackle Libor problems."},
           {date: new Date('01-01-2012'), text: ''}
       ],
        time_line_index = 0;
        
        var reposition = function(index){
            var msg, k, currentRate = data[index]['FIX - USD'],
            RADIUS_WEIGHTING = 5.0, d = data[index];
            
            if(index === 0){
                resetAggregateTheft();
                time_line_index = 0;
            }

            msg = time_line_messages[time_line_index];
            if(d.date > msg.date){
                time_line_index++;
                $('#message-box').html('<p>' + msg.text + '</p>').hide().fadeIn(2000);
            }
             
            time_line.attr('x1', x(d.date))
                .attr('x2', x(d.date))
                .transition(100);

            for(k in aggregateTheft){
                aggregateTheft[k] += d[k] - currentRate;
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
                window.setTimeout(ticker, 100);
            }
            
        };
        
        window.setTimeout(ticker, 25);
    });
})();
