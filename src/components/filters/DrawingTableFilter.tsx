import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import webClient from '../../utils/Webclient';

import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';
import formatDate from '../../utils/formatDate';
import { ReactComponent as ClearIcon } from '../../resources/icon-24-trash-2.svg';

interface DrawingTableFilterProps {
  openFilter: boolean;
  setOpenFilter: Function;
  clientId: number;
  setDrawingName: Function;
  startDate: Date | null;
  endDate: Date | null;
  setDateRange: Function;
  setPageNum: Function;
  setList: Function;
  drawingName: string;
}
const DrawingTableFilter = (props: DrawingTableFilterProps) => {
  const [drawingNameList, setDrawingNameList] = useState<{ name: string }[]>(
    []
  );
  const [selectedName, setSelectedName] = useState<string>(
    props.drawingName ? props.drawingName : ''
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([props.startDate, props.endDate]);

  const applyFilter = () => {
    props.setPageNum(1);
    props.setList([]);
    props.setDrawingName(selectedName);
    props.setDateRange(selectedDateRange);
  };

  const clearFilter = () => {
    setSelectedName('');
    setDrawingNameList([]);
    setSelectedDateRange([null, null]);
  };

  useEffect(() => {
    const getDrawingNameList = async () => {
      const response: AxiosResponse = await webClient.get(
        `drawing/search/?client=${props.clientId}&search=${selectedName}`
      );
      setDrawingNameList(response.data);
    };
    getDrawingNameList();
  }, [selectedName]);

  return (
    <div className="stats_filter_container flex flex-col relative">
      <div className="filter_title flex ml-16 mt-16">
        {' '}
        도면명 검색{' '}
        <button
          className="clear-button ml-160 flex flex-row justify-center"
          onClick={() => {
            clearFilter();
          }}
        >
          <ClearIcon />
        </button>
      </div>
      <div>
        <input
          className="drawer_input flex ml-16 mt-14"
          list="client-datalist"
          placeholder="도면명"
          value={selectedName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedName(e.target.value);
          }}
        />
        <datalist id="client-datalist">
          {drawingNameList.map((name, index) => {
            return <option key={index.toString()} value={name.name} />;
          })}
        </datalist>
        <input
          className="drawer_input flex ml-16 mt-14"
          placeholder="날짜 선택"
          value={`${
            selectedDateRange[0] ? formatDate(selectedDateRange[0]) : ''
          }${
            selectedDateRange[1] ? ' ~ ' + formatDate(selectedDateRange[1]) : ''
          }`}
          onClick={() => {
            setIsCalendarOpen(!isCalendarOpen);
          }}
          readOnly
        />
        {isCalendarOpen && (
          <div className="absolute z-100 top-150 left-16">
            <DatePicker
              onInputClick={() => setIsCalendarOpen(!isCalendarOpen)}
              onClickOutside={() => setIsCalendarOpen(false)}
              locale={ko}
              selectsRange={true}
              startDate={selectedDateRange[0]}
              endDate={selectedDateRange[1]}
              onChange={(update: [Date | null, Date | null]) => {
                setSelectedDateRange(update);
                //부모 변수를 업데이트
                if (update[1]) setIsCalendarOpen(false);
              }}
              isClearable
              inline
            />
          </div>
        )}
      </div>
      <div className="flex flex-row">
        <button
          className="modal-button text-palette-modal-black ml-120 mt-33 h-40 w-76 flex items-center text-sm font-medium justify-center"
          onClick={() => {
            props.setOpenFilter(!props.openFilter);
          }}
        >
          취소하기
        </button>
        <button
          className="modal-button text-palette-button-sub mt-33 h-40 w-76 flex flex-row items-center text-sm font-medium justify-center"
          onClick={() => {
            props.setOpenFilter(!props.openFilter);
            applyFilter();
          }}
        >
          적용하기
        </button>
      </div>
    </div>
  );
};

export default DrawingTableFilter;
