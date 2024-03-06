import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const toolTip = styled.div`
  background-color: white;
  border: 1px solid black;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.75);
`;

const toolTipText = styled.p`
  margin: 0;
  font-weight: bold;
  color: black;
`;

const toolTipValue = styled.p`
  margin: 0;
  color: black;
`;

const toolTipMain = styled.h3`
  margin: 0;
  color: black;
`;

const toolTipContent = ({ active, payload, dataKey }) => {
  if (active && payload && payload.length) {
    const { subject, attendancePercentage, present, absent, totalClasses, classesAttended, subjectName, marksObtained } = payload[0].payload;

    return (
      <toolTip>
        {dataKey === "attendancePercentage" ? (
          <div>
            <toolTipMain>{subjectName}</toolTipMain>
            <toolTipText>Attendance Percentage: </toolTipText>
            <toolTipValue>{attendancePercentage}%</toolTipValue>
            <toolTipText>Classes Attended: </toolTipText>
            <toolTipValue>{classesAttended}</toolTipValue>
            <toolTipText>Total Classes: </toolTipText>
            <toolTipValue>{totalClasses}</toolTipValue>
          </div>
        ) : (
          <div>
            <toolTipMain>{subjectName}</toolTipMain>
            <toolTipText>Marks Obtained: </toolTipText>
            <toolTipValue>{marksObtained}</toolTipValue>
          </div>
        )}
      </toolTip>
    )
  }

  return null;
};

const BarCharts = ({ chartData, dataKey }) => {
  const subjectData = chartData.map((data) => data.subject)
  const colours = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF1919", "#19FF19", "#19FFD7", "#FF19E5", "#19FFB4", "#FF19B4"]

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        height={500}
        width={1000}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKey === "marksObtained" ? "subjectName" : "subject"} />
        <YAxis domain={[0, 100]} />
        <Tooltip content={<toolTipContent dataKey={dataKey} />} />
        <Legend />
        <Bar dataKey={dataKey} fill="#8884d8">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colours[index % colours.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarCharts;