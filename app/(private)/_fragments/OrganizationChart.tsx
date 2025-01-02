'use client';

import { useQuery } from '@tanstack/react-query'
import { Spin } from 'antd'
import * as d3 from 'd3'
import { OrgChart } from 'd3-org-chart'
import { useEffect, useState } from 'react'

import { getStructureOrganization } from '@domain/events/position.service'

function transformData(
  node: any,
  parentId = null,
  result: any[] = [],
  idCounter = { count: 1 }
) {
  const nodeId: any = String(idCounter.count++);
  result.push({
    id: nodeId,
    name: node.name,
    position: node.position,
    parentId: parentId,
    expanded: true,
  });

  if (node.subordinates && node.subordinates.length > 0) {
    node.subordinates.forEach((subordinate: any) =>
      transformData(subordinate, nodeId, result, idCounter)
    );
  }

  return result;
}

const OrganizationChart = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['organizationChart'],
    queryFn: async () => getStructureOrganization(),
  });

  const [transformedData, setTransformedData] = useState<any[]>([]);
  useEffect(() => {
    if (data) {
      const transformedData = transformData(data);
      setTransformedData(transformedData);
    }
  }, [data]);

  useEffect(() => {
    if (transformedData.length > 0) {
      const chart = new OrgChart();

      chart
        .container('#org-chart')
        .data(transformedData)
        .expandAll()
        // .nodeWidth((d: any) => d.data.name.length * 10)
        .nodeHeight((d: any) => 100)
        .childrenMargin((d: any) => 100)
        .compactMarginBetween((d: any) => 50)
        .compactMarginPair((d: any) => 70)
        .onNodeClick((d: any) => console.log(d.data.name + ' node clicked'))
        .siblingsMargin((d) => 100)
        .linkUpdate((d: any, i: any, arr: any[]) => {
          d3.select(arr[i])
            .style('stroke-width', '2px')
            .style('stroke', '#555');
        })
        .nodeContent(
          (d: any) =>
            ` <div class="rounded-lg flex flex-col items-center justify-start text-center gap-2 h-full border"> 
                <div class="h-[35%] w-full bg-teal-300 flex items-center justify-center">
                  <h5 class="font-bold text-base">${d.data.name}</h5> 
                </div>
                <div class="h-[65%] w-full bg-white">
                  <span>${d.data.position}</span>
                </div> 
              </div>`
        )
        .render();
    }
  }, [transformedData]);

  return (
    <Spin spinning={isLoading}>
      <div id='org-chart' style={{ width: '100%', height: '800px' }}></div>
    </Spin>
  );
};

export default OrganizationChart;
