import { useState, useEffect } from 'react';

import webClient from '../../utils/Webclient';
import { AxiosResponse } from 'axios';

import { PartData, DrawingData, TableData } from '../../types';

import generateURL from '../../utils/generateURL';

const useFetch = (props: TableData) => {
  const [list, setList] = useState<PartData[] | DrawingData[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.client <= 0) return;

    if (props.type === 'client') {
      const fetchData = async () => {
        try {
          setIsLoading(true);

          const response: AxiosResponse = await webClient.get(
            generateURL({
              type: props.type,
              category: props.category,
              client: props.client,
              page: props.page,
              is_outsource: props.is_outsource,
              main_division: props.main_division,
              sub_division: props.sub_division,
              startDate: props.startDate,
              endDate: props.endDate,
            })
          );

          props.page === 1
            ? setList([...response.data.results])
            : setList((prevList: PartData[] | DrawingData[]) => {
                return [...prevList, ...response.data.results];
              });

          setHasMore(response.data.next !== null);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    } else {
      const fetchData = async () => {
        for (let page = 1; ; page++) {
          try {
            const response: AxiosResponse = await webClient.get(
              generateURL({
                type: props.type,
                category: 'drawing',
                client: props.client,
                page: page,
                month: props.month,
                is_outsource: props.is_outsource,
              })
            );
            setList((prevList: PartData[] | DrawingData[]) => {
              return [
                ...prevList,
                ...(response.data.results as DrawingData[]),
              ] as DrawingData[];
            });
            if (response.data.next === null) break;
          } catch (error) {
            console.log(error);
            break;
          }
        }
      };

      fetchData();
    }
  }, [
    props.type,
    props.category,
    props.page,
    props.client,
    props.month,
    props.main_division,
    props.sub_division,
    props.is_outsource,
    props.startDate,
    props.endDate,
  ]);

  return { hasMore, list, isLoading, setList };
};

export default useFetch;
