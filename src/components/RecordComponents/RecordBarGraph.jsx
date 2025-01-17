/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Box } from '@mui/material';
import Chart from 'chart.js/auto';
import { useEffect, useState } from 'react';
import externalTooltipHandler from '../BarGraphToolTip';

// type RunStatistics = Array<{
//   count: number;
//   date: string;
//   totalDistanceOfTerm: number;
//   totalTimeOfTerm: number;
//   averagePaceOfTerm: number;
// }>;
const RecordBarGraph = ({ graphProps, getPickedDayRecords, index }) => {
  const [graph, setGraph] = useState();
  useEffect(() => {
    const barGraphCtx = document.getElementById('barGraph');
    const barGraph = new Chart(barGraphCtx, {
      type: 'bar',
      data: {
        labels: graphProps.map((item) => new Date(item.date).getDate()),
        datasets: [
          {
            label: '',
            data: graphProps.map((item) => item.totalDistanceOfTerm),
            backgroundColor: '#C4C4C4',
            fill: true,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: '#fff',
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                fontColor: '#fff',
              },
            },
          ],
        },
        scales: {
          x: {
            grid: {
              borderWidth: 0,
              display: false,
            },
          },
          y: {
            grid: {
              borderWidth: 0,
              borderColor: 'rgba(0,0,0,0)',
            },
          },
        },

        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
            external: externalTooltipHandler,
          },
        },
        responsive: true,
        title: {
          display: true,
          text: '막대 차트 테스트',
        },
        hoverBackgroundColor: '#1162FF',
        barThickness: '10',
      },
    });
    barGraphCtx.addEventListener(
      'click',
      function (evt, elem) {
        const points = barGraph.getElementsAtEventForMode(
          evt,
          'nearest',
          { intersect: true },
          true,
        );
        if (points.length) {
          const firstPoint = points[0];
          const label = barGraph.data.labels[firstPoint.index];
          // const value = barGraph.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
          getPickedDayRecords(label);
        }
      },
      false,
    );
    setGraph(barGraph);
    return () => {
      barGraph.reset();
    };
  }, []);

  useEffect(() => {
    if (graph) {
      graph.reset();
      graph.data.labels = graphProps.map((item) => new Date(item.date).getDate());
      (graph.data.datasets.data = graphProps.map((item) => item.totalDistanceOfTerm)),
        (graph.data.datasets[0].backgroundColor = graphProps.map((item) =>
          item.active ? '#1126ff' : '#C4C4C4',
        ));
      graph.options.animation = false;
      graph.update();
    }
  }, [graphProps, graph]);

  return (
    <Box css={barGraphWrapper}>
      <Box css={graphBorder} />
      <div id={'barGraphDiv'}>
        <canvas css={barGraphStyle()} id="barGraph"></canvas>
      </div>
      <Box css={axis()}>
        <Box>km</Box>
        <Box>일</Box>
      </Box>
    </Box>
  );
};

export default RecordBarGraph;

const barGraphWrapper = css`
  box-sizing: border-box;
  margin: auto;
  padding: 0px 9px 0px 9px;
`;

const barGraphStyle = () => css`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`;

const axis = () => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  line-height: 12px;
  position: relative;
  flex-direction: row;
  top: -16px;
  font-size: 12px;
  color: #848484;
`;
const graphBorder = css`
  width: 100%;
  border: 1px solid #dddddd;
  margin-bottom: 32px;
`;
