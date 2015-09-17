# runstats
Runstats collects and shows general data from several races.
Nowadays running and other competitive sports are becoming an important part of our lives.
The number and frequency of races are increasing as well as the number of participants.
Different kind of people are starting running and traininig,
joining races and checking their improvement with tracking devices.
In addition, most of the races use provide devices and other
trackers and they have a reliable way of measuring the data of each participant.

You can see runstats runing on heroku [here](http://runstatsclient.herokuapp.com/).

# Installing
This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
(version 0.12.0)

## Webapp

The webapp is builded using [gruntjs](http://gruntjs.com/). It requires [nodejs](https://nodejs.org/) for working.
By the operating system you only have to install nodejs, in Ubuntu/Debian:

```
sudo aptitude install nodejs npm
```

Now the rest of the packets could be installed via __npm__:

```
npm install
```

And then, with Bower install download and install the required libraries by the project:

```
bower install
```

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Developing

It is recomended install the [yo angular generator](https://github.com/yeoman/generator-angular):

```
npm install -g yo generator-karma generator-angular
```

# What is next?
Runstats is now under development. I still have lots of things to do and thousands of bugs to fix.

Here is a list of short/mid term tasks that I have planed:

- Fix land page for small device. Responsive design.
- Show interactive help indicating what is what.
- Fix bars and lines on histogram chart.
- Update the database with more circuits.
- Fix the json schema and solve some bugs in the parser.
- Fix build grunt. Some dependencies are not well treated.
- Add support for updating the database, specially when adding new fields.
- Update formulas for radar visualization
- Add dates to the races.
- Make a web parser for sports maniacs.
- Show data for each race independently: Teams and participants.
- Error and status messages for the server.
- Code doc.
- Cookies.
- Add circuit view.
	- Graphic bar: distance, participants, average speed, max_speed...
	- Evolution of larger teams.
- Filter and sort races.


In the long run, I want to work with the runner view:

- Select by circuit and id.
- Evolution during the circuit: Abs position, Rel position, pace.
- Stats (radar): average pace, best paces, regularity, average/best relative position.
- Runners comparator.
	
