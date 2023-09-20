// import React, { useState, useEffect } from "react";
// import {
//   LookerVisComponent,
//   LookerData,
// } from "@looker/visualizations";
// import ReactFlow, { ReactFlowProvider } from "react-flow";

// const MyVis = (props) => {
//   const [data, setData] = useState([]);
//   const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);

//   useEffect(() => {
//     const lookerData = props.data;

//     // Transform the Looker data into a format that ReactFlow can understand
//     const nodes = lookerData.map((row) => ({
//       id: row.id,
//       data: row,
//     }));
//     const edges = lookerData.map((row) => ({
//       id: `${row.id}-edge`,
//       source: row.parentId,
//       target: row.id,
//     }));

//     setData(lookerData);
//     setNodes(nodes);
//     setEdges(edges);
//   }, [props.data]);

//   return (
//     <ReactFlowProvider>
//       <ReactFlow nodes={nodes} edges={edges} />
//     </ReactFlowProvider>
//   );
// };

// export default LookerVisComponent(MyVis);
import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
} from "reactflow";
import ColorSelectorNode from "./ColorSelectorNode"; // Replace with your custom node component if needed
import { createRoot } from "react-dom/client";

const initBgColor = "#1A192B";

const connectionLineStyle = { stroke: "#fff" };
const snapGrid = [20, 20];
const nodeTypes = {
  selectorNode: ColorSelectorNode, // Replace with your custom node type if needed
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

looker.plugins.visualizations.add({
  options: {
    // Define your visualization options here
  },
  create: function (element, config) {
    element.innerHTML = "<div id='reactflow-container'></div>";
  },

  updateAsync: function (
    data,
    element,
    config,
    queryResponse,
    details,
    doneRendering
  ) {
    const container = document.getElementById("reactflow-container");
    console.log("=============>", data);
    const sampleData = [
      {
        id: "1",
        type: "input",
        data: { label: "An input node" },
        position: { x: 0, y: 50 },
        sourcePosition: "right",
      },
      {
        id: "2",
        type: "selectorNode",
        data: { color: initBgColor },
        style: { border: "1px solid #777", padding: 10 },
        position: { x: 300, y: 50 },
      },
      {
        id: "3",
        type: "output",
        data: { label: "Output A" },
        position: { x: 650, y: 25 },
        targetPosition: "left",
      },
      {
        id: "4",
        type: "output",
        data: { label: "Output B" },
        position: { x: 650, y: 100 },
        targetPosition: "left",
      },
    ];

    const MyVis = () => {
      const [nodes, setNodes, onNodesChange] = useNodesState(sampleData);
      const [edges, setEdges, onEdgesChange] = useEdgesState([]);
      const [bgColor, setBgColor] = useState(initBgColor);

      useEffect(() => {
        const onChange = (event) => {
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id !== "2") {
                return node;
              }

              const color = event.target.value;

              setBgColor(color);

              return {
                ...node,
                data: {
                  ...node.data,
                  color,
                },
              };
            })
          );
        };

        // You can set your edges here if needed.
        // Example:
        // setEdges([
        //   {
        //     id: 'e1-2',
        //     source: '1',
        //     target: '2',
        //     animated: true,
        //     style: { stroke: '#fff' },
        //   },
        //   // Add more edges as needed
        // ]);
      }, []);

      const onConnect = useCallback(
        (params) =>
          setEdges((eds) =>
            addEdge(
              { ...params, animated: true, style: { stroke: "#fff" } },
              eds
            )
          ),
        []
      );

      return (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          style={{ background: bgColor }}
          nodeTypes={nodeTypes}
          connectionLineStyle={connectionLineStyle}
          snapToGrid={true}
          snapGrid={snapGrid}
          defaultViewport={defaultViewport}
          fitView
          attributionPosition="bottom-left"
        >
          <MiniMap
            nodeStrokeColor={(n) => {
              if (n.type === "input") return "#0041d0";
              if (n.type === "selectorNode") return bgColor;
              if (n.type === "output") return "#ff0072";
            }}
            nodeColor={(n) => {
              if (n.type === "selectorNode") return bgColor;
              return "#fff";
            }}
          />
          <Controls />
        </ReactFlow>
      );
    };

    // Use createRoot to render the component
    const root = createRoot(container);
    root.render(<MyVis />);

    doneRendering();
  },
});


