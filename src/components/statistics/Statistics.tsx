import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import DrawingTable from '../tables/DrawingTable';

import { StatsData, ClientData } from '../../types';

import webClient from '../../utils/Webclient';
import { AxiosResponse } from 'axios';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';

import TableStats from './TableStats';
import MonthStats from './MonthStats';

import getGross from '../../utils/getGross';
import formatDate from '../../utils/formatDate';
import StatsFilter from '../filters/StatsFilter';
import getClientName from '../../utils/getClientName';

import STATS from '../../constants/STATS.json';

const formatMonth = (date: Date) => {
  return formatDate(date).split('-').slice(0, 2).join('-');
};

const Statistics = (props: { clientList: ClientData[] }) => {
  const [currentStats, setCurrentStats] = useState<StatsData>();
  const [prevStats, setPrevStats] = useState<StatsData>();
  const [client, setClient] = useState<number>(324);
  const [date, setDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const getValue = <K extends keyof StatsData>(
    key: K,
    stat: StatsData | undefined
  ) => {
    if (stat) return stat[key];
    return undefined;
  };

  useEffect(() => {
    if (client <= 0) return;
    const getStats = async () => {
      try {
        let dateParam = formatMonth(date);
        let response: AxiosResponse = await webClient.get(
          `stats?client=${client}&date=${dateParam}`
        );
        setCurrentStats(response.data as StatsData);
        dateParam = formatMonth(
          new Date(date.getTime() - 1000 * 60 * 60 * 24 * 15)
        );
        response = await webClient.get(
          `stats?client=${client}&date=${dateParam}`
        );
        setPrevStats(response.data as StatsData);
      } catch (error) {
        console.log(error);
      }
    };
    getStats();
  }, [client, date]);

  return (
    <div
      id="statistics-container"
      className="flex justify-center w-100p h-100p overflow-scroll scroll-hide"
    >
      <div
        id="statistics-content"
        className="flex flex-col items-center w-100p relative"
      >
        <div
          id="statistics-filters-container"
          className="flex justify-start w-100p"
        >
          <div
            className="statistics-filter flex cursor-pointer text-palette-black bg-palette-grey px-16 h-40 items-center mr-12"
            onClick={() => {
              setIsCalendarOpen(!isCalendarOpen);
              setIsFilterOpen(false);
            }}
          >
            {`${formatDate(date).split('-')[1]}월 매출`}
          </div>
          <button
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsCalendarOpen(false);
            }}
            className="statistics-filter flex cursor-pointer text-palette-black bg-palette-grey px-16 h-40 items-center mr-12"
          >
            {client <= 0
              ? '회사 선택하기'
              : getClientName(props.clientList, Number(client))}
          </button>
        </div>
        <div className="absolute left-0 top-54 z-100 ">
          {isCalendarOpen && (
            <DatePicker
              selected={date}
              onChange={(date: Date) => {
                setDate(date);
                setIsCalendarOpen(false);
              }}
              onClickOutside={() => setIsCalendarOpen(false)}
              dateFormat="MM/yyyy"
              locale={ko}
              showMonthYearPicker
              inline
            />
          )}
          {isFilterOpen && (
            <div className="stats_filter absolute z-100">
              {isFilterOpen && (
                <StatsFilter
                  openFilter={isFilterOpen}
                  setOpenFilter={setIsFilterOpen}
                  clientId={client}
                  setClient={setClient}
                  clientList={props.clientList}
                />
              )}
            </div>
          )}
        </div>
        <div
          id="statistics-stats-container"
          className="flex justify-start overflow-x-scroll scroll-hide my-14 w-100p pl-1 pt-1"
        >
          {STATS.month_stats.map((stat, index) => {
            return (
              <MonthStats
                title={stat.title}
                gross={getGross(
                  getValue(stat.value as keyof StatsData, currentStats),
                  getValue(stat.value as keyof StatsData, prevStats)
                )}
                value={getValue(stat.value as keyof StatsData, currentStats)}
                key={index}
              />
            );
          })}
        </div>
        <div
          id="statistics-table-container"
          className="flex flex-col w-100p overflow-scroll scroll-hide"
        >
          <div
            id="statistics-pol-table-container"
            className="flex w-100p mb-18"
          >
            <DrawingTable
              clientId={client}
              tableInfo="연마 도면 목록"
              type="statistics_pol"
              month={formatMonth(date)}
            />
          </div>
          <div className="statistics-table-stats-container flex justify-start ml-1">
            <TableStats
              title="연마 매출 합계"
              is_positive={false}
              gross={getGross(
                currentStats?.pol_revenue,
                currentStats?.total_revenue
              )}
              value={currentStats?.pol_revenue}
            />
          </div>
          <div id="statistics-os-table-container" className="flex w-100p">
            <DrawingTable
              clientId={client}
              tableInfo="제작 도면 목록"
              type="statistics_os"
              month={formatMonth(date)}
            />
          </div>
          <div className="statistics-table-stats-container h-100p w-100p overflow-x-scroll scroll-hide flex justify-start pl-1">
            {STATS.os_stats.map((stat, index) => {
              return (
                <TableStats
                  title={stat.title}
                  is_positive={stat.is_positive}
                  gross={getGross(
                    getValue(stat.value as keyof StatsData, currentStats),
                    getValue(stat.denominator as keyof StatsData, currentStats)
                  )}
                  value={getValue(stat.value as keyof StatsData, currentStats)}
                  key={index}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  clientList: state.clientReducer.clientList,
});

export default connect(mapStateToProps)(Statistics);
