> **Warning** This repository is now archived and will not be updated

> This repository was originally published to foster collaboration and engagement with developers as they customized or developed visualizations, but due to customer feedback and usage data, it is now moved back to closed source. Moving this and other projects back to closed source will support better integration with internal build and test tooling, and free up resources for investment in these and other visualizations.


# sn-network-chart

A network chart to be used with nebula.js, built using [visjs network visualization](https://github.com/visjs/vis-network) to display networks of nodes and edges.

## Requirements

Requires `@nebula.js/stardust` version `1.7.0` or later.

## Installing

If you use npm: `npm install @nebula.js/sn-network-chart`.

You can also load through the script tag directly from [https://unpkg.com](https://unpkg.com/@nebula.js/sn-network-chart).

## Usage

```js
import { embed } from '@nebula.js/stardust';
import network from '@nebula.js/sn-network-chart';

// 'app' is an enigma app model
const nuked = embed(app, {
  types: [
    {
      // register grid chart - qlik-network-chart is the default name in sense
      name: 'qlik-network-chart',
      load: () => Promise.resolve(network),
    },
  ],
});

// Rendering a simple network chart
nuked.render({
  element: document.querySelector('.network'),
  type: 'qlik-network-chart',
  fields: ['Source', 'Target', '=Sum(Flow)'],
  properties: {
    title: 'Visualization of network flows',
  },
});
```

## Data sample

Check `resources/Network data.xlsx` for an example. The simplest data form is where each row represents an edge in the network. Take this example of airport connections:

| AirportID | AirportName    | LinkToId | Volume |
|-----------|----------------|----------|--------|
| 0         | Soekarno-Hatta | 3        | 23000  |
| 1         | Halim          | 0        | 5460   |
| 2         | Changi         | 0        | 10870  |
| 3         | KLCC           | 1        | 2780   |
| 4         | Don Muang      | 1        | 4800   |
| 4         | Don Muang      | 2        | 7800   |

Sense inline load script example:

```
Load * Inline [
AirportID, AirportName, LinktoID,Volume
0,Soekarno-Hatta,3,23000
1,Halim,0,5460
2,Changi,0,10870
3,KLCC,1,2780
4,Don Muang,1,4800
4,Don Muang,2,7800
];
```

# Original Author
**Michael Laenen**
* [github.com/miclae76](https://github.com/miclae76)

# Contributors
**Göran Sander**
* [github.com/mountaindude](https://github.com/mountaindude)
