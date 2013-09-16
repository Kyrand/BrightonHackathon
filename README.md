BrightonHackathon
=================

Results of weekend sprint attempting to visualize the 2007-8 banking crisis

## To run

The simplest way to run using Python's simple HTTP server:

    $ python -m SimpleHTTPServer

Then open up your browser and go to http://localhost:8000/index.html

## Visualization

The page shows a multi-line plot using the rather wonderful [D3](http://D3.org) Javascript visualization library. The lines represent stated LIBOR estimates by the banks over the period Jan-2005 to Dec-2008, plotted against the actual rate (in red). As the blue line moves through time, the filled circles on the left represent the aggregate difference between the individual bank estimates and the actual value. Red circles show an over-estimate, green an under. Roughly speaking, the greater these differentials the more money the banks could potential steal.

Over the critical period of 2007-08, Barclay's LIBOR numbers were widely different from the actual figures, allowing them to manipulate the LIBOR rate and make bets on that change. 

For a good summary of the LIBOR scandal, on-going fixes [Matt Taibbi's Rolling Stone](http://www.rollingstone.com/politics/news/everything-is-rigged-the-biggest-financial-scandal-yet-20130425) articles are a pungent, if depressing read

This is a multi-trillion dollar market so even small manipulations can make big money. Conservative estimates put losses to us all in the tens of billions. As usual, no bankers went to prison and business continues pretty much as usual...
