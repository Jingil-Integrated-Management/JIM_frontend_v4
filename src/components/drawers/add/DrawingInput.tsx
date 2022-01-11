import { connect } from 'react-redux';

import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';
import { ClientData, DrawingData } from '../../../types';
import { useState } from 'react';
import formatDate from '../../../utils/formatDate';
import getClientID from '../../../utils/getClientID';

interface drawingInputProps {
  setDrawerModified: Function;
  drawing: DrawingData;
  setDrawing: Function;
  clientList: ClientData[];
}

const DrawingInput = (props: drawingInputProps) => {
  const [date, setDate] = useState<Date>(new Date());

  const onInputChange = <K extends keyof DrawingData, V extends DrawingData[K]>(
    key: K,
    value: V
  ) => {
    props.setDrawerModified(true);
    props.setDrawing((prevDrawing: DrawingData) => {
      let tmpDrawing = { ...prevDrawing };
      tmpDrawing[key] = value;
      return tmpDrawing;
    });
  };

  return (
    <div className="w-full h-220">
      <div className="flex mt-53">
        <div className="flex justify-center items-center w-40 h-40 bg-palette-purple-index rounded-panel">
          0
        </div>
        <div className="flex justify-center items-center w-95 h-40 ml-10 rounded-panel bg-palette-grey">
          도면 정보
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            onInputChange('is_outsource', !props.drawing.is_outsource);
          }}
        >
          {props.drawing.is_outsource ? (
            <div className="flex justify-center items-center w-62 h-40 ml-10 rounded-panel onOsBox">
              제작
            </div>
          ) : (
            <div className="flex justify-center items-center w-62 h-40 ml-10 rounded-panel onOsBox">
              연마
            </div>
          )}
        </div>
      </div>
      <div className="mt-24 h-72 flex">
        <div className="w-256">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            도면명
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            placeholder="내용을 입력하세요."
            onChange={(e) => {
              onInputChange('name', e.target.value);
            }}
          ></input>
        </div>
        <div className="w-256 ml-32">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            담당회사
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            list="clientList"
            placeholder="내용을 입력하세요."
            onChange={(e) => {
              onInputChange(
                'client',
                getClientID(props.clientList, e.target.value)
              );
            }}
          ></input>
          <datalist id="clientList">
            <option value="">회사 선택</option>
            {props.clientList.map((client: ClientData) => {
              return <option key={client.id} value={client.name} />;
            })}
          </datalist>
        </div>
      </div>
      <div className="mt-12 h-72 flex">
        <div className="w-256">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            날짜
          </div>
          <DatePicker
            selected={date}
            locale={ko}
            onChange={(changedDate: Date) => {
              setDate(changedDate);
              onInputChange('created_at', formatDate(changedDate));
            }}
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input"
          />
        </div>
        <div className="w-256 ml-32">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            비고
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            placeholder="내용을 입력하세요."
            onChange={(e) => {
              onInputChange('comment', e.target.value);
            }}
          ></input>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  clientList: state.clientReducer.clientList,
});

export default connect(mapStateToProps)(DrawingInput);
