import React, { useState, useEffect } from 'react';

//date-picker
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';

//axios
import webClient from '../../utils/Webclient';
import { AxiosResponse } from 'axios';

//utils
import formatDate from '../../utils/formatDate';

//icons
import { ReactComponent as ClearIcon } from '../../resources/svg/clearIcon.svg';

interface mainDivisionList {
  main_division: string;
}

interface subDivisionList {
  sub_division: string;
}

interface filterProps {
  clientId: number;
  openFilter: boolean;
  setPageNum: Function;
  setOpenFilter: Function;
  mainDivision: string;
  setMainDivision: Function;
  subDivision: string;
  setSubDivision: Function;
  setList: Function;
  startDate: Date | null;
  endDate: Date | null;
  setDateRange: Function;
  isOutSource: boolean | undefined;
  setIsOutSource: Function;
  isFiltered: boolean;
  setIsFiltered: Function;
}

const PartTableFilter = (props: filterProps) => {
  const [mainDivisionList, setMainDivisionList] = useState<
    { main_division: string }[]
  >([]);
  const [subDivisionList, setSubDivisionList] = useState<
    { sub_division: string }[]
  >([]);

  const [selectedMainDivision, setSelectedMainDivision] = useState<string>(
    props.mainDivision
  );
  const [selectedSubDivision, setSelectedSubDivision] = useState<string>(
    props.subDivision
  );

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

  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([props.startDate, props.endDate]);

  useEffect(() => {
    const getDivision = async () => {
      try {
        const response: AxiosResponse = await webClient.get(
          `/division/main/?client=${props.clientId}`
        );
        setMainDivisionList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getDivision();
  }, [props.clientId]);

  useEffect(() => {
    const getSubDivision = async () => {
      try {
        const response: AxiosResponse = await webClient.get(
          `division/?client=${props.clientId}&main_division=${selectedMainDivision}`
        );
        setSubDivisionList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSubDivision();
  }, [props.clientId, selectedMainDivision]);

  const applyFilter = () => {
    props.setPageNum(1);
    props.setMainDivision(selectedMainDivision);
    props.setSubDivision(selectedSubDivision);
    props.setList([]);
    props.setIsOutSource(getOSBoolValue(selectedIsOutSource));
    props.setDateRange(selectedDateRange);
  };

  const checkFiltered = () => {
    if (
      selectedMainDivision.length === 0 &&
      selectedSubDivision.length === 0 &&
      selectedIsOutSource.length === 0 &&
      selectedDateRange[0] === null &&
      selectedDateRange[1] === null
    ) {
      props.setIsFiltered(false);
    } else {
      props.setIsFiltered(true);
    }
  };

  const clearFilter = () => {
    setSelectedMainDivision('');
    setSelectedSubDivision('');
    setSelectedIsOutsource('');
    setSelectedDateRange([null, null]);
  };

  return (
    <div className="filter_container flex flex-col relative">
      <div>
        <div className="filter_title flex flex-row ml-16 mt-16">
          필터 설정하기
          <button
            className="clear-button ml-160 flex flex-row justify-center"
            onClick={() => {
              clearFilter();
            }}
          >
            <ClearIcon />
          </button>
        </div>
      </div>
      <div>
        <input
          className="drawer_input flex ml-16 mt-14"
          list="os-datalist"
          placeholder="제작 여부"
          value={selectedIsOutSource}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedIsOutsource(e.target.value);
          }}
        />
        <datalist id="os-datalist">
          <option value="제작" />
          <option value="연마" />
        </datalist>
        <input
          className="drawer_input flex ml-16 mt-16"
          list="mainDivision-datalist"
          placeholder="구분"
          value={selectedMainDivision}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedMainDivision(e.target.value);
          }}
        />
        <datalist id="mainDivision-datalist">
          {mainDivisionList.map((main_division: mainDivisionList, index) => {
            return (
              <option
                key={index.toString()}
                value={main_division.main_division}
              />
            );
          })}
        </datalist>
        <input
          className="drawer_input flex ml-16 mt-14"
          list="subDivision-datalist"
          placeholder="세부 구분"
          value={selectedSubDivision}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedSubDivision(e.target.value);
          }}
        />
        <datalist id="subDivision-datalist">
          {subDivisionList.map((sub_division: subDivisionList, index) => {
            return (
              <option
                key={index.toString()}
                value={sub_division.sub_division}
              />
            );
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
          <div className="absolute z-100 top-256 left-16">
            <DatePicker
              onInputClick={() => setIsCalendarOpen(!isCalendarOpen)}
              onClickOutside={() => setIsCalendarOpen(false)}
              locale={ko}
              selectsRange={true}
              startDate={selectedDateRange[0]}
              endDate={selectedDateRange[1]}
              onChange={(update: [Date | null, Date | null]) => {
                setSelectedDateRange(update);
                if (update[1]) setIsCalendarOpen(false);
              }}
              isClearable
              inline
            />
          </div>
        )}
      </div>
      {!isCalendarOpen && (
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
              applyFilter();
              checkFiltered();
              props.setOpenFilter(!props.openFilter);
            }}
          >
            적용하기
          </button>
        </div>
      )}
    </div>
  );
};

export default PartTableFilter;
