import { Network } from 'vis-network';
import { createTooltipHTML } from './tooltip';
import { escapeHTML } from './utilities';
import './styles/main.css';

function isTextCellNotEmpty(c) {
  return (c.qText && !(c.qIsNull || c.qText.trim() == ''));
}

function getColor (index, colors) {
  return colors[index % colors.length];
}

export default function paint ( { element,layout, theme, component } ) {
  return new Promise((resolve) => {
    const colorScale = theme.getDataColorPalettes()[0];
    const numDimensions = layout.qHyperCube.qDimensionInfo.length;
    const numMeasures = layout.qHyperCube.qMeasureInfo.length;

    var qData = layout.qHyperCube.qDataPages[0],
      id = layout.qInfo.qId,
      containerId = 'network-container_' + id;

    if(qData && qData.qMatrix) {
      element.textContent = '';
      const topDiv = document.createElement("div");
      topDiv.setAttribute('id', containerId);
      topDiv.classList.add('sn-network-top');
      component.inEditState() && topDiv.classList.add('is-edit-mode');
      element.append(topDiv);

      var dataSet = qData.qMatrix.map(function(e){
        const nodeName = e[1].qText;
        let groupNumber;

        const dataItem = {
          id: e[0].qText,
          eNum: e[0].qElemNumber,
          label: nodeName,
          parentid : e[2].qText
        };

        if(numDimensions === 4) {
          groupNumber = e[3].qText;
          dataItem.group = groupNumber;
        }

        // optional measures set
        if (numMeasures > 0) {
          const tooltip = e[numDimensions];

          if (isTextCellNotEmpty(tooltip)) {
            const tooltipText = tooltip.qText;
            dataItem.title = escapeHTML(tooltipText);
          } else if(numMeasures > 1) {
            // This part is a bit fishy and should be tested
            const nodeMeasure = e[numDimensions+1].qText;
            dataItem.title = createTooltipHTML({
              name: nodeName,
              groupNumber,
              nodeMeasure
            });
          }
        }

        if (numMeasures > 1) {
          if (e[numDimensions+1].qNum) {
            // node value - to scale node shape size
            dataItem.nodeValue = e[numDimensions+1].qNum;
          }
        }

        if (numMeasures > 2) {
          if (e[numDimensions+2].qNum) {
            // edge value - to scale edge width
            dataItem.edgeValue = e[numDimensions+2].qNum;
          }
        }

        return dataItem;
      });

      // Require 2 arrays :  nodes and edges -  nodes array must be unique values of IDs !
      var uniqueId = [];
      var nodes = [];
      var edges = [];
      const groups = {};

      for(let i = 0; i< dataSet.length; i++){
        if (layout.displayEdgeLabel && dataSet[i].edgeValue !== undefined) {
          edges.push({
            "from":dataSet[i].id,
            "to":dataSet[i].parentid,
            "value":dataSet[i].edgeValue,
            "label": `${dataSet[i].edgeValue}`
          }); // with labels
        } else {
          edges.push({
            "from":dataSet[i].id,
            "to":dataSet[i].parentid,
            "value":dataSet[i].edgeValue
          }); // create edges
        }

        // process uniqueness
        if(uniqueId.indexOf(dataSet[i].id) === -1) {
          uniqueId.push(dataSet[i].id);

          var nodeItem = {
            id: dataSet[i].id,
            eNum: dataSet[i].eNum,
            label: dataSet[i].label,
            title: dataSet[i].title,
            group: dataSet[i].group,
            value: dataSet[i].nodeValue
          };
          nodes.push(nodeItem); // create node
          groups[nodeItem.group] = {};
        }
      }
      const colors = colorScale.colors[Math.min(Object.keys(groups).length-1, colorScale.colors.length-1)];

      Object.keys(groups).forEach(function(g,i) {
        groups[g].color = getColor(i, colors);
      });

      // create dataset for \\
      var data = {
        nodes: nodes,
        edges: edges
      };

      // create a network
      var container = document.getElementById(containerId);

      var options = {
        groups: groups,
        layout: {
          randomSeed: "0.6610209392878246:1631081903504"
        },
        nodes: {
          shape:layout.nodeShape,
          shadow:layout.shadowMode
        },
        edges: {
          shadow:layout.shadowMode,
          font: {
            align: layout.posEdgeLabel
          },
          smooth: {
            type: layout.edgeType
          }
        },
        interaction: {
          hideEdgesOnDrag: true,
          tooltipDelay: 100
        },
        physics: {
          forceAtlas2Based: {
            gravitationalConstant: -100,
            centralGravity: 0.005,
            springLength: 230,
            springConstant: 0.18
          },
          maxVelocity: 146,
          solver: 'forceAtlas2Based',
          timestep: 0.35,
          stabilization: { iterations: 150 }
        }
      };
      var network = new Network(container, data, options);
      network.fit();
      network.on('select', function (properties) {
        if (Object.prototype.hasOwnProperty.call(properties, "nodes") && component.options.noInteraction !== true) {
          if (properties.nodes.length > 0) {
            // find connected nodes to selection
            var connectedNodes = network.getConnectedNodes(properties.nodes[0]);
            // append node to the array
            connectedNodes.push(properties.nodes[0]);
            const toSelect = [];
            connectedNodes.forEach(function(node) {
              var id;
              data.nodes.forEach(function(dataNode) {
                // Find match, ignore null
                if(dataNode.id === node && node !== "-") {
                  id = dataNode.eNum;
                }
              });
              if(id !== undefined) {
                // Remove duplicates
                toSelect.indexOf(id) === -1 && toSelect.push(id);
              }
            });
            //Make the selections
            component.backendApi.selectValues(0,toSelect,false);
          }
        }
      });

      network.on('stabilizationIterationsDone', function() {
        resolve(network);
      });
    } else {
      resolve();
    }
  });
}
