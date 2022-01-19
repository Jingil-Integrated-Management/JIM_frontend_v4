import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import webClient from '../../utils/Webclient';

import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';
import formatDate from '../../utils/formatDate';
import { ReactComponent as ClearIcon } from '../../resources/svg/clearIcon.svg';

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
  setIsFiltered: Function;
  drawingName: string;
  isOutSource: boolean | undefined;
  setIsOutSource: Function;
}
const DrawingTableFilter = (props: DrawingTableFilterProps) => {
  const [drawingNameList, setDrawingNameList] = useState<{ name: string }[]>(
    []
  );
  const [selectedName, setSelectedName] = useState<string>(
    props.drawingName ? props.drawingName : ''
  );
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([props.startDate, props.endDate]);

  const getOSStringValue = (outsource: boolean | undefined) => {
    if (outsource === undefined) return '';
    else if (outsource === true) return '제작';
    else return '연마';
  };

  const getOSBoolValue = (outsource: string) => {
    if (outsource === '제작') return true;
    else if (outsource === '연마') return false;
    else return undefined;
  };

  const [selectedIsOutSource, setSelectedIsOutsource] = useState<string>(
    getOSStringValue(props.isOutSource)
  );

  const applyFilter = () => {
    if (isChanged) {
      props.setPageNum(1);
      props.setList([]);
      props.setDrawingName(selectedName);
      props.setDateRange(selectedDateRange);
      props.setIsOutSource(getOSBoolValue(selectedIsOutSource));
    }
  };

  const checkFiltered = () => {
    if (
      selectedName.length === 0 &&
      selectedDateRange[0] === null &&
      selectedDateRange[1] === null &&
      selectedIsOutSource.length === 0
    ) {
      props.setIsFiltered(false);
    } else {
      props.setIsFiltered(true);
    }
  };

  const clearFilter = () => {
    setSelectedName('');
    setDrawingNameList([]);
    setSelectedIsOutsource('');
    setSelectedDateRange([null, null]);
    setIsChanged(true);
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
    <div className="stats_filter_container_client flex flex-col relative ">
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
          list="os-datalist"
          placeholder="제작 여부"
          autoComplete="off"
          value={selectedIsOutSource}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedIsOutsource(e.target.value);
            setIsChanged(true);
          }}
        />
        <datalist id="os-datalist">
          <option value="제작" />
          <option value="연마" />
        </datalist>
        <input
          className="drawer_input flex ml-16 mt-14"
          list="client-datalist"
          placeholder="도면명"
          autoComplete="off"
          value={selectedName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedName(e.target.value);
            setIsChanged(true);
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
            setIsChanged(true);
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
                setIsChanged(true);
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
            checkFiltered();
          }}
        >
          적용하기
        </button>
      </div>
    </div>
  );
};

export default DrawingTableFilter;
